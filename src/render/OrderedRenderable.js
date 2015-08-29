/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OrderedRenderable
 * @version $Id: OrderedRenderable.js 2694 2015-01-28 02:19:33Z tgaskins $
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
         * @alias OrderedRenderable
         * @constructor
         * @classdesc Represents an ordered renderable.
         * This is an interface class and is not meant to be instantiated directly.
         */
        var OrderedRenderable = function () {

            /**
             * This ordered renderable's display name.
             * @type {String}
             * @default Renderable
             */
            this.displayName = "Renderable";

            /**
             * Indicates whether this ordered renderable is enabled.
             * @type {Boolean}
             * @default true
             */
            this.enabled = true;

            /**
             * This ordered renderable's distance from the eye point in meters.
             * @type {Number}
             * @default Number.MAX_VALUE
             */
            this.eyeDistance = Number.MAX_VALUE;

            /**
             * The time at which this ordered renderable was inserted into the ordered rendering list.
             * @type {Number}
             * @default 0
             */
            this.insertionTime = 0;

            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "OrderedRenderable", "constructor", "abstractInvocation"));
        };

        /**
         * Renders this ordered renderable.
         * @param {DrawContext} dc The current draw context.
         */
        OrderedRenderable.prototype.renderOrdered = function (dc) {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "OrderedRenderable", "renderOrdered", "abstractInvocation"));
        };

        return OrderedRenderable;
    })
;