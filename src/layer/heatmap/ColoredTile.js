/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
    './Tile'
], function (Tile) {
    /**
     * It provides us with a Tile available to ColoredTile.
     * @constructor
     * @augments Tile
     * @alias ColoredTile
     * @inheritDoc
     * @param options.intensityGradient {Object} Keys represent the opacity between 0 and 1 and the values represent
     *  color strings.
     */
    var ColoredTile = function(data, options) {
        Tile.call(this, data, options);

        this._gradient = this.gradient(options.intensityGradient);
    };

    ColoredTile.prototype = Object.create(Tile.prototype);

    /**
     * @inheritDoc
     */
    ColoredTile.prototype.draw = function() {
        var canvas = Tile.prototype.draw.call(this);

        var ctx = canvas.getContext('2d');
        var colored = ctx.getImageData(0, 0, this._width, this._height);
        this.colorize(colored.data, this._gradient);
        ctx.putImageData(colored, 0, 0);

        return canvas;
    };

    /**
     *
     * @private
     * @param grad {Object}
     * @return {Uint8ClampedArray} Array of the gradient data
     */
    ColoredTile.prototype.gradient = function (grad) {
        // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
        var canvas = this.createCanvas(1, 256),
            ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, 0, 256);

        for (var i in grad) {
            gradient.addColorStop(+i, grad[i]);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1, 256);

        return ctx.getImageData(0, 0, 1, 256).data;
    };

    /**
     * this takes relatively long. Is it possible to improve?
     * @private
     */
    ColoredTile.prototype.colorize = function (pixels, gradient) {
        for (var i = 0, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i + 3] * 4; // get gradient color from opacity value

            if (j) {
                pixels[i] = gradient[j];
                pixels[i + 1] = gradient[j + 1];
                pixels[i + 2] = gradient[j + 2];
            }
        }

    };

    return ColoredTile;
});