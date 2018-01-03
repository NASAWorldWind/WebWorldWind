define([
    'src/util/Font',
    'src/render/TextRenderer'
], function (Font,
             TextRenderer) {
    "use strict";
    describe("TextRenderer tests", function () {

        TextRenderer.prototype.textSize = function (text, font, outline) {
            return new Vec2(10, 10);
        };

        it("Should throw an exception on missing text input", function () {
            expect(function () {
                var mockTextRenderer = new TextRenderer();
                //var myFont = new Font(15);
                mockTextRenderer.wrap(null, 20, 100, "fake font");
            }).toThrow();
        });
    })
});