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
        '../ogc/OwsDescription',
        '../ogc/OwsLanguageString',
        '../ogc/OwsOperationsMetadata',
        '../ogc/OwsServiceIdentification',
        '../ogc/OwsServiceProvider',
        '../ogc/WmsCapabilities',
        '../ogc/WmtsLayerCapabilities'
    ],
    function (ArgumentError,
              Logger,
              OwsDescription,
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
                } else if (child.localName === "Themes") {
                    this.themes = WmtsCapabilities.assembleThemes(child);
                } else if (child.localName === "ServiceMetadataURL") {
                    this.serviceMetadataUrls = this.serviceMetadataUrls || [];
                    this.serviceMetadataUrls.push(WmtsCapabilities.assembleServiceMetadataURL(child));
                }
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
            var tileMatrixSet = new OwsDescription(element);

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
                }
            }

            //TODO
            if (!isNaN(tileMatrixSet.tileMatrix[0].identifier)) {
                tileMatrixSet.tileMatrix.sort(function (a, b) {
                    return parseFloat(a.identifier) - parseFloat(b.identifier);
                })
            }

            for (var i = 0; i < tileMatrixSet.tileMatrix.length; i++) {
                tileMatrixSet.tileMatrix[i].levelNumber = i;
            }

            return tileMatrixSet;
        };

        WmtsCapabilities.assembleTileMatrix = function (element) {
            var tileMatrix = new OwsDescription(element);

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Identifier") {
                    tileMatrix.identifier = child.textContent;
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
            }

            return tileMatrix;
        };

        WmtsCapabilities.assembleThemes = function (element) {
            var themes;

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                if (child.localName === "Theme") {
                    themes = themes || [];
                    themes.push(WmtsCapabilities.assembleTheme(child));
                }
            }

            return themes;
        };

        WmtsCapabilities.assembleTheme = function (element) {
            var theme = new OwsDescription(element);

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Identifier") {
                    theme.identifier = child.textContent;
                } else if (child.localName === "LayerRef") {
                    theme.layerRef = theme.layerRef || [];
                    theme.layerRef.push(child.textContent);
                } else if (child.localName === "Theme") {
                    theme.themes = theme.themes || [];
                    theme.themes.push(WmtsCapabilities.assembleTheme(child));
                }
            }

            return theme;
        };

        WmtsCapabilities.assembleServiceMetadataURL = function (element) {
            var result = {};

            var link = element.getAttribute("xlink:href");
            if (link) {
                result.url = link;
            }

            return result;
        };

        WmtsCapabilities.prototype.resolveTileMatrixSetLinks = function () {
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
                    return operation.dcp[0].getMethods[0].url;
                }
            }

            return null;
        };

        return WmtsCapabilities;
    })
;