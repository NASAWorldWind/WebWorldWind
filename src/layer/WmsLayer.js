/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WmsLayer
 * @version $Id: WmsLayer.js 3054 2015-04-29 19:29:02Z tgaskins $
 */
define([
        '../error/ArgumentError',
        '../geom/Location',
        '../util/Logger',
        '../geom/Sector',
        '../layer/TiledImageLayer',
        '../util/WmsUrlBuilder'
    ],
    function (ArgumentError,
              Location,
              Logger,
              Sector,
              TiledImageLayer,
              WmsUrlBuilder) {
        "use strict";

        /**
         * Constructs a WMS image layer.
         * @alias WmsLayer
         * @constructor
         * @augments TiledImageLayer
         * @classdesc Displays a WMS image layer.
         * @param {{}} config Specifies configuration information for the layer. Must contain the following
         * properties:
         * <ul>
         *     <li>service: {String} The URL of the WMS server.</li>
         *     <li>layerNames: {String} A comma separated list of the names of the WMS layers to include in this layer.</li>
         *     <li>sector: {Sector} The sector spanned by this layer.</li>
         *     <li>levelZeroDelta: {Location} The level-zero tile delta to use for this layer.</li>
         *     <li>numLevels: {Number} The number of levels to make for this layer.</li>
         *     <li>format: {String} The mime type of the image format to request, e.g., image/png.</li>
         *     <li>size: {Number} The size in pixels of tiles for this layer.</li>
         *     <li>coordinateSystem (optional): {String} The coordinate system to use for this layer, e.g., EPSG:4326.</li>
         *     <li>styleNames (optional): {String} A comma separated list of the styles to include in this layer.</li>
         * </ul>
         * The function [WmsLayer.formLayerConfiguration]{@link WmsLayer#formLayerConfiguration} will create an
         * appropriate configuration object given a {@link WmsLayerCapabilities} object.
         * @throws {ArgumentError} If the specified configuration is null or undefined.
         */
        var WmsLayer = function (config) {
            if (!config) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmsLayer", "constructor", "No configuration specified."));
            }

            var cachePath = config.service + config.layerNames + config.styleNames;

            TiledImageLayer.call(this, config.sector, config.levelZeroDelta, config.numLevels, config.format,
                cachePath, config.size, config.size);

            this.displayName = config.title;
            this.pickEnabled = false;

            this.urlBuilder = new WmsUrlBuilder(config.service, config.layerNames, config.styleNames, config.version);
            if (config.coordinateSystem) {
                this.urlBuilder.crs = config.coordinateSystem;
            }
        };

        WmsLayer.prototype = Object.create(TiledImageLayer.prototype);

        /**
         * Forms a configuration object for a specified {@link WmsLayerCapabilities} layer description. The
         * configuration object created and returned is suitable for passing to the WmsLayer constructor.
         * @param wmsLayerCapabilities {WmsLayerCapabilities} The WMS layer capabilities to create a configuration for.
         * @returns {{}} A configuration object.
         * @throws {ArgumentError} If the specified WMS layer capabilities is null or undefined.
         */
        WmsLayer.formLayerConfiguration = function (wmsLayerCapabilities) {
            var config = {
                title: wmsLayerCapabilities.title,
                version: wmsLayerCapabilities.capability.capsDoc.version
            };

            // Determine the layer's sector.
            var bbox = wmsLayerCapabilities.geographicBoundingBox || wmsLayerCapabilities.latLonBoundingBox;
            if (bbox && bbox.westBoundLongitude) {
                config.sector = new Sector(bbox.southBoundLatitude, bbox.northBoundLatitude,
                    bbox.westBoundLongitude, bbox.eastBoundLongitude);
            } else if (bbox && bbox.minx) {
                config.sector = new Sector(bbox.miny, bbox.maxy, bbox.minx, bbox.maxx);
            } else {
                config.sector = Sector.FULL_SPHERE;
            }

            // Determine level 0 delta.
            config.levelZeroDelta = new Location(36, 36); // TODO: How to determine best delta

            // Determine number of levels.
            config.numLevels = 19; // TODO: How to determine appropriate num levels

            config.size = 256;

            // Assign layer name.
            config.layerNames = wmsLayerCapabilities.name;

            // Determine image format
            var getMapInfo = wmsLayerCapabilities.capability.request.getMap,
                formats = getMapInfo.formats;

            if (formats.indexOf("image/png") >= 0) {
                config.format = "image/png";
            } else if (formats.indexOf("image/jpeg") >= 0) {
                config.format = "image/jpeg";
            } else if (formats.indexOf("image/tiff") >= 0) {
                config.format = "image/tiff";
            } else if (formats.indexOf("image/gif") >= 0) {
                config.format = "image/gif";
            }

            // Determine the GetMap service address.
            config.service = getMapInfo.url;

            // Determine the coordinate system to use.
            var coordinateSystems = wmsLayerCapabilities.crses; // WMS 1.3.0 and greater
            if (!coordinateSystems) {
                coordinateSystems = wmsLayerCapabilities.srses; // WMS 1.1.1 and lower
            }

            if (coordinateSystems) {
                if ((coordinateSystems.indexOf("EPSG:4326") >= 0) || (coordinateSystems.indexOf("epsg:4326") >= 0)) {
                    config.coordinateSystem = "EPSG:4326";
                } else if ((coordinateSystems.indexOf("CRS84") >= 0) || (coordinateSystems.indexOf("CRS:84") >= 0)) {
                    config.coordinateSystem = "CRS:84";
                }
            }

            return config;
        };

        return WmsLayer;
    });