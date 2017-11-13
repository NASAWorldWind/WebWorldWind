define([
    '../Layer'
], function(Layer){
    "use strict";

    /**
     *
     * @constructor
     * @augments Layer
     * @param displayName {String} The display name to associate with this layer.
     * @param data {IntensityLocation[]} Array of the point containing on top of the information also intensity vector
     * @param options {Object}
     * @param options.scale {Color[]} Array of colors representing the scale which should be used when generating the
     *  layer.
     * @param options.intervalType {IntervalType} Different types of approaches to handling the interval between min
     *  and max values
     */
    var HeatMapLayer = function(displayName, data, options) {
        Layer.call(this, displayName || "Heatmap")
    };

    HeatMapLayer.prototype = Object.create(Layer.prototype);

    /**
     * Based on the information such as altitude we need to generate the HeatMap. We also need to cache the heatmap and
     * quite probably when adding the heatmap layer generate some type of the pyramid to simplify the handling.
     * @inheritDoc
     */
    HeatMapLayer.prototype.doRender = function(dc) {

    };

    return HeatMapLayer;
});