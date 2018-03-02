/*
* Copyright 2015-2017 WorldWind Contributors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
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

        /**
         * Constructs a control point marker.
         * @alias ControlPointMarker
         * @constructor
         * @classdesc A visual marker with position and purpose (scope).
         * @param {Position} position  The control point's position.
         * @param {PlacemarkAttributes} attributes  The control point's attributes.
         * @param {Number} id The control point's ID.
         * @param {string} purpose The control point's purpose.
         * @throws {ArgumentError} If the specified position, id or purpose is null or undefined.
         */
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

            // Documented in defineProperties below.
            this._id = id;

            // Documented in defineProperties below.
            this._purpose = purpose;

            // Documented in defineProperties below.
            this._size = null;

            // Documented in defineProperties below.
            this._rotation = null;
        };

        ControlPointMarker.prototype = Object.create(Placemark.prototype);

        Object.defineProperties(ControlPointMarker.prototype, {
            /**
             * The control point's ID, which is typically its array index when the shape has an array of locations.
             * @memberof ControlPointMarker.prototype
             * @type {Number}
             * @readonly
             */
            id: {
                get: function () {
                    return this._id;
                }
            },
            /**
             * Indicates the feature the control point affects.
             * @memberof ControlPointMarker.prototype
             * @type {string}
             * @readonly
             */
            purpose: {
                get: function () {
                    return this._purpose;
                }
            },
            /**
             * Indicates size (in meters) if this control point affects a size of the shape, otherwise null.
             * @memberof ControlPointMarker.prototype
             * @type {Number}
             */
            size: {
                get: function () {
                    return this._size;
                },
                set: function (value) {
                    this._size = value;
                }
            },

            /**
             * Indicates angle if this control point affects an angle associated with the shape, otherwise null.
             * @memberof ControlPointMarker.prototype
             * @type {Number}
             */
            rotation: {
                get: function () {
                    return this._rotation;
                },
                set: function (value) {
                    this._rotation = value;
                }
            }
        });

        // Control points purposes

        // Indicates that a control point is associated with annotation.
        ControlPointMarker.ANNOTATION = "annotation";

        // Indicates a control point is associated with a location.
        ControlPointMarker.LOCATION = "location";

        // Indicates that a control point is associated with whole-shape rotation.
        ControlPointMarker.ROTATION = "rotation";

        // Indicates that a control point is associated with width change.
        ControlPointMarker.WIDTH = "width";

        // Indicates that a control point is associated with height change.
        ControlPointMarker.HEIGHT = "height";

        // Indicates that a control point is associated with the right width of a shape.
        ControlPointMarker.RIGHT_WIDTH = "rightWidth";

        // Indicates that a control point is associated with the outer radius of a shape.
        ControlPointMarker.OUTER_RADIUS = "outerRadius";

        return ControlPointMarker;
    });