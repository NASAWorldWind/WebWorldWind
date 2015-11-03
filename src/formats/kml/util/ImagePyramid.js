/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/extend',
    '../KmlElements',
    '../KmlObject'
], function (extend,
             KmlElements,
             KmlObject) {
    // TODO KmlSchema isn't actually descendant of the KmlObject. The relevant logic should be applied differently.
    "use strict";
    /**
     * Constructs an ImagePyramid. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * @alias ImagePyramid
     * @constructor
     * @classdesc Contains the data associated with Kml Image Pyramid
     * @param node {Node} Node representing the Kml Image Pyramid.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#imagepyramid
     */
    var ImagePyramid = function (node) {
        KmlObject.call(this, node);

        Object.defineProperties(this, {
            /**
             * Size of the tiles, in pixels. Tiles must be square, and <tileSize> must be a power of 2. A tile size of
             * 256
             * (the default) or 512 is recommended. The original image is divided into tiles of this size, at varying
             * resolutions.
             * @memberof ImagePyramid.prototype
             * @readonly
             * @type {Number}
             */
            tileSize: {
                get: function () {
                    return this.retrieve({name: 'tileSize', transformer: Number});
                }
            },

            /**
             * Width in pixels of the original image.
             * @memberof ImagePyramid.prototype
             * @readonly
             * @type {Number}
             */
            maxWidth: {
                get: function () {
                    return this.retrieve({name: 'maxWidth', transformer: Number});
                }
            },

            /**
             * Height in pixels of the original image.
             * @memberof ImagePyramid.prototype
             * @readonly
             * @type {Number}
             */
            maxHeight: {
                get: function () {
                    return this.retrieve({name: 'maxHeight', transformer: Number});
                }
            },

            /**
             * Specifies where to begin numbering the tiles in each layer of the pyramid. A value of lowerLeft specifies
             * that row 1, column 1 of each layer is in the bottom left corner of the grid.
             * @memberof ImagePyramid.prototype
             * @readonly
             * @type {String}
             */
            gridOrigin: {
                get: function () {
                    return this.retrieve({name: 'gridOrigin'});
                }
            }
        });

        extend(this, ImagePyramid.prototype);
    };

    /**
     * Returns tag name of this Node.
     * @returns {String[]}
     */
    ImagePyramid.prototype.getTagNames = function () {
        return ['ImagePyramid'];
    };

    KmlElements.addKey(ImagePyramid.prototype.getTagNames()[0], ImagePyramid);

    return ImagePyramid;
});