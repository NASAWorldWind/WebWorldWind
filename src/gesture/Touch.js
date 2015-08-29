/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports Touch
 * @version $Id: Touch.js 3221 2015-06-19 22:55:04Z dcollins $
 */
define([],
    function () {
        "use strict";

        /**
         * Constructs a touch point.
         * @alias Touch
         * @constructor
         * @classdesc Represents a touch point.
         * @param {Color} identifier A number uniquely identifying the touch point
         * @param {Number} clientX The X coordinate of the touch point's location.
         * @param {Number} clientY The Y coordinate of the touch point's location.
         */
        var Touch = function (identifier, clientX, clientY) {

            /**
             * A number uniquely identifying this touch point.
             * @type {Number}
             * @readonly
             */
            this.identifier = identifier;

            // Intentionally not documented.
            this._clientX = clientX;

            // Intentionally not documented.
            this._clientY = clientY;

            // Intentionally not documented.
            this._clientStartX = clientX;

            // Intentionally not documented.
            this._clientStartY = clientY;
        };

        Object.defineProperties(Touch.prototype, {
            /**
             * Indicates the X coordinate of this touch point's location.
             * @type {Number}
             * @memberof Touch.prototype
             */
            clientX: {
                get: function () {
                    return this._clientX;
                },
                set: function (value) {
                    this._clientX = value;
                }
            },

            /**
             * Indicates the Y coordinate of this touch point's location.
             * @type {Number}
             * @memberof Touch.prototype
             */
            clientY: {
                get: function () {
                    return this._clientY;
                },
                set: function (value) {
                    this._clientY = value;
                }
            },

            /**
             * Indicates this touch point's translation along the X axis since the touch started.
             * @type {Number}
             * @memberof Touch.prototype
             */
            translationX: {
                get: function () {
                    return this._clientX - this._clientStartX;
                },
                set: function (value) {
                    this._clientStartX = this._clientX - value;
                }
            },

            /**
             * Indicates this touch point's translation along the Y axis since the touch started.
             * @type {Number}
             * @memberof Touch.prototype
             */
            translationY: {
                get: function () {
                    return this._clientY - this._clientStartY;
                },
                set: function (value) {
                    this._clientStartY = this._clientY - value;
                }
            }
        });

        return Touch;
    });