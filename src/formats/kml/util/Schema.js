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
    '../KmlObject'
], function (KmlElements,
             KmlObject) {
    "use strict";
    /**
     * Constructs an Schema. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * @alias Schema
     * @constructor
     * @classdesc Contains the data associated with Kml Schema
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Kml Schema.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#itemicon
     * @augments KmlObject
     */
    var Schema = function (options) {
        KmlObject.call(this, options);
    };

    Schema.prototype = Object.create(KmlObject.prototype);

    /**
     * @inheritDoc
     */
    Schema.prototype.getTagNames = function () {
        return ['Schema'];
    };

    KmlElements.addKey(Schema.prototype.getTagNames()[0], Schema);

    return Schema;
});