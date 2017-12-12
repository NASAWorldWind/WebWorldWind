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
     * Constructs an KmlLatLonQuad. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlLatLonQuad
     * @classdesc Contains the data associated with LatLonQuad node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing lat lon quadruple in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#gxlatlonquad
     * @augments KmlObject
     */
    var KmlLatLonQuad = function (options) {
        KmlObject.call(this, options);
    };

    KmlLatLonQuad.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlLatLonQuad.prototype, {
        /**
         * Specifies the coordinates of the four corner points of a quadrilateral defining the overlay area.
         * Exactly
         * four coordinate tuples have to be provided, each consisting of floating point values for longitude and
         * latitude. Insert a space between tuples. Do not include spaces within a tuple. The coordinates must be
         * specified in counter-clockwise order with the first coordinate corresponding to the lower-left corner of
         * the overlayed image. The shape described by these corners must be convex.
         * @memberof KmlLatLonQuad.prototype
         * @readonly
         * @type {String}
         */
        kmlCoordinates: {
            get: function () {
                return this._factory.specific(this, {name: 'coordinates', transformer: NodeTransformers.string});
            }
        }
    });


    /**
     * @inheritDoc
     */
    KmlLatLonQuad.prototype.getTagNames = function () {
        return ['gx:LatLonQuad'];
    };

    KmlElements.addKey(KmlLatLonQuad.prototype.getTagNames()[0], KmlLatLonQuad);

    return KmlLatLonQuad;
});