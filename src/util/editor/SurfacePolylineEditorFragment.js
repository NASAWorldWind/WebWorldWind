/*
 * Copyright 2015-2018 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @exports SurfacePolylineEditorFragment
 */
define([
        './BaseSurfaceEditorFragment',
        '../../geom/Location',
        '../../geom/Position',
        './ShapeEditorConstants',
        '../../shapes/SurfacePolyline',
    ],
    function (BaseSurfaceEditorFragment,
              Location,
              Position,
              ShapeEditorConstants,
              SurfacePolyline) {
        "use strict";

        //Internal use only. Intentionally not documented.
        var SurfacePolylineEditorFragment = function () {};

        SurfacePolylineEditorFragment.prototype = Object.create(BaseSurfaceEditorFragment.prototype);

        //Internal use only. Intentionally not documented.
        SurfacePolylineEditorFragment.prototype.canHandle = function (shape) {
            return shape instanceof SurfacePolyline;
        };

        //Internal use only. Intentionally not documented.
        SurfacePolylineEditorFragment.prototype.createShadowShape = function (shape) {
            return new SurfacePolyline(this.deepCopyLocations(shape.boundaries), shape.attributes);
        };

        //Internal use only. Intentionally not documented.
        SurfacePolylineEditorFragment.prototype.getShapeCenter = function (shape, globe) {
            return this.getCenter(globe, shape.boundaries);
        };

        // Internal use only.
        SurfacePolylineEditorFragment.prototype.initializeControlElements = function (shape,
                                                                                     controlPoints,
                                                                                     accessories,
                                                                                     sizeControlPointAttributes,
                                                                                     angleControlPointAttributes,
                                                                                     locationControlPointAttributes) {
            this.currentHeading = 0;
            this.locationControlPointAttributes = locationControlPointAttributes;

            var locations = shape.boundaries;

            for (var i = 0, len = locations.length; i < len; i++) {
                this.createControlPoint(
                    controlPoints,
                    locationControlPointAttributes,
                    ShapeEditorConstants.LOCATION,
                    i
                );
            }

            this.createControlPoint(controlPoints, angleControlPointAttributes, ShapeEditorConstants.ROTATION);

            this.initializeRotationAccessory(accessories, angleControlPointAttributes);
        };

        // Internal use only.
        SurfacePolylineEditorFragment.prototype.updateControlElements = function (shape,
                                                                                 globe,
                                                                                 controlPoints,
                                                                                 accessories) {
            var locations = shape.boundaries;

            var rotationControlPoint = controlPoints.pop();

            var lenControlPoints = controlPoints.length;

            for (var i = 0, len = locations.length; i < len; i++) {
                if (i >= lenControlPoints) {
                    this.createControlPoint(
                        controlPoints,
                        this.locationControlPointAttributes,
                        ShapeEditorConstants.LOCATION,
                        i
                    );
                }
                controlPoints[i].position = locations[i];
            }

            var polygonCenter = this.getCenter(globe, locations);
            var polygonRadius = 1.2 * this.getAverageDistance(globe, polygonCenter, locations);

            Location.greatCircleLocation(
                polygonCenter,
                this.currentHeading,
                polygonRadius,
                rotationControlPoint.position
            );

            rotationControlPoint.userProperties.rotation = this.currentHeading;

            controlPoints.push(rotationControlPoint);

            this.updateRotationAccessory(polygonCenter, rotationControlPoint.position, accessories);
        };

        // Internal use only.
        SurfacePolylineEditorFragment.prototype.reshape = function (shape,
                                                                   globe,
                                                                   controlPoint,
                                                                   newPosition,
                                                                   previousPosition,
                                                                   alternateAction) {
            var locations = shape.boundaries;

            if (controlPoint.userProperties.purpose === ShapeEditorConstants.ROTATION) {
                this.rotateLocations(globe, newPosition, previousPosition, locations);
                shape.resetBoundaries();
                shape._stateId = SurfacePolyline.stateId++;
                shape.stateKeyInvalid = true;

            } else if (controlPoint.userProperties.purpose === ShapeEditorConstants.LOCATION) {
                var index = controlPoint.userProperties.index;
                if (alternateAction) {
                    // TODO Implement removal of the control point
                } else {
                    this.moveLocation(globe, controlPoint, previousPosition, newPosition, locations[index]);
                }
                shape.resetBoundaries();
                shape._stateId = SurfacePolyline.stateId++;
                shape.stateKeyInvalid = true;
            }
        };

        return SurfacePolylineEditorFragment;
    }
);