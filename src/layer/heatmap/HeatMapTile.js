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
define([], function(){
    /**
     * Returns one tile for the HeatMap information. It is basically an interface specifying the public methods
     * properties and default configuration. The logic itself is handled in the subclasses.
     * @alias HeatMapTile
     * @constructor
     * @param data {Object[]} Array of information constituting points in the map.
     * @param options {Object}
     * @param options.sector {Sector} Sector with the geographical information for tile representation.
     * @param options.width {Number} Width of the Canvas to be created in pixels.
     * @param options.height {Number} Height of the Canvas to be created in pixels.
     * @param options.radius {Number} Radius of the data point in pixels.
     * @param options.incrementPerIntensity {Number}
     */
    var HeatMapTile = function(data, options) {
        this._data = data;

        this._sector = options.sector;

        this._canvas = this.createCanvas(options.width, options.height);
        this._width = options.width;
        this._height = options.height;

        this._radius = options.radius;

        this._incrementPerIntensity = options.incrementPerIntensity;
    };

    /**
     * Returns the drawn HeatMapTile in the form of URL.
     * @return {String} Data URL of the tile.
     */
    HeatMapTile.prototype.url = function() {
        return this.draw().toDataURL();
    };

    /**
     * Returns the whole Canvas. It is then possible to use for further uses. This one is actually used in the
     * HeatMapLayer mechanism so if you want to provide some custom implementation of Canvas creation in your tile,
     * change this method.
     * @return {HTMLCanvasElement} Canvas Element representing the drawn tile.
     */
    HeatMapTile.prototype.canvas = function() {
        return this.draw();
    };

    /**
     * Draws the shapes on the canvas.
     * @protected
     * @returns {HTMLCanvasElement}
     */
    HeatMapTile.prototype.draw = function() {
        var shape = this.shape();

        var ctx = this._canvas.getContext('2d');
        ctx.clearRect(0,0, this._width, this._height);

        for(var i = 0; i < this._data.length; i++) {
            var location = this._data[i];
            // Get the location in pixels and draw the image.
            ctx.globalAlpha = location.measure * this._incrementPerIntensity;
            ctx.drawImage(shape, this.longitudeInSector(location, this._sector, this._width), this._height - this.latitudeInSector(location, this._sector, this._height));
        }

        return this._canvas;
    };

    /**
     * Creates canvas element of given size.
     * @protected
     * @param width {Number} Width of the canvas in pixels
     * @param height {Number} Height of the canvas in pixels
     * @returns {HTMLCanvasElement} Created the canvas
     */
    HeatMapTile.prototype.createCanvas = function(width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        return canvas;
    };

    /**
     * Creates a canvas containing the circle of the right size. THe default shape is circle, but subclasses can
     * change this behavior.
     * @protected
     * @returns {HTMLCanvasElement} Canvas representing the circle.
     */
    HeatMapTile.prototype.shape = function() {
        var shape = this.createCanvas(this._width, this._height),
            ctx = shape.getContext('2d'),
            r2 = this._radius + this._radius;

        shape.width = shape.height = r2;

        var gradient = ctx.createRadialGradient(this._radius, this._radius, 0, this._radius, this._radius, this._radius);
        gradient.addColorStop(0, "rgba(0,0,0,1)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");

        ctx.beginPath();
        ctx.arc(this._radius, this._radius, this._radius, 0, Math.PI * 2, true);

        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.closePath();

        return shape;
    };

    /**
     * Calculates position in pixels of the point based on its latitude.
     * @param location {Location} Location to transform
     * @param sector {Sector} Sector to which transform
     * @param height {Number} Height of the tile to draw to.
     * @private
     * @returns {number} Position on the height in pixels. THe result needs to start with 0
     */
    HeatMapTile.prototype.latitudeInSector = function(location, sector, height) {
        // Percentage of the available space.
        var sizeOfArea = sector.maxLatitude - sector.minLatitude;
        var locationInArea = location.latitude - sector.minLatitude;
        return Math.ceil((locationInArea / sizeOfArea) * (height - 1));
    };

    /**
     * Calculates position in pixels of the point based on its longitude.
     * @param location {Location} Location to transform
     * @param sector {Sector} Sector to which transform
     * @param width {Number} Height of the tile to draw to.
     * @returns {number}
     */
    HeatMapTile.prototype.longitudeInSector = function(location, sector, width) {
        var sizeOfArea = sector.maxLongitude - sector.minLongitude ;
        var locationInArea = location.longitude - sector.minLongitude;
        return Math.ceil((locationInArea / sizeOfArea) * (width - 1));
    };

    return HeatMapTile;
});