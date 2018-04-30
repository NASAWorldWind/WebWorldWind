/*
 * Copyright 2015-2018 WorldWind Contributors
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
define(['../../util/QuadTree'], function(QuadTree){
    /**
     * It works with IntensityLocations instead of with the plain bound object. This type of tree uses default QuadTree
     * implementation but before inserting transforms the points into the bound objects and after retrieval transform
     * the bounds objects back to the IntensityLocations.
     * @augments QuadTree
     * @alias HeatMapQuadTree
     * @constructor
     * @inheritDoc
     */
    var HeatMapQuadTree = function(options) {
        QuadTree.call(this, options);
    };

    HeatMapQuadTree.prototype = Object.create(QuadTree.prototype);

    /**
     * This method could possibly be named differently, but the purpose is the same, only it accepts the geographical
     * points and transform them to the x, y space used by the QuadTree
     * @param intensityLocation {MeasuredLocation} Location to insert into the tree.
     */
    HeatMapQuadTree.prototype.insert = function(intensityLocation) {
        // Build the structure to call standard insert
        QuadTree.prototype.insert.call(this, {
            data: intensityLocation,
            x: intensityLocation.longitude + 180,
            y: intensityLocation.latitude + 90,
            width: 1,
            height: 1
        });
    };

    /**
     * It retrieves the information in the form of Array of IntensityLocations, which are stored in the data.
     * @return {IntensityLocation[]} Array of retrieved locations.
     * @inheritDoc
     */
    HeatMapQuadTree.prototype.retrieve = function(bounds){
        bounds.x = bounds.x + 180;
        bounds.y = bounds.y + 90;

        var points = QuadTree.prototype.retrieve.call(this, bounds);
        return points.map(function(point){
            return point.data;
        });
    };

    return HeatMapQuadTree;
});