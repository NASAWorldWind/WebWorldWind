/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
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