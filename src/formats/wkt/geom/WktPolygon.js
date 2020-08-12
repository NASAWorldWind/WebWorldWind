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
define([
    '../../../shapes/Polygon',
    '../../../shapes/ShapeAttributes',
    '../../../shapes/SurfacePolygon',
    '../WktElements',
    './WktObject',
    '../WktType'
], function (Polygon,
             ShapeAttributes,
             SurfacePolygon,
             WktElements,
             WktObject,
             WktType) {
    /**
     * It represents the polygon.
     * @alias WktPolygon
     * @augments WktObject
     * @constructor
     */
    var WktPolygon = function () {
        WktObject.call(this, WktType.SupportedGeometries.POLYGON);

        this._renderable = null;
    };

    WktPolygon.prototype = Object.create(WktObject.prototype);

    /**
     * @inheritDoc
     */
    WktPolygon.prototype.commaWithoutCoordinates = function() {
        this.outerBoundaries = this.coordinates.slice();
        this.coordinates = [];
    };

    /**
     * It returns SurfacePolygon for 2D. It returns Polygon for 3D.
     * @inheritDoc
     * @return {Polygon[]|SurfacePolyline[]}
     */
    WktPolygon.prototype.shapes = function () {
        if (this._is3d) {
            if(this.outerBoundaries) {
                return [new Polygon([this.outerBoundaries, this.coordinates], new ShapeAttributes(null))];
            } else {
                return [new Polygon(this.coordinates, new ShapeAttributes(null))];
            }
        } else {
            if(this.outerBoundaries) {
                return [new SurfacePolygon([this.outerBoundaries, this.coordinates], new ShapeAttributes(null))];
            } else {
                return [new SurfacePolygon(this.coordinates, new ShapeAttributes(null))];
            }
        }
    };

    WktElements['POLYGON'] = WktPolygon;

    return WktPolygon;
});