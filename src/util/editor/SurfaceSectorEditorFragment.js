/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
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
/**
 * @exports SurfaceSectorEditorFragment
 */
define([
        './BaseSurfaceEditorFragment',
        '../../geom/Location',
        '../../geom/Position',
        '../../geom/Sector',
        './ShapeEditorConstants',
        '../../shapes/SurfaceSector'
    ],
    function (BaseSurfaceEditorFragment,
              Location,
              Position,
              Sector,
              ShapeEditorConstants,
              SurfaceSector) {
        "use strict";

        // Internal use only.
        var SurfaceSectorEditorFragment = function () {
        };

        SurfaceSectorEditorFragment.prototype = Object.create(BaseSurfaceEditorFragment.prototype);

        // Internal use only.
        SurfaceSectorEditorFragment.prototype.canHandle = function (shape) {
            return shape instanceof SurfaceSector;
        };

        // Internal use only.
        SurfaceSectorEditorFragment.prototype.createShadowShape = function (shape) {
            return new SurfaceSector(
                new Sector(shape._boundaries[0].latitude, shape._boundaries[1].latitude, shape._boundaries[0].longitude,
                    shape._boundaries[2].longitude ),
                shape.attributes
            );
        };

        // Internal use only.
        SurfaceSectorEditorFragment.prototype.getShapeCenter = function (shape, globe) {
            return this.getCenterFromLocations(globe, shape._boundaries);
        };

        // Internal use only.
        SurfaceSectorEditorFragment.prototype.initializeControlElements = function (shape,
                                                                                    controlPoints,
                                                                                    accessories,
                                                                                    resizeControlPointAttributes) {

            this.createControlPoint(controlPoints, resizeControlPointAttributes, ShapeEditorConstants.MIN_CORNER);
            this.createControlPoint(controlPoints, resizeControlPointAttributes, ShapeEditorConstants.MAX_CORNER);
        };

        // Internal use only.
        SurfaceSectorEditorFragment.prototype.updateControlElements = function (shape,
                                                                                globe,
                                                                                controlPoints) {

            controlPoints[0].position = shape._boundaries[0];
            controlPoints[1].position = shape._boundaries[2];
        };

        // Internal use only.
        SurfaceSectorEditorFragment.prototype.reshape = function (shape,
                                                                  globe,
                                                                  controlPoint,
                                                                  currentPosition,
                                                                  previousPosition) {

            if (controlPoint.userProperties.purpose === ShapeEditorConstants.MIN_CORNER) {
                shape.sector = new Sector(currentPosition.latitude, shape._boundaries[1].latitude,
                    currentPosition.longitude, shape._boundaries[2].longitude);
            } else if (controlPoint.userProperties.purpose === ShapeEditorConstants.MAX_CORNER) {
                shape.sector = new Sector(shape._boundaries[0].latitude, currentPosition.latitude,
                    shape._boundaries[0].longitude, currentPosition.longitude);
            }
        };

        return SurfaceSectorEditorFragment;
    }
);
