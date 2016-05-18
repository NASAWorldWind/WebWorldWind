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
        };

        SurfaceShape.prototype = Object.create(Renderable.prototype);

        Object.defineProperties(SurfaceShape.prototype, {
            stateKey: {
                /**
                 * A hash key of the total visible external state of the surface shape.
                 * @memberof SurfaceShape.prototype
                 * @type {String}
                 */
                get: function() {
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
                get: function() {
                    return this._displayName;
                },
                set: function(value) {
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
                get: function() {
                    return this._attributes;
                },
                set: function(value) {
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
                get: function() {
                    return this._highlightAttributes;
                },
                set: function(value) {
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
                get: function() {
                    return this._highlighted;
                },
                set: function(value) {
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
                get: function() {
                    return this._enabled;
                },
                set: function(value) {
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
                get: function() {
                    return this._pathType;
                },
                set: function(value) {
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
                get: function() {
                    return this._maximumNumEdgeIntervals;
                },
                set: function(value) {
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
                get: function() {
                    return this._sector;
                }
            }
        });

        SurfaceShape.staticStateKey = function(shape) {
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

            return   "dn " + shape.displayName +
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

        SurfaceShape.prototype.computeStateKey = function() {
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
        SurfaceShape.prototype.computeBoundaries = function(globe) {
            // This method is in the base class and should be overridden if the boundaries are generated.
            // It should be called only if the geometry has been provided by the user and does not need to be generated.
            // assert(!this._boundaries);

            throw new AbstractError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceShape", "computeBoundaries", "abstractInvocation"));
        };

        // Internal function. Intentionally not documented.
        SurfaceShape.prototype.render = function(dc) {
            if (!this.enabled) {
                return;
            }

            this.layer = dc.currentLayer;

            this.prepareBoundaries(dc);

            dc.surfaceShapeTileBuilder.insertSurfaceShape(this);
        };

        // Internal function. Intentionally not documented.
        SurfaceShape.prototype.interpolateLocations = function(locations) {
            var first  = locations[0],
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
        SurfaceShape.prototype.interpolateEdge = function(start, end, locations) {
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
                    locations.push(location);
                }
            }
        };

        // Internal function. Intentionally not documented.
        // Return a throttled step size when near the poles.
        SurfaceShape.prototype.throttledStep = function(dt, location) {
            var cosLat = Math.cos(location.latitude * Angle.DEGREES_TO_RADIANS);
            cosLat *= cosLat; // Square cos to emphasize poles and de-emphasize equator.

            // Remap polarThrotle:
            //  0 .. INF => 0 .. 1
            // This acts as a weight between no throttle and fill throttle.
            var weight = this._polarThrottle / (1 + this._polarThrottle);

            return dt * ((1 - weight) + weight * cosLat);
        };

        // Internal function. Intentionally not documented.
        SurfaceShape.prototype.prepareBoundaries = function(dc) {
            if (this.isPrepared) return;

            // Some shapes generate boundaries, such as ellipses and sectors;
            // others don't, such as polylines and polygons.
            // Handle the latter below.
            if (!this._boundaries) {
                this.computeBoundaries(dc);
            }

            if (!this._locations) {
                this.interpolateLocations(this._boundaries);
            }

            this.prepareGeometry(dc);

            this.prepareSectors();

            this.isPrepared = true;
        };

        /**
         * Computes the bounding sectors for the shape. There will be more than one if the shape crosses the date line,
         * but does not enclose a pole.
         *
         * @param {DrawContext} dc The drawing context containing a globe.
         *
         * @return {Sector[]}  Bounding sectors for the shape.
         */
        SurfaceShape.prototype.computeSectors = function(dc) {
            // Return a previously computed value if it already exists.
            if (this._sectors && this._sectors.length > 0) {
                return this._sectors;
            }

            this.prepareBoundaries(dc);

            return this._sectors;
        };

        // Internal function. Intentionally not documented.
        SurfaceShape.prototype.prepareSectors = function() {
            var boundaries = this._boundaries;
            if (!boundaries) {
                return;
            }

            this._sector = new Sector(-90, 90, -180, 180);
            this._sector.setToBoundingSector(boundaries);

            var pole = this.containsPole(boundaries);
            if (pole != Location.poles.NONE) {
                // If the shape contains a pole, then the bounding sector is defined by the shape's extreme latitude, the
                // latitude of the pole, and the full range of longitude.
                if (pole == Location.poles.NORTH) {
                    this._sector = new Sector(this._sector.minLatitude, 90, -180, 180);
                }
                else {
                    this._sector = new Sector(-90, this._sector.maxLatitude, -180, 180);
                }

                this._sectors = [this._sector];
            }
            else if (Location.locationsCrossDateLine(boundaries)) {
                this._sectors = Sector.splitBoundingSectors(boundaries);
            }
            else {
                 if (!this._sector.isEmpty()) {
                    this._sectors = [this._sector];
                }
            }

            if (!this._sectors) {
                return;
            }

            // Great circle paths between two latitudes may result in a latitude which is greater or smaller than either of
            // the two latitudes. All other path types are bounded by the defining locations.
            if (this._pathType === WorldWind.GREAT_CIRCLE) {
                for (var idx = 0, len = this._sectors.length; idx < len; idx += 1) {
                    var sector = this._sectors[idx];

                    var extremes = Location.greatCircleArcExtremeLocations(boundaries);

                    var minLatitude = Math.min(sector.minLatitude, extremes[0].latitude);
                    var maxLatitude = Math.max(sector.maxLatitude, extremes[1].latitude);

                    this._sectors[idx] = new Sector(minLatitude, maxLatitude, sector.minLongitude, sector.maxLongitude);
                }
            }
        };

        // Internal function. Intentionally not documented.
        SurfaceShape.prototype.prepareGeometry = function(dc) {
            var datelineLocations;

            this._interiorGeometry = [];
            this._outlineGeometry = [];

            var locations = this._locations;

            var pole = this.containsPole(locations);
            if (pole != Location.poles.NONE) {
                // Wrap the shape interior around the pole and along the anti-meridian. See WWJ-284.
                var poleLocations = this.cutAlongDateLine(locations, pole, dc.globe);
                this._interiorGeometry.push(poleLocations);

                // The outline need only compensate for dateline crossing. See WWJ-452.
                datelineLocations = this.repeatAroundDateline(locations);
                this._outlineGeometry.push(datelineLocations[0]);
                if (datelineLocations.length > 1) {
                    this._outlineGeometry.push(datelineLocations[1]);
                }
            }
            else if (Location.locationsCrossDateLine(locations)) {
                datelineLocations = this.repeatAroundDateline(locations);
                this._interiorGeometry.push(datelineLocations[0]); //this._interiorGeometry.addAll(datelineLocations);
                this._interiorGeometry.push(datelineLocations[1]); //this._interiorGeometry.addAll(datelineLocations);
                this._outlineGeometry.push(datelineLocations[0]); //this._outlineGeometry.addAll(datelineLocations);
                this._outlineGeometry.push(datelineLocations[1]); //this._outlineGeometry.addAll(datelineLocations);
            }
            else {
                this._interiorGeometry.push(locations);
                this._outlineGeometry.push(locations);
            }
        };

        /**
         * Determine if a list of geographic locations encloses either the North or South pole. The list is treated as a
         * closed loop. (If the first and last positions are not equal the loop will be closed for purposes of this
         * computation.)
         *
         * @param {Location[]} locations Locations to test.
         *
         * @return {Number} Location.poles.NORTH if the North Pole is enclosed,
         *                  Location.poles.SOUTH if the South Pole is enclosed, or
         *                  Location.poles.NONE if neither pole is enclosed.
         *                  Always returns Location.poles.NONE if {@link #canContainPole()} returns false.
         *
         * TODO: handle a shape that contains both poles.
         */
        SurfaceShape.prototype.containsPole = function(locations) {
            // Determine how many times the path crosses the date line. Shapes that include a pole will cross an odd number of times.
            var containsPole = false;

            var minLatitude = 90.0;
            var maxLatitude = -90.0;

            var prev = locations[0];
            for (var idx = 1, len = locations.length; idx < len; idx += 1) {
                var next = locations[idx];

                if (Location.locationsCrossDateLine([prev, next])) {
                    containsPole = !containsPole;
                }

                minLatitude = Math.min(minLatitude, next.latitude);
                maxLatitude = Math.max(maxLatitude, next.latitude);

                prev = next;
            }

            // Close the loop by connecting the last position to the first. If the loop is already closed then the following
            // test will always fail, and will not affect the result.
            var first = locations[0];
            if (Location.locationsCrossDateLine([first, prev])) {
                containsPole = !containsPole;
            }

            if (!containsPole) {
                return Location.poles.NONE;
            }

            // Determine which pole is enclosed. If the shape is entirely in one hemisphere, then assume that it encloses
            // the pole in that hemisphere. Otherwise, assume that it encloses the pole that is closest to the shape's
            // extreme latitude.
            if (minLatitude > 0) {
                return Location.poles.NORTH; // Entirely in Northern Hemisphere.
            }
            else if (maxLatitude < 0) {
                return Location.poles.SOUTH; // Entirely in Southern Hemisphere.
            }
            else if (Math.abs(maxLatitude) >= Math.abs(minLatitude)) {
                return Location.poles.NORTH; // Spans equator, but more north than south.
            }
            else {
                return Location.poles.SOUTH; // Spans equator, but more south than north.
            }
        };

        /**
         * Divide a list of locations that encloses a pole along the international date line. This method determines where
         * the locations cross the date line, and inserts locations to the pole, and then back to the intersection position.
         * This allows the shape to be "unrolled" when projected in a lat-lon projection.
         *
         * @param {Location[]} locations    Locations to cut at date line. This list is not modified.
         * @param {Number} pole             Pole contained by locations, either AVKey.NORTH or AVKey.SOUTH.
         * @param {Globe} globe             Current globe.
         *
         * @return {Location[]} New location list with locations added to correctly handle date line intersection.
         */
        SurfaceShape.prototype.cutAlongDateLine = function(locations, pole, globe)
        {
            // If the locations do not contain a pole, then there's nothing to do.
            if (pole == Location.poles.NONE) {
                return locations;
            }

            var newLocations = [];

            var poleLat = pole == Location.poles.NORTH ? 90 : -90;

            var prev = locations[locations.length - 1];
            for (var idx = 0, len = locations.length; idx < len; idx += 1) {
                var next = locations[idx];

                newLocations.push(prev);
                if (Location.locationsCrossDateLine([prev, next])) {
                    // Determine where the segment crosses the date line.
                    var latitude = Location.intersectionWithMeridian(prev, next, 180, globe);
                    var sign = WWMath.signum(prev.longitude);

                    var lat = latitude;
                    var thisSideLon = 180 * sign;
                    var otherSideLon = -thisSideLon;

                    // Add locations that run from the intersection to the pole, then back to the intersection. Note
                    // that the longitude changes sign when the path returns from the pole.
                    //         . Pole
                    //      2 ^ | 3
                    //        | |
                    //      1 | v 4
                    // --->---- ------>
                    newLocations.push(new Location(lat, thisSideLon));
                    newLocations.push(new Location(poleLat, thisSideLon));
                    newLocations.push(new Location(poleLat, otherSideLon));
                    newLocations.push(new Location(lat, otherSideLon));
                }

                prev = next;
            }
            newLocations.push(prev);

            return newLocations;
        };

        /**
         * Returns a list containing two copies of the specified list of locations crossing the dateline: one that extends
         * across the -180 longitude  boundary and one that extends across the +180 longitude boundary. If the list of
         * locations does not cross the dateline this returns a list containing a copy of the original list.
         *
         * @param {Location[]} locations Locations to repeat. This is list not modified.
         *
         * @return {Location[][]} A list containing two new location lists, one copy for either side of the date line.
         */
        SurfaceShape.prototype.repeatAroundDateline = function(locations) {
            var lonOffset = 0,
                applyLonOffset = false;

            var newLocations = [];

            var prev= locations[0];
            newLocations.push(prev);
            for (var idx = 1, len = locations.length; idx < len; idx += 1) {
                var next = locations[idx];

                if (Location.locationsCrossDateLine([prev, next])) {
                    if (lonOffset == 0) {
                        lonOffset = prev.longitude < 0 ? -360 : 360;
                    }

                    applyLonOffset = !applyLonOffset;
                }

                if (applyLonOffset) {
                    newLocations.push(new Location(next.latitude, next.longitude + lonOffset));
                }
                else {
                    newLocations.push(next);
                }

                prev = next;
            }

            var locationGroup = [newLocations];

            if (lonOffset != 0) {
                var oldLocations = newLocations;
                newLocations = [];

                for (idx = 0, len = oldLocations.length; idx < len; idx += 1) {
                    var cur = oldLocations[idx];

                    newLocations.push(new Location(cur.latitude, cur.longitude - lonOffset));
                }

                locationGroup.push(newLocations);
            }

            return locationGroup;
        };

        // Internal use only. Intentionally not documented.
        SurfaceShape.prototype.resetPickColor = function() {
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
        SurfaceShape.prototype.renderToTexture = function(dc, ctx2D, xScale, yScale, dx, dy) {
            var idx,
                len,
                path = [],
                idxPath,
                lenPath,
                isPicking = dc.pickingMode,
                attributes = (this._highlighted ? (this._highlightAttributes || this._attributes) : this._attributes);

            if (isPicking && !this.pickColor) {
                this.pickColor = dc.uniquePickColor();
            }

            // Fill the interior of the shape.
            if (!this._isInteriorInhibited && attributes.drawInterior) {
                ctx2D.fillStyle = isPicking ? this.pickColor.toRGBAString() : attributes.interiorColor.toRGBAString();

                for (idx = 0, len = this._interiorGeometry.length; idx < len; idx += 1) {
                    idxPath = 0;
                    lenPath = this._outlineGeometry[idx].length * 2;
                    path.splice(0, path.length);

                    // Convert the geometry to a transformed path that can be drawn directly, and as a side effect,
                    // detect if the path is smaller than a pixel. If it is, don't bother drawing it.
                    if (this.transformPath(this._interiorGeometry[idx], xScale, yScale, dx, dy, path)) {
                        ctx2D.beginPath();

                        ctx2D.moveTo(path[idxPath++], path[idxPath++]);

                        while (idxPath < lenPath) {
                            ctx2D.lineTo(path[idxPath++], path[idxPath++]);
                        }

                        ctx2D.closePath();

                        ctx2D.fill();
                    }
                }
            }

            // Draw the outline of the shape.
            if (attributes.drawOutline && attributes.outlineWidth > 0) {
                ctx2D.lineWidth = 4 * attributes.outlineWidth;
                ctx2D.strokeStyle = isPicking ? this.pickColor.toRGBAString() : attributes.outlineColor.toRGBAString();

                var pattern = this._attributes.outlineStipplePattern,
                    factor = this._attributes.outlineStippleFactor;

                for (idx = 0, len = this._outlineGeometry.length; idx < len; idx += 1) {
                    path.splice(0, path.length);

                    // Convert the geometry to a transformed path that can be drawn directly, and as a side effect,
                    // detect if the path is smaller than a pixel. If it is, don't bother drawing it.
                    if (this.transformPath(this._outlineGeometry[idx], xScale, yScale, dx, dy, path)) {
                        // NOTE: this code used to be written as:
                        //      a single beginPath() call,
                        //      followed by a single moveTo() call,
                        //      followed by as many lineTo() calls as there were vertices remaining in the path,
                        //      followed by a stroke().
                        // Performance was BAD!
                        // The code was rewritten this way and it doesn't have any performance issues.
                        // That shouldn't be the case, but it is.
                        var xFirst = path[0],
                            yFirst = path[1],
                            xPrev = xFirst,
                            yPrev = yFirst,
                            xNext = xFirst,
                            yNext = yFirst,
                            isPrevFirst = true,
                            isNextFirst = true,
                            countFirst = 0;

                        for (idxPath = 2, lenPath = path.length; idxPath < lenPath; ) {
                            // Remember the previous point in the path.
                            xPrev = xNext;
                            yPrev = yNext;
                            isPrevFirst = isNextFirst;

                            // Extract the next point in the path.
                            xNext = path[idxPath++];
                            yNext = path[idxPath++];

                            isNextFirst = xNext == xFirst && yNext == yFirst;

                            // Avoid drawing virtual edges that reconnect to the first point
                            // when drawing multiply connected domains.
                            if (isPrevFirst || isNextFirst) {
                                countFirst += 1;

                                if (countFirst > 2) {
                                    continue;
                                }
                            }

                            // Draw the path one line segment at a time.
                            ctx2D.beginPath();
                            ctx2D.moveTo(xPrev, yPrev);

                            ctx2D.lineTo(xNext, yNext);

                            ctx2D.stroke();
                        }
                    }
                }
            }

            if (isPicking) {
                var po = new PickedObject(this.pickColor.clone(), this._pickDelegate ? this._pickDelegate : this,
                    null, this.layer, false);
                dc.resolvePick(po);
            }
        };

        //
        // Internal use only.
        // Transform a path and compute its extrema.
        // In the process of transforming it, optimize out line segments that are too short (shorter than some threshold).
        // Return an indicator of the path is "big enough".
        SurfaceShape.prototype.transformPath = function(path, xScale, yScale, xOffset, yOffset, result) {
            var xPrev, yPrev,
                xNext, yNext,
                xFirst, yFirst,
                xLast, yLast,
                xMin, yMin,
                xMax, yMax,
                dx, dy, dr2,
                dr2Min = 4, // Squared length of minimum length line that must be drawn.
                isNextFirst,
                location, idxResult, idxPath, lenPath;

            idxResult = 0;

            location = path[0];

            xFirst = location.longitude * xScale + xOffset;
            yFirst = location.latitude * yScale + yOffset;

            isNextFirst = true;

            xMin = xMax = xPrev = xNext = xFirst;
            yMin = yMax = yPrev = yNext = yFirst;

            result[idxResult++] = xNext;
            result[idxResult++] = yNext;

            for (idxPath = 1, lenPath = path.length; idxPath < lenPath; idxPath += 1) {
                location = path[idxPath];

                // Capture the last point even it it was optimized out.
                xLast = xNext;
                yLast = yNext;

                xNext = location.longitude * xScale + xOffset;
                yNext = location.latitude * yScale + yOffset;

                // Detect whether the next point is the same as the first point.
                isNextFirst = (xNext == xFirst) && (yNext == yFirst);

                // Compute the length from the previous point that was emitted to the next point.
                dx = xNext - xPrev;
                dy = yNext - yPrev;
                dr2 = dx * dx + dy * dy;

                // If the line is smaller than a single pixel, accumulate more data before emitting,
                // unless the point is the same as the first point, in which case it is always emitted.
                if (isNextFirst || dr2 >= dr2Min) {
                    xMin = Math.min(xMin, xNext);
                    xMax = Math.max(xMax, xNext);
                    yMin = Math.min(yMin, yNext);
                    yMax = Math.max(yMax, yNext);

                    // If the last point was optimized out because the line it contributed to was too short,
                    // force it to be emitted.
                    if (result[idxResult - 2] != xLast || result[idxResult - 1] != yLast) {
                        result[idxResult++] = xLast;
                        result[idxResult++] = yLast;
                    }

                    result[idxResult++] = xNext;
                    result[idxResult++] = yNext;

                    xPrev = xNext;
                    yPrev = yNext;
                }
            }

            return (xMax - xMin) >= 2 || (yMax - yMin) >= 2;
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