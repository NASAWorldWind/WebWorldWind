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
 * @exports KmlGeometry
 */
define([
    '../KmlObject'
], function (KmlObject) {
    "use strict";
    /**
     * Constructs an KmlGeometry. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read.
     * @alias KmlGeometry
     * @constructor
     * @classdesc Contains the data associated with Kml geometry
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Geometry
     * @throws {ArgumentError} If either the node is null or the content of the Kml point contains invalid elements.
     * @see https://developers.google.com/kml/documentation/kmlreference#geometry
     * @augments KmlObject
     */
    var KmlGeometry = function (options) {
        KmlObject.call(this, options);

        this._renderable = null;
    };

    KmlGeometry.prototype = Object.create(KmlObject.prototype);

	/**
     * @inheritDoc
     */
    KmlGeometry.prototype.render = function(dc, kmlOptions) {
        KmlObject.prototype.render.call(this, dc, kmlOptions);

        this.enabled = kmlOptions.lastVisibility;
    };

    /**
     * @inheritDoc
     */
    KmlGeometry.prototype.getTagNames = KmlGeometry.getTagNames = function () {
        return ['Point', 'LinearRing', 'LineString', 'MultiGeometry', 'Polygon'];
    };

    return KmlGeometry;
});