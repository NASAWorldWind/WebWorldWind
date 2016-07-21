/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports ColladaAsset
 */

define([], function () {
    "use strict";

    /**
     * Constructs a ColladaAsset
     * @alias ColladaAsset
     * @constructor
     * @classdesc Represents a collada asset tag.
     * @param {XML} xmlDoc The raw XML data of the collada file.
     */
    var ColladaAsset = function (xmlDoc) {
        this.xmlAsset = xmlDoc.getElementsByTagName("asset")[0];
        this.asset = {
            daeVersion: xmlDoc.querySelector("COLLADA").getAttribute("version")
        };
    };

    /**
     * Parses the asset tag.
     * Internal. Applications should not call this function.
     */
    ColladaAsset.prototype.parse = function () {

        if (!this.xmlAsset) {
            return null;
        }

        for (var i = 0; i < this.xmlAsset.childNodes.length; i++) {

            var child = this.xmlAsset.childNodes.item(i);

            if (child.nodeType !== 1) {
                continue;
            }

            switch (child.nodeName) {
                case "contributor":
                    var tool = child.querySelector("authoring_tool");
                    if (tool) {
                        this.asset["authoring_tool"] = tool.textContext;
                    }
                    break;

                case "unit":
                    this.asset["unit"] = child.getAttribute("meter");
                    break;

                default:
                    this.asset[child.localName] = child.textContent;
                    break;
            }
        }

        this.xmlAsset = null;

        return this.asset;
    };

    return ColladaAsset;
});