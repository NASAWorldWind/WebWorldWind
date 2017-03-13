/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WKTParser
 */
define([
        '../../geom/Location',
        '../../util/Logger',
        '../../shapes/PlacemarkAttributes',
        '../../layer/RenderableLayer',
        '../../shapes/ShapeAttributes',
        '../../shapes/SurfaceCircle',
        '../../shapes/SurfacePolygon',
        '../../shapes/SurfacePolyline'
    ],
    function (Location,
              Logger,
              PlacemarkAttributes,
              RenderableLayer,
              ShapeAttributes,
              SurfaceCircle,
              SurfacePolygon,
              SurfacePolyline) {
        "use strict";

        /**
         * Constructs a WKT object for a specified WKT data source. Call [load]{@link WKTParser#load} to
         * retrieve the WKT and create shapes for it.
         * @alias WKTParser
         * @constructor
         * @classdesc Parses a WKT and creates shapes representing its contents. Points and MultiPoints in
         * the WKT are represented by [Placemarks]{@link Placemark}, Lines and MultiLines are represented by
         * [SurfacePolylines]{@link SurfacePolyline}, and Polygons and MultiPolygons are represented
         * by [SurfacePolygons]{@link SurfacePolygon}.
         * @param {String} dataSource The data source of the WKT. Can be a string or an URL to a WKT.
         * @throws {ArgumentError} If the specified data source is null or undefined.
         */
        var WKTParser = function (dataSource) {
            if (!dataSource) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "constructor", "missingDataSource"));
            }

            // Documented in defineProperties below.
            this._dataSource = dataSource;

            // Documented in defineProperties below.
            this._WKTObject = null;

            // Documented in defineProperties below.
            this._WKTType = null;

            // Documented in defineProperties below.
            this._crs = null;

            // Documented in defineProperties below.
            this._layer = null;

            // Documented in defineProperties below.
            this._parserCompletionCallback = null;

            // Documented in defineProperties below.
            this._shapeConfigurationCallback = this.defaultShapeConfigurationCallback;


            this.defaultPlacemarkAttributes = new PlacemarkAttributes(null);

            this.defaultShapeAttributes = new ShapeAttributes(null);

            //this.setProj4jsAliases();
        };

        Object.defineProperties(WKTParser.prototype, {
            /**
             * The WKT data source as specified to this WKT's constructor.
             * @memberof WKTParser.prototype
             * @type {String}
             * @readonly
             */
            dataSource: {
                get: function () {
                    return this._dataSource;
                }
            },

            /**
             * The WKT object resulting from the parsing of WKT string.
             * @memberof WKTParser.prototype
             * @type {Object}
             * @readonly
             */
            WKTObject: {
                get: function () {
                    return this._WKTObject;
                }
            },

            /**
             * The layer containing the shapes representing the geometries in this WKT, as specified to this
             * WKT's constructor or created by the constructor if no layer was specified.
             * @memberof WKTParser.prototype
             * @type {RenderableLayer}
             * @readonly
             */
            layer: {
                get: function () {
                    return this._layer;
                }
            },

            /** The completion callback specified to [load]{@link WKTParser#load}. An optional function called when
             * the WKT loading is complete and
             * all the shapes have been added to the layer.
             * @memberof WKTParser.prototype
             * @type {Function}
             * @readonly
             */
            parserCompletionCallback: {
                get: function () {
                    return this._parserCompletionCallback;
                }
            },

            /**
             * The attribute callback specified to [load]{@link WKTParser#load}.
             * See that method's description for details.
             * @memberof WKTParser.prototype
             * @type {Function}
             * @default [defaultShapeConfigurationCallback]{@link WKTParser#defaultShapeConfigurationCallback}
             * @readonly
             */
            shapeConfigurationCallback: {
                get: function () {
                    return this._shapeConfigurationCallback;
                }
            }
        });

        /**
         * Retrieves the WKT, parses it and creates shapes representing its contents. The result is a layer
         * containing the created shapes. A function can also be specified to be called for each WKT geometry so
         * that the attributes and other properties of the shape created for it can be assigned.
         * @param {Function} parserCompletionCallback An optional function called when the WKT loading is
         * complete and all the shapes have been added to the layer.
         * @param {Function} shapeConfigurationCallback An optional function called by the addRenderablesFor*
         * methods just prior to creating a shape for the indicated WKT geometry. This function
         * can be used to assign attributes to newly created shapes. The callback function's first argument is the
         * current geometry object.  The second argument to the callback function is the object containing the
         * properties read from the corresponding WKT properties member, if any.
         *
         * @param {RenderableLayer} layer A {@link RenderableLayer} to hold the shapes created for each WKT geometry.
         * If null, a new layer is created and assigned to this object's [layer]{@link WKTParser#layer} property.
         */

        WKTParser.prototype.load = function (parserCompletionCallback, shapeConfigurationCallback, layer) {
            if (parserCompletionCallback) {
                this._parserCompletionCallback = parserCompletionCallback;
            }

            if (shapeConfigurationCallback) {
                this._shapeConfigurationCallback = shapeConfigurationCallback;
            }

            this._layer = layer || new RenderableLayer();

            // if (this.isDataSourceWKT()){ // TODO - how to find out if it is WKT
            // Do trimming
            this.parse(this.dataSource);
            // }
            // else {
            //     this.requestUrl(this.dataSource);
            // }
        };

        /**
         * The default [shapeConfigurationCallback]{@link WKTParser#shapeConfigurationCallback} for this WKT.
         * It is called if none was specified to the [load]{@link WKTParser#load} method.
         * This method assigns shared, default attributes to the shapes created for each geometry. Any changes to these
         * attributes will have an effect in all shapes created by this WKT.
         * <p>
         * For all geometry, the WKT's properties are checked for an attribute named "name", "Name" or "NAME".
         * If found, the returned shape configuration contains a name property holding the value associated with
         * the attribute. This value is specified as the label displayName property for all shapes created.
         * For {@link Placemark} shapes it is also specified as the placemark label.
         * It is specified as the displayName for all other shapes.
         *
         * @param {WKTGeometry} geometry An object containing the geometry associated with this WKT.
         * @param {Object} properties An object containing the attribute-value pairs found in WKT feature
         * properties member.
         * @returns {Object} An object with properties as described above.
         */
        WKTParser.prototype.defaultShapeConfigurationCallback = function (geometry, properties) {
            var configuration = {};

            var name = properties.name || properties.Name || properties.NAME;
            if (name) {
                configuration.name = name;
            }

            if (geometry.isPointType() || geometry.isMultiPointType()) {
                configuration.attributes = this.defaultPlacemarkAttributes;
            } else if (geometry.isLineStringType() || geometry.isMultiLineStringType()) {
                configuration.attributes = this.defaultShapeAttributes;
            } else if (geometry.isPolygonType() || geometry.isMultiPolygonType()) {
                configuration.attributes = this.defaultShapeAttributes;
            }

            return configuration;
        };

        // Get WKT string using XMLHttpRequest. Internal use only.
        WKTParser.prototype.requestUrl = function (url) {
            var xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            xhr.responseType = 'text';
            xhr.onreadystatechange = (function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        this.parse(xhr.response);
                    }
                    else {
                        Logger.log(Logger.LEVEL_WARNING,
                            "WKT retrieval failed (" + xhr.statusText + "): " + url);
                    }
                }
            }).bind(this);

            xhr.onerror = function () {
                Logger.log(Logger.LEVEL_WARNING, "WKT retrieval failed: " + url);
            };

            xhr.ontimeout = function () {
                Logger.log(Logger.LEVEL_WARNING, "WKT retrieval timed out: " + url);
            };

            xhr.send(null);
        };

        // Parse WKT string using built in method JSON.parse(). Internal use only.
        WKTParser.prototype.parse = function (WKTString) {
            var geometryTypeRegex = /^\s*([a-z]+)\s*(\(\s*(.*)\s*\)|EMPTY)\s*$/mig;
            var matching = geometryTypeRegex.exec(WKTString);

            if (!matching) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "parse", "missingWKTType")
                );
            }

            var geometryType = matching[1];

            if (geometryType == 'POLYGON') {
                this.createPolygon(WKTString);
            } else if (geometryType == 'POINT') {
                this.createPoint(WKTString);
            } else if (geometryType == 'LINESTRING') {
                this.createLineString(WKTString);
            } else if (geometryType == 'MULTIPOLYGON') {
                this.createMultiPolygon(WKTString);
            } else if(geometryType == 'MULTIPOINT') {
                this.createMultiPoint(WKTString);
            } else if (geometryType == 'MULTILINESTRING') {
                this.createMultiLineString(WKTString);
            }
        };

        /**
         *
         * @param WKTString
         */
        WKTParser.prototype.createMultiLineString = function(WKTString) {
            var multiLineString = WKTString.replace('MULTILINESTRING ((', '').replace('))','');
            var lineStrings = multiLineString.split('),(');
            var self = this;
            lineStrings.forEach(function(lineString){
                self.createLineString(lineString);
            });
        };

        /**
         *
         * @param WKTString
         */
        WKTParser.prototype.createMultiPoint = function(WKTString) {
            var multiplePointCoordinates = WKTString.replace('MULTIPOINT ((', '').replace('))', '');
            var pointsCoordinates = multiplePointCoordinates.split("),(");
            var self = this;
            pointsCoordinates.forEach(function(latitudeLongitude) {
                var latitudeLongitudeCoordinates = latitudeLongitude.split(' ');

                var latitude = latitudeLongitudeCoordinates[0];
                var longitude = latitudeLongitudeCoordinates[1];

                self._layer.addRenderable(
                    new SurfaceCircle(
                        new Location(latitude, longitude), 1000, self.defaultShapeAttributes
                    )
                );
            });
        };

        /**
         * It takes valid Multipolygon string and based on it creates polygons.
         * @param WKTString
         */
        WKTParser.prototype.createMultiPolygon = function(WKTString) {
            var multiPolygonCoordinates = WKTString.replace('MULTIPOLYGON (((', '').replace(')))', '');
            var multiPolygons = multiPolygonCoordinates.split(')),((');
            var self = this;
            multiPolygons.forEach(function(polygon){
                self.createPolygon(polygon);
            });
        };

        /**
         *
         * @param WKTString {String}
         */
        WKTParser.prototype.createLineString = function(WKTString) {
            var polygonCoordinates = WKTString.replace('LINESTRING ((', '').replace('))', '');
            var boundaries = this.parseBoundaries(polygonCoordinates);
            this._layer.addRenderable(new SurfacePolyline(boundaries, this.defaultShapeAttributes));
        };

        /**
         *
         * @param WKTString {String}
         */
        WKTParser.prototype.createPoint = function(WKTString) {
            var pointCoordinates = WKTString.replace('POINT (', '').replace(')', '');
            var latitudeLongitude = pointCoordinates.split(' ');
            this._layer.addRenderable(
                new SurfaceCircle(
                    new Location(latitudeLongitude[0], latitudeLongitude[1]), 1000, this.defaultShapeAttributes
                )
            );
        };

        /**
         * It takes WKT String containing the polygon and retrieves the boundaries and based on them creates a polygon.
         * @param WKTString {String} Text representation of polygon.
         */
        WKTParser.prototype.createPolygon = function(WKTString) {
            var polygonCoordinates = WKTString.replace('POLYGON ((', '').replace('))', '');
            if (WKTString.indexOf("),(") != -1) {
                var polygonBoundaries = polygonCoordinates.split("),(");
                var outerBoundaries = this.parseBoundaries(polygonBoundaries[0]);
                var innerBoundaries = this.parseBoundaries(polygonBoundaries[1]);
                this._layer.addRenderable(new SurfacePolygon([outerBoundaries, innerBoundaries], this.defaultShapeAttributes));
            } else {
                var boundaries = this.parseBoundaries(polygonCoordinates);
                this._layer.addRenderable(new SurfacePolygon(boundaries, this.defaultShapeAttributes));
            }
        };

        /**
         *
         * @private
         * @param boundariesText
         * @returns {Array}
         */
        WKTParser.prototype.parseBoundaries = function (boundariesText) {
            var coordinatePairs = boundariesText.split(', ');
            var boundaries = [];
            coordinatePairs.forEach(function (coordinatePair) {
                var latitudeLongitude = coordinatePair.split(' ');
                boundaries.push(new Location(latitudeLongitude[0], latitudeLongitude[1]));
            });
            return boundaries;
        };

        /**
         * Indicate whether the data source is of a JSON type.
         * @returns {Boolean} True if the data source is of JSON type.
         */
        WKTParser.prototype.isDataSourceJson = function () {
            try {
                JSON.parse(this.dataSource);
            } catch (e) {
                return false;
            }
            return true;
        };

        return WKTParser;
    }
);
