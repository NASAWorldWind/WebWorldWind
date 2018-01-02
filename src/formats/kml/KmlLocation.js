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
], function (
    KmlElements,
    KmlObject, 
    NodeTransformers
) {
    "use strict";

    /**
     * Constructs an KmlLocation. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlLocation
     * @classdesc Contains the data associated with Location node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing location in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#location
     * @augments KmlObject
     */
    var KmlLocation = function (options) {
        KmlObject.call(this, options);
    };

    KmlLocation.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlLocation.prototype, {
        /**
         * Longitude of the location.
         * @memberof KmlLocation.prototype
         * @readonly
         * @type {String}
         */
        kmlLongitude: {
            get: function() {
                return this._factory.specific(this, {name: 'longitude', transformer: NodeTransformers.string});
            }
        },

        /**
         * Latitude of the location.
         * @memberof KmlLocation.prototype
         * @readonly
         * @type {String}
         */
        kmlLatitude: {
            get: function() {
                return this._factory.specific(this, {name: 'latitude', transformer: NodeTransformers.string});
            }
        },

        /**
         * Altitude of the location.
         * @memberof KmlLocation.prototype
         * @readonly
         * @type {String}
         */
        kmlAltitude: {
            get: function() {
                return this._factory.specific(this, {name: 'altitude', transformer: NodeTransformers.string});
            }
        }
    });

    /**
     * @inheritDoc
     */
    KmlLocation.prototype.getTagNames = function () {
        return ['Location'];
    };

    KmlElements.addKey(KmlLocation.prototype.getTagNames()[0], KmlLocation);

    return KmlLocation;
});