/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports SurfaceRenderable
 * @version $Id: SurfaceRenderable.js 3351 2015-07-28 22:03:20Z dcollins $
 */
define(['../util/Logger',
        '../error/UnsupportedOperationError'
    ],
    function (Logger,
              UnsupportedOperationError) {
        "use strict";

        /**
         * Applications must not call this constructor. It is an interface class and is not meant to be instantiated
         * directly.
         * @alias SurfaceRenderable
         * @constructor
         * @classdesc Represents a surface renderable.
         * This is an interface class and is not meant to be instantiated directly.
         */
        var SurfaceRenderable = function () {

            /**
             * This surface renderable's display name.
             * @type {String}
             * @default Renderable
             */
            this.displayName = "Renderable";

            /**
             * Indicates whether this surface renderable is enabled.
             * @type {Boolean}
             * @default true
             */
            this.enabled = true;

            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceRenderable", "constructor", "abstractInvocation"));
        };

        /**
         * Renders this surface renderable.
         * @param {DrawContext} dc The current draw context.
         */
        SurfaceRenderable.prototype.renderSurface = function (dc) {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceRenderable", "renderSurface", "abstractInvocation"));
        };

        return SurfaceRenderable;
    });