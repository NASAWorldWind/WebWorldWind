/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define([
    '../../error/ArgumentError',
    './HeatMapColoredTile',
    './HeatMapTile',
    '../../util/ImageSource',
    './HeatMapIntervalType',
    '../../geom/Location',
    '../../util/Logger',
    '../../geom/MeasuredLocation',
    '../TiledImageLayer',
    '../../geom/Sector',
    '../../util/WWUtil'
], function (ArgumentError,
             ColoredTile,
             HeatMapTile,
             ImageSource,
             IntervalType,
             Location,
             Logger,
             MeasuredLocation,
             TiledImageLayer,
             Sector,
             WWUtil) {
    "use strict";

    /**
     * Returns a HeatMap Layer. The default implementation uses gradient circles as the way to display the
     * point. The intensity of the point is taken in the account. The default implementation should look just fine,
     * though it is possible to change the way the HeatMap looks via options to quite some extent.
     * @constructor
     * @augments TiledImageLayer
     * @alias HeatMapLayer
     * @param displayName {String} The display name to associate with this layer.
     * @param measuredLocations {MeasuredLocation[]} Array of the points with the measured locations provided. .
     */
    var HeatMapLayer = function (displayName, measuredLocations) {
        this.tileWidth = 512;
        this.tileHeight = 512;

        TiledImageLayer.call(this, new Sector(-90, 90, -180, 180), new Location(45, 45), 14, 'image/png', 'HeatMap' + WWUtil.guid(), this.tileWidth, this.tileHeight);

        this.displayName = displayName;

        var data = {};
        var lat, lon;
        for (lat = -90; lat <= 90; lat++) {
            data[lat] = {};
            for (lon = -180; lon <= 180; lon++) {
                data[lat][lon] = [];
            }
        }

        var latitude, longitude;
        var max = Number.MIN_VALUE;
        measuredLocations.forEach(function (measured) {
            latitude = Math.floor(measured.latitude);
            longitude = Math.floor(measured.longitude);
            data[latitude][longitude].push(measured);
            if(measured.measure > max) {
                max = measured.measure;
            }
        });
        this._data = data;
        this._measuredLocations = measuredLocations;
        // Use other structure than filtering for the geographical data? Each of the tiles receive a value.
        // Object representing the lat and lon?

        this._intervalType = IntervalType.CONTINUOUS;
        this._scale = ['blue', 'cyan', 'lime', 'yellow', 'red'];
        this._radius = 25;
        this._blur = 10;
        this._incrementPerIntensity = 1 / max;

        this.setGradient(measuredLocations);
    };

    HeatMapLayer.prototype = Object.create(TiledImageLayer.prototype);

    Object.defineProperties(HeatMapLayer.prototype, {
        /**
         * Different types of approaches to handling the interval between min
         * and max values. Default value is Continuous.
         * @memberof HeatMapLayer.prototype
         * @type {IntervalType}
         */
        intervalType: {
            get: function () {
                return this._intervalType;
            },
            set: function (intervalType) {
                this._intervalType = intervalType;
                this.setGradient();
            }
        },

        /**
         * Array of colors representing the scale which should be used when generating the
         * layer. Default is ['blue', 'cyan', 'lime', 'yellow', 'red']
         * @memberof HeatMapLayer.prototype
         * @type {String[]}
         */
        scale: {
            get: function () {
                return this._scale;
            },
            set: function (scale) {
                this._scale = scale;
                this.setGradient();
            }
        },

        /**
         * Gradient to use for coloring of the HeatMap.
         * @memberOf HeatMapLayer.prototype
         * @type {String[]}
         */
        gradient: {
            get: function () {
                return this._gradient;
            },
            set: function (gradient) {
                this._gradient = gradient;
            }
        },

        /**
         * Represents radius of the point drawn on the canvas. It is also possible to provide a function. Radius of the
         * point to be representing the intensity location. Default value is 25. The size of the radius.
         * @memberof HeatMapLayer.prototype
         * @type {Function|Number}
         */
        radius: {
            get: function () {
                return this._radius;
            },
            set: function (radius) {
                this._radius = radius;
            }
        },

        /**
         * Amount of pixels used for blur.
         * @memberof HeatMapLayer.prototype
         * @type {Number}
         */
        blur: {
            get: function () {
                return this._blur;
            },
            set: function (blur) {
                this._blur = blur;
            }
        },

        /**
         * Increment per intensity. How strong is going to be the change in
         * the intensity based on the intensity vector of the point
         * @memberof HeatMapLayer.prototype
         * @type {Number}
         */
        incrementPerIntensity: {
            get: function () {
                return this._incrementPerIntensity;
            },
            set: function (incrementPerIntensity) {
                this._incrementPerIntensity = incrementPerIntensity;
            }
        }
    });

    /**
     * Returns the relevant points for the visualisation for current sector. At the moment it uses QuadTree to retrieve
     * the information.
     * @private
     * @param data
     * @param sector
     * @returns {Object[]}
     */
    HeatMapLayer.prototype.filterGeographically = function (data, sector) {
        var minLatitude = Math.floor(sector.minLatitude);
        var maxLatitude = Math.floor(sector.maxLatitude);
        var minLongitude = Math.floor(sector.minLongitude);
        var maxLongitude = Math.floor(sector.maxLongitude);

        var extraLongitudeBefore = 0, extraLongitudeAfter = 0;

        if (minLatitude <= -90) {
            minLatitude = -90;
        }
        if (maxLatitude >= 90) {
            maxLatitude = 90;
        }

        if (minLongitude <= -180) {
            extraLongitudeBefore = Math.abs(minLongitude - (-180));
            minLongitude = -180;
        }
        if (maxLongitude >= 180) {
            extraLongitudeAfter = Math.abs(maxLongitude - 180);
            maxLongitude = 180;
        }

        var result = [];
        var lat, lon;
        this.gatherGeographical(data, result, sector, minLatitude, maxLatitude, minLongitude, maxLongitude);

        if (extraLongitudeBefore !== 0) {
            var beforeSector = new Sector(minLatitude, maxLatitude, 180 - extraLongitudeBefore, 180);
            for (lat = minLatitude; lat <= maxLatitude; lat++) {
                for (lon = 180 - extraLongitudeBefore; lon <= 180; lon++) {
                    data[lat][lon].forEach(function (element) {
                        if (beforeSector.containsLocation(element.latitude, element.longitude)) {
                            result.push(new MeasuredLocation(element.latitude, -360 + element.longitude, element.measure));
                        }
                    });
                }
            }
        }
        if (extraLongitudeAfter !== 0) {
            var afterSector = new Sector(minLatitude, maxLatitude, -180, -180 + extraLongitudeAfter);

            for (lat = minLatitude; lat <= maxLatitude; lat++) {
                for (lon = -180; lon <= -180 + extraLongitudeAfter; lon++) {
                    data[lat][lon].forEach(function (element) {
                        if (afterSector.containsLocation(element.latitude, element.longitude)) {
                            result.push(new MeasuredLocation(element.latitude, 360 + element.longitude, element.measure));
                        }
                    });
                }
            }
        }

        return result;
    };

    /**
     * Internal method to gather the geographical data for given sector and boundingBox.
     * @private
     * @param data
     * @param result
     * @param sector
     * @param minLatitude
     * @param maxLatitude
     * @param minLongitude
     * @param maxLongitude
     */
    HeatMapLayer.prototype.gatherGeographical = function (data, result, sector, minLatitude, maxLatitude, minLongitude, maxLongitude) {
        var lat, lon;
        for (lat = minLatitude; lat <= maxLatitude; lat++) {
            for (lon = minLongitude; lon <= maxLongitude; lon++) {
                data[lat][lon].forEach(function (element) {
                    if (sector.containsLocation(element.latitude, element.longitude)) {
                        result.push(element);
                    }
                });
            }
        }
    };

    /**
     * Sets gradient based on the Scale and IntervalType.
     */
    HeatMapLayer.prototype.setGradient = function () {
        var intervalType = this.intervalType;
        var scale = this.scale;

        var gradient = {};
        if (intervalType === IntervalType.CONTINUOUS) {
            scale.forEach(function (color, index) {
                gradient[index / scale.length] = color;
            });
        } else if (intervalType === IntervalType.QUANTILES) {
            var data = this._measuredLocations;
            // Equal amount of pieces in each group.
            data.sort(function (item1, item2) {
                if (item1.measure < item2.measure) {
                    return -1;
                } else if (item1.measure > item2.measure) {
                    return 1;
                } else {
                    return 0;
                }
            });
            var max = data[data.length - 1].measure;
            if (data.length >= scale.length) {
                scale.forEach(function (color, index) {
                    // What is the fraction of the colors
                    var fractionDecidingTheScale = index / scale.length; // Kolik je na nte pozice z maxima.
                    var pointInScale = data[Math.floor(fractionDecidingTheScale * data.length)].measure / max;
                    if(index === 0) {
                        gradient[0] = color;
                    } else {
                        gradient[pointInScale] = color;
                    }
                });
            } else {
                scale.forEach(function (color, index) {
                    gradient[index / scale.length] = color;
                });
            }
        }
        this.gradient = gradient;
    };

    /**
     * @inheritDoc
     */
    HeatMapLayer.prototype.retrieveTileImage = function (dc, tile, suppressRedraw) {
        if (this.currentRetrievals.indexOf(tile.imagePath) < 0) {
            if (this.absentResourceList.isResourceAbsent(tile.imagePath)) {
                return;
            }

            var imagePath = tile.imagePath,
                cache = dc.gpuResourceCache,
                layer = this,
                radius = this.calculateRadius(tile.sector);

            var extended = this.calculateExtendedSector(tile.sector);
            var extendedWidth = Math.ceil(extended.extensionFactor * this.tileWidth);
            var extendedHeight = Math.ceil(extended.extensionFactor * this.tileHeight);

            var data = this.filterGeographically(this._data, extended.sector);

            var canvas = this.createHeatMapTile(data, {
                sector: extended.sector,

                width: this.tileWidth + 2 * extendedWidth,
                height: this.tileHeight + 2 * extendedHeight,
                radius: radius,
                blur: this.blur,

                intensityGradient: this.gradient,
                incrementPerIntensity: this._incrementPerIntensity
            }).canvas();

            var result = document.createElement('canvas');
            result.height = this.tileHeight;
            result.width = this.tileWidth;
            result.getContext('2d').putImageData(canvas.getContext('2d').getImageData(
                extendedWidth, extendedHeight, this.tileWidth, this.tileHeight), 0, 0
            );

            var texture = layer.createTexture(dc, tile, result);
            layer.removeFromCurrentRetrievals(imagePath);

            if (texture) {
                cache.putResource(imagePath, texture, texture.size);

                layer.currentTilesInvalid = true;
                layer.absentResourceList.unmarkResourceAbsent(imagePath);

                if (!suppressRedraw) {
                    // Send an event to request a redraw.
                    var e = document.createEvent('Event');
                    e.initEvent(WorldWind.REDRAW_EVENT_TYPE, true, true);
                    window.dispatchEvent(e);
                }
            }
        }
    };

    /**
     * Returns radius used to draw the points relevant to the HeatMap.
     * @protected
     * @param sector {Sector} Sector to be used for the calculation of the radius.
     * @return {Number} Pixels representing the radius.
     */
    HeatMapLayer.prototype.calculateRadius = function (sector) {
        var radius = this.radius;

        if (typeof this.radius === 'function') {
            radius = this.radius(sector, this.tileWidth, this.tileHeight);
        }

        return radius;
    };

    /**
     * Calculates the new sector for which the data will be filtered and which will be drawn on the tile.
     * The standard version just applies extension factor to the difference between minimum and maximum.
     * @protected
     * @param sector {Sector} Sector to use as basis for the extension.
     * @return {Object} .sector New extended sector.
     *                  .extensionFactor The factor by which the area is changed.
     */
    HeatMapLayer.prototype.calculateExtendedSector = function (sector) {
        var extensionFactor = 1;
        var latitudeChange = (sector.maxLatitude - sector.minLatitude) * extensionFactor;
        var longitudeChange = (sector.maxLongitude - sector.minLongitude) * extensionFactor;
        return {
            sector: new Sector(
                sector.minLatitude - latitudeChange,
                sector.maxLatitude + latitudeChange,
                sector.minLongitude - longitudeChange,
                sector.maxLongitude + longitudeChange
            ),
            extensionFactor: extensionFactor
        };
    };

    /**
     * Overwrite this method if you want to use a custom implementation of tile used for displaying the data.
     * @protected
     * @param data {Object[]} Array of information constituting points in the map.
     * @param options {Object}
     * @param options.sector {Sector} Sector with the geographical information for tile representation.
     * @param options.width {Number} Width of the Canvas to be created in pixels.
     * @param options.height {Number} Height of the Canvas to be created in pixels.
     * @param options.radius {Number} Radius of the data point in pixels.
     * @param options.blur {Number} Blur of the HeatMap element in the pixels.
     * @param options.incrementPerIntensity {Number}
     * @return {HeatMapTile} Implementation of the HeatMapTile used for this instance of the layer.
     */
    HeatMapLayer.prototype.createHeatMapTile = function (data, options) {
        return new ColoredTile(data, options);
    };

    return HeatMapLayer;
});