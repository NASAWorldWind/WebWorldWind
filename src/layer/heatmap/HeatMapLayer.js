define([
    './ColoredTile',
    '../../util/ImageSource',
    './IntervalType',
    '../../geom/Location',
    '../../util/Logger',
    '../TiledImageLayer',
    '../../geom/Sector',
    '../../util/WWUtil'
], function (ColoredTile,
             ImageSource,
             IntervalType,
             Location,
             Logger,
             TiledImageLayer,
             Sector,
             WWUtil) {
    "use strict";

    /**
     * @constructor
     * @augments TiledImageLayer
     * @param displayName {String} The display name to associate with this layer.
     * @param data {IntensityLocation[]} Array of the point containing on top of the information also intensity vector
     * @param options {Object}
     * @param options.scale {String[]} Optional. Array of colors representing the scale which should be used when generating the
     *  layer. Default is ['blue', 'cyan', 'lime', 'yellow', 'red']
     * @param options.intervalType {IntervalType} Optional. Different types of approaches to handling the interval between min
     *  and max values. Default value is Continuous.
     * @param options.radius {Number|Function} Optional. It is also possible to provide a function. Radius of the point to
     *  be representing the intensity location. Default value is 25. The size of the radius.
     * @param options.blur {Number} Optional. Amount of pixels used for blur.
     * @param options.tile {Tile} Tile used to display the information.
     * @param options.incrementPerIntensity {Number} Increment per intensity.
     */
    var HeatMapLayer = function (displayName, data, options) {
        this.tileWidth = 512;
        this.tileHeight = 512;

        TiledImageLayer.call(this, new Sector(-90, 90, -180, 180), new Location(45, 45), 14, 'image/png', 'HeatMap' + WWUtil.guid(), this.tileWidth, this.tileHeight);

        this.displayName = displayName;

        this._data = data;

        this._gradient = this.getGradient(data,
            options.intervalType || IntervalType.CONTINUOUS,
            options.scale || ['blue', 'cyan', 'lime', 'yellow', 'red']);

        // It is necessary
        this._radius = options.radius || 25;

        this._blur = options.blur || 10;

        this._tile = options.tile || ColoredTile;

        this._incrementPerIntensity = options.incrementPerIntensity || 0.025;
    };

    HeatMapLayer.prototype = Object.create(TiledImageLayer.prototype);

    /**
     * @private
     * @param data
     * @param sector
     * @returns {IntensityLocation[]}
     */
    HeatMapLayer.prototype.filterGeographically = function(data, sector) {
        return data.filter(function(point){
            return point.isInSector(sector)
        });
    };

    /**
     * Object represented by
     * 0.2: #ff0000
     * @param data
     * @param intervalType
     * @param scale
     * @returns {{}}
     */
    HeatMapLayer.prototype.getGradient = function(data, intervalType, scale) {
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
        return gradient;
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
                radius = this._radius;

            if(typeof this._radius === 'function') {
                radius = this._radius(tile.sector, this.tileWidth, this.tileHeight);
            }

            var latitudeChange = (tile.sector.maxLatitude - tile.sector.minLatitude) * 0.1;
            var longitudeChange = (tile.sector.maxLongitude - tile.sector.minLongitude) * 0.1;
            var extendedSector = new Sector(
                tile.sector.minLatitude - latitudeChange,
                tile.sector.maxLatitude + latitudeChange,
                tile.sector.minLongitude - longitudeChange,
                tile.sector.maxLongitude + longitudeChange
            );
            var data = this.filterGeographically(this._data, extendedSector);

            // You need to take into account bigger area. Generate the tile for it and then clip it. Something like 10%
            // of the tile width / tile height
            var canvas = new this._tile(data, {
                sector: extendedSector,

                width: this.tileWidth + 2 * Math.ceil(0.1 * this.tileWidth),
                height: this.tileHeight + 2 * Math.ceil(0.1 * this.tileHeight),
                radius: radius,
                blur: this._blur,

                intensityGradient: this._gradient,
                incrementPerIntensity: this._incrementPerIntensity
            }).canvas();

            var result = document.createElement('canvas');
            result.height = this.tileHeight;
            result.width = this.tileWidth;
            result.getContext('2d').putImageData(canvas.getContext('2d').getImageData(Math.ceil(0.1 * this.tileWidth), Math.ceil(0.1 * this.tileHeight), this.tileWidth, this.tileHeight), 0, 0);

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

    return HeatMapLayer;
});