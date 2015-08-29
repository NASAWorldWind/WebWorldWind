/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports RenderableLayer
 * @version $Id: RenderableLayer.js 3334 2015-07-22 19:15:43Z tgaskins $
 */
define([
        '../error/ArgumentError',
        '../layer/Layer',
        '../util/Logger'
    ],
    function (ArgumentError,
              Layer,
              Logger) {
        "use strict";

        /**
         * Constructs a layer that contains shapes and other renderables.
         * @alias RenderableLayer
         * @constructor
         * @augments Layer
         * @classdesc Provides a layer that contains shapes and other renderables.
         * @param {String} displayName This layer's display name.
         */
        var RenderableLayer = function (displayName) {
            Layer.call(this, displayName);

            /**
             * The array of renderables;
             * @type {Array}
             * @readonly
             */
            this.renderables = [];
        };

        RenderableLayer.prototype = Object.create(Layer.prototype);

        /**
         * Adds a renderable to this layer.
         * @param {Renderable} renderable The renderable to add.
         * @throws {ArgumentError} If the specified renderable is null or undefined.
         */
        RenderableLayer.prototype.addRenderable = function (renderable) {
            if (!renderable) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "RenderableLayer", "addRenderable",
                    "missingRenderable"));
            }

            this.renderables.push(renderable);
        };

        /**
         * Adds an array of renderables to this layer.
         * @param {Renderable[]} renderables The renderables to add.
         * @throws {ArgumentError} If the specified renderables array is null or undefined.
         */
        RenderableLayer.prototype.addRenderables = function (renderables) {
            if (!renderables) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "RenderableLayer", "addRenderables",
                    "The renderables array is null or undefined."));
            }

            for (var i = 0, len = renderables.length; i < len; i++) {
                this.addRenderable(renderables[i]);
            }
        };

        /**
         * Removes a renderable from this layer.
         * @param {Renderable} renderable The renderable to remove.
         */
        RenderableLayer.prototype.removeRenderable = function (renderable) {
            var index = this.renderables.indexOf(renderable);
            if (index >= 0) {
                this.renderables.splice(index, 1);
            }
        };

        /**
         * Removes all renderables from this layer. Does not call dispose on those renderables.
         */
        RenderableLayer.prototype.removeAllRenderables = function () {
            this.renderables = [];
        };

        // Documented in superclass.
        RenderableLayer.prototype.doRender = function (dc) {
            var numOrderedRenderablesAtStart = dc.orderedRenderables.length;

            for (var i = 0, len = this.renderables.length; i < len; i++) {
                try {
                    this.renderables[i].render(dc);
                } catch (e) {
                    Logger.logMessage(Logger.LEVEL_SEVERE, "RenderableLayer", "doRender",
                        "Error while rendering shape " + this.renderables[i].displayName + ".\n" + e.toString());
                    // Keep going. Render the rest of the shapes.
                }
            }

            if (dc.orderedRenderables.length > numOrderedRenderablesAtStart) {
                this.inCurrentFrame = true;
            }
        };

        return RenderableLayer;
    });