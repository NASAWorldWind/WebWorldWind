/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports GeoJSON
 */
define(['../../error/ArgumentError',
        '../../util/Color',
        './GeoJSONConstants',
        './GeoJSONFeature',
        './GeoJSONFeatureCollection',
        './GeoJSONGeometry',
        './GeoJSONGeometryCollection',
        './GeoJSONGeometryLineString',
        './GeoJSONGeometryMultiLineString',
        './GeoJSONGeometryMultiPoint',
        './GeoJSONGeometryMultiPolygon',
        './GeoJSONGeometryPoint',
        './GeoJSONGeometryPolygon',
        '../../geom/Location',
        '../../util/Logger',
        '../../shapes/Placemark',
        '../../shapes/PlacemarkAttributes',
        '../../shapes/Polygon',
        '../../geom/Position',
        '../../util/proj4-src',
        '../../layer/RenderableLayer',
        '../../shapes/ShapeAttributes',
        '../../shapes/SurfacePolygon',
        '../../shapes/SurfacePolyline'
    ],
    function (ArgumentError,
              Color,
              GeoJSONConstants,
              GeoJSONFeature,
              GeoJSONFeatureCollection,
              GeoJSONGeometry,
              GeoJSONGeometryCollection,
              GeoJSONGeometryLineString,
              GeoJSONGeometryMultiLineString,
              GeoJSONGeometryMultiPoint,
              GeoJSONGeometryMultiPolygon,
              GeoJSONGeometryPoint,
              GeoJSONGeometryPolygon,
              Location,
              Logger,
              Placemark,
              PlacemarkAttributes,
              Polygon,
              Position,
              Proj4,
              RenderableLayer,
              ShapeAttributes,
              SurfacePolygon,
              SurfacePolyline) {
        "use strict";

        /**
         * Constructs a GeoJSON object for a specified GeoJSON URL. Call [load]{@link GeoJSON#load} to retrieve the
         * GeoJSON and create shapes for it.
         * @alias GeoJSON
         * @constructor
         * @classdesc Parses a GeoJSON and creates shapes representing its contents. Points and MultiPoints in
         * the GeoJSON are represented by [Placemarks]{@link Placemark}, Lines and MultiLines are represented by
         * [SurfacePolylines]{@link SurfacePolyline}, and Polygons and MultiPolygons are represented
         * by [SurfacePolygons]{@link SurfacePolygon}.
         * <p>
         * An attribute callback may also be specified to examine each geometry and configure the shape created for it.
         * This function enables the application to assign independent attributes to each
         * shape. An argument to this function provides any attributes specified in a properties member of GeoJSON
         * feature.
         * @param {String} url The location of the GeoJSON.
         * @throws {ArgumentError} If the specified URL is null or undefined.
         */
        var GeoJSON = function (url) {
            if (!url) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "constructor", "missingUrl"));
            }

            // Documented in defineProperties below.
            this._url = url;

            // Documented in defineProperties below.
            this._geoJSONObject = null;

            // Documented in defineProperties below.
            this._geoJSONType = null;

            // Documented in defineProperties below.
            this._layer = null;

            // Documented in defineProperties below.
            this._shapeConfigurationCallback = this.defaultShapeConfigurationCallback;

            this.defaultPlacemarkAttributes = new PlacemarkAttributes(null);

            this.defaultShapeAttributes = new ShapeAttributes(null);

            this.setProj4jsAliases();
        };

        Object.defineProperties(GeoJSON.prototype, {
            /**
             * The GeoJSON URL as specified to this GeoJSON's constructor.
             * @memberof GeoJSON.prototype
             * @type {String}
             * @readonly
             */
            url: {
                get: function () {
                    return this._url;
                }
            },

            /**
             * The GeoJSON object resulting from the parsing of GeoJSON string.
             * @memberof GeoJSON.prototype
             * @type {Object}
             * @readonly
             */
            geoJSONObject: {
                get: function () {
                    return this._geoJSONObject;
                }
            },

            /**
             * The type of the GeoJSON. The type can be one of the following:
             * <ul>
             *     <li>GeoJSONConstants.TYPE_POINT</li>
             *     <li>GeoJSONConstants.TYPE_MULTI_POINT</li>
             *     <li>GeoJSONConstants.TYPE_LINE_STRING</li>
             *     <li>GeoJSONConstants.TYPE_MULTI_LINE_STRING</li>
             *     <li>GeoJSONConstants.TYPE_POLYGON</li>
             *     <li>GeoJSONConstants.TYPE_MULTI_POLYGON</li>
             *     <li>GeoJSONConstants.TYPE_GEOMETRY_COLLECTION</li>
             *     <li>GeoJSONConstants.TYPE_FEATURE</li>
             *     <li>GeoJSONConstants.TYPE_FEATURE_COLLECTION</li>
             * </ul>
             * This value is defined after GeoJSON parsing.
             * @memberof GeoJSON.prototype
             * @type {String}
             * @readonly
             */
            geoJSONType: {
                get: function () {
                    return this._geoJSONType;
                }
            },

            /**
             * The layer containing the shapes representing the geometries in this GeoJSON, as specified to this
             * GeoJSON's constructor or created by the constructor if no layer was specified.
             * @memberof GeoJSON.prototype
             * @type {RenderableLayer}
             * @readonly
             */
            layer: {
                get: function () {
                    return this._layer;
                }
            },

            /**
             * The attribute callback specified to [load]{@link GeoJSON#load}.
             * See that method's description for details.
             * @memberof GeoJSON.prototype
             * @type {Function}
             * @default [defaultShapeConfigurationCallback]{@link GeoJSON#defaultShapeConfigurationCallback}
             * @readonly
             */
            shapeConfigurationCallback: {
                get: function () {
                    return this._shapeConfigurationCallback;
                }
            }
        });

        /**
         * Retrieves the GeoJSON, parses it and creates shapes representing its contents. The result is a layer
         * containing the created shapes. A function can also be specified to be called for each GeoJSON geometry so
         * that the attributes and other properties of the shape created for it can be assigned.
         * @param {Function} shapeConfigurationCallback An optional function called by the addRenderablesFor*
         * methods just prior to creating a shape for the indicated GeoJSON geometry. This function
         * can be used to assign attributes to newly created shapes. The callback function's first argument is the
         * current geometry object.  The second argument to the callback function is the object containing the
         * properties read from the corresponding GeoJSON properties member, if any.
         * See the following methods for descriptions of the configuration properties they recognize:
         * <ul>
         *     <li>[addRenderablesForPoint]{@link GeoJSON#addRenderablesForPoint}</li>
         *     <li>[addRenderablesForMultiPoint]{@link GeoJSON#addRenderablesForMultiPoint}</li>
         *     <li>[addRenderablesForLineString]{@link GeoJSON#addRenderablesForLineString}</li>
         *     <li>[addRenderablesForMultiLineString]{@link GeoJSON#addRenderablesForMultiLineString}</li>
         *     <li>[addRenderablesForPolygon]{@link GeoJSON#addRenderablesForPolygon}</li>
         *     <li>[addRenderablesForMultiPolygon]{@link GeoJSON#addRenderablesForMultiPolygon}</li>
         *     <li>[addRenderablesForGeometryCollection]{@link GeoJSON#addRenderablesForGeometryCollection}</li>
         *     <li>[addRenderablesForFeature]{@link GeoJSON#addRenderablesForFeature}</li>
         *     <li>[addRenderablesForFeatureCollection]{@link GeoJSON#addRenderablesForFeatureCollection}</li>
         * </ul>
         *
         * @param {RenderableLayer} layer A {@link RenderableLayer} to hold the shapes created for each GeoJSON
         * geometry. If null, a new layer is created and assigned to this object's [layer]{@link GeoJSON#layer}
         * property.
         */
        GeoJSON.prototype.load = function ( shapeConfigurationCallback, layer) {

            if (shapeConfigurationCallback) {
                this._shapeConfigurationCallback = shapeConfigurationCallback;
            }

            this._layer = layer || new RenderableLayer();

            this.requestUrl(this.url);
        };

        /**
         * The default [shapeConfigurationCallback]{@link GeoJSON#shapeConfigurationCallback} for this GeoJSON.
         * It is called if none was specified to the [load]{@link GeoJSON#load} method.
         * This method assigns shared, default attributes to the shapes created for each geometry. Any changes to these
         * attributes will have an effect in all shapes created by this GeoJSON.
         * <p>
         * For all geometry, the GeoJSON's properties are checked for an attribute named "name", "Name" or "NAME".
         * If found, the returned shape configuration contains a name property holding the value associated with
         * the attribute. This value is specified as the label displayName property for all shapes created.
         * For {@link Placemark} shapes it is also specified as the placemark label.
         * It is specified as the displayName for all other shapes.
         *
         * @param {GeoJSONGeometry} geometry An object containing the geometry associated with this GeoJSON.
         * @param {Object} properties An object containing the attribute-value pairs found in GeoJSON feature
         * properties member.
         * @returns {Object} An object with properties as described above.
         */
        GeoJSON.prototype.defaultShapeConfigurationCallback = function (geometry, properties) {
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

        // Get GeoJSON string using XMLHttpRequest. Internal use only.
        GeoJSON.prototype.requestUrl = function (url) {
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
                            "GeoJSON retrieval failed (" + xhr.statusText + "): " + url);
                    }

                    if (this.geoJSONObject) {
                        this.addRenderablesForGeoJSON(this.layer);
                    }
                }
            }).bind(this);

            xhr.onerror = function () {
                Logger.log(Logger.LEVEL_WARNING, "GeoJSON retrieval failed: " + url);
            };

            xhr.ontimeout = function () {
                Logger.log(Logger.LEVEL_WARNING, "GeoJSON retrieval timed out: " + url);
            };

            xhr.send(null);
        };

        // Parse GeoJSON string using built in method JSON.parse(). Internal use only.
        GeoJSON.prototype.parse = function (geoJSONString) {
            try {
                this._geoJSONObject = JSON.parse(geoJSONString);
            }
            catch (e) {
                console.log(e);
            }
            finally {
                if (this.geoJSONObject){
                    if (Object.prototype.toString.call(this.geoJSONObject) === '[object Array]') {
                        throw new ArgumentError(
                            Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "parse",
                                "invalidGeoJSONObjectLength"));
                    }

                    if (this.geoJSONObject.hasOwnProperty(GeoJSONConstants.FIELD_TYPE)) {
                        this.setGeoJSONType(this.geoJSONObject);
                    }
                    else{
                        throw new ArgumentError(
                            Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "parse",
                                "missingGeoJSONType"));
                    }
                }
            }
        };

        /**
         * Iterates over this GeoJSON's geometries and creates shapes for them. See the following methods for the
         * details of the shapes created and their use of the
         * [shapeConfigurationCallback]{@link GeoJSON#shapeConfigurationCallback}:
         * <ul>
         *     <li>[addRenderablesForGeometry]{@link GeoJSON#addRenderablesForGeometry}</li>
         *     <li>[addRenderablesForGeometryCollection]{@link GeoJSON#addRenderablesForGeometryCollection}</li>
         *     <li>[addRenderablesForFeature]{@link GeoJSON#addRenderablesForFeature}</li>
         *     <li>[addRenderablesForFeatureCollection]{@link GeoJSON#addRenderablesForFeatureCollection}</li>
         * </ul>
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         */
        GeoJSON.prototype.addRenderablesForGeoJSON = function (layer) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForGeoJSON", "missingLayer"));
            }

            switch(this.geoJSONType) {
                case GeoJSONConstants.TYPE_FEATURE:
                    var feature = new  GeoJSONFeature(
                        this.geoJSONObject[GeoJSONConstants.FIELD_GEOMETRY],
                        this.geoJSONObject[GeoJSONConstants.FIELD_PROPERTIES],
                        this.geoJSONObject[GeoJSONConstants.FIELD_CRS],
                        this.geoJSONObject[GeoJSONConstants.FIELD_ID],
                        this.geoJSONObject[GeoJSONConstants.FIELD_BBOX]
                    );
                    this.addRenderablesForFeature(
                        layer,
                        feature,
                        null);
                    break;
                case GeoJSONConstants.TYPE_FEATURE_COLLECTION:
                    var featureCollection = new GeoJSONFeatureCollection(
                        this.geoJSONObject[GeoJSONConstants.FIELD_FEATURES],
                        this.geoJSONObject[GeoJSONConstants.FIELD_CRS],
                        this.geoJSONObject[GeoJSONConstants.FIELD_BBOX]
                    );
                    this.addRenderablesForFeatureCollection(
                        layer,
                        featureCollection);
                    break;
                case GeoJSONConstants.TYPE_GEOMETRY_COLLECTION:
                    var geometryCollection = new GeoJSONGeometryCollection(
                        this.geoJSONObject[GeoJSONConstants.FIELD_GEOMETRIES],
                        this.geoJSONObject[GeoJSONConstants.FIELD_CRS],
                        this.geoJSONObject[GeoJSONConstants.FIELD_BBOX]);
                    this.addRenderablesForGeometryCollection(
                        layer,
                        geometryCollection,
                        null);
                    break;
                default:
                    this.addRenderablesForGeometry(
                        layer,
                        this.geoJSONObject,
                        null,
                        null);
                    break;
            }
        };

        /**
         * Creates shape for a geometry. See the following methods for the
         * details of the shapes created and their use of the
         * [shapeConfigurationCallback]{@link GeoJSON#shapeConfigurationCallback}:
         * <ul>
         *     <li>[addRenderablesForPoint]{@link GeoJSON#addRenderablesForPoint}</li>
         *     <li>[addRenderablesForMultiPoint]{@link GeoJSON#addRenderablesForMultiPoint}</li>
         *     <li>[addRenderablesForLineString]{@link GeoJSON#addRenderablesForLineString}</li>
         *     <li>[addRenderablesForMultiLineString]{@link GeoJSON#addRenderablesForMultiLineString}</li>
         *     <li>[addRenderablesForPolygon]{@link GeoJSON#addRenderablesForPolygon}</li>
         *     <li>[addRenderablesForMultiPolygon]{@link GeoJSON#addRenderablesForMultiPolygon}</li>
         * </ul>
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONGeometry} geometry An object containing the current geometry.
         * @param {GeoJSONCRS} crs An object containing the CRS information.
         * @param {Object} properties An object containing the attribute-value pairs found in GeoJSON feature
         * properties member.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the geometry is null or undefined.
         */
        GeoJSON.prototype.addRenderablesForGeometry = function (layer, geometry, crs, properties){
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForGeometry", "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForGeometry", "missingGeometry"));
            }

            var crsObject = geometry[GeoJSONConstants.FIELD_CRS] ? geometry[GeoJSONConstants.FIELD_CRS] : crs;

            switch(geometry[GeoJSONConstants.FIELD_TYPE]){
                case GeoJSONConstants.TYPE_POINT:
                    var pointGeometry = new GeoJSONGeometryPoint(
                        geometry[GeoJSONConstants.FIELD_COORDINATES],
                        geometry[GeoJSONConstants.FIELD_TYPE],
                        crsObject,
                        geometry[GeoJSONConstants.FIELD_BBOX]);
                    this.addRenderablesForPoint(
                        layer,
                        pointGeometry,
                        properties ? properties : null);
                    break;
                case GeoJSONConstants.TYPE_MULTI_POINT:
                    var multiPointGeometry = new GeoJSONGeometryMultiPoint(
                        geometry[GeoJSONConstants.FIELD_COORDINATES],
                        geometry[GeoJSONConstants.FIELD_TYPE],
                        crsObject,
                        geometry[GeoJSONConstants.FIELD_BBOX]);
                    this.addRenderablesForMultiPoint(
                        layer,
                        multiPointGeometry,
                        properties ? properties : null);
                    break;
                case GeoJSONConstants.TYPE_LINE_STRING:
                    var lineStringGeometry = new GeoJSONGeometryLineString(
                        geometry[GeoJSONConstants.FIELD_COORDINATES],
                        geometry[GeoJSONConstants.FIELD_TYPE],
                        crsObject,
                        geometry[GeoJSONConstants.FIELD_BBOX]);
                    this.addRenderablesForLineString(
                        layer,
                        lineStringGeometry,
                        properties ? properties : null);
                    break;
                case GeoJSONConstants.TYPE_MULTI_LINE_STRING:
                    var multiLineStringGeometry = new GeoJSONGeometryMultiLineString(
                        geometry[GeoJSONConstants.FIELD_COORDINATES],
                        geometry[GeoJSONConstants.FIELD_TYPE],
                        crsObject,
                        geometry[GeoJSONConstants.FIELD_BBOX]);
                    this.addRenderablesForMultiLineString(
                        layer,
                        multiLineStringGeometry,
                        properties ? properties : null);
                    break;
                case GeoJSONConstants.TYPE_POLYGON:
                    var polygonGeometry = new GeoJSONGeometryPolygon(
                        geometry[GeoJSONConstants.FIELD_COORDINATES],
                        geometry[GeoJSONConstants.FIELD_TYPE],
                        crsObject,
                        geometry[GeoJSONConstants.FIELD_BBOX]
                    );
                    this.addRenderablesForPolygon(
                        layer,
                        polygonGeometry,
                        properties ? properties : null);
                    break;
                case GeoJSONConstants.TYPE_MULTI_POLYGON:
                    var multiPolygonGeometry = new GeoJSONGeometryMultiPolygon(
                        geometry[GeoJSONConstants.FIELD_COORDINATES],
                        geometry[GeoJSONConstants.FIELD_TYPE],
                        crsObject,
                        geometry[GeoJSONConstants.FIELD_BBOX]);
                    this.addRenderablesForMultiPolygon(
                        layer,
                        multiPolygonGeometry,
                        properties ? properties : null);
                    break;
            }
        }

        /**
         * Creates a {@link Placemark} for a Point geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeometry]{@link GeoJSON#addRenderablesForGeometry}.
         * <p>
         * This method invokes this GeoJSON's
         * [shapeConfigurationCallback]{@link GeoJSON#shapeConfigurationCallback} for the geometry.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONPointGeometry} geometry The Point geometry object.
         * @param {Properties} properties The properties related to the Point geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified geometry is null or undefined.
         */
        GeoJSON.prototype.addRenderablesForPoint = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForPoint", "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForPoint", "missingGeometry"));
            }

            var configuration = this.shapeConfigurationCallback(geometry, properties);

            if (!geometry.crs || geometry.crs.isCRSSupported()) {
                var longitude = geometry.coordinates[0],
                    latitude = geometry.coordinates[1],
                    altitude = geometry.coordinates[2] ?  geometry.coordinates[2] : 0;

                var reprojectedCoordinate = this.getReprojectedIfRequired(
                    latitude,
                    longitude,
                    geometry.crs);
                var position = new Position(reprojectedCoordinate[1], reprojectedCoordinate[0], altitude);
                var placemark = new Placemark(
                    position,
                    false,
                    configuration && configuration.attributes ? configuration.attributes : null);

                placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                if (configuration && configuration.name){
                    placemark.label = configuration.name;
                }
                layer.addRenderable(placemark);
            }
        };

        /**
         * Creates {@link Placemark}s for a MultiPoint geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeometry]{@link GeoJSON#addRenderablesForGeometry}.
         * <p>
         * This method invokes this GeoJSON's
         * [shapeConfigurationCallback]{@link GeoJSON#shapeConfigurationCallback} for the geometry.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONMultiPointGeometry} geometry The MultiPoint geometry object.
         * @param {Properties} properties The properties related to the MultiPoint geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified geometry is null or undefined.
         */
        GeoJSON.prototype.addRenderablesForMultiPoint = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiPoint",
                        "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiPoint",
                        "missingGeometry"));
            }

            var configuration = this.shapeConfigurationCallback(geometry, properties);

            if (!geometry.crs || geometry.crs.isCRSSupported()) {
                for (var pointIndex = 0, points = geometry.coordinates.length; pointIndex < points; pointIndex += 1){
                    var longitude = geometry.coordinates[pointIndex][0],
                        latitude = geometry.coordinates[pointIndex][1],
                        altitude = geometry.coordinates[pointIndex][2] ?  geometry.coordinates[pointIndex][2] : 0;

                    var reprojectedCoordinate = this.getReprojectedIfRequired(
                        latitude,
                        longitude,
                        geometry.crs);
                    var position = new Position(reprojectedCoordinate[1], reprojectedCoordinate[0], altitude);
                    var placemark = new Placemark(
                        position,
                        false,
                        configuration && configuration.attributes ? configuration.attributes : null);
                    placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                    if (configuration && configuration.name){
                        placemark.label = configuration.name;
                    }
                    layer.addRenderable(placemark);
                }
            }
        };

        /**
         * Creates a {@link SurfacePolyline} for a LineString geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeometry]{@link GeoJSON#addRenderablesForGeometry}.
         * <p>
         * This method invokes this GeoJSON's
         * [shapeConfigurationCallback]{@link GeoJSON#shapeConfigurationCallback} for the geometry.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONLineStringGeometry} geometry The LineString geometry object.
         * @param {Properties} properties The properties related to the LineString geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified geometry is null or undefined.
         */
        GeoJSON.prototype.addRenderablesForLineString = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForLineString",
                        "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForLineString",
                        "missingGeometry"));
            }

            var configuration = this.shapeConfigurationCallback(geometry, properties);

            if (!geometry.crs || geometry.crs.isCRSSupported()) {
                var positions = [];
                for (var pointsIndex = 0, points = geometry.coordinates; pointsIndex < points.length; pointsIndex++) {
                    var longitude = points[pointsIndex][0],
                        latitude = points[pointsIndex][1];
                    //altitude = points[pointsIndex][2] ?  points[pointsIndex][2] : 0,
                    var reprojectedCoordinate = this.getReprojectedIfRequired(
                        latitude,
                        longitude,
                        geometry.crs);
                    var position = new Location(reprojectedCoordinate[1], reprojectedCoordinate[0]);
                    positions.push(position);
                }

                var shape;
                shape = new SurfacePolyline(
                    positions,
                    configuration && configuration.attributes ? configuration.attributes : null);
                layer.addRenderable(shape);
            }
        };

        /**
         * Creates {@link SurfacePolyline}s for a MultiLineString geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeometry]{@link GeoJSON#addRenderablesForGeometry}.
         * <p>
         * This method invokes this GeoJSON's
         * [shapeConfigurationCallback]{@link GeoJSON#shapeConfigurationCallback} for the geometry.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONMultiLineStringGeometry} geometry The MultiLineString geometry object.
         * @param {Properties} properties The properties related to the MultiLineString geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified geometry is null or undefined.
         */
        GeoJSON.prototype.addRenderablesForMultiLineString = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiLineString",
                        "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiLineString",
                        "missingGeometry"));
            }

            var configuration = this.shapeConfigurationCallback(geometry, properties);

            if (!geometry.crs || geometry.crs.isCRSSupported()) {
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
                            geometry.crs);
                        var position = new Location(reprojectedCoordinate[1], reprojectedCoordinate[0]);
                        positions.push(position);
                    }

                    var shape;
                    shape = new SurfacePolyline(
                        positions,
                        configuration && configuration.attributes ? configuration.attributes : null);
                    layer.addRenderable(shape);
                }
            }
        };

        /**
         * Creates a {@link SurfacePolygon} for a Polygon geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeometry]{@link GeoJSON#addRenderablesForGeometry}.
         * <p>
         * This method invokes this GeoJSON's
         * [shapeConfigurationCallback]{@link GeoJSON#shapeConfigurationCallback} for the geometry.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONPolygonGeometry} geometry The Polygon geometry object.
         * @param {Properties} properties The properties related to the Polygon geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified geometry is null or undefined.
         */
        GeoJSON.prototype.addRenderablesForPolygon = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForPolygon", "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForPolygon", "missingGeometry"));
            }

            var configuration = this.shapeConfigurationCallback(geometry, properties);

            if (!geometry.crs || geometry.crs.isCRSSupported()) {
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
                            geometry.crs);
                        var position = new Location(reprojectedCoordinate[1], reprojectedCoordinate[0]);
                        positions.push(position);
                    }

                    var shape;
                    shape = new SurfacePolygon(
                        positions,
                        configuration && configuration.attributes ? configuration.attributes : null);
                    layer.addRenderable(shape);
                }
            }
        };

        /**
         * Creates {@link SurfacePolygon}s for a MultiPolygon geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeometry]{@link GeoJSON#addRenderablesForGeometry}.
         * <p>
         * This method invokes this GeoJSON's
         * [shapeConfigurationCallback]{@link GeoJSON#shapeConfigurationCallback} for the geometry.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONMultiPolygonGeometry} geometry The MultiPolygon geometry object.
         * @param {Properties} properties The properties related to the MultiPolygon geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified geometry is null or undefined.
         */
        GeoJSON.prototype.addRenderablesForMultiPolygon = function (layer, geometry, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiPolygon",
                        "missingLayer"));
            }

            if (!geometry) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForMultiPolygon",
                        "missingGeometry"));
            }

            var configuration = this.shapeConfigurationCallback(geometry, properties);

            if (!geometry.crs || geometry.crs.isCRSSupported()) {
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
                                geometry.crs);
                            var position = new Location(reprojectedCoordinate[1], reprojectedCoordinate[0]);
                            positions.push(position);
                        }
                        boundaries.push(positions);
                    }
                    var shape;
                    shape = new SurfacePolygon(
                        boundaries,
                        configuration && configuration.attributes ? configuration.attributes : null);
                    layer.addRenderable(shape);
                }
            }
        };

        /**
         * Iterates over the GeoJSON GeometryCollection geometries and creates {@link GeoJSONGeometry}s for them.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeoJSON]{@link GeoJSON#addRenderablesForGeoJSON}.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONGeometryCollection} geometryCollection The GeometryCollection object.
         * @param {Object} properties The properties related to the GeometryCollection geometry.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified featureCollection is null or undefined.
         */
        GeoJSON.prototype.addRenderablesForGeometryCollection = function (layer, geometryCollection, properties) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForGeometryCollection",
                        "missingLayer"));
            }

            if (!geometryCollection) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForGeometryCollection",
                        "missingGeometryCollection"));
            }


            for (var geometryIndex = 0, geometries = geometryCollection.geometries;
                 geometryIndex < geometries.length; geometryIndex++) {
                if(geometries[geometryIndex].hasOwnProperty(GeoJSONConstants.FIELD_TYPE)){
                    this.addRenderablesForGeometry(layer, geometries[geometryIndex], null, properties);
                }
            }
        };

        /**
         * Calls [addRenderablesForGeometry]{@link GeoJSON#addRenderablesForGeometry} or
         * [addRenderablesForGeometryCollection]{@link GeoJSON#addRenderablesForGeometryCollection}
         * depending on the type of feature geometry.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeoJSON]{@link GeoJSON#addRenderablesForGeoJSON}.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONFeature} feature The Feature object.
         * @param {Object} inheritedCrs An object containing Coordinate Reference System information if there is a
         * FeatureCollection object's crs member.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified feature is null or undefined.
         */
        GeoJSON.prototype.addRenderablesForFeature = function (layer, feature, inheritedCrs) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForFeature", "missingLayer"));
            }

            if (!feature) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForFeature", "missingFeature"));
            }

            //If an object has no crs member, then its parent or grandparent object's crs member may be acquired.
            var crs = feature.crs ? feature.crs : inheritedCrs;

            if (feature.geometry.type === GeoJSON.TYPE_GEOMETRY_COLLECTION) {
                this.addRenderablesForGeometryCollection(
                    layer,
                    feature.geometry,
                    feature.properties);
            }
            else {
                this.addRenderablesForGeometry(
                    layer,
                    feature.geometry,
                    crs,
                    feature.properties
                );
            }
        };

        /**
         * Iterates over the GeoJSON FeatureCollection features and creates {@link GeoJSONFeature}s for them.
         * Applications typically do not call this method directly. It is called by
         * [addRenderablesForGeoJSON]{@link GeoJSON#addRenderablesForGeoJSON}.
         * @param {RenderableLayer} layer The layer in which to place the newly created shapes.
         * @param {GeoJSONFeatureCollection} featureCollection The FeatureCollection object.
         * @throws {ArgumentError} If the specified layer is null or undefined.
         * @throws {ArgumentError} If the specified featureCollection is null or undefined.
         */
        GeoJSON.prototype.addRenderablesForFeatureCollection = function (layer, featureCollection) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForFeatureCollection",
                        "missingLayer"));
            }

            if (!featureCollection) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "addRenderablesForFeatureCollection",
                        "missingFeatureCollection"));
            }

            if (featureCollection.features.length > 0) {
                for (var featureIndex = 0; featureIndex < featureCollection.features.length; featureIndex++) {

                    var feature = new GeoJSONFeature(
                        featureCollection.features[featureIndex][GeoJSONConstants.FIELD_GEOMETRY],
                        featureCollection.features[featureIndex][GeoJSONConstants.FIELD_PROPERTIES],
                        featureCollection.features[featureIndex][GeoJSONConstants.FIELD_CRS],
                        featureCollection.features[featureIndex][GeoJSONConstants.FIELD_ID],
                        featureCollection.features[featureIndex][GeoJSONConstants.FIELD_BBOX]);
                    this.addRenderablesForFeature(layer, feature, featureCollection.crs);
                }
            }
        };

        // Set type of GeoJSON object. Internal use ony.
        GeoJSON.prototype.setGeoJSONType = function (geoJSONObject) {
            if (!geoJSONObject) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "setGeoJSONType",
                        "missingGeoJSONObject"));
            }

            switch (geoJSONObject[GeoJSONConstants.FIELD_TYPE]) {
                case GeoJSONConstants.TYPE_POINT:
                    this._geoJSONType = GeoJSONConstants.TYPE_POINT;
                    break;
                case GeoJSONConstants.TYPE_MULTI_POINT:
                    this._geoJSONType = GeoJSONConstants.TYPE_MULTI_POINT;
                    break;
                case GeoJSONConstants.TYPE_LINE_STRING:
                    this._geoJSONType = GeoJSONConstants.TYPE_LINE_STRING;
                    break;
                case GeoJSONConstants.TYPE_MULTI_LINE_STRING:
                    this._geoJSONType = GeoJSONConstants.TYPE_MULTI_LINE_STRING;
                    break;
                case GeoJSONConstants.TYPE_POLYGON:
                    this._geoJSONType = GeoJSONConstants.TYPE_POLYGON;
                    break;
                case GeoJSONConstants.TYPE_MULTI_POLYGON:
                    this._geoJSONType = GeoJSONConstants.TYPE_MULTI_POLYGON;
                    break;
                case GeoJSONConstants.TYPE_GEOMETRY_COLLECTION:
                    this._geoJSONType = GeoJSONConstants.TYPE_GEOMETRY_COLLECTION;
                    break;
                case GeoJSONConstants.TYPE_FEATURE:
                    this._geoJSONType = GeoJSONConstants.TYPE_FEATURE;
                    break;
                case GeoJSONConstants.TYPE_FEATURE_COLLECTION:
                    this._geoJSONType = GeoJSONConstants.TYPE_FEATURE_COLLECTION;
                    break;
                default:
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "setGeoJSONType", "invalidGeoJSONType"));
            }
        };

        /**
         * Reprojects GeoJSON geometry coordinates if required using proj4js.
         *
         * @param {Number} latitude The latitude coordinate of the geometry.
         * @param {Number} longitude The longitude coordinate of the geometry.
         * @param {GeoJSONCRS} crsObject The GeoJSON CRS object.
         * @returns {Number[]} An array containing reprojected coordinates.
         * @throws {ArgumentError} If the specified latitude is null or undefined.
         * @throws {ArgumentError} If the specified longitude is null or undefined.
         * @throws {ArgumentError} If the specified crsObject is null or undefined.
         */
        GeoJSON.prototype.getReprojectedIfRequired = function (latitude, longitude, crsObject) {
            if (!latitude) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "getReprojectedIfRequired",
                        "missingLatitude"));
            }

            if (!longitude) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "getReprojectedIfRequired",
                        "missingLongitude"));
            }

            if (!crsObject) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSON", "getReprojectedIfRequired",
                        "missingCrsObject"));
            }

            if (!crsObject || crsObject.isDefault()){
                return [longitude, latitude];
            }
            else{
                if (crsObject.isNamed()){
                    return Proj4(crsObject.properties.name, GeoJSONConstants.EPSG4326_CRS, [longitude, latitude]);
                }
                else{
                    //TODO Linked CRS
                }
            }
        };

        // Use this function to add aliases for some projection strings that proj4js doesn't recognize. Internal
        // use only.
        GeoJSON.prototype.setProj4jsAliases = function () {
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

        return GeoJSON;
    }
);
