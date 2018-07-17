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
 * @exports SurfaceRectangleEditorFragment
 */
define([
        './BaseSurfaceEditorFragment',
        '../../geom/Location',
        './ShapeEditorConstants',
        '../../shapes/SurfaceRectangle'
    ],
    function (BaseSurfaceEditorFragment,
              Location,
              ShapeEditorConstants,
              SurfaceRectangle) {
        "use strict";

        // Internal use only.
        var SurfaceRectangleEditorFragment = function () {};

        SurfaceRectangleEditorFragment.prototype = Object.create(BaseSurfaceEditorFragment.prototype);

        // Internal use only.
        SurfaceRectangleEditorFragment.prototype.canHandle = function (shape) {
            return shape instanceof SurfaceRectangle;
        };

        // Internal use only.
        SurfaceRectangleEditorFragment.prototype.createShadowShape = function (shape) {
            return new SurfaceRectangle(
                shape.center,
                shape.width,
                shape.height,
                shape.heading,
                shape.attributes
            );
        };

        // Internal use only.
        SurfaceRectangleEditorFragment.prototype.getShapeCenter = function (shape) {
            return shape.center;
        };

        // Internal use only.
        SurfaceRectangleEditorFragment.prototype.initializeControlElements = function (shape,
                                                                                       controlPoints,
                                                                                       accessories,
                                                                                       resizeControlPointAttributes,
                                                                                       rotateControlPointAttributes) {

            this.createControlPoint(controlPoints, resizeControlPointAttributes, ShapeEditorConstants.WIDTH);
            this.createControlPoint(controlPoints, resizeControlPointAttributes, ShapeEditorConstants.HEIGHT);
            this.createControlPoint(controlPoints, rotateControlPointAttributes, ShapeEditorConstants.ROTATION);

            this.createRotationAccessory(accessories, rotateControlPointAttributes);
        };

        // Internal use only.
        SurfaceRectangleEditorFragment.prototype.updateControlElements = function (shape,
                                                                                   globe,
                                                                                   controlPoints,
                                                                                   accessories) {
            Location.greatCircleLocation(
                shape.center,
                90 + shape.heading,
                0.5 * shape.width / globe.equatorialRadius,
                controlPoints[0].position
            );

            Location.greatCircleLocation(
                shape.center,
                shape.heading,
                0.5 * shape.height / globe.equatorialRadius,
                controlPoints[1].position
            );

            Location.greatCircleLocation(
                shape.center,
                shape.heading,
                0.8 * shape.height / globe.equatorialRadius,
                controlPoints[2].position
            );

            controlPoints[0].userProperties.size = shape.width;
            controlPoints[1].userProperties.size = shape.height;
            controlPoints[2].userProperties.rotation = shape.heading;

            this.updateRotationAccessory(shape.center, controlPoints[2].position, accessories);
        };

        // Internal use only.
        SurfaceRectangleEditorFragment.prototype.reshape = function (shape,
                                                                     globe,
                                                                     controlPoint,
                                                                     currentPosition,
                                                                     previousPosition) {

            var delta = this.computeControlPointDelta(globe, currentPosition, previousPosition);
            var vector = this.computeControlPointDelta(globe, controlPoint.position, shape.center).normalize();

            if (controlPoint.userProperties.purpose === ShapeEditorConstants.WIDTH) {
                var width = shape.width + delta.dot(vector) * 2 ;
                if (width > 0) {
                    shape.width = width;
                }

            } else if (controlPoint.userProperties.purpose === ShapeEditorConstants.HEIGHT) {
                var height = shape.height + delta.dot(vector) * 2;
                if (height > 0) {
                    shape.height = height;
                }

            } else if (controlPoint.userProperties.purpose === ShapeEditorConstants.ROTATION) {
                var oldHeading = Location.greatCircleAzimuth(shape.center, previousPosition);
                var deltaHeading = Location.greatCircleAzimuth(shape.center, currentPosition) - oldHeading;
                shape.heading = this.normalizedHeading(shape.heading, deltaHeading);
            }
        };

        return SurfaceRectangleEditorFragment;
    }
);