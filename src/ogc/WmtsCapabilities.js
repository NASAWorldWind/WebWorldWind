/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WmtsCapabilities
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../ogc/OwsLanguageString',
        '../ogc/OwsOperationsMetadata',
        '../ogc/OwsServiceIdentification',
        '../ogc/OwsServiceProvider',
        '../ogc/WmsCapabilities',
        '../ogc/WmtsLayerCapabilities'
    ],
    function (ArgumentError,
              Logger,
              OwsLanguageString,
              OwsOperationsMetadata,
              OwsServiceIdentification,
              OwsServiceProvider,
              WmsCapabilities,
              WmtsLayerCapabilities) {
        "use strict";

        /**
         * Constructs an OGC WMTS capabilities document from an XML DOM.
         * @alias WmtsCapabilities
         * @constructor
         * @classdesc Represents an OGC WMTS capabilities document.
         * This object holds as properties all the fields specified in the OGC WMTS capabilities document.
         * Most fields can be accessed as properties named according to their document names converted to camel case.
         * For example, "serviceIdentification" and "contents".
         * @param {{}} xmlDom An XML DOM representing the OGC WMTS capabilities document.
         * @throws {ArgumentError} If the specified XML DOM is null or undefined.
         */
        var WmtsCapabilities = function (xmlDom) {
            if (!xmlDom) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsCapabilities", "constructor", "No XML DOM specified."));
            }

            this.assembleDocument(xmlDom);
        };

        WmtsCapabilities.prototype.assembleDocument = function (dom) {
            var root = dom.documentElement;

            this.version = root.getAttribute("version");
            this.updateSequence = root.getAttribute("updateSequence");

            var children = root.children || root.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "ServiceIdentification") {
                    this.serviceIdentification = new OwsServiceIdentification(child);
                } else if (child.localName === "ServiceProvider") {
                    this.serviceProvider = new OwsServiceProvider(child);
                } else if (child.localName === "OperationsMetadata") {
                    this.operationsMetadata = new OwsOperationsMetadata(child);
                } else if (child.localName === "Contents") {
                    this.contents = this.assembleContents(child);
                }
                // TODO: Themes
            }

            this.resolveTileMatrixSetLinks();
        };

        WmtsCapabilities.prototype.assembleContents = function (element) {
            var contents = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Layer") {
                    contents.layer = contents.layer || [];
                    try {
                        contents.layer.push(new WmtsLayerCapabilities(child, this));
                    } catch (e) {
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsCapabilities", "constructor",
                            "Exception reading WMTS layer description: " + e.message);
                    }
                } else if (child.localName === "TileMatrixSet") {
                    contents.tileMatrixSet = contents.tileMatrixSet || [];
                    try {
                        contents.tileMatrixSet.push(WmtsCapabilities.assembleTileMatrixSet(child));
                    } catch (e) {
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsCapabilities", "constructor",
                            "Exception reading WMTS tile matrix set description: " + e.message);
                    }
                }
                // TODO: OtherSource
            }

            return contents;
        };

        WmtsCapabilities.assembleTileMatrixSet = function (element) {
            var tileMatrixSet = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Identifier") {
                    tileMatrixSet.identifier = child.textContent;
                } else if (child.localName === "SupportedCRS") {
                    tileMatrixSet.supportedCRS = child.textContent;
                } else if (child.localName === "WellKnownScaleSet") {
                    tileMatrixSet.wellKnownScaleSet = child.textContent;
                } else if (child.localName === "BoundingBox") {
                    tileMatrixSet.boundingBox = WmtsLayerCapabilities.assembleBoundingBox(child);
                } else if (child.localName === "TileMatrix") {
                    tileMatrixSet.tileMatrix = tileMatrixSet.tileMatrix || [];
                    tileMatrixSet.tileMatrix.push(WmtsCapabilities.assembleTileMatrix(child));
                } else if (child.localName === "Title") {
                    tileMatrixSet.title = tileMatrixSet.title || [];
                    tileMatrixSet.title.push(new OwsLanguageString(child));
                } else if (child.localName === "Abstract") {
                    tileMatrixSet.abstract = tileMatrixSet.abstract || [];
                    tileMatrixSet.abstract.push(new OwsLanguageString(child));
                }
                // TODO: Keywords
            }

            for (var i = 0; i < tileMatrixSet.tileMatrix.length; i++) {
                tileMatrixSet.tileMatrix[i].levelNumber = i;
            }

            return tileMatrixSet;
        };

        WmtsCapabilities.assembleTileMatrix = function (element) {
            var tileMatrix = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Identifier") {
                    tileMatrix.identifier = child.textContent;
                } else if (child.localName === "Title") {
                    tileMatrix.title = tileMatrixSet.title || [];
                    tileMatrix.title.push(new OwsLanguageString(child));
                } else if (child.localName === "Abstract") {
                    tileMatrix.abstract = tileMatrixSet.abstract || [];
                    tileMatrix.abstract.push(new OwsLanguageString(child));
                } else if (child.localName === "ScaleDenominator") {
                    tileMatrix.scaleDenominator = parseFloat(child.textContent);
                } else if (child.localName === "TileWidth") {
                    tileMatrix.tileWidth = parseFloat(child.textContent);
                } else if (child.localName === "TileHeight") {
                    tileMatrix.tileHeight = parseFloat(child.textContent);
                } else if (child.localName === "MatrixWidth") {
                    tileMatrix.matrixWidth = parseFloat(child.textContent);
                } else if (child.localName === "MatrixHeight") {
                    tileMatrix.matrixHeight = parseFloat(child.textContent);
                } else if (child.localName === "TopLeftCorner") {
                    var values = child.textContent.split(" ");
                    tileMatrix.topLeftCorner = [parseFloat(values[0]), parseFloat(values[1])];
                }

                // TODO: Keywords
            }

            return tileMatrix;
        };

        WmtsCapabilities.prototype.resolveTileMatrixSetLinks = function() {
            for (var i = 0; i < this.contents.layer.length; i++) {
                var layer = this.contents.layer[i];

                for (var j = 0; j < layer.tileMatrixSetLink.length; j++) {
                    var link = layer.tileMatrixSetLink[j];

                    for (var k = 0; k < this.contents.tileMatrixSet.length; k++) {
                        if (this.contents.tileMatrixSet[k].identifier === link.tileMatrixSet) {
                            link.tileMatrixSetRef = this.contents.tileMatrixSet[k];
                            break;
                        }
                    }
                }
            }
        };

        WmtsCapabilities.prototype.getGetTileKvpAddress = function () {
            for (var i = 0; i < this.operationsMetadata.operation.length; i++) {
                var operation = this.operationsMetadata.operation[i];

                if (operation.name === "GetTile") {
                    return operation.dcp[0].http.get[0].href;
                }
            }

            return null;
        };

        return WmtsCapabilities;
    })
;