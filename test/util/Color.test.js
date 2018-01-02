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
], function (
    Color
) {
    "use strict";
    describe("Color-colorFromHex", function() {
        it("testValidWhiteHex", function() {
            var result = Color.colorFromHex("ffffffff");
            expect(result.equals(new Color(1,1,1,1))).toBe(true);
        });

        it("testValidBlackHex", function() {
            var result = Color.colorFromHex("000000ff");
            expect(result.equals(new Color(0,0,0,1))).toBe(true);
        });
    })
});