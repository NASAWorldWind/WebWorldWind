/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
/**
 * @exports KmlTimeSpan
 */
define([
    './KmlElements',
    './KmlTimePrimitive',
    './util/KmlNodeTransformers'
], function(
    KmlElements,
    KmlTimePrimitive,
    NodeTransformers
){
    "use strict";
    /**
     * Constructs an KmlTimeSpan. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from KmlFile are read.
     * @alias KmlTimeSpan
     * @classdesc Contains the data associated with Kml TimeSpan
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Kml TimeSpan
     * @constructor
     * @throws {ArgumentError} If the content of the node contains invalid elements.
     * @see https://developers.google.com/kml/documentation/kmlreference#timespan
     * @augments KmlTimePrimitive
     */
    var KmlTimeSpan = function (options) {
        //noinspection JSUndefinedPropertyAssignment
        options.isTimeSpan = true;

        KmlTimePrimitive.call(this, options);
    };

    KmlTimeSpan.prototype = Object.create(KmlTimePrimitive.prototype);

    Object.defineProperties(KmlTimeSpan.prototype, {
        /**
         * Time from which is the event valid.
         * @memberof KmlTimeSpan.prototype
         * @type {Date}
         * @readonly
         */
        kmlBegin: {
            get: function() {
                return this._factory.specific(this, {name: 'begin', transformer: NodeTransformers.date});
            }
        },

        /**
         * Time to which is the event valid.
         * @memberof KmlTimeSpan.prototype
         * @type {Date}
         * @readonly
         */
        kmlEnd: {
            get: function() {
                return this._factory.specific(this, {name: 'end', transformer: NodeTransformers.date});
            }
        }
    });

    /**
     * @inheritDoc
     */
    KmlTimeSpan.prototype.getTagNames = function () {
        return ['TimeSpan'];
    };

    KmlElements.addKey(KmlTimeSpan.prototype.getTagNames()[0], KmlTimeSpan);

    return KmlTimeSpan;
});