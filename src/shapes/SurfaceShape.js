/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports SurfaceShape
 * @version $Id: SurfaceShape.js 3191 2015-06-15 19:35:57Z tgaskins $
 */
define([
        '../error/AbstractError',
        '../geom/Angle',
        '../error/ArgumentError',
        '../geom/Location',
        '../util/Logger',
        '../error/NotYetImplementedError',
        '../pick/PickedObject',
        '../util/PolygonSplitter',
        '../render/Renderable',
        '../geom/Sector',
        '../shapes/ShapeAttributes',
        '../error/UnsupportedOperationError',
        '../util/WWMath'
    ],
    function (AbstractError,
              Angle,
              ArgumentError,
              Location,
              Logger,
              NotYetImplementedError,
              PickedObject,
              PolygonSplitter,
              Renderable,
              Sector,
              ShapeAttributes,
              UnsupportedOperationError,
              WWMath) {
        "use strict";

        /**
         * Constructs a surface shape with an optionally specified bundle of default attributes.
         * @alias SurfaceShape
         * @constructor
         * @augments Renderable
         * @abstract
         * @classdesc Represents a surface shape. This is an abstract base class and is meant to be instantiated
         * only by subclasses.
         * <p>
         * Surface shapes other than SurfacePolyline {@link SurfacePolyline} have an interior and an outline and utilize
         * the corresponding attributes in their associated ShapeAttributes {@link ShapeAttributes}. They do not
         * utilize image-related attributes.
         *
         * @param {ShapeAttributes} attributes The attributes to apply to this shape. May be null, in which case
         * attributes must be set directly before the shape is drawn.
         */
        var SurfaceShape = function (attributes) {

            Renderable.call(this);

            // All these are documented with their property accessors below.
            this._displayName = "Surface Shape";
            this._attributes = attributes ? attributes : new ShapeAttributes(null);
            this._highlightAttributes = null;
            this._highlighted = false;
            this._enabled = true;
            this._pathType = WorldWind.GREAT_CIRCLE;
            this._maximumNumEdgeIntervals = SurfaceShape.DEFAULT_NUM_EDGE_INTERVALS;
            this._polarThrottle = SurfaceShape.DEFAULT_POLAR_THROTTLE;
            this._sector = null;

            /**
             * Indicates the object to return as the owner of this shape when picked.
             * @type {Object}
             * @default null
             */
            this.pickDelegate = null;

            /*
             * The bounding sectors for this tile, which may be needed for crossing the dateline.
             * @type {Sector[]}
             * @protected
             */
            this._sectors = [];

            /*
             * The raw collection of locations defining this shape and are explicitly specified by the client of this class.
             * @type {Location[]}
             * @protected
             */
            this._locations = null;

            /*
             * Boundaries that are either the user specified locations or locations that are algorithmically generated.
             * @type {Location[]}
             * @protected
             */
            this._boundaries = null;

            /*
             * The collection of locations that describes a closed curve which can be filled.
             * @type {Location[][]}
             * @protected
             */
            this._interiorGeometry = null;

            /*
             * The collection of locations that describe the outline of the shape.
             * @type {Location[][]}
             * @protected
             */
            this._outlineGeometry = null;

            /*
             * Internal use only.
             * Inhibit the filling of the interior. This is to be used ONLY by polylines.
             * @type {Boolean}
             * @protected
             */
            this._isInteriorInhibited = false;

            /*
             * Indicates whether this object's state key is invalid. Subclasses must set this value to true when their
             * attributes change. The state key will be automatically computed the next time it's requested. This flag
             * will be set to false when that occurs.
             * @type {Boolean}
             * @protected
             */
            this.stateKeyInvalid = true;

            // Internal use only. Intentionally not documented.
            this._attributesStateKey = null;

            // Internal use only. Intentionally not documented.
            this.isPrepared = false;

            // Internal use only. Intentionally not documented.
            this.layer = null;

            // Internal use only. Intentionally not documented.
            this.pickColor = null;

            //the split contours returned from polygon splitter
            this.contours = [];
            this.containsPole = false;
            this.crossesAntiMeridian = false;
        };

        SurfaceShape.prototype = Object.create(Renderable.prototype);

        Object.defineProperties(SurfaceShape.prototype, {
            stateKey: {
                /**
                 * A hash key of the total visible external state of the surface shape.
                 * @memberof SurfaceShape.prototype
                 * @type {String}
                 */
                get: function () {
                    // If we don't have a state key for the shape attributes, consider this state key to be invalid.
                    if (!this._attributesStateKey) {
                        // Update the state key for the appropriate attributes for future
                        if (this._highlighted) {
                            if (!!this._highlightAttributes) {
                                this._attributesStateKey = this._highlightAttributes.stateKey;
                            }
                        } else {
                            if (!!this._attributes) {
                                this._attributesStateKey = this._attributes.stateKey;
                            }
                        }

                        // If we now actually have a state key for the attributes, it was previously invalid.
                        if (!!this._attributesStateKey) {
                            this.stateKeyInvalid = true;
                        }
                    } else {
                        // Detect a change in the appropriate attributes.
                        var currentAttributesStateKey = null;

                        if (this._highlighted) {
                            // If there are highlight attributes associated with this shape, ...
                            if (!!this._highlightAttributes) {
                                currentAttributesStateKey = this._highlightAttributes.stateKey;
                            }
                        } else {
                            if (!!this._attributes) {
                                currentAttributesStateKey = this._attributes.stateKey;
                            }
                        }

                        // If the attributes state key changed, ...
                        if (currentAttributesStateKey != this._attributesStateKey) {
                            this._attributesStateKey = currentAttributesStateKey;
                            this.stateKeyInvalid = true;
                        }
                    }

                    if (this.stateKeyInvalid) {
                        this._stateKey = this.computeStateKey();
                    }

                    return this._stateKey;
                }
            },

            /**
             * The shape's display name and label text.
             * @memberof SurfaceShape.prototype
             * @type {String}
             * @default Surface Shape
             */
            displayName: {
                get: function () {
                    return this._displayName;
                },
                set: function (value) {
                    this.stateKeyInvalid = true;
                    this._displayName = value;
                }
            },

            /**
             * The shape's attributes. If null and this shape is not highlighted, this shape is not drawn.
             * @memberof SurfaceShape.prototype
             * @type {ShapeAttributes}
             * @default see [ShapeAttributes]{@link ShapeAttributes}
             */
            attributes: {
                get: function () {
                    return this._attributes;
                },
                set: function (value) {
                    this.stateKeyInvalid = true;
                    this._attributes = value;
                    this._attributesStateKey = value.stateKey;
                }
            },

            /**
             * The attributes used when this shape's highlighted flag is true. If null and the
             * highlighted flag is true, this shape's normal attributes are used. If they, too, are null, this
             * shape is not drawn.
             * @memberof SurfaceShape.prototype
             * @type {ShapeAttributes}
             * @default null
             */
            highlightAttributes: {
                get: function () {
                    return this._highlightAttributes;
                },
                set: function (value) {
                    this.stateKeyInvalid = true;
                    this._highlightAttributes = value;
                }
            },

            /**
             * Indicates whether this shape displays with its highlight attributes rather than its normal attributes.
             * @memberof SurfaceShape.prototype
             * @type {Boolean}
             * @default false
             */
            highlighted: {
                get: function () {
                    return this._highlighted;
                },
                set: function (value) {
                    this.stateKeyInvalid = true;
                    this._highlighted = value;
                }
            },

            /**
             * Indicates whether this shape is drawn.
             * @memberof SurfaceShape.prototype
             * @type {Boolean}
             * @default true
             */
            enabled: {
                get: function () {
                    return this._enabled;
                },
                set: function (value) {
                    this.stateKeyInvalid = true;
                    this._enabled = value;
                }
            },

            /**
             * The path type to used to interpolate between locations on this shape. Recognized values are:
             * <ul>
             * <li>WorldWind.GREAT_CIRCLE</li>
             * <li>WorldWind.RHUMB_LINE</li>
             * <li>WorldWind.LINEAR</li>
             * </ul>
             * @memberof SurfaceShape.prototype
             * @type {String}
             * @default WorldWind.GREAT_CIRCLE
             */
            pathType: {
                get: function () {
                    return this._pathType;
                },
                set: function (value) {
                    this.stateKeyInvalid = true;
                    this._pathType = value;
                }
            },

            /**
             * The maximum number of intervals an edge will be broken into. This is the number of intervals that an
             * edge that spans to opposite side of the globe would be broken into. This is strictly an upper bound
             * and the number of edge intervals may be lower if this resolution is not needed.
             * @memberof SurfaceShape.prototype
             * @type {Number}
             * @default SurfaceShape.DEFAULT_NUM_EDGE_INTERVALS
             */
            maximumNumEdgeIntervals: {
                get: function () {
                    return this._maximumNumEdgeIntervals;
                },
                set: function (value) {
                    this.stateKeyInvalid = true;
                    this._maximumNumEdgeIntervals = value;
                }
            },

            /**
             * A dimensionless number that controls throttling of edge traversal near the poles where edges need to be
             * sampled more closely together.
             * A value of 0 indicates that no polar throttling is to be performed.
             * @memberof SurfaceShape.prototype
             * @type {Number}
             * @default SurfaceShape.DEFAULT_POLAR_THROTTLE
             */
            polarThrottle: {
                get: function () {
                    return this._polarThrottle;
                },
                set: function (value) {
                    this.stateKeyInvalid = true;
                    this._polarThrottle = value;
                }
            },

            /**
             * Defines the extent of the shape in latitude and longitude.
             * This sector only has valid data once the boundary is defined. Prior to this, it is null.
             * @memberof SurfaceShape.prototype
             * @type {Sector}
             */
            sector: {
                get: function () {
                    return this._sector;
                }
            }
        });

        SurfaceShape.staticStateKey = function (shape) {
            shape.stateKeyInvalid = false;

            if (shape.highlighted) {
                if (!shape._highlightAttributes) {
                    if (!shape._attributes) {
                        shape._attributesStateKey = null;
                    } else {
                        shape._attributesStateKey = shape._attributes.stateKey;
                    }
                } else {
                    shape._attributesStateKey = shape._highlightAttributes.stateKey;
                }
            } else {
                if (!shape._attributes) {
                    shape._attributesStateKey = null;
                } else {
                    shape._attributesStateKey = shape._attributes.stateKey;
                }
            }

            return "dn " + shape.displayName +
                " at " + (!shape._attributesStateKey ? "null" : shape._attributesStateKey) +
                " hi " + shape.highlighted +
                " en " + shape.enabled +
                " pt " + shape.pathType +
                " ne " + shape.maximumNumEdgeIntervals +
                " po " + shape.polarThrottle +
                " se " + "[" +
                shape.sector.minLatitude + "," +
                shape.sector.maxLatitude + "," +
                shape.sector.minLongitude + "," +
                shape.sector.maxLongitude +
                "]";
        };

        SurfaceShape.prototype.computeStateKey = function () {
            return SurfaceShape.staticStateKey(this);
        };

        /**
         * Returns this shape's area in square meters.
         * @param {Globe} globe The globe on which to compute the area.
         * @param {Boolean} terrainConformant If true, the returned area is that of the terrain,
         * including its hillsides and other undulations. If false, the returned area is the shape's
         * projected area.
         */
        SurfaceShape.prototype.area = function (globe, terrainConformant) {
            throw new NotYetImplementedError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceShape", "area", "notYetImplemented"));
        };

        // Internal function. Intentionally not documented.
        SurfaceShape.prototype.computeBoundaries = function (globe) {
            // This method is in the base class and should be overridden if the boundaries are generated.
            // It should be called only if the geometry has been provided by the user and does not need to be generated.
            // assert(!this._boundaries);

            throw new AbstractError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceShape", "computeBoundaries", "abstractInvocation"));
        };

        // Internal function. Intentionally not documented.
        SurfaceShape.prototype.render = function (dc) {
            if (!this.enabled) {
                return;
            }

            this.layer = dc.currentLayer;

            this.prepareBoundaries(dc);

            dc.surfaceShapeTileBuilder.insertSurfaceShape(this);
        };

        // Internal function. Intentionally not documented.
        SurfaceShape.prototype.interpolateLocations = function (locations) {
            var first = locations[0],
                next = first,
                prev,
                isNextFirst = true,
                isPrevFirst = true,// Don't care initially, this will get set in first iteration.
                countFirst = 0,
                isInterpolated = true,
                idx, len;

            this._locations = [first];

            for (idx = 1, len = locations.length; idx < len; idx += 1) {
                // Advance to next location, retaining previous location.
                prev = next;
                isPrevFirst = isNextFirst;

                next = locations[idx];

                // Detect whether the next location and the first location are the same.
                isNextFirst = next.latitude == first.latitude && next.longitude == first.longitude;

                // Inhibit interpolation if either endpoint if the first location,
                // except for the first segement which will be the actual first location or that location
                // as the polygon closes the first time.
                // All subsequent encounters of the first location are used to connected secondary domains with the
                // primary domain in multiply-connected geometry (an outer ring with multiple inner rings).
                isInterpolated = true;
                if (isNextFirst || isPrevFirst) {
                    countFirst += 1;

                    if (countFirst > 2) {
                        isInterpolated = false;
                    }
                }

                if (isInterpolated) {
                    this.interpolateEdge(prev, next, this._locations);
                }

                this._locations.push(next);

                prev = next;
            }

            // Force the closing of the border.
            if (!this._isInteriorInhibited) {
                // Avoid duplication if the first endpoint was already emitted.
                if (prev.latitude != first.latitude || prev.longitude != first.longitude) {
                    this.interpolateEdge(prev, first, this._locations);
                    this._locations.push(first);
                }
            }
        };

        // Internal function. Intentionally not documented.
        SurfaceShape.prototype.interpolateEdge = function (start, end, locations) {
            var distanceRadians = Location.greatCircleDistance(start, end),
                steps = Math.round(this._maximumNumEdgeIntervals * distanceRadians / Math.PI),
                dt,
                location;

            if (steps > 0) {
                dt = 1 / steps;
                location = start;

                for (var t = this.throttledStep(dt, location); t < 1; t += this.throttledStep(dt, location)) {
                    location = new Location(0, 0);
                    Location.interpolateAlongPath(this._pathType, t, start, end, location);

                    //florin: ensure correct longitude sign and decimal error for anti-meridian
                    if (start.longitude === 180 && end.longitude === 180) {
                        location.longitude = 180;
                    }
                    else if (start.longitude === -180 && end.longitude === -180) {
                        location.longitude = -180;
                    }

                    locations.push(location);
                }
            }
        };

        // Internal function. Intentionally not documented.
        // Return a throttled step size when near the poles.
        SurfaceShape.prototype.throttledStep = function (dt, location) {
            var cosLat = Math.cos(location.latitude * Angle.DEGREES_TO_RADIANS);
            cosLat *= cosLat; // Square cos to emphasize poles and de-emphasize equator.

            // Remap polarThrotle:
            //  0 .. INF => 0 .. 1
            // This acts as a weight between no throttle and fill throttle.
            var weight = this._polarThrottle / (1 + this._polarThrottle);

            return dt * ((1 - weight) + weight * cosLat);
        };

        // Internal function. Intentionally not documented.
        SurfaceShape.prototype.prepareBoundaries = function (dc) {
            if (this.isPrepared) {
                return;
            }

            // Some shapes generate boundaries, such as ellipses and sectors;
            // others don't, such as polylines and polygons.
            // Handle the latter below.
            if (!this._boundaries) {
                this.computeBoundaries(dc);
            }

            var newBoundaries = this.formatBoundaries();
            this.normalizeAngles(newBoundaries);
            newBoundaries = this.interpolateBoundaries(newBoundaries);

            var contoursInfo = [];
            var doesCross = PolygonSplitter.splitContours(newBoundaries, contoursInfo);
            this.contours = contoursInfo;
            this.crossesAntiMeridian = doesCross;

            this.prepareGeometry(dc, contoursInfo);

            this.prepareSectors();

            this.isPrepared = true;
        };

        //Internal. Formats the boundaries of a surface shape to be a multi dimensional array
        SurfaceShape.prototype.formatBoundaries = function () {
            var boundaries = [];
            if (!this._boundaries.length) {
                return boundaries;
            }
            if (this._boundaries[0].latitude != null) {
                //not multi dim array
                boundaries.push(this._boundaries);
            }
            else {
                boundaries = this._boundaries;
            }
            return boundaries;
        };

        // Internal use only. Intentionally not documented.
        SurfaceShape.prototype.normalizeAngles = function (boundaries) {
            for (var i = 0, len = boundaries.length; i < len; i++) {
                var polygon = boundaries[i];
                for (var j = 0, lenP = polygon.length; j < lenP; j++) {
                    var point = polygon[j];
                    if (point.longitude < -180 || point.longitude > 180) {
                        point.longitude = Angle.normalizedDegreesLongitude(point.longitude);
                    }
                    if (point.latitude < -90 || point.latitude > 90) {
                        point.latitude = Angle.normalizedDegreesLatitude(point.latitude);
                    }
                }
            }
        };

        // Internal use only. Intentionally not documented.
        SurfaceShape.prototype.interpolateBoundaries = function (boundaries) {
            var newBoundaries = [];
            for (var i = 0, len = boundaries.length; i < len; i++) {
                var contour = boundaries[i];
                this.interpolateLocations(contour);
                newBoundaries.push(this._locations.slice());
                this._locations.length = 0;
            }
            return newBoundaries;
        };

        /**
         * Computes the bounding sectors for the shape. There will be more than one if the shape crosses the date line,
         * but does not enclose a pole.
         *
         * @param {DrawContext} dc The drawing context containing a globe.
         *
         * @return {Sector[]}  Bounding sectors for the shape.
         */
        SurfaceShape.prototype.computeSectors = function (dc) {
            // Return a previously computed value if it already exists.
            if (this._sectors && this._sectors.length > 0) {
                return this._sectors;
            }

            this.prepareBoundaries(dc);

            return this._sectors;
        };

        // Internal use only. Intentionally not documented.
        SurfaceShape.prototype.prepareSectors = function () {
            this.determineSectors();
            if (this.crossesAntiMeridian) {
                this.sectorsOverAntiMeridian();
            }
            else {
                this.sectorsNotOverAntiMeridian();
            }
        };

        // Internal use only. Intentionally not documented.
        SurfaceShape.prototype.determineSectors = function () {
            for (var i = 0, len = this.contours.length; i < len; i++) {
                var contour = this.contours[i];
                var polygons = contour.polygons;
                contour.sectors = [];
                for (var j = 0, lenP = polygons.length; j < lenP; j++) {
                    var polygon = polygons[j];
                    var sector = new Sector(0, 0, 0, 0);
                    sector.setToBoundingSector(polygon);
                    if (this._pathType === WorldWind.GREAT_CIRCLE) {
                        var extremes = Location.greatCircleArcExtremeLocations(polygon);
                        var minLatitude = Math.min(sector.minLatitude, extremes[0].latitude);
                        var maxLatitude = Math.max(sector.maxLatitude, extremes[1].latitude);
                        sector.minLatitude = minLatitude;
                        sector.maxLatitude = maxLatitude;
                    }
                    contour.sectors.push(sector);
                }
            }
        };

        // Internal use only. Intentionally not documented.
        SurfaceShape.prototype.sectorsOverAntiMeridian = function () {
            var eastSector = new Sector(90, -90, 180, -180); //positive
            var westSector = new Sector(90, -90, 180, -180); //negative
            for (var i = 0, len = this.contours.length; i < len; i++) {
                var sectors = this.contours[i].sectors;
                for (var j = 0, lenS = sectors.length; j < lenS; j++) {
                    var sector = sectors[j];
                    if (sector.minLongitude < 0 && sector.maxLongitude > 0) {
                        westSector.union(sector);
                        eastSector.union(sector);
                    }
                    else if (sector.minLongitude < 0) {
                        westSector.union(sector);
                    }
                    else {
                        eastSector.union(sector);
                    }
                }
            }
            var minLatitude = Math.min(eastSector.minLatitude, westSector.minLatitude);
            var maxLatitude = Math.max(eastSector.maxLatitude, eastSector.maxLatitude);
            this._sector = new Sector(minLatitude, maxLatitude, -180, 180);
            this._sectors = [eastSector, westSector];
        };

        // Internal use only. Intentionally not documented.
        SurfaceShape.prototype.sectorsNotOverAntiMeridian = function () {
            this._sector = new Sector(90, -90, 180, -180);
            for (var i = 0, len = this.contours.length; i < len; i++) {
                var sectors = this.contours[i].sectors;
                for (var j = 0, lenS = sectors.length; j < lenS; j++) {
                    this._sector.union(sectors[j]);
                }
            }
            this._sectors = [this._sector];
        };

        // Internal use only. Intentionally not documented.
        SurfaceShape.prototype.prepareGeometry = function (dc, contours) {
            var interiorPolygons = [];
            var outlinePolygons = [];

            for (var i = 0, len = contours.length; i < len; i++) {
                var contour = contours[i];
                var poleIndex = contour.poleIndex;

                for (var j = 0, lenC = contour.polygons.length; j < lenC; j++) {
                    var polygon = contour.polygons[j];
                    var iMap = contour.iMap[j];
                    interiorPolygons.push(polygon);

                    if (contour.pole !== Location.poles.NONE && lenC > 1) {
                        //split with pole
                        if (j === poleIndex) {
                            this.outlineForPole(polygon, iMap, outlinePolygons);
                        }
                        else {
                            this.outlineForSplit(polygon, iMap, outlinePolygons);
                        }
                    }
                    else if (contour.pole !== Location.poles.NONE && lenC === 1) {
                        //only pole
                        this.outlineForPole(polygon, iMap, outlinePolygons);
                    }
                    else if (contour.pole === Location.poles.NONE && lenC > 1) {
                        //only split
                        this.outlineForSplit(polygon, iMap, outlinePolygons);
                    }
                    else if (contour.pole === Location.poles.NONE && lenC === 1) {
                        //no pole, no split
                        outlinePolygons.push(polygon);
                    }
                }
            }

            this._interiorGeometry = interiorPolygons;
            this._outlineGeometry = outlinePolygons;
        };

        // Internal use only. Intentionally not documented.
        SurfaceShape.prototype.outlineForPole = function (polygon, iMap, outlinePolygons) {
            this.containsPole = true;
            var outlinePolygon = [];
            var pCount = 0;
            for (var k = 0, lenP = polygon.length; k < lenP; k++) {
                var point = polygon[k];
                var intersection = iMap.get(k);
                if (intersection && intersection.forPole) {
                    pCount++;
                    if (pCount % 2 === 1) {
                        outlinePolygon.push(point);
                        outlinePolygons.push(outlinePolygon);
                        outlinePolygon = [];
                    }
                }
                if (pCount % 2 === 0) {
                    outlinePolygon.push(point);
                }
            }
            if (outlinePolygon.length) {
                outlinePolygons.push(outlinePolygon);
            }
        };

        // Internal use only. Intentionally not documented.
        SurfaceShape.prototype.outlineForSplit = function (polygon, iMap, outlinePolygons) {
            var outlinePolygon = [];
            var iCount = 0;
            for (var k = 0, lenP = polygon.length; k < lenP; k++) {
                var point = polygon[k];
                var intersection = iMap.get(k);
                if (intersection && !intersection.forPole) {
                    iCount++;
                    if (iCount % 2 === 0) {
                        outlinePolygon.push(point);
                        outlinePolygons.push(outlinePolygon);
                        outlinePolygon = [];
                    }
                }
                if (iCount % 2 === 1) {
                    outlinePolygon.push(point);
                }
            }
        };

        // Internal use only. Intentionally not documented.
        SurfaceShape.prototype.resetPickColor = function () {
            this.pickColor = null;
        };

        /**
         * Internal use only.
         * Render the shape onto the texture map of the tile.
         * @param {DrawContext} dc The draw context to render onto.
         * @param {CanvasRenderingContext2D} ctx2D The rendering context for SVG.
         * @param {Number} xScale The multiplicative scale factor in the horizontal direction.
         * @param {Number} yScale The multiplicative scale factor in the vertical direction.
         * @param {Number} dx The additive offset in the horizontal direction.
         * @param {Number} dy The additive offset in the vertical direction.
         */
        SurfaceShape.prototype.renderToTexture = function (dc, ctx2D, xScale, yScale, dx, dy) {
            var attributes = (this._highlighted ? (this._highlightAttributes || this._attributes) : this._attributes);
            var drawInterior = (!this._isInteriorInhibited && attributes.drawInterior);
            var drawOutline = (attributes.drawOutline && attributes.outlineWidth > 0);

            if (!drawInterior && !drawOutline) {
                return;
            }

            if (dc.pickingMode && !this.pickColor) {
                this.pickColor = dc.uniquePickColor();
            }

            if (dc.pickingMode) {
                var pickColor = this.pickColor.toHexString();
            }

            if (this.crossesAntiMeridian || this.containsPole) {
                if (drawInterior) {
                    this.draw(this._interiorGeometry, ctx2D, xScale, yScale, dx, dy);
                    ctx2D.fillStyle = dc.pickingMode ? pickColor : attributes.interiorColor.toRGBAString();
                    ctx2D.fill();
                }
                if (drawOutline) {
                    this.draw(this._outlineGeometry, ctx2D, xScale, yScale, dx, dy);
                    ctx2D.lineWidth = 4 * attributes.outlineWidth;
                    ctx2D.strokeStyle = dc.pickingMode ? pickColor : attributes.outlineColor.toRGBAString();
                    ctx2D.stroke();
                }
            }
            else {
                this.draw(this._interiorGeometry, ctx2D, xScale, yScale, dx, dy);
                if (drawInterior) {
                    ctx2D.fillStyle = dc.pickingMode ? pickColor : attributes.interiorColor.toRGBAString();
                    ctx2D.fill();
                }
                if (drawOutline) {
                    ctx2D.lineWidth = 4 * attributes.outlineWidth;
                    ctx2D.strokeStyle = dc.pickingMode ? pickColor : attributes.outlineColor.toRGBAString();
                    ctx2D.stroke();
                }
            }

            if (dc.pickingMode) {
                var po = new PickedObject(this.pickColor.clone(), this.pickDelegate ? this.pickDelegate : this,
                    null, this.layer, false);
                dc.resolvePick(po);
            }
        };

        SurfaceShape.prototype.draw = function (contours, ctx2D, xScale, yScale, dx, dy) {
            ctx2D.beginPath();
            for (var i = 0, len = contours.length; i < len; i++) {
                var contour = contours[i];
                var point = contour[0];
                var x = point.longitude * xScale + dx;
                var y = point.latitude * yScale + dy;
                ctx2D.moveTo(x, y);
                for (var j = 1, lenC = contour.length; j < lenC; j++) {
                    point = contour[j];
                    x = point.longitude * xScale + dx;
                    y = point.latitude * yScale + dy;
                    ctx2D.lineTo(x, y);
                }
            }
        };

        /**
         * Default value for the maximum number of edge intervals. This results in a maximum error of 480 m for an arc
         * that spans the entire globe.
         *
         * Other values for this parameter have the associated errors below:
         * Intervals        Maximum error (meters)
         *      2           1280253.5
         *      4           448124.5
         *      8           120837.6
         *      16          30628.3
         *      32          7677.9
         *      64          1920.6
         *      128         480.2
         *      256         120.0
         *      512         30.0
         *      1024        7.5
         *      2048        1.8
         * The errors cited above are upper bounds and the actual error may be lower.
         * @type {Number}
         */
        SurfaceShape.DEFAULT_NUM_EDGE_INTERVALS = 128;

        /**
         * The defualt value for the polar throttle, which slows edge traversal near the poles.
         * @type {Number}
         */
        SurfaceShape.DEFAULT_POLAR_THROTTLE = 10;

        return SurfaceShape;
    }
);