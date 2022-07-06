/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
/**
 * @exports ColladaImage
 */

define(['./ColladaUtils'],function(ColladaUtils){
    "use strict";

    /**
     * Constructs a ColladaImage
     * @alias ColladaImage
     * @constructor
     * @classdesc Represents a collada image tag.
     * @param {String} imageId The id of an image node
     * @param {String} imageName The name of an image node
     */
    var ColladaImage = function (imageId, imageName) {
        this.filename = '';
        this.map = imageId;
        this.name = imageName;
        this.path = '';
    };

    /**
     * Parses the images of a collada file.
     * Internal. Applications should not call this function.
     * @param {Node} element An image node
     */
    ColladaImage.prototype.parse = function (element) {

        for (var i = 0; i < element.childNodes.length; i++) {

            var child = element.childNodes[i];

            if (child.nodeType !== 1) {
                continue;
            }

            switch (child.nodeName){

                case 'init_from':

                    this.filename = ColladaUtils.getFilename(child.textContent);
                    this.path = child.textContent;

                    break;

                default:
                    break;
            }
        }

        return this;

    };

    return ColladaImage;
});