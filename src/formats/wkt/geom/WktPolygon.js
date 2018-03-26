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