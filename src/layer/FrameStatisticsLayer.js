/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports FrameStatisticsLayer
 * @version $Id: FrameStatisticsLayer.js 3343 2015-07-28 18:22:59Z dcollins $
 */
define([
        '../error/ArgumentError',
        '../util/Color',
        '../util/Font',
        '../layer/Layer',
        '../util/Logger',
        '../util/Offset',
        '../shapes/ScreenText',
        '../shapes/TextAttributes'
    ],
    function (ArgumentError,
              Color,
              Font,
              Layer,
              Logger,
              Offset,
              ScreenText,
              TextAttributes) {
        "use strict";

        /**
         * Constructs a layer that displays the current performance statistics.
         * @alias FrameStatisticsLayer
         * @constructor
         * @augments Layer
         * @classDesc Displays the current performance statistics, which are collected each frame in the World Window's
         * {@link FrameStatistics}. A frame statics layer cannot be shared among World Windows. Each World Window if it
         * is to have a frame statistics layer must have its own.
         * @param {WorldWindow} worldWindow The World Window associated with this layer.
         * This layer may not be associated with more than one World Window. Each World Window must have it's own
         * instance of this layer if each window is to have a frame statistics display.
         * @throws {ArgumentError} If the specified world window is null or undefined.
         */
        var FrameStatisticsLayer = function (worldWindow) {
            if (!worldWindow) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "FrameStatisticsLayer", "constructor", "missingWorldWindow"));
            }

            Layer.call(this, "Frame Statistics");

            // No picking of this layer's screen elements.
            this.pickEnabled = false;

            var textAttributes = new TextAttributes(null);
            textAttributes.color = Color.GREEN;
            textAttributes.font = new Font(12);
            textAttributes.offset = new Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 1);

            // Intentionally not documented.
            this.frameTime = new ScreenText(new Offset(WorldWind.OFFSET_PIXELS, 5, WorldWind.OFFSET_INSET_PIXELS, 5), " ");
            this.frameTime.attributes = textAttributes;

            // Intentionally not documented.
            this.frameRate = new ScreenText(new Offset(WorldWind.OFFSET_PIXELS, 5, WorldWind.OFFSET_INSET_PIXELS, 25), " ");
            this.frameRate.attributes = textAttributes;

            // Register a redraw callback on the World Window.
            var thisLayer = this;

            function redrawCallback(worldWindow, stage) {
                thisLayer.handleRedraw(worldWindow, stage);
            }

            worldWindow.redrawCallbacks.push(redrawCallback);
        };

        FrameStatisticsLayer.prototype = Object.create(Layer.prototype);

        // Documented in superclass.
        FrameStatisticsLayer.prototype.doRender = function (dc) {
            this.frameRate.render(dc);
            this.frameTime.render(dc);
            this.inCurrentFrame = true;
        };

        // Intentionally not documented.
        FrameStatisticsLayer.prototype.handleRedraw = function (worldWindow, stage) {
            if (stage != WorldWind.BEFORE_REDRAW) {
                return; // ignore after redraw events
            }

            var frameStats = worldWindow.frameStatistics;
            this.frameTime.text = "Frame time  " + frameStats.frameTimeAverage.toFixed(0) + " ms  (" + frameStats.frameTimeMin.toFixed(0) + " - " + frameStats.frameTimeMax.toFixed(0) + ")";
            this.frameRate.text = "Frame rate  " + frameStats.frameRateAverage.toFixed(0) + " fps";
        };

        return FrameStatisticsLayer;
    });