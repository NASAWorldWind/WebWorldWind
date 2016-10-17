/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
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