/**
 * @exports TmsCapabilities
 */
define([
        '../error/ArgumentError',
        '../util/Logger'
    ],
    function (ArgumentError,
              Logger) {
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
                var tileMap = {};
                this.promises.push($.Deferred());

                tileMaps.push(tileMap);

                if (child.localName === "TileMap") {
                    tileMap.title = child.getAttribute("title");
                    tileMap.projection = child.getAttribute("srs");
                    tileMap.profile = child.getAttribute("profile");
                    // tileMap.url = child.getAttribute("href");
                    var url = child.getAttribute("href").split("/");
                    tileMap.matrixSet = url[url.length-1].split("@")[1];
                    tileMap.layerName = url[url.length-1].split("@")[0];
                }

                const layer = this;
                const ind = c;

                (function () {
                    $.get(child.getAttribute("href"), ind, function(response) {
                        tileMaps[ind] = layer.assembleTileMap(response, tileMaps[ind], ind);
                    });
                })();
            }
        };

        TmsCapabilities.prototype.assembleTileMap = function (response, tileMap, ind) {
            var root = response.documentElement;
            tileMap.version = root.getAttribute("version");
            tileMap.url = root.getAttribute("tilemapservice");

            var children = root.children || root.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Title") {
                    tileMap.title = child.textContent;
                } else if (child.localName === "Abstract") {
                    tileMap.abstract = child.textContent;
                } else if (child.localName === "SRS") {
                    tileMap.projection = child.textContent;
                } else if (child.localName === "BoundingBox") {
                    tileMap.extent = [parseFloat(child.getAttribute("minx")), parseFloat(child.getAttribute("miny")), parseFloat(child.getAttribute("maxx")), parseFloat(child.getAttribute("maxy"))];
                } else if (child.localName === "Origin") {
                    tileMap.origin = [parseFloat(child.getAttribute("x")), parseFloat(child.getAttribute("y"))];
                } else if (child.localName === "TileFormat") {
                    tileMap.tileSize = parseInt(child.getAttribute("width"));
                    tileMap.imageFormat = child.getAttribute("mime-type");
                } else if (child.localName === "TileSets") {
                    tileMap.resolutions = [];

                    var children2 = child.children || child.childNodes;
                    for (var cc = 0; cc < children2.length; cc++) {
                        var child2 = children2[cc];
                        tileMap.resolutions.push(parseFloat(child2.getAttribute("units-per-pixel")));

                    }
                }
            }

            this.promises[ind].resolve();

            return tileMap;
        };

        return TmsCapabilities;
    });