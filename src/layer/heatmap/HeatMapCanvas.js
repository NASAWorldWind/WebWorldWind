/**
 * @exports HeatMapCanvas
 */
define([
    '../../geom/Sector'
], function (Sector) {
    'use strict';

    /**
     * This utility generates the heatmap into the canvas. This canvas is then usable as the source for the SurfaceImage
     * in the heatmap.
     * @param canvas {Element}
     * @param options {Object}
     * @param options.sector {Sector} Optional. It represents the area displayed by the HeatMap. If none is supplied the whole world will be used.
     * @param options.data {IntensityLocation[]} Optional. If no data are supplied, the heatmap will be empty.
     * @param options.max {Number} Optional It is possible to provide maximum intensity available in the data. If none is provided
     *  the max is counted on the creation of the instance of heatmap canvas.
     * @param options.minOpacity {Number} Optional. Minimum opacity of the layer to be generated. It must be number between 0 and 1.
     *  Default value is 0.05
     * @param options.blur {Number} Optional. Blurring of the point representing the location internally in the heatmap. Default value is 15
     * @param options.radius {Number} Optional. Radius of the point to be representing the intensity location. Default value is 25
     * @param options.gradient {Object} Optional. Keys represent the number on the scale between 0 and 1. Internally the
     *  heatmap is generated in the shades of gray and then colored based on this gradient.
     * @constructor
     * @alias HeatMapCanvas
     */
    var HeatMapCanvas = function (canvas, options) {
        this._canvas = canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;

        this._ctx = canvas.getContext('2d');
        this._width = canvas.width;
        this._height = canvas.height;

        options = options || {};
        this._data = options.data || [];
        this._max = options.max || this.getMax(this._data) || 1;

        this._minOpacity = options.minOpacity || 0.05;
        this._blur = options.blur || 15;
        this._radius = options.radius || 25;
        this._gradient = options.gradient || {
            0.4: 'blue',
            0.6: 'cyan',
            0.7: 'lime',
            0.8: 'yellow',
            1.0: 'red'
        };

        this._sector = options.sector || new Sector(-90, 90, -180, 180);
    };

    /**
     * It draws the information from the current HeatMapCanvas on the real canvas.
     * @return {HeatMapCanvas}
     */
    HeatMapCanvas.prototype.draw = function () {
        var r = this._radius + this._blur;
        var radius = this.radius(this._radius, this._blur);
        var grad = this.gradient(this._gradient);

        var ctx = this._ctx;

        ctx.clearRect(0, 0, this._width, this._height);

        // draw a grayscale heatmap by putting a blurred circle at each data point
        for (var i = 0, len = this._data.length, point; i < len; i++) {
            point = this._data[i];
            if(point.isInSector(this._sector)) {
                ctx.globalAlpha = Math.min(Math.max(point.intensity / this._max, this._minOpacity === undefined ? 0.05 : this._minOpacity), 1);
                ctx.drawImage(radius, point.longitudeInSector(this._sector, this._width) - r, point.latitudeInSector(this._sector, this._height) - r);
            }
        }

        // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
        var colored = ctx.getImageData(0, 0, this._width, this._height);
        this.colorize(colored.data, grad);
        ctx.putImageData(colored, 0, 0);

        return this;
    };

    HeatMapCanvas.prototype.resize = function () {
        this._width = this._canvas.width;
        this._height = this._canvas.height;

        return this;
    };

    /**
     * @private
     */
    HeatMapCanvas.prototype.getMax = function () {

    };

    /**
     * @private
     * @param r {Number} Radius of the point itself
     * @param blur {Number} Radius of the blurring used to calculate the final number
     * @return {Element} It returns canvas relevant for the creation of the data points.
     */
    HeatMapCanvas.prototype.radius = function (r, blur) {
        // create a grayscale blurred circle image that we'll use for drawing points
        var circle = this.createCanvas(),
            ctx = circle.getContext('2d'),
            r2 = r + blur;

        circle.width = circle.height = r2 * 2;

        ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
        ctx.shadowBlur = blur;
        ctx.shadowColor = 'black';

        ctx.beginPath();
        ctx.arc(-r2, -r2, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        return circle;
    };

    /**
     * @private
     * @param grad
     * @return
     */
    HeatMapCanvas.prototype.gradient = function (grad) {
        // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
        var canvas = this.createCanvas(),
            ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, 0, 256);

        canvas.width = 1;
        canvas.height = 256;

        for (var i in grad) {
            gradient.addColorStop(+i, grad[i]);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1, 256);

        return ctx.getImageData(0, 0, 1, 256).data;
    };

    /**
     * @private
     */
    HeatMapCanvas.prototype.colorize = function (pixels, gradient) {
        for (var i = 0, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i + 3] * 4; // get gradient color from opacity value

            if (j) {
                pixels[i] = gradient[j];
                pixels[i + 1] = gradient[j + 1];
                pixels[i + 2] = gradient[j + 2];
            }
        }

    };

    /**
     * @private
     * @return {Element}
     */
    HeatMapCanvas.prototype.createCanvas = function () {
        return document.createElement('canvas');
    };

    return HeatMapCanvas;
});