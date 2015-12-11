/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports TextAttributes
 * @version $Id: TextAttributes.js 3295 2015-06-30 19:16:37Z tgaskins $
 */
define([
        '../util/Color',
        '../util/Font',
        '../util/Offset'
    ],
    function (Color,
              Font,
              Offset) {
        "use strict";

        /**
         * Constructs a text attributes bundle.
         * @alias TextAttributes
         * @constructor
         * @classdesc Holds attributes applied to [Text]{@link Text} shapes and [Placemark]{@link Placemark} labels.
         *
         * @param {TextAttributes} attributes Attributes to initialize this attributes instance to. May be null,
         * in which case the new instance contains default attributes.
         */
        var TextAttributes = function (attributes) {
            this._color = attributes ? attributes._color : new Color(1, 1, 1, 1);
            this._font = attributes ? attributes._font : new Font(14);
            this._offset = attributes ? attributes._offset
                : new Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.0);
            this._scale = attributes ? attributes._scale : 1;
            this._depthTest = attributes ? attributes._depthTest : false;

            /**
             * Indicates whether this object's state key is invalid. Subclasses must set this value to true when their
             * attributes change. The state key will be automatically computed the next time it's requested. This flag
             * will be set to false when that occurs.
             * @type {boolean}
             * @protected
             */
            this.stateKeyInvalid = true;
        };

        /**
         * Computes the state key for this attributes object. Subclasses that define additional attributes must
         * override this method, call it from that method, and append the state of their attributes to its
         * return value.
         * @returns {String} The state key for this object.
         * @protected
         */
        TextAttributes.prototype.computeStateKey = function () {
            return "c " + this._color.toHexString(true) +
                " f " + this._font.toString() +
                " o " + this._offset.toString() +
                " s " + this._scale +
                " dt " + this._depthTest;
        };

        Object.defineProperties(TextAttributes.prototype, {
            /**
             * A string identifying the state of this attributes object. The string encodes the current values of all
             * this object's properties. It's typically used to validate cached representations of shapes associated
             * with this attributes object.
             * @type {String}
             * @readonly
             * @memberof TextAttributes.prototype
             */
            stateKey: {
                get: function () {
                    if (this.stateKeyInvalid) {
                        this._stateKey = this.computeStateKey();
                        this.stateKeyInvalid = false;
                    }
                    return this._stateKey;
                }
            },

            /**
             * The text color.
             * @type {Color}
             * @default White (1, 1, 1, 1)
             * @memberof TextAttributes.prototype
             */
            color: {
                get: function () {
                    return this._color;
                },
                set: function (value) {
                    this._color = value;
                    this.stateKeyInvalid = true;
                }
            },

            /**
             * The text size, face and other characteristics, as described in [Font]{@link Font}.
             * @type {Font}
             * @default Those of [Font]{@link Font}, but with a font size of 14.
             * @memberof TextAttributes.prototype
             */
            font: {
                get: function () {
                    return this._font;
                },
                set: function (value) {
                    this._font = value;
                    this.stateKeyInvalid = true;
                }
            },

            /**
             * Indicates the location of the text relative to its specified position.
             * May be null, in which case the text's bottom-left corner is placed at the specified position.
             * @type {Offset}
             * @default 0.5, 0.0, both fractional (Places the text's horizontal center and vertical bottom at the
             * specified position.)
             * @memberof TextAttributes.prototype
             */
            offset: {
                get: function () {
                    return this._offset;
                },
                set: function (value) {
                    this._offset = value;
                    this.stateKeyInvalid = true;
                }
            },

            /**
             * Indicates the amount to scale the text. A value of 0 makes the text disappear.
             * @type {Number}
             * @default 1.0
             * @memberof TextAttributes.prototype
             */
            scale: {
                get: function () {
                    return this._scale;
                },
                set: function (value) {
                    this._scale = value;
                    this.stateKeyInvalid = true;
                }
            },

            /**
             * Indicates whether the text should be depth-tested against other objects in the scene. If true,
             * the text may be occluded by terrain and other objects in certain viewing situations. If false,
             * the text will not be occluded by terrain and other objects.
             * @type {Boolean}
             * @default false
             * @memberof TextAttributes.prototype
             */
            depthTest: {
                get: function () {
                    return this._depthTest;
                },
                set: function (value) {
                    this._depthTest = value;
                    this.stateKeyInvalid = true;
                }
            }
        });

        return TextAttributes;
    });