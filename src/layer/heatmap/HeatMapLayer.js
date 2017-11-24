define([
    './HeatMapCanvas',
    '../../util/ImageSource',
    '../../geom/Location',
    '../../util/Logger',
    '../TiledImageLayer',
    '../../geom/Sector'
], function (HeatMapCanvas,
             ImageSource,
             Location,
             Logger,
             TiledImageLayer,
             Sector) {
    "use strict";

    /**
     * @constructor
     * @augments TiledImageLayer
     * @param displayName {String} The display name to associate with this layer.
     * @param data {IntensityLocation[]} Array of the point containing on top of the information also intensity vector
     * @param options {Object}
     * Following two helps you create the gradient.
     * @param options.scale {Color[]} Array of colors representing the scale which should be used when generating the
     *  layer.
     * @param options.intervalType {IntervalType} Different types of approaches to handling the interval between min
     *  and max values
     */
    var HeatMapLayer = function (displayName, data, options) {
        TiledImageLayer.call(this, new Sector(-90, 90, -180, 180), new Location(45, 45), 14, 'image/png', 'heatmap', 512, 512);

        this._data = data;

        this._gradient = this.getGradient(data, options.scale, options.intervalType);
    };

    HeatMapLayer.prototype = Object.create(TiledImageLayer.prototype);

    /**
     * @private
     * @param data
     * @param scale
     * @param intervalType
     */
    HeatMapLayer.prototype.getGradient = function (data, scale, intervalType) {

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
                data: this._data,
                max: 10
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