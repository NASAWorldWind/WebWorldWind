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
    'src/layer/heatmap/HeatMapTile'
], function (IntensityLocation,
             Sector,
             HeatMapTile) {
    describe('HeatMapTile', function () {
        describe('All data in the tile without overlap', function () {

            var data = [
                new IntensityLocation(0, 0, 1),
                new IntensityLocation(0, 4, 1),
                new IntensityLocation(4, 0, 1),
                new IntensityLocation(4, 4, 1)
            ];
            var tile = new HeatMapTile(data, {
                sector: new Sector(0, 4, 0, 4), // Sector this tile represents
                width: 16, // Width of the tile in pixels
                height: 16, // Height of the tile in pixels
                radius: Math.ceil(Math.sqrt(2 * Math.pow(2, 2))), // Radius of the data point in pixels. In this way
                incrementPerIntensity: 1
            });

            describe('#url', function () {
                it('returns grayed canvas with correctly applied data', function () {
                    var imageUrl = tile.url();

                    expect(imageUrl).toEqual('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEG0lEQVQ4EQEQBO/7AQAAAMMAAAC2AAAAqQAAAN4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACIAAABXAAAASgAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAYAAAA0gAAAM4AAAD+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADzAAAADQAAAPIAAADbAQAAACIAAADiAAAA/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAIgAAAOIAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAeAAAAAAQAAABXAAAA0gAAALkAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAARwAAAC4AAAAABAAAAEoAAAAAAAAA1wAAAN4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4AAAAuAAAASgAAAABNbROHkOSuEAAAAABJRU5ErkJggg==');
                });
            });

            describe('#shape', function () {
                it('returns correct shape. In this case a circle.', function () {
                    var circle = tile.shape();

                    expect(circle.toDataURL()).toEqual('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAoUlEQVQIHQGWAGn/AQAAAAAAAAAEAAAAHgAAAAAAAADiAAAA/AMAAAAEAAAARwAAAEMAAAAsAAAADQAAAN8EAAAAHgAAAC4AAABKAAAAAAAAAAAAAADXAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAADiAAAA0gAAAAAAAAAAAAAA0gAAAOIBAAAAAAAAAAQAAAAeAAAAAAAAAOIAAAD8rcoKi1aAwMsAAAAASUVORK5CYII=');
                })
            });
        });

        describe('All data in the tile with overlap', function () {
            var data = [
                new IntensityLocation(0, 0, 1),
                new IntensityLocation(0, 4, 1),
                new IntensityLocation(4, 0, 1),
                new IntensityLocation(4, 4, 1),
                new IntensityLocation(1, 1, 1),
                new IntensityLocation(1, 3, 1),
                new IntensityLocation(3, 1, 1),
                new IntensityLocation(3, 3, 1),
                new IntensityLocation(2, 2, 2)
            ];
            var tile = new HeatMapTile(data, {
                sector: new Sector(0, 4, 0, 4), // Sector this tile represents
                width: 16, // Width of the tile in pixels
                height: 16, // Height of the tile in pixels
                radius: Math.ceil(Math.sqrt(2 * Math.pow(2, 2))), // Radius of the data point in pixels. In this way
                incrementPerIntensity: 0.3
            });

            describe('#url', function () {
                it('returns grayed canvas with correctly applied overlap of data', function () {
                    // ctx.globalAlpha draws partially
                    var imageUrl = tile.url();

                    expect(imageUrl).toEqual('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEG0lEQVQ4EQEQBO/7AQAAADkAAADrAAAA5gAAAPYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAaAAAAFQAAAAAEAAAAAAAAAAAAAAABAAAACgAAAAAAAAD3AAAA/wAAAAAAAAAAAAAAAAAAAAEAAAAJAAAACgAAAAEAAAAAAAAAAAEAAAAkAAAA8wAAAAAAAAANAAAAAAAAAPIAAADrAAAA/wAAAAAAAAABAAAAFQAAAA4AAAABAAAABQAAAPsAAAD/BAAAAOYAAAABAAAAGQAAABUAAAAAAAAAAAAAAPQAAAD2AAAAAAAAAAkAAAAOAAAAFQAAAAAAAADsAAAA7wAAAPYCAAAA9gAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD2AAAA9gQAAAAAAAAA9wAAAPIAAAAAAAAAAAAAAPIAAAD5AAAAFAAAAAAAAADvAAAA8gAAAAAAAAAAAAAA8gAAAPcAAAAAAQAAAAAAAAAAAAAAAQAAAAkAAAAAAAAA+QAAACoAAAAbAAAAAAAAAOUAAADWAAAABwAAAAAAAAD3AAAA/wAAAAAEAAAAAAAAAAAAAAD/AAAA9gAAAAAAAAAUAAAAGwAAACwAAAAAAAAAAAAAAOcAAADsAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAQAAAAkAAAAAAAAA7wAAAOUAAAAAAAAAAAAAAOUAAADvAAAACgAAAAAAAAD3AAAA/wAAAAABAAAAAAAAAAEAAAAVAAAADgAAAAAAAADyAAAA7QAAABEAAAAAAAAA7wAAABMAAAAOAAAAAAAAAPIAAADrAAAA/wQAAAAAAAAACQAAAA4AAAAVAAAAAAAAAAAAAAD0AAAA7AAAAAAAAAAKAAAADgAAABUAAAAAAAAAAAAAAPQAAAD2AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAACgAAAPgAAADyAAAAAAAAAAAAAADyAAAA9wAAAAAAAAAAAAAA9wAAAPIAAAAAAAAAAAAAAPMAAAABAAAACgEAAAAkAAAA8gAAAOwAAAAIAAAAAAAAAPcAAAD/AAAAAAAAAAAAAAAAAAAAAQAAAAkAAAABAAAADAAAAA0AAAAABAAAABUAAAAAAAAA9AAAAPYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA9gAAAAoAAAANAAAAFQAAAAC8fEYtyILHuwAAAABJRU5ErkJggg==');
                });
            });
        });
    });
});