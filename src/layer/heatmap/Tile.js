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
define([], function(){
    /**
     * It represents one tile in the heatmap information. It is basically an interface specifying the public methods
     * properties and default configuration. The logic itself is handled in the subclasses.
     * @alias Tile
     * @constructor
     * @param data {IntensityLocation[]} Array of information constituting points in the map.
     * @param options {Object}
     * @param options.sector {Sector} Sector with the geographical information for tile representation.
     * @param options.width {Number} Width of the Canvas to be created in pixels.
     * @param options.height {Number} Height of the Canvas to be created in pixels.
     * @param options.radius {Number} Radius of the data point in pixels.
     * @param options.incrementPerIntensity {Number}
     */
    var Tile = function(data, options) {
        this._data = data;

        this._sector = options.sector;

        this._canvas = this.createCanvas(options.width + 2 * options.radius, options.height + 2 * options.radius);
        this._width = options.width;
        this._height = options.height;

        this._radius = options.radius;

        this._incrementPerIntensity = options.incrementPerIntensity;
    };

    Tile.prototype.url = function() {
        return this.draw().toDataURL();
    };

    Tile.prototype.canvas = function() {
        return this.draw();
    };

    /**
     * It draws the shapes on the canvas.
     * @protected
     * @returns {HTMLCanvasElement}
     */
    Tile.prototype.draw = function() {
        var shape = this.shape();

        var ctx = this._canvas.getContext('2d');
        ctx.clearRect(0,0, this._width + 2 * this._radius, this._height + 2 * this._radius);

        for(var i = 0; i < this._data.length; i++) {
            var location = this._data[i];
            // Get the location in pixels and draw the image.
            ctx.globalAlpha = location.intensity * this._incrementPerIntensity;
            ctx.drawImage(shape, location.longitudeInSector(this._sector, this._width), this._height - location.latitudeInSector(this._sector, this._height));
        }

        return this.clip(this._canvas, this._radius, this._radius, this._width, this._height);
    };

    /**
     * It creates canvas element of given size.
     * @protected
     * @param width {Number} Width of the canvas in pixels
     * @param height {Number} Height of the canvas in pixels
     * @returns {HTMLCanvasElement} Created the canvas
     */
    Tile.prototype.createCanvas = function(width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        return canvas;
    };

    /**
     * Internal method for clipping the canvas to some size. The size + offset must be smaller than the area
     * @protected
     * @param canvas {HTMLCanvasElement} Canvas to clip
     * @param x {Number} Start position for clipping with respect to width
     * @param y {Number} Start position for clipping with respect to height
     * @param width {Number} Width of the clip area
     * @param height {Number} Height of the clip area.
     * @returns {HTMLCanvasElement} Clipped canvas.
     */
    Tile.prototype.clip = function(canvas, x, y, width, height) {
        var result = this.createCanvas(width, height);
        result.getContext('2d').putImageData(canvas.getContext('2d').getImageData(x, y, width, height), 0, 0);
        return result;
    };

    /**
     * It creates a canvas containing the circle of the right size. THe default shape is circle, but subclasses can
     * change this behavior.
     * @protected
     * @returns {HTMLCanvasElement} Canvas representing the circle.
     */
    Tile.prototype.shape = function() {
        var circle = this.createCanvas(this._width, this._height),
            ctx = circle.getContext('2d'),
            r2 = this._radius + this._radius;

        circle.width = circle.height = r2;

        ctx.beginPath();
        ctx.arc(this._radius, this._radius, this._radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        return circle;
    };

    return Tile;
});