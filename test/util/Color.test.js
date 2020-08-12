/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
require([
    'src/util/Color'
], function (Color) {
    "use strict";
    describe("Color-colorFromHex", function () {
        it("testValidWhiteHex", function () {
            var result = Color.colorFromHex("ffffffff");
            expect(result.equals(new Color(1, 1, 1, 1))).toBe(true);
        });

        it("testValidBlackHex", function () {
            var result = Color.colorFromHex("000000ff");
            expect(result.equals(new Color(0, 0, 0, 1))).toBe(true);
        });
    });

    describe("Converts Color to CSS Compatible Color String", function () {

        // convert CSS Color string to byte array
        var re = /\d+(\.\d+)?/g; // pattern to extract CSS color values from a string
        var cssStringParse = function (cssString) {
            // parse the integer values from the css string
            var bytes = [];
            var match;
            while ((match = re.exec(cssString)) != null) {
                bytes.push(match[0]);
            }

            return bytes;
        };

        it("should round to the same integer values", function () {
            var r = 0.25, g = 0.07, b = 0.75, a = 0.5; // values which test the rounding scheme
            var result = new Color(r, g, b, a).toCssColorString();
            expect(result === "rgba(64, 18, 191, 0.5)").toBe(true);
        });

        it("should convert from CSS String to the matching byte value", function () {
            var color = new Color(0, 0, 0, 1); // initial color to start testing (similar to DrawContext pickColor)
            var tests = 256 * 256; // test two bands of unique pick colors, the complete three band range takes too long

            for (var i = 0; i < tests; i++) {
                var startColor = color.nextColor().clone();
                var colorValues = cssStringParse(startColor.toCssColorString());
                var convertedColor = Color.colorFromBytes(colorValues[0], colorValues[1], colorValues[2], colorValues[3] * 255);
                expect(startColor.equals(convertedColor)).toBe(true);
            }
        });

        it("should convert from CSS back to the original value within css 8 bit precision", function () {
            var err = 1 / 510;

            for (var red = 0; red <= 1; red += 0.0001) {
                var initialColor = new Color(red, 0, 0, 1);
                var colorCssString = initialColor.toCssColorString();
                var colorValues = cssStringParse(colorCssString);
                var resultColor = Color.colorFromBytes(colorValues[0], colorValues[1], colorValues[2], colorValues[3] * 255);
                expect(Math.abs(resultColor.red - initialColor.red) <= err).toBe(true);
            }
        });
    });
});
