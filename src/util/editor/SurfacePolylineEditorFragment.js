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
 * @exports SurfacePolylineEditorFragment
 */
define([
        './BaseSurfaceEditorFragment',
        '../../geom/Location',
        '../../geom/Position',
        './ShapeEditorConstants',
        '../../shapes/SurfacePolyline',
        '../../geom/Vec3'
    ],
    function (BaseSurfaceEditorFragment,
              Location,
              Position,
              ShapeEditorConstants,
              SurfacePolyline,
              Vec3) {
        "use strict";

        //Internal use only. Intentionally not documented.
        var SurfacePolylineEditorFragment = function () {
            this.currentHeading = 0;
            this.moveControlPointAttributes = null;
            this.shadowControlPointAttributes = null;
        };

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
            return this.getCenterFromLocations(globe, shape.boundaries);
        };

        // Internal use only.
        SurfacePolylineEditorFragment.prototype.initializeControlElements = function (shape,
                                                                                      controlPoints,
                                                                                      shadowControlPoints,
                                                                                      accessories,
                                                                                      resizeControlPointAttributes,
                                                                                      rotateControlPointAttributes,
                                                                                      moveControlPointAttributes,
                                                                                      shadowControlPointAttributes) {
            this.currentHeading = 0;

            if (moveControlPointAttributes) {
                this.moveControlPointAttributes = moveControlPointAttributes;
                this.shadowControlPointAttributes = shadowControlPointAttributes;

                var locations = shape.boundaries;

                for (var i = 0, len = locations.length; i < len; i++) {
                    this.createControlPoint(
                        controlPoints,
                        moveControlPointAttributes,
                        ShapeEditorConstants.LOCATION,
                        i
                    );
                }
            }

            if (rotateControlPointAttributes) {
                this.createControlPoint(controlPoints, rotateControlPointAttributes, ShapeEditorConstants.ROTATION);

                this.createRotationAccessory(accessories, rotateControlPointAttributes);
            }

            if (shadowControlPointAttributes) {
                for (var i = 0, len = locations.length - 1; i < len; i++) {
                    this.createControlPoint(
                        shadowControlPoints,
                        shadowControlPointAttributes,
                        ShapeEditorConstants.SHADOW,
                        i
                    );
                }
            }
        };

        // Internal use only.
        SurfacePolylineEditorFragment.prototype.updateControlElements = function (shape,
                                                                                  globe,
                                                                                  controlPoints,
                                                                                  shadowControlPoints,
                                                                                  accessories) {
            var locations = shape.boundaries;
            var lenLocations = locations.length;
            var lenControlPoints = controlPoints.length;
            var locationControlPoints = [];
            var rotationControlPoint = null;


            for (var i = lenControlPoints - 1; i > -1; i--) {
                if (controlPoints[i].userProperties.purpose === ShapeEditorConstants.ROTATION) {
                    rotationControlPoint = controlPoints[i];

                    var polygonCenter = this.getCenterFromLocations(globe, locations);
                    var polygonRadius = 1.2 * this.getAverageDistance(globe, polygonCenter, locations);

                    Location.greatCircleLocation(
                        polygonCenter,
                        this.currentHeading,
                        polygonRadius,
                        rotationControlPoint.position
                    );

                    rotationControlPoint.userProperties.rotation = this.currentHeading;

                    this.updateRotationAccessory(polygonCenter, rotationControlPoint.position, accessories);
                } else {
                    locationControlPoints.push(controlPoints[i]);
                }

                controlPoints.pop();
            }

            locationControlPoints.reverse();
            var lenLocationControlPoints = locationControlPoints.length;

            for (var i = 0; i < lenLocations; i++) {
                if (i >= lenLocationControlPoints) {
                    this.createControlPoint(
                        locationControlPoints,
                        this.moveControlPointAttributes,
                        ShapeEditorConstants.LOCATION,
                        i
                    );

                    this.createControlPoint(
                        shadowControlPoints,
                        this.shadowControlPointAttributes,
                        ShapeEditorConstants.SHADOW,
                        i - 1
                    );

                }
                locationControlPoints[i].position = locations[i];
            }

            if (locationControlPoints.length > lenLocations) {
                locationControlPoints.splice(lenLocations, locationControlPoints.length - lenLocations);
                shadowControlPoints.splice(lenLocations-1, shadowControlPoints.length - lenLocations - 1);
            }

            for (var i = 0; i < locationControlPoints.length; i++) {
                controlPoints.push(locationControlPoints[i]);
            }

            for (var i = 0; i < controlPoints.length - 1; i++) {
                this.computeShadowPointLocations(shape, shadowControlPoints[i], locations[i], locations[i + 1]);
            }

            controlPoints.push(rotationControlPoint);
        };

        // Internal use only.
        SurfacePolylineEditorFragment.prototype.reshape = function (shape,
                                                                    globe,
                                                                    controlPoint,
                                                                    currentPosition,
                                                                    previousPosition,
                                                                    secondaryBehavior) {
            var locations = shape.boundaries;

            if (controlPoint.userProperties.purpose === ShapeEditorConstants.ROTATION) {
                var deltaHeading = this.rotateLocations(globe, currentPosition, previousPosition, locations);
                this.currentHeading = this.normalizedHeading(this.currentHeading, deltaHeading);
                shape.resetBoundaries();
                shape._stateId = SurfacePolyline.stateId++;
                shape.stateKeyInvalid = true;

            } else if (controlPoint.userProperties.purpose === ShapeEditorConstants.LOCATION) {
                var index = controlPoint.userProperties.index;
                if (secondaryBehavior) {
                    if (locations.length > 2) {
                        locations.splice(index, 1);
                    }
                } else {
                    this.moveLocation(globe, controlPoint, previousPosition, currentPosition, locations[index]);
                }
                shape.resetBoundaries();
                shape._stateId = SurfacePolyline.stateId++;
                shape.stateKeyInvalid = true;
            }
        };

        // Internal use only.
        SurfacePolylineEditorFragment.prototype.addNewVertex = function (shape, globe, position) {
            var pointA = new Vec3(0, 0, 0);
            var pointB = new Vec3(0, 0, 0);
            var pointOnEdge = new Vec3(0, 0, 0);

            var locations = shape.boundaries;

            var pointPicked = globe.computePointFromPosition(
                position.latitude,
                position.longitude,
                0,
                new Vec3(0, 0, 0)
            );

            var nearestPoint = new Vec3(0, 0 , 0);
            var nearestSegmentIndex = -1;
            var nearestDistance = Number.MAX_VALUE;
            for (var i = 1, len = locations.length; i < len; i++) {
                var locationA = locations[i - 1];
                var locationB = locations[i];

                globe.computePointFromPosition(locationA.latitude, locationA.longitude, 0, pointA);
                globe.computePointFromPosition(locationB.latitude, locationB.longitude, 0, pointB);

                pointOnEdge.copy(pointPicked);
                pointOnEdge = this.closestPointOnSegment(
                    pointA,
                    pointB,
                    pointPicked
                );

                var distance = pointOnEdge.distanceTo(pointPicked);
                if (distance < nearestDistance) {
                    nearestPoint.copy(pointOnEdge);
                    nearestSegmentIndex = i;
                    nearestDistance = distance;
                }
            }

            if (nearestDistance < 20000) {
                var nearestLocation = globe.computePositionFromPoint(
                    nearestPoint[0],
                    nearestPoint[1],
                    nearestPoint[2],
                    new Position(0, 0, 0)
                );

                if (nearestSegmentIndex == locations.length) {
                    locations.push(nearestLocation);
                } else {
                    locations.splice(nearestSegmentIndex, 0, nearestLocation);
                }

                shape.resetBoundaries();
                shape._stateId = SurfacePolyline.stateId++;
                shape.stateKeyInvalid = true;
            }
        };

        return SurfacePolylineEditorFragment;
    }
);