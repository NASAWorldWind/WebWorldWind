/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../KmlElements',
    '../KmlObject',
    '../util/NodeTransformers'
], function (KmlElements,
             KmlObject,
             NodeTransformers) {
    "use strict";
    /**
     * Constructs an ImagePyramid. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * @alias ImagePyramid
     * @constructor
     * @classdesc Contains the data associated with Kml Image Pyramid
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Kml Image Pyramid.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#imagepyramid
     * @augments KmlObject
     */
    var ImagePyramid = function (options) {
        KmlObject.call(this, options);
    };

    ImagePyramid.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(ImagePyramid.prototype, {
        /**
         * Size of the tiles, in pixels. Tiles must be square, and &lt;tileSize&gt; must be a power of 2. A tile size of
         * 256
         * (the default) or 512 is recommended. The original image is divided into tiles of this size, at varying
         * resolutions.
         * @memberof ImagePyramid.prototype
         * @readonly
         * @type {Number}
         */
        kmlTileSize: {
            get: function () {
                return this._factory.specific(this, {name: 'tileSize', transformer: NodeTransformers.number});
            }
        },

        /**
         * Width in pixels of the original image.
         * @memberof ImagePyramid.prototype
         * @readonly
         * @type {Number}
         */
        kmlMaxWidth: {
            get: function () {
                return this._factory.specific(this, {name: 'maxWidth', transformer: NodeTransformers.number});
            }
        },

        /**
         * Height in pixels of the original image.
         * @memberof ImagePyramid.prototype
         * @readonly
         * @type {Number}
         */
        kmlMaxHeight: {
            get: function () {
                return this._factory.specific(this, {name: 'maxHeight', transformer: NodeTransformers.number});
            }
        },

        /**
         * Specifies where to begin numbering the tiles in each layer of the pyramid. A value of lowerLeft specifies
         * that row 1, column 1 of each layer is in the bottom left corner of the grid.
         * @memberof ImagePyramid.prototype
         * @readonly
         * @type {String}
         */
        kmlGridOrigin: {
            get: function () {
                return this._factory.specific(this, {name: 'gridOrigin', transformer: NodeTransformers.string});
            }
        }
    });

    /**
     * @inheritDoc
     */
    ImagePyramid.prototype.getTagNames = function () {
        return ['ImagePyramid'];
    };

    KmlElements.addKey(ImagePyramid.prototype.getTagNames()[0], ImagePyramid);

    return ImagePyramid;
});