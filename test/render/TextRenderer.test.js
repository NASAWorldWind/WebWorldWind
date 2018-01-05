define([
    'src/util/Font',
    'src/render/TextRenderer',
    'src/geom/Vec2'
], function (Font,
             TextRenderer,
             Vec2) {
    "use strict";
    describe("TextRenderer tests", function () {

        // Mock TextRenderer.textSize() to avoid 2D context requirement.
        TextRenderer.prototype.textSize = function (text, font, outline) {
            return new Vec2(10, 50);
        };

        var testText = "Lorem ipsum dolor sit amet, consectetur "
            + "adipiscing elit, sed do eiusmod tempor incididunt ut";

        var myFont = new Font(15);

        it("Should throw an exception on missing text input", function () {
            expect(function () {
                var mockTextRenderer = new TextRenderer();
                mockTextRenderer.wrap(null, 20, 100, myFont);
            }).toThrow();
        });

        it("Should output '...' due to wrap height being less than textSize height", function () {
            var mockTextRenderer = new TextRenderer();
            var wrappedText = mockTextRenderer.wrap(testText, 10, 49, myFont);
            expect(wrappedText).toEqual("...");
        });

        it("Should output 'Lorem...' due to wrap width being less than textSize width", function () {
            var mockTextRenderer = new TextRenderer();
            var wrappedText = mockTextRenderer.wrap(testText, 9, 50, myFont);
            expect(wrappedText).toEqual("Lorem...");
        });

        it("Should output every word on testText in different lines", function () {
            var mockTextRenderer = new TextRenderer();
            // Wrap line width less than textSize texture width
            var wrappedLines = mockTextRenderer.wrapLine(testText, 9, null, myFont);
            expect(wrappedLines).toEqual("Lorem\n" +
                "ipsum\n" +
                "dolor\n" +
                "sit\n" +
                "amet,\n" +
                "consectetur\n" +
                "adipiscing\n" +
                "elit,\n" +
                "sed\n" +
                "do\n" +
                "eiusmod\n" +
                "tempor\n" +
                "incididunt\n" +
                "ut");
        });
    })
});