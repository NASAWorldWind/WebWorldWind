/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports ImageSource
 * @version $Id: ImageSource.js 3023 2015-04-15 20:24:17Z tgaskins $
 */
define([
        '../error/ArgumentError',
        '../util/Color',
        '../util/Logger'
    ],
    function (ArgumentError,
              Color,
              Logger) {
        "use strict";

        /**
         * Constructs an image source.
         * @alias ImageSource
         * @constructor
         * @classdesc Holds an Image with an associated key that uniquely identifies that image. The key is
         * automatically generated but may be reassigned after construction. Instances of this class are used to
         * specify dynamically created image sources for {@link Placemark}, {@link SurfaceImage},
         * {@link Polygon} textures and other shapes that display imagery.
         * @param {Image} image The image for this image source.
         * @throws {ArgumentError} If the specified image is null or undefined.
         */
        var ImageSource = function (image) {
            if (!image) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ImageSource", "constructor",
                    "missingImage"));
            }

            /**
             * This image source's image
             * @type {Image}
             * @readonly
             */
            this.image = image;

            /**
             * This image source's key. A unique key is automatically generated and assigned during construction.
             * Applications may assign a different key after construction.
             * @type {String}
             * @default A unique string for this image source.
             */
            this.key = "ImageSource " + ++ImageSource.keyPool;
        };

        // Internal. Intentionally not documented.
        ImageSource.keyPool = 0; // source of unique ids

        return ImageSource;
    }
);