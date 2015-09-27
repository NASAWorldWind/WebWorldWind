/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
        '../util/Color',
        '../util/Font',
        '../geom/Vec2'
    ],
    function (Color,
              Font,
              Vec2) {
        "use strict";

        var AnnotationAttributes = function (attributes) {
                this._offset = attributes ? attributes._offset
                    : new Vec2(1, 1);
                this._cornerRadius = attributes ? attributes._cornerRadius : 0;

            this._insetLeft = attributes ? attributes._insetLeft : 2;
            this._insetRight = attributes ? attributes._insetRight : 2;
            this._insetTop = attributes ? attributes._insetTop : 2;
            this._insetBottom = attributes ? attributes._insetBottom : 2;

            this._backgroundColor = attributes ? attributes._backgroundColor : Color.WHITE;
            this._leaderGapWidth = attributes ? attributes._leaderGapWidth : 40;
            this._opacity = attributes ? attributes._opacity : 1;
            this._scale = attributes ? attributes._scale : 1;
            this._textColor = attributes ? attributes._textColor : new Color(1, 1, 1, 1);
        };

        AnnotationAttributes.prototype.setInsets = function(left, right, top, bottom){
            this._insetLeft = left;
            this._insetRight = right;
            this._insetTop = top;
            this._insetBottom = bottom;
        };

        Object.defineProperties(AnnotationAttributes.prototype, {

            offset: {
                get: function () {
                    return this._offset;
                },
                set: function (value) {
                    this._offset = value;
                }
            },
            cornerRadius: {
                get: function () {
                    return this._cornerRadius;
                },
                set: function (value) {
                    this._cornerRadius = value;
                }
            },
            insetLeft: {
                get: function () {
                    return this._insetLeft;
                },
                set: function (value) {
                    this._insetLeft = value;
                }
            },
            insetRight: {
                get: function () {
                    return this._insetRight;
                },
                set: function (value) {
                    this._insetRight = value;
                }
            },
            insetTop: {
                get: function () {
                    return this._insetTop;
                },
                set: function (value) {
                    this._insetTop = value;
                }
            },
            insetBottom: {
                get: function () {
                    return this._insetBottom;
                },
                set: function (value) {
                    this._insetBottom = value;
                }
            },
            backgroundColor: {
                get: function () {
                    return this._backgroundColor;
                },
                set: function (value) {
                    this._backgroundColor = value;
                }
            },
            textColor: {
                get: function () {
                    return this._textColor;
                },
                set: function (value) {
                    this._textColor = value;
                }
            },
            drawLeader: {
                get: function () {
                    return this._drawLeader;
                },
                set: function (value) {
                    this._drawLeader = value;
                }
            },
            leaderGapWidth: {
                get: function () {
                    return this._leaderGapWidth;
                },
                set: function (value) {
                    this._leaderGapWidth = value;
                }
            },
            opacity: {
                get: function () {
                    return this._opacity;
                },
                set: function (value) {
                    this._opacity = value;
                }
            },
            scale: {
                get: function () {
                    return this._scale;
                },
                set: function (value) {
                    this._scale = value;
                }
            }
        });

        return AnnotationAttributes;
    })
;