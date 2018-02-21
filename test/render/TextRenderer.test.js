define([
    'src/util/Font',
    'src/render/TextRenderer',
    'src/geom/Vec2'
], function (Font,
             TextRenderer,
             Vec2) {
    "use strict";
    describe("TextRenderer tests", function () {

        // Mocking TextRenderer.textSize() to avoid 2D context requirement.
        TextRenderer.prototype.textSize = function (text, font, outline) {
            return new Vec2(text.length * 7, 16);
        };

        // Mocking draw context to avoid WebGL requirements.
        var DrawContext = function () {
            this.currentGlContext = "fake GL context";
            this.pixelScale = 1;
            this.textRenderer = new TextRenderer(this);
        };

        var testText = "Lorem ipsum dolor sit amet, consectetur "
            + "adipiscing elit, sed do eiusmod tempor incididunt ut";

        var mockDrawContext = new DrawContext;

        it("Should throw an exception on missing constructor draw context", function () {
            expect(function () {
                var mockTextRenderer = new TextRenderer(null);
            }).toThrow();
        });

        it("Should return null due to empty string input on RenderText", function () {
            var mockTextRenderer = new TextRenderer(mockDrawContext);
            expect(mockTextRenderer.renderText("")).toBeNull();
        });

        it("Should throw an exception on missing text input", function () {
            expect(function () {
                var mockTextRenderer = new TextRenderer(mockDrawContext);
                mockTextRenderer.wrap(null, 20, 100);
            }).toThrow();
        });

        it("Should output '...' due to wrap height being less than textSize height", function () {
            var mockTextRenderer = new TextRenderer(mockDrawContext);
            var wrappedText = mockTextRenderer.wrap(testText, 92, 15);
            expect(wrappedText).toEqual("...");
        });

        it("Should output 'Lorem ipsum...' due to wrap width being less than textSize width", function () {
            var mockTextRenderer = new TextRenderer(mockDrawContext);
            var wrappedText = mockTextRenderer.wrap(testText, 90, 16);
            expect(wrappedText).toEqual("Lorem ipsum...");
        });

        it("Should output every word on testText in different lines", function () {
            var mockTextRenderer = new TextRenderer(mockDrawContext);
            // Wrap line width less than textSize texture width
            var wrappedLines = mockTextRenderer.wrapLine(testText, 0);
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