/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define(['../error/ArgumentError',
        '../util/Logger'
    ],
    function (ArgumentError,
              Logger) {
        "use strict";

        /**
         * Constructs an Insets object that is a representation of the borders of a container.
         * It specifies the space that a container must leave at each of its edges.
         * @alias Insets
         * @param {Number} top The inset from the top.
         * @param {Number} left The inset from the left.
         * @param {Number} bottom The inset from the bottom.
         * @param {Number} right The inset from the right.
         * @constructor
         */
        var Insets = function (top, left, bottom, right) {

            if (arguments.length !== 4) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Insets", "constructor", "invalidArgumentCount"));
            }

            // These are all documented with their property accessors below.
            this._top = top;
            this._left = left;
            this._bottom = bottom;
            this._right = right;
        };

        /**
         * Set top, left, bottom, and right to the specified values.
         * @param {Number} top The inset from the top.
         * @param {Number} left The inset from the left.
         * @param {Number} bottom The inset from the bottom.
         * @param {Number} right The inset from the right.
         */
        Insets.prototype.set = function (top, left, bottom, right) {
            this._top = top;
            this._left = left;
            this._bottom = bottom;
            this._right = right;
        };

        /**
         * Creates a new copy of this insets with identical property values.
         * @returns {Insets} A new insets instance with its property values the same as this one's.
         */
        Insets.prototype.clone = function () {
            return new Insets(this._top, this._left, this._bottom, this._right);
        };

        /**
         * Returns a string representation of this object.
         * @returns {String} A string representation of this object.
         */
        Insets.prototype.toString = function () {
            return this._top + " " + this._left + " " + this._bottom + " " + this._right;
        };

        Object.defineProperties(Insets.prototype, {

            /**
             * Indicates the the inset from the top.
             * @type {Number}
             * @memberof Insets.prototype
             */
            top: {
                get: function () {
                    return this._top;
                },
                set: function (value) {
                    this._top = value;
                }
            },

            /**
             * Indicates the the inset from the left.
             * @type {Number}
             * @memberof Insets.prototype
             */
            left: {
                get: function () {
                    return this._left;
                },
                set: function (value) {
                    this._left = value;
                }
            },

            /**
             * Indicates the the inset from the bottom.
             * @type {Number}
             * @memberof Insets.prototype
             */
            bottom: {
                get: function () {
                    return this._bottom;
                },
                set: function (value) {
                    this._bottom = value;
                }
            },

            /**
             * Indicates the the inset from the right.
             * @type {Number}
             * @memberof Insets.prototype
             */
            right: {
                get: function () {
                    return this._right;
                },
                set: function (value) {
                    this._right = value;
                }
            }

        });

        return Insets;
    }
);