/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WmtsLayerCapabilities
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../ogc/OwsLanguageString',
        '../ogc/WmsCapabilities'
    ],
    function (ArgumentError,
              Logger,
              OwsLanguageString,
              WmsCapabilities) {
        "use strict";

        /**
         * Constructs an WMTS Layer instance from an XML DOM.
         * @alias WmtsLayerCapabilities
         * @constructor
         * @classdesc Represents a WMTS layer description from a WMTS Capabilities document. This object holds all the
         * fields specified in the associated WMTS Capabilities document.
         * @param {{}} layerElement A WMTS Layer element describing the layer.
         * @param {{}} capabilities The WMTS capabilities documented containing this layer.
         * @throws {ArgumentError} If the specified layer element is null or undefined.
         */
        var WmtsLayerCapabilities = function (layerElement, capabilities) {
            if (!layerElement) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmtsLayerCapabilities", "constructor", "missingDomElement"));
            }

            /**
             * This layer's WMTS capabilities document, as specified to the constructor of this object.
             * @type {{}}
             * @readonly
             */
            this.capabilities = capabilities;

            /**
             * The identifier of this layer description.
             * @type {String}
             * @readonly
             */
            this.identifier;

            /**
             * The titles of this layer.
             * @type {String[]}
             * @readonly
             */
            this.title;

            /**
             * The abstracts of this layer.
             * @type {String[]}
             * @readonly
             */
            this.abstract;

            /**
             * The list of keywords associated with this layer description.
             * @type {String[]}
             * @readonly
             */
            this.keywords;

            /**
             * The WGS84 bounding box associated with this layer. The returned object has the following properties:
             * "lowerCorner", "upperCorner".
             * @type {{}}
             * @readonly
             */
            this.wgs84BoundingBox;

            /**
             * The bounding boxes associated with this layer. The returned array contains objects with the following
             * properties: TODO
             * @type {Object[]}
             * @readonly
             */
            this.boundingBox;

            /**
             * The list of styles associated with this layer description, accumulated from this layer and its parent
             * layers. Each object returned may have the following properties: name {String}, title {String},
             * abstract {String}, legendUrls {Object[]}, styleSheetUrl, styleUrl. Legend urls may have the following
             * properties: width, height, format, url. Style sheet urls and style urls have the following properties:
             * format, url.
             * @type {Object[]}
             * @readonly
             */
            this.styles;

            /**
             * The formats supported by this layer.
             * @type {String[]}
             * @readonly
             */
            this.formats;

            /**
             * The Feature Info formats supported by this layer.
             * @type {String[]}
             * @readonly
             */
            this.infoFormat;

            /**
             * The dimensions associated with this layer. The returned array contains objects with the following
             * properties: TODO
             */
            this.dimension;

            /**
             * The metadata associated with this layer description. Each object in the returned array has the
             * following properties: type, format, url.
             * @type {Object[]}
             * @readonly
             */
            this.metadata;

            /**
             * The tile matris sets associated with this layer.
             * @type {Object[]}
             * @readonly
             */
            this.tileMatrixSetLink;

            /**
             * The resource URLs associated with this layer description. Each object in the returned array has the
             * following properties: format, url.
             * @type {Object[]}
             * @readonly
             */
            this.resourceUrl;

            this.assembleLayer(layerElement);
        };

        WmtsLayerCapabilities.prototype.assembleLayer = function (element) {
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Identifier") {
                    this.identifier = child.textContent;
                } else if (child.localName === "Title") {
                    this.title = this.title || [];
                    this.title.push(new OwsLanguageString(child));
                } else if (child.localName === "Abstract") {
                    this.abstract = this.abstract || [];
                    this.abstract.push(new OwsLanguageString(child));
                } else if (child.localName === "WGS84BoundingBox") {
                    this.wgs84BoundingBox = WmtsLayerCapabilities.assembleBoundingBox(child);
                } else if (child.localName === "BoundingBox") {
                    this.boundingBox = this.boundingBox || [];
                    this.boundingBox.push(WmtsLayerCapabilities.assembleBoundingBox(child));
                } else if (child.localName === "Style") {
                    this.style = this.style || [];
                    this.style.push(WmtsLayerCapabilities.assembleStyle(child));
                } else if (child.localName === "Format") {
                    this.format = this.format || [];
                    this.format.push(child.textContent);
                } else if (child.localName === "InfoFormat") {
                    this.infoFormat = this.infoFormat || [];
                    this.infoFormat.push(child.textContent);
                } else if (child.localName === "Dimension") {
                    this.dimension = this.dimension || [];
                    this.dimension.push(WmtsLayerCapabilities.assembleDimension(child));
                } else if (child.localName === "Metadata") {
                    this.metadata = this.metadata || [];
                    this.metadata.push(WmtsLayerCapabilities.assembleMetadata(child));
                } else if (child.localName === "ResourceURL") {
                    this.resourceUrl = this.resourceUrl || [];
                    this.resourceUrl.push(WmtsLayerCapabilities.assembleResourceUrl(child));
                } else if (child.localName === "TileMatrixSetLink") {
                    this.tileMatrixSetLink = this.tileMatrixSetLink || [];
                    this.tileMatrixSetLink.push(WmtsLayerCapabilities.assembleTileMatrixSetLink(child));
                }
                // TODO: Keywords
            }

        };

        WmtsLayerCapabilities.assembleStyle = function (element) {
            var result = {};

            result.isDefault = element.getAttribute("isDefault");

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Identifier") {
                    result.identifier = child.textContent;
                } else if (child.localName === "Title") {
                    result.title = result.title || [];
                    result.title.push(new OwsLanguageString(child));
                } else if (child.localName === "Abstract") {
                    result.abstract = result.abstract || [];
                    result.abstract.push(new OwsLanguageString(child));
                } else if (child.localName === "LegendURL") {
                    result.legendUrl = result.legendUrl || [];
                    result.legendUrl.push(WmtsLayerCapabilities.assembleLegendUrl(child));
                }
                // TODO: keywords
            }

            return result;
        };

        WmtsLayerCapabilities.assembleBoundingBox = function (element) {
            var result = {};

            var crs = element.getAttribute("crs");
            if (crs) {
                result.crs = crs;
            }

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "LowerCorner") {
                    var lc = child.textContent.split(" ");
                    result.lowerCorner = [parseFloat(lc[0]), parseFloat(lc[1])];
                } else if (child.localName === "UpperCorner") {
                    var uc = child.textContent.split(" ");
                    result.upperCorner = [parseFloat(uc[0]), parseFloat(uc[1])];
                }
            }

            return result;
        };

        WmtsLayerCapabilities.assembleDimension = function (element) {
            var result = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Identifier") {
                    result.identifier = child.textContent;
                } else if (child.localName === "Title") {
                    result.title = result.title || [];
                    result.title.push(new OwsLanguageString(child));
                } else if (child.localName === "Abstract") {
                    result.abstract = result.abstract || [];
                    result.abstract.push(new OwsLanguageString(child));
                } else if (child.localName === "UOM") {
                    result.uom = {
                        name: child.getAttribute("name"),
                        reference: child.getAttribute("reference")
                    }
                } else if (child.localName == "UnitSymbol") {
                    result.unitSymbol = child.textContent;
                } else if (child.localName === "Default") {
                    result.default = child.textContent;
                } else if (child.localName === "Current") {
                    result.current = (child.textContent === "true");
                } else if (child.localName === "Value") {
                    result.value = result.value || [];
                    result.value.push(child.textContent);
                }
            }

            return result;
        };

        WmtsLayerCapabilities.assembleMetadata = function (element) { // TODO
            var result = {};

            return result;
        };

        WmtsLayerCapabilities.assembleResourceUrl = function (element) {
            var result = {};

            result.format = element.getAttribute("format");
            result.resourceType = element.getAttribute("resourceType");
            result.template = element.getAttribute("template");

            return result;
        };

        WmtsLayerCapabilities.assembleLegendUrl = function (element) {
            var result = {};

            result.format = element.getAttribute("format");
            result.minScaleDenominator = element.getAttribute("minScaleDenominator");
            result.maxScaleDenominator = element.getAttribute("maxScaleDenominator");
            result.href = element.getAttribute("xlink:href");
            result.width = element.getAttribute("width");
            result.height = element.getAttribute("height");

            return result;
        };

        WmtsLayerCapabilities.assembleTileMatrixSetLink = function (element) {
            var result = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "TileMatrixSet") {
                    result.tileMatrixSet = child.textContent;
                } else if (child.localName === "TileMatrixSetLimits") {
                    result.tileMatrixSetLimits = WmtsLayerCapabilities.assembleTileMatrixSetLimits(child);
                }
            }

            return result;
        };

        WmtsLayerCapabilities.assembleTileMatrixSetLimits = function (element) {
            var result = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "TileMatrixLimits") {
                    result.tileMatrixLimits = result.tileMatrixLimits || [];
                    result.tileMatrixLimits.push(WmtsLayerCapabilities.assembleTileMatrixLimits(child));
                }
            }

            return result;
        };

        WmtsLayerCapabilities.assembleTileMatrixLimits = function (element) {
            var result = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "TileMatrix") {
                    result.tileMatrix = child.textContent;
                } else if (child.localName === "MinTileRow") {
                    result.minTileRow = parseInt(child.textContent);
                } else if (child.localName === "MaxTileRow") {
                    result.maxTileRow = parseInt(child.textContent);
                } else if (child.localName === "MinTileCol") {
                    result.minTileCol = parseInt(child.textContent);
                } else if (child.localName === "maxTileCol") {
                    result.maxTileCol = parseInt(child.textContent);
                }
            }

            return result;
        };

        return WmtsLayerCapabilities;
    }
);