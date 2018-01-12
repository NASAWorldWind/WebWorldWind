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
    describe('All data in the tile with overlap', function(){
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
                // ctx.globalAlpha draws partially
                var imageUrl = tile.url();

                expect(imageUrl).toEqual('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAEG0lEQVQ4EQEQBO/7AQP6AGUAAAAAMtAA9ss2AKUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADXKAFvOMAAKAAAAAAAAAAABA/oAZf0FAAEY6AD7HeMA+gAAAAC3RADbE/IAzAEAAP4AAAAA/wAAAu0OADRJvAAly7x3IwDZKQgAoGDgA/sA/wE1ygBb4x0ABugYAAUD+wD/AAAAAAAAAADpFADRFPIAygAAAADsDgA2F+wALwAAAAD9BQABAGCgIAAn1/g1RIndAQAAAAA1ygBbzjAACgAAAAAAAAAAAAAAADLQAPbLNgClAAAAADXKAFvOMAAKAAAAAAAAAAAAAAAAMtAA9ss2AKUCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAA7A4ANhfsAC8AAAAAAAAAAP37CgMATbMkYr4QKwAAAACeQvDVALNN3AMF9v0AAAAAAAAAAOkUANEU8gDKAQAAAAD/AAAC7Q4ANEm8ACUAAAAAy3i9MaW+7z8AAAAAAAAAAAAAAABbQhHBNYhDzwAAAAC3RADbE/IAzAEAAP4BAAAAAAAAAAAAAAAAAAAAAAAAAABiAM23QwDfFAAAAAAAAAAAAAAAAL0AIeyeADNJAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAD/AAAC7A4ANjXKAFs1ygBbnkLw1QAAAAAAAAAAAAAAAAAAAACeQvDVNcoAWzXKAFvsDgA2/wAAAgAAAAABAAAAAOwOADYX7AAvAAAAAAAAAAD9+woDAE2zJGK+ECsAAAAAnkLw1QCzTdwDBfb9AAAAAAAAAADpFADRFPIAygEAAAAANcoAW84wAAoAAAAAAAAAAAAAAAAy0AD2yzYApQAAAAA1ygBbzjAACgAAAAAAAAAAAAAAADLQAPbLNgClAjXKAFvLvHcj/QUAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP0FAAH9ZaAhy0XwOzXKAFsCzjAACgDZKQgAYKAgAAAAAAAAAAAAAAAAt0QA2wAAAAAAAAAAt0QA2wAAAAAAAAAAAGCgIByhTxwAULDwzjAACgIAAAAAAKBg4AAn1/gy0AD2MtAA9ukUANET8gDMAAAAAAAAAAAT8gDM6RQA0TLQAPYAsFAQ5F+x5ACgYOAAAAAAAQP6AGUAAAAAMtAA9ss2AKUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADXKAFvOMAAKAAAAAAAAAADo/MLGan0YyQAAAABJRU5ErkJggg==');
            });
        });
    });
});