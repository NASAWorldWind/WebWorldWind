define([
    '../../error/ArgumentError',
    './ColoredTile',
    '../../util/ImageSource',
    './IntervalType',
    '../../geom/Location',
    '../../util/Logger',
    '../../geom/MeasuredLocation',
    '../TiledImageLayer',
    '../../geom/Sector',
    '../../util/WWUtil'
], function (ArgumentError,
             ColoredTile,
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
     * It represents a HeatMap Layer. The default implementation uses gradient circles as the way to display the
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
        for (lat = -90; lat < 90; lat++) {
            data[lat] = {};
            for (lon = -180; lon < 180; lon++) {
                data[lat][lon] = [];
            }
        }

        var latitude, longitude;
        measuredLocations.forEach(function (measured) {
            latitude = Math.floor(measured.latitude);
            longitude = Math.floor(measured.longitude);
            data[latitude][longitude].push(measured);
        });
        this._data = data;
        // Use other structure than filtering for the geographical data? Each of the tiles receive a value.
        // Object representing the lat and lon?

        this._intervalType = IntervalType.CONTINUOUS;
        this._scale = ['blue', 'cyan', 'lime', 'yellow', 'red'];
        this._radius = 25;
        this._blur = 10;
        this._incrementPerIntensity = 0.025;

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
         * It is also possible to provide a function. Radius of the point to
         * be representing the intensity location. Default value is 25. The size of the radius.
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
     * It gets the relevant points for the visualisation for current sector. At the moment it uses QuadTree to retrieve
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

        if (minLatitude < -90) {
            minLatitude = -90;
        }
        if (maxLatitude > 89) {
            maxLatitude = 89;
        }

        if (minLongitude < -180) {
            extraLongitudeBefore = Math.abs(minLongitude - (-180));
            minLongitude = -180;
        }
        if (maxLongitude > 179) {
            extraLongitudeAfter = Math.abs(maxLongitude - 180);
            maxLongitude = 179;
        }

        var result = [];
        var lat, lon;
        this.gatherGeographical(data, result, sector, minLatitude, maxLatitude, minLongitude, maxLongitude);

        if (extraLongitudeBefore !== 0) {
            var beforeSector = new Sector(minLatitude, maxLatitude, 179 - extraLongitudeBefore, 179);
            for (lat = minLatitude; lat <= maxLatitude; lat++) {
                for (lon = 179 - extraLongitudeBefore; lon <= 179; lon++) {
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
     * It sets gradient based on the Scale and IntervalType.
     */
    HeatMapLayer.prototype.setGradient = function (data) {
        var intervalType = this.intervalType;
        var scale = this.scale;

        var gradient = {};
        if (intervalType === IntervalType.CONTINUOUS) {
            scale.forEach(function (color, index) {
                gradient[index / scale.length] = color;
            });
        } else if (intervalType === IntervalType.QUANTILES) {
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
                    var pointInScale = data[Math.floor(fractionDecidingTheScale * data.length)].intensity / max;
                    gradient[pointInScale] = color;
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
                radius = this.radius;

            if (typeof this.radius === 'function') {
                radius = this.radius(tile.sector, this.tileWidth, this.tileHeight);
            }

            var extensionFactor = 1;
            var latitudeChange = (tile.sector.maxLatitude - tile.sector.minLatitude) * extensionFactor;
            var longitudeChange = (tile.sector.maxLongitude - tile.sector.minLongitude) * extensionFactor;
            var extendedSector = new Sector(
                tile.sector.minLatitude - latitudeChange,
                tile.sector.maxLatitude + latitudeChange,
                tile.sector.minLongitude - longitudeChange,
                tile.sector.maxLongitude + longitudeChange
            );
            console.log(extendedSector);
            var data = this.filterGeographically(this._data, extendedSector);
            console.log(data);

            // You need to take into account bigger area. Generate the tile for it and then clip it. Something like 10%
            // of the tile width / tile height. The size you need to actually take into account differs.
            var canvas = this.createHeatMapTile(data, {
                sector: extendedSector,

                width: this.tileWidth + 2 * Math.ceil(extensionFactor * this.tileWidth),
                height: this.tileHeight + 2 * Math.ceil(extensionFactor * this.tileHeight),
                radius: radius,
                blur: this.blur,

                intensityGradient: this.gradient,
                incrementPerIntensity: this.incrementPerIntensity
            }).canvas();

            var result = document.createElement('canvas');
            result.height = this.tileHeight;
            result.width = this.tileWidth;
            result.getContext('2d').putImageData(canvas.getContext('2d').getImageData(Math.ceil(extensionFactor * this.tileWidth), Math.ceil(extensionFactor * this.tileHeight), this.tileWidth, this.tileHeight), 0, 0);

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
                    canvas.dispatchEvent(e);
                }
            }
        }
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