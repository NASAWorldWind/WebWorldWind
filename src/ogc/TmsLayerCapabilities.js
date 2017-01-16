/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports TmsLayerCapabilities
 * @version $Id: TmsLayerCapabilities.js
 */
define([
        '../error/ArgumentError',
        '../util/Logger'
    ],
    function (ArgumentError,
              Logger) {
        "use strict";

        /**
         * Constructs a TMS Layer instance from an XML DOM.
         * @alias TmsLayerCapabilities
         * @constructor
         * @classdesc Represents a TMS layer description from a TMS Capabilities document. This object holds all the
         * fields specified in the associated TMS Capabilities document.
         * @param {{}} layerElement A TMS Layer element describing the layer.
         * @param {{}} parentNode An object indicating the new layer object's parent object.
         * @param {{}} promise A promise object to show if the parsing is over.
         * @throws {ArgumentError} If the specified layer element is null or undefined.
         */
        var TmsLayerCapabilities = function (layerElement, parentNode, promise) {
            if (!layerElement) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TmsLayerCapabilities", "constructor",
                        "Layer element is null or undefined."));
            }

            this.title = layerElement.getAttribute("title");
            this.projection = layerElement.getAttribute("srs");
            this.profile = layerElement.getAttribute("profile");
            var url = layerElement.getAttribute("href").split("/");
            this.matrixSet = url[url.length-1].split("@")[1];
            this.layerName = url[url.length-1].split("@")[0];


            const layer = this;

            (function () {
                $.get(layerElement.getAttribute("href"), function(response) {
                    layer.assembleTileMap(response, layer, promise);
                });
            })();




        };

        TmsLayerCapabilities.prototype.assembleTileMap = function (response, tileMap, promise) {
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

            promise.resolve();

            return tileMap;
        };


        return TmsLayerCapabilities;
    }
)
;