define([
    './WKTTokens'
], function (WKTTokens) {
    /**
     *
     * @param textRepresentation
     * @constructor
     */
    var WKTObjects = function (textRepresentation) {
        this.textRepresentation = textRepresentation;

        this.objects = null;
    };

    /**
     * It parses the received string and create the Objects, which then can be rendered.
     * @private
     * @return {WKTObject[]}
     */
    WKTObjects.prototype.parse = function () {
        return new WKTTokens(this.textRepresentation).objects();
    };

    /**
     * It renders all consequent objects in the text representation.
     * @inheritDoc
     */
    WKTObjects.prototype.render = function (dc) {
        if(!this.objects) {
            this.objects = this.parse();
        }

        this.objects.forEach(function (object) {
            object.render(dc);
        });
    };

    return WKTObjects;
});