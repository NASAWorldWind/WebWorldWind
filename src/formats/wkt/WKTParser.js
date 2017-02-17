/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WKTParser
 */
define([
        '../../util/Logger',
        './WKTConstants',
        // './WKTCRS',
        // './WKTFeature',
        // './WKTFeatureCollection',
        './WKTGeometry',
        // './WKTGeometryCollection',
        './WKTGeometryLineString',
        './WKTGeometryMultiLineString',
        './WKTGeometryMultiPoint',
        './WKTGeometryMultiPolygon',
        './WKTGeometryPoint',
        './WKTGeometryPolygon'
    ],
    function (
        Logger,
        // WKTCRS,
        // WKTFeature,
        // WKTFeatureCollection,
        WKTGeometry,
        // WKTGeometryCollection,
        WKTGeometryLineString,
        WKTGeometryMultiLineString,
        WKTGeometryMultiPoint,
        WKTGeometryMultiPolygon,
        WKTGeometryPoint,
        WKTGeometryPolygon
    ) {
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

            this.setProj4jsAliases();
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
             * The type of the WKT. The type can be one of the following:
             * <ul>
             *     <li>WKTConstants.TYPE_POINT</li>
             *     <li>WKTConstants.TYPE_MULTI_POINT</li>
             *     <li>WKTConstants.TYPE_LINE_STRING</li>
             *     <li>WKTConstants.TYPE_MULTI_LINE_STRING</li>
             *     <li>WKTConstants.TYPE_POLYGON</li>
             *     <li>WKTConstants.TYPE_MULTI_POLYGON</li>
             *     <li>WKTConstants.TYPE_GEOMETRY_COLLECTION</li>
             *     <li>WKTConstants.TYPE_FEATURE</li>
             *     <li>WKTConstants.TYPE_FEATURE_COLLECTION</li>
             * </ul>
             * This value is defined after WKT parsing.
             * @memberof WKTParser.prototype
             * @type {String}
             * @readonly
             */
            WKTType: {
                get: function () {
                    return this._WKTType;
                }
            },

            /**
             *
             */
            crs: {
                get: function () {
                    return this._crs;
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
         * See the following methods for descriptions of the configuration properties they recognize:
         * <ul>
         *     <li>[addRenderablesForPoint]{@link WKTParser#addRenderablesForPoint}</li>
         *     <li>[addRenderablesForMultiPoint]{@link WKTParser#addRenderablesForMultiPoint}</li>
         *     <li>[addRenderablesForLineString]{@link WKTParser#addRenderablesForLineString}</li>
         *     <li>[addRenderablesForMultiLineString]{@link WKTParser#addRenderablesForMultiLineString}</li>
         *     <li>[addRenderablesForPolygon]{@link WKTParser#addRenderablesForPolygon}</li>
         *     <li>[addRenderablesForMultiPolygon]{@link WKTParser#addRenderablesForMultiPolygon}</li>
         *     <li>[addRenderablesForGeometryCollection]{@link WKTParser#addRenderablesForGeometryCollection}</li>
         *     <li>[addRenderablesForFeature]{@link WKTParser#addRenderablesForFeature}</li>
         *     <li>[addRenderablesForFeatureCollection]{@link WKTParser#addRenderablesForFeatureCollection}</li>
         * </ul>
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


            // TODO what to do with EMPTY?


            // TODO - filter out invalid geometry types




            // TODO if single feature




            // TODO if multi feature








            // try {
            //     this._WKTObject = JSON.parse(WKTString); // TODO
            // }
            // catch (e) {
            //     Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "parse",
            //         "invalidWKTObject");
            // }
            // finally {
            //     if (this.WKTObject){
            //         if (Object.prototype.toString.call(this.WKTObject) === '[object Array]') {
            //             throw new ArgumentError(
            //                 Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "parse",
            //                     "invalidWKTObjectLength"));
            //         }
            //
            //         if (this.WKTObject.hasOwnProperty(WKTConstants.FIELD_TYPE)) {
            //             this.setWKTType();
            //             this.setWKTCRS();
            //         }
            //         else{
            //             throw new ArgumentError(
            //                 Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "parse",
            //                     "missingWKTType"));
            //         }
            //
            //         if (!!this._parserCompletionCallback && typeof this._parserCompletionCallback === "function") {
            //             this._parserCompletionCallback(this.layer);
            //         }
            //     }
            // }
        };

        // Set WKT CRS object.
        // If no crs member can be so acquired, the default CRS shall apply to the WKT object.
        // The crs member should be on the top-level WKT object in a hierarchy (in feature collection, feature,
        // geometry order) and should not be repeated or overridden on children or grandchildren of the object.
        // Internal use only.
        WKTParser.prototype.setWKTCRS = function () {
            if (this.WKTObject[WKTConstants.FIELD_CRS]){
                this._crs = new WKTCRS (
                    this.WKTObject[WKTConstants.FIELD_CRS][WKTConstants.FIELD_TYPE],
                    this.WKTObject[WKTConstants.FIELD_CRS][WKTConstants.FIELD_PROPERTIES]);

                var crsCallback = (function() {
                    this.addRenderablesForWKT(this.layer);
                }).bind(this);

                this.crs.setCRSString(crsCallback);
            }
            else{
                // If no CRS, consider default one
                this.addRenderablesForWKT(this.layer);
            }
        };

        /**
         * Iterates over this WKT's geometries and creates shapes for them. See the following methods for the
         * details of the shapes created and their use of the
         * [shapeConfigurationCallback]{@link WKTParser#shapeConfigurationCallback}:
         * <ul>
         *     <li>[addRenderablesForGeometry]{@link WKTParser#addRenderablesForGeometry}</li>
         *     <li>[addRenderablesForGeometryCollection]{@link WKTParser#addRenderablesForGeometryCollection}</li>
         *     <li>[addRenderablesForFeature]{@link WKTParser#addRenderablesForFeature}</li>
         *     <li>[addRenderablesForFeatureCollection]{@link WKTParser#addRenderablesForFeatureCollection}</li>
         * </ul>
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         */
        WKTParser.prototype.addRenderablesForWKT = function (layer) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForWKT", "missingLayer"));
            }

            switch(this.WKTType) {
                case WKTConstants.TYPE_FEATURE:
                    var feature = new  WKTFeature(
                        this.WKTObject[WKTConstants.FIELD_GEOMETRY],
                        this.WKTObject[WKTConstants.FIELD_PROPERTIES],
                        this.WKTObject[WKTConstants.FIELD_ID],
                        this.WKTObject[WKTConstants.FIELD_BBOX]
                    );
                    this.addRenderablesForFeature(
                        layer,
                        feature);
                    break;
                case WKTConstants.TYPE_FEATURE_COLLECTION:
                    var featureCollection = new WKTFeatureCollection(
                        this.WKTObject[WKTConstants.FIELD_FEATURES],
                        this.WKTObject[WKTConstants.FIELD_BBOX]
                    );
                    this.addRenderablesForFeatureCollection(
                        layer,
                        featureCollection);
                    break;
                case WKTConstants.TYPE_GEOMETRY_COLLECTION:
                    var geometryCollection = new WKTGeometryCollection(
                        this.WKTObject[WKTConstants.FIELD_GEOMETRIES],
                        this.WKTObject[WKTConstants.FIELD_BBOX]);
                    this.addRenderablesForGeometryCollection(
                        layer,
                        geometryCollection,
                        null);
                    break;
                default:
                    this.addRenderablesForGeometry(
                        layer,
                        this.WKTObject,
                        null);
                    break;
            }
        };

        /**
         * Creates shape for a geometry. See the following methods for the
         * details of the shapes created and their use of the
         * [shapeConfigurationCallback]{@link WKTParser#shapeConfigurationCallback}:
         * <ul>
         *     <li>[addRenderablesForPoint]{@link WKTParser#addRenderablesForPoint}</li>
         *     <li>[addRenderablesForMultiPoint]{@link WKTParser#addRenderablesForMultiPoint}</li>
         *     <li>[addRenderablesForLineString]{@link WKTParser#addRenderablesForLineString}</li>
         *     <li>[addRenderablesForMultiLineString]{@link WKTParser#addRenderablesForMultiLineString}</li>
         *     <li>[addRenderablesForPolygon]{@link WKTParser#addRenderablesForPolygon}</li>
         *     <li>[addRenderablesForMultiPolygon]{@link WKTParser#addRenderablesForMultiPolygon}</li>
         * </ul>
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {WKTGeometry} geometry An object containing the current geometry.
         * @param {Object} properties An object containing the attribute-value pairs found in WKT feature
         * properties member.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the geometry is null or undefined.
         */
        WKTParser.prototype.addRenderablesForGeometry = function (layer, geometry, properties){
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForGeometry", "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForGeometry", "missingGeometry"));
            }

            switch(geometry[WKTConstants.FIELD_TYPE]){
                case WKTConstants.TYPE_POINT:
                    var pointGeometry = new WKTGeometryPoint(
                        geometry[WKTConstants.FIELD_COORDINATES],
                        geometry[WKTConstants.FIELD_TYPE],
                        geometry[WKTConstants.FIELD_BBOX]);
                    this.addRenderablesForPoint(
                        layer,
                        pointGeometry,
                        properties ? properties : null);
                    break;
                case WKTConstants.TYPE_MULTI_POINT:
                    var multiPointGeometry = new WKTGeometryMultiPoint(
                        geometry[WKTConstants.FIELD_COORDINATES],
                        geometry[WKTConstants.FIELD_TYPE],
                        geometry[WKTConstants.FIELD_BBOX]);
                    this.addRenderablesForMultiPoint(
                        layer,
                        multiPointGeometry,
                        properties ? properties : null);
                    break;
                case WKTConstants.TYPE_LINE_STRING:
                    var lineStringGeometry = new WKTGeometryLineString(
                        geometry[WKTConstants.FIELD_COORDINATES],
                        geometry[WKTConstants.FIELD_TYPE],
                        geometry[WKTConstants.FIELD_BBOX]);
                    this.addRenderablesForLineString(
                        layer,
                        lineStringGeometry,
                        properties ? properties : null);
                    break;
                case WKTConstants.TYPE_MULTI_LINE_STRING:
                    var multiLineStringGeometry = new WKTGeometryMultiLineString(
                        geometry[WKTConstants.FIELD_COORDINATES],
                        geometry[WKTConstants.FIELD_TYPE],
                        geometry[WKTConstants.FIELD_BBOX]);
                    this.addRenderablesForMultiLineString(
                        layer,
                        multiLineStringGeometry,
                        properties ? properties : null);
                    break;
                case WKTConstants.TYPE_POLYGON:
                    var polygonGeometry = new WKTGeometryPolygon(
                        geometry[WKTConstants.FIELD_COORDINATES],
                        geometry[WKTConstants.FIELD_TYPE],
                        geometry[WKTConstants.FIELD_BBOX]
                    );
                    this.addRenderablesForPolygon(
                        layer,
                        polygonGeometry,
                        properties ? properties : null);
                    break;
                case WKTConstants.TYPE_MULTI_POLYGON:
                    var multiPolygonGeometry = new WKTGeometryMultiPolygon(
                        geometry[WKTConstants.FIELD_COORDINATES],
                        geometry[WKTConstants.FIELD_TYPE],
                        geometry[WKTConstants.FIELD_BBOX]);
                    this.addRenderablesForMultiPolygon(
                        layer,
                        multiPolygonGeometry,
                        properties ? properties : null);
                    break;
                default:
                    break;
            }
        }

        /**
         * Creates a {@link Placemark} for a Point geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeometry]{@link WKTParser#addRenderablesForGeometry}.
         * <p>
         * This method invokes this WKT's
         * [shapeConfigurationCallback]{@link WKTParser#shapeConfigurationCallback} for the geometry.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {WKTGeometryPoint} geometry The Point geometry object.
         * @param {Object} properties The properties related to the Point geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified geometry is null or undefined.
         */
        WKTParser.prototype.addRenderablesForPoint = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForPoint", "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForPoint", "missingGeometry"));
            }

            var configuration = this.shapeConfigurationCallback(geometry, properties);

            if (!this.crs || this.crs.isCRSSupported()) {
                var longitude = geometry.coordinates[0],
                    latitude = geometry.coordinates[1],
                    altitude = geometry.coordinates[2] ?  geometry.coordinates[2] : 0;

                var reprojectedCoordinate = this.getReprojectedIfRequired(
                    latitude,
                    longitude,
                    this.crs);
                var position = new Position(reprojectedCoordinate[1], reprojectedCoordinate[0], altitude);
                var placemark = new Placemark(
                    position,
                    false,
                    configuration && configuration.attributes ? configuration.attributes : null);

                placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                if (configuration && configuration.name){
                    placemark.label = configuration.name;
                }
                if (configuration.highlightAttributes) {
                    placemark.highlightAttributes = configuration.highlightAttributes;
                }
                if (configuration && configuration.pickDelegate) {
                    placemark.pickDelegate = configuration.pickDelegate;
                }
                if (configuration && configuration.userProperties) {
                    placemark.userProperties = configuration.userProperties;
                }
                layer.addRenderable(placemark);
            }
        };

        /**
         * Creates {@link Placemark}s for a MultiPoint geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeometry]{@link WKTParser#addRenderablesForGeometry}.
         * <p>
         * This method invokes this WKT's
         * [shapeConfigurationCallback]{@link WKTParser#shapeConfigurationCallback} for the geometry.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {WKTGeometryMultiPoint} geometry The MultiPoint geometry object.
         * @param {Object} properties The properties related to the MultiPoint geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified geometry is null or undefined.
         */
        WKTParser.prototype.addRenderablesForMultiPoint = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForMultiPoint",
                        "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForMultiPoint",
                        "missingGeometry"));
            }

            var configuration = this.shapeConfigurationCallback(geometry, properties);

            if (!this.crs || this.crs.isCRSSupported()) {
                for (var pointIndex = 0, points = geometry.coordinates.length; pointIndex < points; pointIndex += 1){
                    var longitude = geometry.coordinates[pointIndex][0],
                        latitude = geometry.coordinates[pointIndex][1],
                        altitude = geometry.coordinates[pointIndex][2] ?  geometry.coordinates[pointIndex][2] : 0;

                    var reprojectedCoordinate = this.getReprojectedIfRequired(
                        latitude,
                        longitude,
                        this.crs);
                    var position = new Position(reprojectedCoordinate[1], reprojectedCoordinate[0], altitude);
                    var placemark = new Placemark(
                        position,
                        false,
                        configuration && configuration.attributes ? configuration.attributes : null);
                    placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                    if (configuration && configuration.name){
                        placemark.label = configuration.name;
                    }
                    if (configuration.highlightAttributes) {
                        placemark.highlightAttributes = configuration.highlightAttributes;
                    }
                    if (configuration && configuration.pickDelegate) {
                        placemark.pickDelegate = configuration.pickDelegate;
                    }
                    if (configuration && configuration.userProperties) {
                        placemark.userProperties = configuration.userProperties;
                    }
                    layer.addRenderable(placemark);
                }
            }
        };

        /**
         * Creates a {@link SurfacePolyline} for a LineString geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeometry]{@link WKTParser#addRenderablesForGeometry}.
         * <p>
         * This method invokes this WKT's
         * [shapeConfigurationCallback]{@link WKTParser#shapeConfigurationCallback} for the geometry.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {WKTGeometryLineString} geometry The LineString geometry object.
         * @param {Object} properties The properties related to the LineString geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified geometry is null or undefined.
         */
        WKTParser.prototype.addRenderablesForLineString = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForLineString",
                        "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForLineString",
                        "missingGeometry"));
            }

            var configuration = this.shapeConfigurationCallback(geometry, properties);

            if (!this.crs || this.crs.isCRSSupported()) {
                var positions = [];
                for (var pointsIndex = 0, points = geometry.coordinates; pointsIndex < points.length; pointsIndex++) {
                    var longitude = points[pointsIndex][0],
                        latitude = points[pointsIndex][1];
                    //altitude = points[pointsIndex][2] ?  points[pointsIndex][2] : 0,
                    var reprojectedCoordinate = this.getReprojectedIfRequired(
                        latitude,
                        longitude,
                        this.crs);
                    var position = new Location(reprojectedCoordinate[1], reprojectedCoordinate[0]);
                    positions.push(position);
                }

                var shape;
                shape = new SurfacePolyline(
                    positions,
                    configuration && configuration.attributes ? configuration.attributes : null);
                if (configuration.highlightAttributes) {
                    shape.highlightAttributes = configuration.highlightAttributes;
                }
                if (configuration && configuration.pickDelegate) {
                    shape.pickDelegate = configuration.pickDelegate;
                }
                if (configuration && configuration.userProperties) {
                    shape.userProperties = configuration.userProperties;
                }
                layer.addRenderable(shape);
            }
        };

        /**
         * Creates {@link SurfacePolyline}s for a MultiLineString geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeometry]{@link WKTParser#addRenderablesForGeometry}.
         * <p>
         * This method invokes this WKT's
         * [shapeConfigurationCallback]{@link WKTParser#shapeConfigurationCallback} for the geometry.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {WKTGeometryMultiLineString} geometry The MultiLineString geometry object.
         * @param {Object} properties The properties related to the MultiLineString geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified geometry is null or undefined.
         */
        WKTParser.prototype.addRenderablesForMultiLineString = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForMultiLineString",
                        "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForMultiLineString",
                        "missingGeometry"));
            }

            var configuration = this.shapeConfigurationCallback(geometry, properties);

            if (!this.crs || this.crs.isCRSSupported()) {
                for (var linesIndex = 0, lines = geometry.coordinates; linesIndex < lines.length; linesIndex++) {
                    var positions = [];

                    for (var positionIndex = 0, points = lines[linesIndex]; positionIndex < points.length;
                         positionIndex++) {
                        var longitude = points[positionIndex][0],
                            latitude = points[positionIndex][1];
                        //altitude = points[positionIndex][2] ?  points[positionIndex][2] : 0,
                        var reprojectedCoordinate = this.getReprojectedIfRequired(
                            latitude,
                            longitude,
                            this.crs);
                        var position = new Location(reprojectedCoordinate[1], reprojectedCoordinate[0]);
                        positions.push(position);
                    }

                    var shape;
                    shape = new SurfacePolyline(
                        positions,
                        configuration && configuration.attributes ? configuration.attributes : null);
                    if (configuration.highlightAttributes) {
                        shape.highlightAttributes = configuration.highlightAttributes;
                    }
                    if (configuration && configuration.pickDelegate) {
                        shape.pickDelegate = configuration.pickDelegate;
                    }
                    if (configuration && configuration.userProperties) {
                        shape.userProperties = configuration.userProperties;
                    }
                    layer.addRenderable(shape);
                }
            }
        };

        /**
         * Creates a {@link SurfacePolygon} for a Polygon geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeometry]{@link WKTParser#addRenderablesForGeometry}.
         * <p>
         * This method invokes this WKT's
         * [shapeConfigurationCallback]{@link WKTParser#shapeConfigurationCallback} for the geometry.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {WKTGeometryPolygon} geometry The Polygon geometry object.
         * @param {Object} properties The properties related to the Polygon geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified geometry is null or undefined.
         */
        WKTParser.prototype.addRenderablesForPolygon = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForPolygon", "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForPolygon", "missingGeometry"));
            }

            var configuration = this.shapeConfigurationCallback(geometry, properties);

            if (!this.crs || this.crs.isCRSSupported()) {
                for (var boundariesIndex = 0, boundaries = geometry.coordinates;
                     boundariesIndex < boundaries.length; boundariesIndex++) {
                    var positions = [];

                    for (var positionIndex = 0, points = boundaries[boundariesIndex];
                         positionIndex < points.length; positionIndex++) {
                        var longitude = points[positionIndex][0],
                            latitude = points[positionIndex][1];
                        //altitude = points[positionIndex][2] ?  points[positionIndex][2] : 0,
                        var reprojectedCoordinate = this.getReprojectedIfRequired(
                            latitude,
                            longitude,
                            this.crs);
                        var position = new Location(reprojectedCoordinate[1], reprojectedCoordinate[0]);
                        positions.push(position);
                    }

                    var shape;
                    shape = new SurfacePolygon(
                        positions,
                        configuration && configuration.attributes ? configuration.attributes : null);
                    if (configuration.highlightAttributes) {
                        shape.highlightAttributes = configuration.highlightAttributes;
                    }
                    if (configuration && configuration.pickDelegate) {
                        shape.pickDelegate = configuration.pickDelegate;
                    }
                    if (configuration && configuration.userProperties) {
                        shape.userProperties = configuration.userProperties;
                    }                    layer.addRenderable(shape);
                }
            }
        };

        /**
         * Creates {@link SurfacePolygon}s for a MultiPolygon geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeometry]{@link WKTParser#addRenderablesForGeometry}.
         * <p>
         * This method invokes this WKT's
         * [shapeConfigurationCallback]{@link WKTParser#shapeConfigurationCallback} for the geometry.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {WKTGeometryMultiPolygon} geometry The MultiPolygon geometry object.
         * @param {Object} properties The properties related to the MultiPolygon geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified geometry is null or undefined.
         */
        WKTParser.prototype.addRenderablesForMultiPolygon = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForMultiPolygon",
                        "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForMultiPolygon",
                        "missingGeometry"));
            }

            var configuration = this.shapeConfigurationCallback(geometry, properties);

            if (!this.crs || this.crs.isCRSSupported()) {
                for (var polygonsIndex = 0, polygons = geometry.coordinates;
                     polygonsIndex < polygons.length; polygonsIndex++) {
                    var boundaries = [];
                    for (var boundariesIndex = 0; boundariesIndex < polygons[polygonsIndex].length; boundariesIndex++) {
                        var positions = [];
                        for (var positionIndex = 0, points = polygons[polygonsIndex][boundariesIndex];
                             positionIndex < points.length; positionIndex++) {
                            var longitude = points[positionIndex][0],
                                latitude = points[positionIndex][1];
                            //altitude = points[positionIndex][2] ?  points[positionIndex][2] : 0,;

                            var reprojectedCoordinate = this.getReprojectedIfRequired(
                                latitude,
                                longitude,
                                this.crs);
                            var position = new Location(reprojectedCoordinate[1], reprojectedCoordinate[0]);
                            positions.push(position);
                        }
                        boundaries.push(positions);
                    }
                    var shape;
                    shape = new SurfacePolygon(
                        boundaries,
                        configuration && configuration.attributes ? configuration.attributes : null);
                    if (configuration.highlightAttributes) {
                        shape.highlightAttributes = configuration.highlightAttributes;
                    }
                    if (configuration && configuration.pickDelegate) {
                        shape.pickDelegate = configuration.pickDelegate;
                    }
                    if (configuration && configuration.userProperties) {
                        shape.userProperties = configuration.userProperties;
                    }
                    layer.addRenderable(shape);
                }
            }
        };

        /**
         * Iterates over the WKT GeometryCollection geometries and creates {@link WKTGeometry}s for them.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForWKT]{@link WKTParser#addRenderablesForWKT}.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {WKTGeometryCollection} geometryCollection The GeometryCollection object.
         * @param {Object} properties The properties related to the GeometryCollection geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified featureCollection is null or undefined.
         */
        WKTParser.prototype.addRenderablesForGeometryCollection = function (layer, geometryCollection, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForGeometryCollection",
                        "missingLayer"));
            }

            if (!geometryCollection) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForGeometryCollection",
                        "missingGeometryCollection"));
            }


            for (var geometryIndex = 0, geometries = geometryCollection.geometries;
                 geometryIndex < geometries.length; geometryIndex++) {
                if(geometries[geometryIndex].hasOwnProperty(WKTConstants.FIELD_TYPE)){
                    this.addRenderablesForGeometry(layer, geometries[geometryIndex], properties);
                }
            }
        };

        /**
         * Calls [addRenderablesForGeometry]{@link WKTParser#addRenderablesForGeometry} or
         * [addRenderablesForGeometryCollection]{@link WKTParser#addRenderablesForGeometryCollection}
         * depending on the type of feature geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForWKT]{@link WKTParser#addRenderablesForWKT}.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {WKTFeature} feature The Feature object.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified feature is null or undefined.
         */
        WKTParser.prototype.addRenderablesForFeature = function (layer, feature) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForFeature", "missingLayer"));
            }

            if (!feature) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForFeature", "missingFeature"));
            }

            if (feature.geometry.type === WKTConstants.TYPE_GEOMETRY_COLLECTION) {
                var geometryCollection = new WKTGeometryCollection(
                    feature.geometry.geometries,
                    feature.bbox);
                this.addRenderablesForGeometryCollection(
                    layer,
                    geometryCollection,
                    feature.properties);
            }
            else {
                this.addRenderablesForGeometry(
                    layer,
                    feature.geometry,
                    feature.properties
                );
            }
        };

        /**
         * Iterates over the WKT FeatureCollection features and creates {@link WKTFeature}s for them.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForWKT]{@link WKTParser#addRenderablesForWKT}.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {WKTFeatureCollection} featureCollection The FeatureCollection object.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified featureCollection is null or undefined.
         */
        WKTParser.prototype.addRenderablesForFeatureCollection = function (layer, featureCollection) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForFeatureCollection",
                        "missingLayer"));
            }

            if (!featureCollection) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "addRenderablesForFeatureCollection",
                        "missingFeatureCollection"));
            }

            if (featureCollection.features.length > 0) {
                for (var featureIndex = 0; featureIndex < featureCollection.features.length; featureIndex++) {
                    var feature = new WKTFeature(
                        featureCollection.features[featureIndex][WKTConstants.FIELD_GEOMETRY],
                        featureCollection.features[featureIndex][WKTConstants.FIELD_PROPERTIES],
                        featureCollection.features[featureIndex][WKTConstants.FIELD_ID],
                        featureCollection.features[featureIndex][WKTConstants.FIELD_BBOX]);
                    this.addRenderablesForFeature(
                        layer,
                        feature);
                }
            }
        };

        // Set type of WKT object. Internal use ony.
        WKTParser.prototype.setWKTType = function () {
            switch (this.WKTObject[WKTConstants.FIELD_TYPE]) {
                case WKTConstants.TYPE_POINT:
                    this._WKTType = WKTConstants.TYPE_POINT;
                    break;
                case WKTConstants.TYPE_MULTI_POINT:
                    this._WKTType = WKTConstants.TYPE_MULTI_POINT;
                    break;
                case WKTConstants.TYPE_LINE_STRING:
                    this._WKTType = WKTConstants.TYPE_LINE_STRING;
                    break;
                case WKTConstants.TYPE_MULTI_LINE_STRING:
                    this._WKTType = WKTConstants.TYPE_MULTI_LINE_STRING;
                    break;
                case WKTConstants.TYPE_POLYGON:
                    this._WKTType = WKTConstants.TYPE_POLYGON;
                    break;
                case WKTConstants.TYPE_MULTI_POLYGON:
                    this._WKTType = WKTConstants.TYPE_MULTI_POLYGON;
                    break;
                case WKTConstants.TYPE_GEOMETRY_COLLECTION:
                    this._WKTType = WKTConstants.TYPE_GEOMETRY_COLLECTION;
                    break;
                case WKTConstants.TYPE_FEATURE:
                    this._WKTType = WKTConstants.TYPE_FEATURE;
                    break;
                case WKTConstants.TYPE_FEATURE_COLLECTION:
                    this._WKTType = WKTConstants.TYPE_FEATURE_COLLECTION;
                    break;
                default:
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "setWKTType", "invalidWKTType"));
            }
        };

        /**
         * Reprojects WKT geometry coordinates if required using proj4js.
         *
         * @param {Number} latitude The latitude coordinate of the geometry.
         * @param {Number} longitude The longitude coordinate of the geometry.
         * @param {WKTCRS} crsObject The WKT CRS object.
         * @returns {Number[]} An array containing reprojected coordinates.
         * @throws {ArgumentError} If the specified latitude is null or undefined.
         * @throws {ArgumentError} If the specified longitude is null or undefined.
         * @throws {ArgumentError} If the specified crsObject is null or undefined.
         */
        WKTParser.prototype.getReprojectedIfRequired = function (latitude, longitude, crsObject) {
            if (!latitude && latitude !== 0.0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "getReprojectedIfRequired",
                        "missingLatitude"));
            }

            if (!longitude && longitude !== 0.0) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WKT", "getReprojectedIfRequired",
                        "missingLongitude"));
            }

            if (!crsObject || crsObject.isDefault()){
                return [longitude, latitude];
            }
            else{
                return Proj4(crsObject.projectionString, WKTConstants.EPSG4326_CRS, [longitude, latitude]);
            }
        };

        // Use this function to add aliases for some projection strings that proj4js doesn't recognize.
        WKTParser.prototype.setProj4jsAliases = function () {
            Proj4.defs([
                [
                    'urn:ogc:def:crs:OGC:1.3:CRS84',
                    Proj4.defs('EPSG:4326')
                ],
                [
                    'urn:ogc:def:crs:EPSG::3857',
                    Proj4.defs('EPSG:3857')

                ]
            ]);
        };

        /**
        * Indicate whether the data source is of a JSON type.
        * @returns {Boolean} True if the data source is of JSON type.
        */
        WKTParser.prototype.isDataSourceJson = function() {
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
