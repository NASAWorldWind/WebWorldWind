/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WmsTimeDimensionedLayer
 * @version $Id: WmsTimeDimensionedLayer.js 3362 2015-07-31 19:29:12Z tgaskins $
 */
define([
        '../error/ArgumentError',
        '../layer/Layer',
        '../util/Logger',
        '../layer/WmsLayer'
    ],
    function (ArgumentError,
              Layer,
              Logger,
              WmsLayer) {
        "use strict";

        /**
         * Constructs a WMS time-dimensioned image layer.
         * @alias WmsTimeDimensionedLayer
         * @constructor
         * @augments Layer
         * @classdesc Displays a time-series WMS image layer. This layer contains a collection of {@link WmsLayer}s,
         * each representing a different time in a time sequence. Only the layer indicated by this layer's
         * [time]{@link WmsTimeDimensionedLayer#time} property is displayed during any frame.
         * @param {{}} config Specifies configuration information for the layer.
         * See the constructor description for {@link WmsLayer} for a description of the required properties.
         * @throws {ArgumentError} If the specified configuration is null or undefined.
         */
        var WmsTimeDimensionedLayer = function (config) {
            if (!config) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmsTimeDimensionedLayer", "constructor",
                        "No configuration specified."));
            }

            Layer.call(this, "WMS Time Dimensioned Layer");

            /**
             * The configuration object specified at construction.
             * @type {{}}
             * @readonly
             */
            this.config = config;

            // Intentionally not documented.
            this.displayName = config.title;
            this.pickEnabled = false;

            // Intentionally not documented. Contains the lazily loaded list of sub-layers.
            this.layers = {};
        };

        WmsTimeDimensionedLayer.prototype = Object.create(Layer.prototype);

        WmsTimeDimensionedLayer.prototype.doRender = function (dc) {
            if (this.time) {
                var currentTimeString = this.time.toISOString(),
                    layer = this.layers[currentTimeString];

                if (!layer) {
                    layer = new WmsLayer(this.config, currentTimeString);
                    this.layers[currentTimeString] = layer;
                }

                layer.opacity = this.opacity;
                layer.doRender(dc);

                this.inCurrentFrame = layer.inCurrentFrame;
            }
        };

        return WmsTimeDimensionedLayer;
    });