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
 * @exports SurfaceCircleEditorFragment
 */
define([
        './BaseSurfaceEditorFragment',
        '../../geom/Location',
        './ShapeEditorConstants',
        '../../shapes/SurfaceCircle'
    ],
    function (BaseSurfaceEditorFragment,
              Location,
              ShapeEditorConstants,
              SurfaceCircle) {
        "use strict";

        // Internal use only.
        var SurfaceCircleEditorFragment = function () {};

        SurfaceCircleEditorFragment.prototype = Object.create(BaseSurfaceEditorFragment.prototype);

        // Internal use only.
        SurfaceCircleEditorFragment.prototype.canHandle = function (shape) {
            return shape instanceof SurfaceCircle;
        };

        // Internal use only.
        SurfaceCircleEditorFragment.prototype.createShadowShape = function (shape) {
            return new SurfaceCircle(shape.center, shape.radius, shape.attributes);
        };

        // Internal use only.
        SurfaceCircleEditorFragment.prototype.getShapeCenter = function (shape) {
            return shape.center;
        };

        // Internal use only.
        SurfaceCircleEditorFragment.prototype.initializeControlElements = function (shape,
                                                                                    controlPoints,
                                                                                    accessories,
                                                                                    resizeControlPointAttributes) {

            this.createControlPoint(controlPoints, resizeControlPointAttributes, ShapeEditorConstants.RADIUS);
        };

        // Internal use only.
        SurfaceCircleEditorFragment.prototype.updateControlElements = function (shape, globe, controlPoints) {
            Location.greatCircleLocation(
                shape.center,
                90,
                shape.radius / globe.equatorialRadius,
                controlPoints[0].position
            );

            controlPoints[0].userProperties.size = shape.radius;
        };

        // Internal use only.
        SurfaceCircleEditorFragment.prototype.reshape = function (shape,
                                                                  globe,
                                                                  controlPoint,
                                                                  currentPosition,
                                                                  previousPosition) {

            if (controlPoint.userProperties.purpose === ShapeEditorConstants.RADIUS) {
                var delta = this.computeControlPointDelta(globe, currentPosition, previousPosition);
                var vector = this.computeControlPointDelta(globe, controlPoint.position, shape.center).normalize();

                var radius = shape.radius + delta.dot(vector);
                if (radius > 0) {
                    shape.radius = radius;
                }
            }
        };

        return SurfaceCircleEditorFragment;
    }
);