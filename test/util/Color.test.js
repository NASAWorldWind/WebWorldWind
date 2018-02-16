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
        it("should round to the same integer values", function () {
            var r = 0.25, g = 0.07, b = 0.75, a = 0.5; // values which test the rounding scheme
            var result = new Color(r, g, b, a).toCssColorString();
            expect(result === "rgba(64, 18, 191, 0.5)").toBe(true);
        });

        it("should convert from CSS String to the matching byte value", function () {
            var color = new Color(0, 0, 0, 1); // initial color to start testing (similar to DrawContext pickColor)
            var re = /\d+(\.\d+)?/g; // pattern to extract CSS color values from a string
            var tests = 256 * 256; // test two bands of unique pick colors

            // convert CSS Color string to byte array
            var cssStringToByte = function (cssString) {
                // parse the integer values from the css string
                var bytes = [];
                var match;
                while ((match = re.exec(cssString)) != null) {
                    bytes.push(match[0]);
                }
                for (var i = bytes.length; i < 4; i++) {
                    bytes.push(0);
                }

                return bytes;
            };

            for (var i = 0; i < tests; i++) {
                var startColor = color.nextColor().clone();
                var colorBytes = cssStringToByte(startColor.toCssColorString());
                var convertedColor = Color.colorFromBytes(colorBytes[0], colorBytes[1], colorBytes[2], colorBytes[3] * 255);
                expect(startColor.equals(convertedColor)).toBe(true);
            }
        });
    });
});
