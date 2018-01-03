/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define([
    './KmlElements',
    './KmlObject',
    './util/NodeTransformers'
], function (KmlElements,
             KmlObject,
             NodeTransformers) {
    "use strict";

    /**
     * Constructs an KmlOrientation. Applications usually don't call this constructor. It is called by {@link KmlFile}
     * as objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlOrientation
     * @classdesc Contains the data associated with Orientation node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing orientation in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#orientation
     * @augments KmlObject
     */
    var KmlOrientation = function (options) {
        KmlObject.call(this, options);
    };

    KmlOrientation.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlOrientation.prototype, {
        /**
         * Rotation about the z axis (normal to the Earth's surface). A value of 0 (the default) equals North. A
         * positive rotation is clockwise around the z axis and specified in degrees from 0 to 360.
         * @memberof KmlOrientation.prototype
         * @readonly
         * @type {Number}
         */
        kmlHeading: {
            get: function () {
                return this._factory.specific(this, {name: 'heading', transformer: NodeTransformers.number});
            }
        },

        /**
         * Rotation about the x axis. A positive rotation is clockwise around the x axis and specified in degrees
         * from 0 to 180.
         * @memberof KmlOrientation.prototype
         * @readonly
         * @type {Number}
         */
        kmlTilt: {
            get: function () {
                return this._factory.specific(this, {name: 'tilt', transformer: NodeTransformers.number});
            }
        },

        /**
         * Rotation about the y axis. A positive rotation is clockwise around the y axis and specified in degrees
         * from 0 to 180.
         * @memberof KmlOrientation.prototype
         * @readonly
         * @type {Number}
         */
        kmlRoll: {
            get: function () {
                return this._factory.specific(this, {name: 'roll', transformer: NodeTransformers.number});
            }
        }
    });

    /**
     * @inheritDoc
     */
    KmlOrientation.prototype.getTagNames = function () {
        return ['Orientation'];
    };

    KmlElements.addKey(KmlOrientation.prototype.getTagNames()[0], KmlOrientation);

    return KmlOrientation;
});