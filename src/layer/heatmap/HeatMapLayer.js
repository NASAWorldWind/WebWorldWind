define([
    '../../error/ArgumentError',
    './ColoredTile',
    './HeatMapQuadTree',
    '../../util/ImageSource',
    './IntervalType',
    '../../geom/Location',
    '../../util/Logger',
    '../TiledImageLayer',
    '../../geom/Sector',
    '../../util/WWUtil'
], function (ArgumentError,
             ColoredTile,
             HeatMapQuadTree,
             ImageSource,
             IntervalType,
             Location,
             Logger,
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
     * @param locations {Location[]} Array of the points to be shown in the HeatMap
     * @param intensities {Number[]} Array of the intensities. The amount must be the same as for the locations.
     */
    var HeatMapLayer = function (displayName, locations, intensities) {
        this.tileWidth = 512;
        this.tileHeight = 512;

        TiledImageLayer.call(this, new Sector(-90, 90, -180, 180), new Location(45, 45), 14, 'image/png', 'HeatMap' + WWUtil.guid(), this.tileWidth, this.tileHeight);

        if(locations.length !== intensities.length) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "HeatMapLayer", "constructor", "The length of locations and intensities differs")
            );
        }

        this.displayName = displayName;

        this._data = new HeatMapQuadTree({
            bounds: {
                x: 0,
                y: 0,
                width: 360,
                height: 180
            },
            maxObjects: Math.ceil(locations.length / Math.pow(4, 4)),
            maxLevels: 4
        });
        locations.forEach(function(location, index){
            this._data.insert({
                latitude: location.latitude,
                longitude: location.longitude,
                intensity: intensities[index]
            });
        }.bind(this));

        this._intervalType = IntervalType.CONTINUOUS;
        this._scale = ['blue', 'cyan', 'lime', 'yellow', 'red'];
        this._radius = 25;
        this._blur = 10;
        this._incrementPerIntensity = 0.025;

        this.setGradient();
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
            get: function() {
                return this._intervalType;
            },
            set: function(intervalType) {
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
            get: function() {
                return this._scale;
            },
            set: function(scale) {
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
            get: function() {
                return this._gradient;
            },
            set: function(gradient) {
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
            get: function() {
                return this._radius;
            },
            set: function(radius) {
                this._radius = radius;
            }
        },

        /**
         * Amount of pixels used for blur.
         * @memberof HeatMapLayer.prototype
         * @type {Number}
         */
        blur: {
            get: function() {
                return this._blur;
            },
            set: function(blur) {
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
            get: function() {
                return this._incrementPerIntensity;
            },
            set: function(incrementPerIntensity) {
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
    HeatMapLayer.prototype.filterGeographically = function(data, sector) {
        return data.retrieve({
            x: sector.minLongitude,
            y: sector.minLatitude,
            width: Math.ceil(sector.maxLongitude - sector.minLongitude),
            height: Math.ceil(sector.maxLatitude - sector.minLatitude)
        });
    };

    /**
     * It sets gradient based on the Scale and IntervalType.
     */
    HeatMapLayer.prototype.setGradient = function() {
        var data = this._data.retrieve({
            x: -180,
            y: -90,
            width: 360,
            height: 180
        });
        var intervalType = this.intervalType;
        var scale = this.scale;

        var gradient = {};
        if(intervalType === IntervalType.CONTINUOUS) {
            scale.forEach(function(color, index){
                gradient[index / scale.length] = color;
            });
        } else if(intervalType === IntervalType.QUANTILES) {
            // Equal amount of pieces in each group.
            data.sort(function(item1, item2){
                if(item1.intensity < item2.intensity){
                    return -1;
                } else if(item1.intensity > item2.intensity) {
                    return 1;
                } else {
                    return 0;
                }
            });
            var max = data[data.length - 1].intensity;
            if(data.length >= scale.length) {
                scale.forEach(function(color, index){
                    // What is the fraction of the colors
                    var fractionDecidingTheScale = index / scale.length; // Kolik je na nte pozice z maxima.
                    var pointInScale = data[Math.floor(fractionDecidingTheScale * data.length)].intensity / max;
                    gradient[pointInScale] = color;
                });
            } else {
                scale.forEach(function(color, index){
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

            if(typeof this.radius === 'function') {
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
            var data = this.filterGeographically(this._data, extendedSector);

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
    HeatMapLayer.prototype.createHeatMapTile = function(data, options) {
        return new ColoredTile(data, options);
    };

    return HeatMapLayer;
});