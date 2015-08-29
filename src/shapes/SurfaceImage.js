/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports SurfaceImage
 * @version $Id: SurfaceImage.js 3023 2015-04-15 20:24:17Z tgaskins $
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../pick/PickedObject',
        '../render/SurfaceTile'
    ],
    function (ArgumentError,
              Logger,
              PickedObject,
              SurfaceTile) {
        "use strict";

        /**
         * Constructs a surface image shape for a specified sector and image path.
         * @alias SurfaceImage
         * @constructor
         * @augments SurfaceTile
         * @classdesc Represents an image drawn on the terrain.
         * @param {Sector} sector The sector spanned by this surface image.
         * @param {String|ImageSource} imageSource The image source of the image to draw on the terrain.
         * May be either a string identifying the URL of the image, or an {@link ImageSource} object identifying a
         * dynamically created image.
         * @throws {ArgumentError} If either the specified sector or image source is null or undefined.
         */
        var SurfaceImage = function (sector, imageSource) {
            if (!sector) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceImage", "constructor",
                    "missingSector"));
            }

            if (!imageSource) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceImage", "constructor",
                    "missingImage"));
            }

            SurfaceTile.call(this, sector);

            /**
             * Indicates whether this surface image is drawn.
             * @type {boolean}
             * @default true
             */
            this.enabled = true;

            /**
             * The path to the image.
             * @type {String}
             */
            this._imageSource = imageSource;

            /**
             * This surface image's opacity. When this surface image is drawn, the actual opacity is the product of
             * this opacity and the opacity of the layer containing this surface image.
             * @type {number}
             */
            this.opacity = 1;

            /**
             * This surface image's display name;
             * @type {string}
             */
            this.displayName = "Surface Image";

            // Internal. Indicates whether the image needs to be updated in the GPU resource cache.
            this.imageSourceWasUpdated = true;
        };

        SurfaceImage.prototype = Object.create(SurfaceTile.prototype);

        Object.defineProperties(SurfaceImage.prototype, {
            /**
             * The source of the image to display.
             * May be either a string identifying the URL of the image, or an {@link ImageSource} object identifying a
             * dynamically created image.
             * @type {String|ImageSource}
             * @default null
             * @memberof SurfaceImage.prototype
             */
            imageSource: {
                get: function () {
                    return this._imageSource;
                },
                set: function (imageSource) {
                    if (!imageSource) {
                        throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceImage", "imageSource",
                            "missingImage"));
                    }

                    this._imageSource = imageSource;
                    this.imageSourceWasUpdated = true;
                }
            }
        });

        SurfaceImage.prototype.bind = function (dc) {
            var texture = dc.gpuResourceCache.resourceForKey(this._imageSource);
            if (texture && !this.imageSourceWasUpdated) {
                return texture.bind(dc);
            } else {
                texture = dc.gpuResourceCache.retrieveTexture(dc.currentGlContext, this._imageSource);
                this.imageSourceWasUpdated = false;
                if (texture) {
                    return texture.bind(dc);
                }
            }
        };

        SurfaceImage.prototype.applyInternalTransform = function (dc, matrix) {
            // No need to apply the transform.
        };

        /**
         * Displays this surface image. Called by the layer containing this surface image.
         * @param {DrawContext} dc The current draw context.
         */
        SurfaceImage.prototype.render = function (dc) {
            if (!this.enabled || !this.sector.overlaps(dc.terrain.sector)) {
                return;
            }

            if (dc.pickingMode) {
                this.pickColor = dc.uniquePickColor();
            }

            dc.surfaceTileRenderer.renderTiles(dc, [this], this.opacity * dc.currentLayer.opacity);

            if (dc.pickingMode) {
                var po = new PickedObject(this.pickColor.clone(), this.pickDelegate ? this.pickDelegate : this,
                    null, this.layer, false);
                dc.resolvePick(po);
            }

            dc.currentLayer.inCurrentFrame = true;
        };

        return SurfaceImage;
    });