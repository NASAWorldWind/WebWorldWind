/**
 * @exports TmsCapabilities
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../ogc/TmsLayerCapabilities'
    ],
    function (ArgumentError,
              Logger,
              TmsLayerCapabilities) {
        "use strict";

        /**
         * Constructs an OGC TMS capabilities document from an XML DOM.
         * @alias TmsCapabilities
         * @constructor
         * @classdesc Represents an OGC TMS capabilities document.
         * This object holds as properties all the fields specified in the OGC TMS capabilities document.
         * Most fields can be accessed as properties named according to their document names converted to camel case.
         * For example, "serviceIdentification" and "contents".
         * @param {{}} xmlDom An XML DOM representing the OGC WMTS capabilities document.
         * @throws {ArgumentError} If the specified XML DOM is null or undefined.
         */
        var TmsCapabilities = function (xmlDom) {
            if (!xmlDom) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsCapabilities", "constructor", "No XML DOM specified."));
            }

            this.promises = [];
            this.assembleDocument(xmlDom);
        };

        TmsCapabilities.prototype.assembleDocument = function (dom) {
            var root = dom.documentElement;

            this.version = root.getAttribute("version");

            this.tileMaps = [];

            var children = root.children || root.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "TileMaps") {
                    this.assembleContents(child, this.tileMaps);
                }
            }
        };

        TmsCapabilities.prototype.assembleContents = function (element, tileMaps) {
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];


                if (child.localName === "TileMap") {

                    var index = this.promises.push($.Deferred());

                    var tileMap = new TmsLayerCapabilities(child, element, this.promises[index-1]);
                    tileMaps.push(tileMap);

                }


            }
        };

        return TmsCapabilities;
    });