define([
    './HeatMapCanvas',
    '../../util/ImageSource',
    './IntervalType',
    '../../geom/Location',
    '../../util/Logger',
    '../TiledImageLayer',
    '../../geom/Sector',
    '../../util/WWUtil'
], function (HeatMapCanvas,
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
     * @param options.minOpacity {Number} Optional. Minimum opacity of the layer to be generated. It must be number between 0 and 1.
     *  Default value is 0.05
     * @param options.blur {Number} Optional. Blurring of the point representing the location internally in the heatmap. Default value is 15
     * @param options.radius {Number} Optional. Radius of the point to be representing the intensity location. Default value is 25
     */
    var HeatMapLayer = function (displayName, data, options) {
        TiledImageLayer.call(this, new Sector(-90, 90, -180, 180), new Location(45, 45), 14, 'image/png', 'HeatMap' + WWUtil.guid(), 512, 512);

        this.displayName = displayName;

        this._data = data;

        this._max = this.getMax(data);

        this._gradient = this.getGradient(data,
            options.intervalType || IntervalType.CONTINUOUS,
            options.scale || ['blue', 'cyan', 'lime', 'yellow', 'red']);

        this._radius = options.radius || 25;
        this._blur = options.blur || 15;
        if(options.blur === 0) {
            this._blur = options.blur;
        }
        this._minOpacity = options.minOpacity || 0.05;
    };

    HeatMapLayer.prototype = Object.create(TiledImageLayer.prototype);

    HeatMapLayer.prototype.getMax = function(data) {
        var max = Number.MIN_VALUE;
        data.forEach(function(point){
            if(point.intensity > max) {
                max = point.intensity;
            }
        });
        return max;
    };

    HeatMapLayer.prototype.filterGeographically = function(data, sector) {
        return data.filter(function(point){
            return point.isInSector(sector)
        });
    };

    // It doesn't handle the way the intensity is mapped to colors. It represents default color for the heatmap and then
    // how the blur is applied
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
                layer = this;

            var canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 512;

            new HeatMapCanvas(canvas, {
                sector: tile.sector,
                data: this.filterGeographically(this._data, tile.sector),
                max: this._max,
                gradient: this._gradient,
                radius: this._radius,
                blur: this._blur,
                minOpacity: this._minOpacity
            }).draw();

            var url = canvas.toDataURL("image/png");
            var image = new Image();
            image.onload = function() {
                Logger.log(Logger.LEVEL_INFO, "Image retrieval succeeded: " + url);

                var texture = layer.createTexture(dc, tile, image);
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
            };

            image.src = url;
        }
    };

    return HeatMapLayer;
});