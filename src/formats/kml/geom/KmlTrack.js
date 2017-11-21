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
    './../KmlElements',
    './KmlGeometry'
], function (KmlElements,
             KmlGeometry) {
    "use strict";

    /**
     * Constructs an KmlTrack. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlTrack
     * @classdesc Contains the data associated with Track node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Track.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#gxtrack
     * @augments KmlGeometry
     */
    var KmlTrack = function (options) {
        KmlGeometry.call(this, options);
    };

    KmlTrack.prototype = Object.create(KmlGeometry.prototype);

    /**
     * @inheritDoc
     */
    KmlTrack.prototype.getTagNames = function () {
        return ['gx:Track'];
    };

    KmlElements.addKey(KmlTrack.prototype.getTagNames()[0], KmlTrack);

    return KmlTrack;
});