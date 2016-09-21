/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports Renderable
 * @version $Id: Renderable.js 2951 2015-03-31 23:31:08Z tgaskins $
 */
define([
        '../util/Logger',
        '../error/UnsupportedOperationError'
    ],
    function (Logger,
              UnsupportedOperationError) {
        "use strict";

        /**
         * Constructs a base renderable.
         * @alias Renderable
         * @constructor
         * @classdesc Represents a shape or other object that can be rendered. This is an abstract class and is not
         * meant to be instantiated directly.
         */
        var Renderable = function () {

            /**
             * The display name of the renderable.
             * @type {String}
             * @default "Renderable"
             */
            this.displayName = "Renderable";

            /**
             * Indicates whether to display this renderable.
             * @type {Boolean}
             * @default true
             */
            this.enabled = true;

            /**
             * Indicates the object to return as the userObject of this shape when picked. If null,
             * then this shape is returned as the userObject.
             * @type {Object}
             * @default null
             * @see  [PickedObject.userObject]{@link PickedObject#userObject}
             */
            this.pickDelegate = null;

            /**
             * An application defined object associated with this renderable. A typical use case is to associate
             * application defined data with a picked renderable.
             * @type {Object}
             * @default An empty object
             */
            this.userProperties = {};
        };

        /**
         * Render this renderable. Some shapes actually draw themselves during this call, others only add themselves
         * to the draw context's ordered rendering list for subsequent drawing when their renderOrdered method is called.
         * This method is intended to be called by layers such as {@link RenderableLayer} and not by applications.
         * @param {DrawContext} dc The current draw context.
         */
        Renderable.prototype.render = function (dc) {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "Renderable", "render", "abstractInvocation"));
        };

        return Renderable;
    });