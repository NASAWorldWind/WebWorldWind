/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports ControlPointMarker
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../shapes/Placemark'
    ],
    function (ArgumentError,
              Logger,
              Placemark) {
        "use strict";

        var ControlPointMarker = function (position, attributes, id, purpose) {
            if (!position) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ControlPointMarker", "constructor", "missingPosition"));
            }

            if (id === null || id === undefined) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ControlPointMarker", "constructor", "missingId"));
            }

            if (!purpose) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ControlPointMarker", "constructor", "missingPurpose"));
            }

            Placemark.call(this, position, false, attributes);

            this._id = id;

            this._purpose = purpose;

            this._size = null;

            this._rotation = null;
        };

        ControlPointMarker.prototype = Object.create(Placemark.prototype);

        Object.defineProperties(ControlPointMarker.prototype, {
            id: {
                get: function () {
                    return this._id;
                }
            },
            purpose: {
                get: function () {
                    return this._purpose;
                }
            },
            size: {
                get: function () {
                    return this._size;
                },
                set: function(value) {
                    this._size = value;
                }
            },
            rotation: {
                get: function () {
                    return this._rotation;
                },
                set: function(value) {
                    this._rotation = value;
                }
            }
        });

        //Control points purposes
        ControlPointMarker.ANNOTATION = "annotation";
        ControlPointMarker.LOCATION = "location";
        ControlPointMarker.ROTATION = "rotation";
        ControlPointMarker.WIDTH = "width";
        ControlPointMarker.HEIGHT = "height";
        ControlPointMarker.RIGHT_WIDTH = "rightWidth";
        ControlPointMarker.OUTER_RADIUS = "outerRadius";

        return ControlPointMarker;
    });
