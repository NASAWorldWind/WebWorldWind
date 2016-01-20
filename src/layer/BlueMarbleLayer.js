/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports BlueMarbleLayer
 */
define([
        '../error/ArgumentError',
        '../layer/Layer',
        '../util/Logger',
        '../util/PeriodicTimeSequence',
        '../layer/RestTiledImageLayer'
    ],
    function (ArgumentError,
              Layer,
              Logger,
              PeriodicTimeSequence,
              RestTiledImageLayer) {
        "use strict";

        /**
         * Constructs a Blue Marble layer.
         * @alias BlueMarbleLayer
         * @constructor
         * @augments Layer
         * @classdesc Represents the 12 month collection of Blue Marble Next Generation imagery for the year 2004.
         * By default the month of January is displayed, but this can be changed by setting this class' time
         * property to indicate the month to display.
         * @param {String} displayName The display name to assign this layer. Defaults to "Blue Marble" if null or
         * undefined.
         * @param {Date} initialTime A date value indicating the month to display. The nearest month to the specified
         * time is displayed. January is displayed if this argument is null or undefined, i.e., new Date("2004-01");
         * @param {{}} configuration An optional object with properties defining the layer configuration.
         * See {@link RestTiledImageLayer} for a description of its contents. May be null, in which case default
         * values are used.
         */
        var BlueMarbleLayer = function (displayName, initialTime, configuration) {
            Layer.call(this, displayName || "Blue Marble");

            /**
             * A value indicating the month to display. The nearest month to the specified time is displayed.
             * @type {Date}
             * @default January 2004 (new Date("2004-01"));
             */
            this.time = initialTime || new Date("2004-01");

            this.configuration = configuration;

            this.pickEnabled = false;

            // Intentionally not documented.
            this.layers = {}; // holds the layers as they're created.

            // Intentionally not documented.
            this.layerNames = [
                {month: "BlueMarble-200401", time: BlueMarbleLayer.availableTimes[0]},
                {month: "BlueMarble-200402", time: BlueMarbleLayer.availableTimes[1]},
                {month: "BlueMarble-200403", time: BlueMarbleLayer.availableTimes[2]},
                {month: "BlueMarble-200404", time: BlueMarbleLayer.availableTimes[3]},
                {month: "BlueMarble-200405", time: BlueMarbleLayer.availableTimes[4]},
                {month: "BlueMarble-200406", time: BlueMarbleLayer.availableTimes[5]},
                {month: "BlueMarble-200407", time: BlueMarbleLayer.availableTimes[6]},
                {month: "BlueMarble-200408", time: BlueMarbleLayer.availableTimes[7]},
                {month: "BlueMarble-200409", time: BlueMarbleLayer.availableTimes[8]},
                {month: "BlueMarble-200410", time: BlueMarbleLayer.availableTimes[9]},
                {month: "BlueMarble-200411", time: BlueMarbleLayer.availableTimes[10]},
                {month: "BlueMarble-200412", time: BlueMarbleLayer.availableTimes[11]}
            ];
            this.timeSequence = new PeriodicTimeSequence("2004-01-01/2004-12-01/P1M");

            this.serverAddress = null;
            this.pathToData = "../standalonedata/Earth/BlueMarble256/";
        };

        BlueMarbleLayer.prototype = Object.create(Layer.prototype);

        /**
         * Indicates the available times for this layer.
         * @type {Date[]}
         * @readonly
         */
        BlueMarbleLayer.availableTimes = [
            new Date("2004-01"),
            new Date("2004-02"),
            new Date("2004-03"),
            new Date("2004-04"),
            new Date("2004-05"),
            new Date("2004-06"),
            new Date("2004-07"),
            new Date("2004-08"),
            new Date("2004-09"),
            new Date("2004-10"),
            new Date("2004-11"),
            new Date("2004-12")
        ];

        /**
         * Initiates retrieval of this layer's level 0 images for all sub-layers. Use
         * [isPrePopulated]{@link TiledImageLayer#isPrePopulated} to determine when the images have been retrieved
         * and associated with the level 0 tiles.
         * Pre-populating is not required. It is used to eliminate the visual effect of loading tiles incrementally,
         * but only for level 0 tiles. An application might pre-populate a layer in order to delay displaying it
         * within a time series until all the level 0 images have been retrieved and added to memory.
         * @param {WorldWindow} wwd The world window for which to pre-populate this layer.
         * @throws {ArgumentError} If the specified world window is null or undefined.
         */
        BlueMarbleLayer.prototype.prePopulate = function (wwd) {
            if (!wwd) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "BlueMarbleLayer", "prePopulate", "missingWorldWindow"));
            }

            for (var i = 0; i < this.layerNames.length; i++) {
                var layerName = this.layerNames[i].month;

                if (!this.layers[layerName]) {
                    this.createSubLayer(layerName);
                }

                this.layers[layerName].prePopulate(wwd);
            }
        };

        /**
         * Indicates whether this layer's level 0 tile images for all sub-layers have been retrieved and associated
         * with the tiles.
         * Use [prePopulate]{@link TiledImageLayer#prePopulate} to initiate retrieval of level 0 images.
         * @param {WorldWindow} wwd The world window associated with this layer.
         * @returns {Boolean} true if all level 0 images have been retrieved, otherwise false.
         * @throws {ArgumentError} If the specified world window is null or undefined.
         */
        BlueMarbleLayer.prototype.isPrePopulated = function (wwd) {
            for (var i = 0; i < this.layerNames.length; i++) {
                var layer = this.layers[this.layerNames[i].month];
                if (!layer || !layer.isPrePopulated(wwd)) {
                    return false;
                }
            }

            return true;
        };

        BlueMarbleLayer.prototype.doRender = function (dc) {
            var layer = this.nearestLayer(this.time);
            layer.opacity = this.opacity;
            if (this.detailControl) {
                layer.detailControl = this.detailControl;
            }

            layer.doRender(dc);

            this.inCurrentFrame = layer.inCurrentFrame;
        };

        // Intentionally not documented.
        BlueMarbleLayer.prototype.nearestLayer = function (time) {
            var nearestName = this.nearestLayerName(time);

            if (!this.layers[nearestName]) {
                this.createSubLayer(nearestName);
            }

            return this.layers[nearestName];
        };

        BlueMarbleLayer.prototype.createSubLayer = function (layerName) {
            var dataPath = this.pathToData + layerName;
            this.layers[layerName] = new RestTiledImageLayer(this.serverAddress, dataPath, this.displayName,
                this.configuration);
        };

        // Intentionally not documented.
        BlueMarbleLayer.prototype.nearestLayerName = function (time) {
            var milliseconds = time.getTime();

            if (milliseconds <= this.layerNames[0].time.getTime()) {
                return this.layerNames[0].month;
            }

            if (milliseconds >= this.layerNames[11].time.getTime()) {
                return this.layerNames[11].month;
            }

            for (var i = 0; i < this.layerNames.length - 1; i++) {
                var leftTime = this.layerNames[i].time.getTime(),
                    rightTime = this.layerNames[i + 1].time.getTime();

                if (milliseconds >= leftTime && milliseconds <= rightTime) {
                    var dLeft = milliseconds - leftTime,
                        dRight = rightTime - milliseconds;

                    return dLeft < dRight ? this.layerNames[i].month : this.layerNames[i + 1].month;
                }
            }
        };

        return BlueMarbleLayer;
    });