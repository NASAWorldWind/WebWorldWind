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
    'src/layer/heatmap/ColoredTile'
], function (IntensityLocation,
             Sector,
             ColoredTile) {
    describe('ColoredTile#All data in the tile with overlap', function(){
        var data = [
            new IntensityLocation(0,0,1),
            new IntensityLocation(0,4,1),
            new IntensityLocation(4,0,1),
            new IntensityLocation(4,4,1),
            new IntensityLocation(1,1,1),
            new IntensityLocation(1,3,1),
            new IntensityLocation(3,1,1),
            new IntensityLocation(3,3,1),
            new IntensityLocation(2,2,2)
        ];
        var tile = new ColoredTile(data, {
            sector: new Sector(0, 4, 0, 4), // Sector this tile represents
            width: 16, // Width of the tile in pixels
            height: 16, // Height of the tile in pixels
            radius: Math.ceil(Math.sqrt(2 * Math.pow(2, 2))), // Radius of the data point in pixels. In this way
            incrementPerIntensity: 0.4,
            intensityGradient: {
                0.2: "#ff0000",
                0.4: "#00ff00",
                0.6: "#0000ff",
                0.8: "#aa00aa",
                1.0: "#004444"
            }
        });

        describe('#url', function(){
            it('returns colored canvas with correctly applied overlap of data', function(){
                var imageUrl = tile.url();

                expect(imageUrl).toEqual('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEG0lEQVQ4EQEQBO/7AXuEAE2EfADjAAAA3QEAAPMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAA0AAAAjfIQAHQAAAAAEAAAAAAAAAAAAAAAC/wAADQAAAAAAAAD1AQAA/gAAAAAAAAAAAAAAAP8AAAIAAAALAAAADAAAAAIAAAAAAAAAAAH/AAAwAAAA8AAAAAAAAAAQAAAAAAAAAO4AAADkAQAA/gAAAAD/AAACAAAAHAAAABIAAAAC5RsABhvlAPoAAAD+BAAAAN0AAAACAAAAIXyEAB0AAAAAhHwAAAAAAO8AAADzAAAAAAAAAAsAAAASfIQAHQAAAACEfADlAAAA5wAAAPQCAQAA8wAAAP4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP4AAAD0AQAA8wEAAAAA/wAAAgAAABwAAAASAAAAAAAAAO4AAADnAAAAFgAAAAAAAADqAAAAGQAAABIAAAAAAAAA7gAAAOQBAAD+AAAAAAAAAAAA/wAAAv8AAA3/AAAN/wAABdAvADwd4gBgHeIAYNAvADz/AAAF/wAADf8AAA3/AAACAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAbHuIARege/DsAAAAAGOIExeIeALsBAADlAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAA/wAAAgAAAAsAAAAAAAAA6rNNANxN4gQAAAAAALNNANwAAADq/wAADQAAAAAAAAD1AQAA/gAAAAABAAAAAP8AAAIAAAAcAAAAEgAAAAAAAADuAAAA5wAAABYAAAAAAAAA6gAAABkAAAASAAAAAAAAAO4AAADkAQAA/gQAAAAAAAAACwAAABJ8hAAdAAAAAIR8AAAAAADvAQAA5QAAAAD/AAANAAAAEnyEAB0AAAAAhHwAAAAAAO8AAADzAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/wAADQAAAPcAAAAaAAAAEgAAAAAAAADuAAAA5AEAAP4AAAAA/wAAAgAAABwAAAASAAAAAAAAAPAAAADvAAAA/gH/AAAwAAAA7gAAAOYAAAAJAAAAAAAAAPUBAAD+AAAAAAAAAAAAAAAA/wAAAgAAAAsAAAACAAAAEQAAABAAAAAABHyEAB2EfAAAAAAA7wEAAPMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAD+AAAA8/8AAA0AAAAQfIQAHQAAAAAbCnRVdrlgPgAAAABJRU5ErkJggg==');
            });
        });
    });
});