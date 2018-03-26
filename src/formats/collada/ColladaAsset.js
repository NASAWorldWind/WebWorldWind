/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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