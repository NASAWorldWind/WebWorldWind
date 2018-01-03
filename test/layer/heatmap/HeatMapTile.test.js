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
    'src/layer/heatmap/IntensityLocation',
    'src/geom/Sector',
    'src/layer/heatmap/Tile'
], function (IntensityLocation,
             Sector,
             Tile) {
    describe('All data in the tile', function(){

        var data = [
            new IntensityLocation(0,0,1),
            new IntensityLocation(0,4,1),
            new IntensityLocation(4,0,1),
            new IntensityLocation(4,4,1)
        ];
        var tile = new Tile(data, {
            sector: new Sector(0, 0, 4, 4), // Sector this tile represents
            width: 16, // Width of the tile in pixels
            height: 16, // Height of the tile in pixels
            radius: Math.sqrt(2 * Math.pow(2, 2)), // Radius of the data point in pixels. In this way
            incrementPerIntensity: 0.1,
            intensityGradient: [] // Array of colors to be used.
        });

        // There needs to be possibility to get the information in the gray.
        // How do you decide what should one point contribute.

        describe('#gray', function(){
            it('returns grayed canvas with correctly applied data', function(){
                // ctx.globalAlpha draws partially
                var grayedCanvas = tile.gray();

                grayedCanvas.getContext('2d').getImageData(0,0,16,16);
            });
        });

        describe('#colored', function(){
            it('returns colored canvas with correctly applied gradient', function(){

            });
        });

        /*
        ctx.beginPath();
        ctx.arc(-r2, -r2, r, 0, Math.PI * 2, true);
        ctx.closePath();
        */
    });

    describe('The data in the radius of the circle but outside of the sector', function(){
        // THe circle is growing through the levels of zoom.
    })
});