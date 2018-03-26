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
 * @exports ImageSource
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