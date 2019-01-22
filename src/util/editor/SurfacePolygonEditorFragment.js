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
 * @exports SurfacePolygonEditorFragment
 */
define([
        './BaseSurfaceEditorFragment',
        '../../geom/Location',
        '../../geom/Position',
        './ShapeEditorConstants',
        '../../shapes/SurfacePolygon',
        '../../geom/Vec3'
    ],
    function (BaseSurfaceEditorFragment,
              Location,
              Position,
              ShapeEditorConstants,
              SurfacePolygon,
              Vec3) {
        "use strict";

        // Internal use only.
        var SurfacePolygonEditorFragment = function () {
            this.currentHeading = 0;
            this.moveControlPointAttributes = null;
            this.shadowControlPointAttributes = null;
        };

        SurfacePolygonEditorFragment.prototype = Object.create(BaseSurfaceEditorFragment.prototype);

        // Internal use only.
        SurfacePolygonEditorFragment.prototype.canHandle = function (shape) {
            return shape instanceof SurfacePolygon;
        };

        // Internal use only.
        SurfacePolygonEditorFragment.prototype.createShadowShape = function (shape) {
            return new SurfacePolygon(this.deepCopyLocations(shape.boundaries), shape.attributes);
        };

        // Internal use only.
        SurfacePolygonEditorFragment.prototype.getShapeCenter = function (shape, globe) {
            return this.getCenterFromLocations(globe, shape.boundaries);
        };

        // Internal use only.
        SurfacePolygonEditorFragment.prototype.initializeControlElements = function (shape,
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

                var locations = this.getLocations(shape);

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
                for (var i = 0, len = locations.length; i < len; i++) {
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
        SurfacePolygonEditorFragment.prototype.updateControlElements = function (shape,
                                                                                 globe,
                                                                                 controlPoints,
                                                                                 shadowControlPoints,
                                                                                 accessories) {
            var locations = this.getLocations(shape);
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
                        i
                    );
                }
                locationControlPoints[i].position = locations[i];
            }

            if (locationControlPoints.length > lenLocations) {
                locationControlPoints.splice(lenLocations, locationControlPoints.length - lenLocations);
                shadowControlPoints.splice(lenLocations, shadowControlPoints.length - lenLocations);
            }

            for (var i = 0; i < locationControlPoints.length; i++) {
                controlPoints.push(locationControlPoints[i]);
            }

            if (shape.boundaries.length > 0 && Array.isArray(shape.boundaries[0])) {
                var x = 0;
                for (var i = 0, ilen = shape.boundaries.length; i < ilen; i++) {
                    for (var j = 0, jlen = shape.boundaries[i].length - 1; j < jlen; j++) {
                        this.computeShadowPointLocations(shape, shadowControlPoints[x], shape.boundaries[i][j], shape.boundaries[i][j + 1]);

                        if (j == jlen - 1) {
                            this.computeShadowPointLocations(shape, shadowControlPoints[x + 1], shape.boundaries[i][j + 1], shape.boundaries[i][0]);
                            x += 1;
                        }
                        x += 1;
                    }
                }
            } else {
                for (var i = 0; i < controlPoints.length - 1 ; i++) {
                    this.computeShadowPointLocations(shape, shadowControlPoints[i], locations[i], locations[i + 1]);

                    if (i == controlPoints.length - 2) {
                        this.computeShadowPointLocations(shape, shadowControlPoints[i + 1], locations[i + 1], locations[0]);
                    }
                }
            }

            controlPoints.push(rotationControlPoint);
        };

        // Internal use only.
        SurfacePolygonEditorFragment.prototype.reshape = function (shape,
                                                                   globe,
                                                                   controlPoint,
                                                                   currentPosition,
                                                                   previousPosition,
                                                                   secondaryBehavior) {
            var locations = this.getLocations(shape);

            if (controlPoint.userProperties.purpose === ShapeEditorConstants.ROTATION) {
                var deltaHeading = this.rotateLocations(globe, currentPosition, previousPosition, locations);
                this.currentHeading = this.normalizedHeading(this.currentHeading, deltaHeading);
                shape.resetBoundaries();
                shape._stateId = SurfacePolygon.stateId++;
                shape.stateKeyInvalid = true;

            } else if (controlPoint.userProperties.purpose === ShapeEditorConstants.LOCATION) {
                var index = controlPoint.userProperties.index;

                if (secondaryBehavior) {
                    var boundaries = shape.boundaries;
                    var lenBoundaries = boundaries.length;

                    if (lenBoundaries > 0 && Array.isArray(boundaries[0])) {
                        var ringIndex = -1;
                        var locationOffset = 0;
                        var locationIndex = -1;

                        for (var i = 0; i < lenBoundaries && ringIndex == -1; i++) {
                            var len = boundaries[i].length;
                            if (locationOffset + len > index) {
                                ringIndex = i;
                                locationIndex = index - locationOffset;
                            }
                            locationOffset += len;
                        }

                        if (ringIndex !== -1) {
                            var ring = boundaries[ringIndex];
                            if (ring.length > 3) {
                                ring.splice(locationIndex, 1);
                            } else if (lenBoundaries > 2) {
                                boundaries.splice(ringIndex, 1);
                            }
                        }

                    } else {
                        if (boundaries.length > 3) {
                            boundaries.splice(index, 1);
                        }
                    }

                } else {
                    this.moveLocation(globe, controlPoint, previousPosition, currentPosition, locations[index]);
                }
                shape.resetBoundaries();
                shape._stateId = SurfacePolygon.stateId++;
                shape.stateKeyInvalid = true;
            }
        };

        // Internal use only.
        SurfacePolygonEditorFragment.prototype.addNewVertex = function (shape, globe, position) {
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

            if(Array.isArray(shape.boundaries[0])){
                var nearestPolyIndex = -1;
                for (var i = 0, lenPoly = locations.length; i < lenPoly; i++) {
                    for (var j = 1, lenVertices = locations[i].length; j <= lenVertices; j++){
                        var locationA = locations[i][j - 1];
                        var locationB = locations[i][j == lenVertices ? 0 : j];

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
                            nearestPolyIndex = i;
                            nearestSegmentIndex = j;
                            nearestDistance = distance;
                        }
                    }
                }

                if (nearestDistance < 20000) {
                    var nearestLocation = globe.computePositionFromPoint(
                        nearestPoint[0],
                        nearestPoint[1],
                        nearestPoint[2],
                        new Position(0, 0, 0)
                    );

                    if (nearestSegmentIndex == locations[nearestPolyIndex].length) {
                        locations[nearestPolyIndex].push(nearestLocation);
                    } else {
                        locations[nearestPolyIndex].splice(nearestSegmentIndex, 0, nearestLocation);
                    }

                    shape.resetBoundaries();
                    shape._stateId = SurfacePolygon.stateId++;
                    shape.stateKeyInvalid = true;
                }
            }
            else{
                for (var i = 1, len = locations.length; i <= len; i++) {
                    var locationA = locations[i - 1];
                    var locationB = locations[i == len ? 0 : i];

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
                    shape._stateId = SurfacePolygon.stateId++;
                    shape.stateKeyInvalid = true;
                }
            }

        };

        // Internal use only.
        SurfacePolygonEditorFragment.prototype.getLocations = function (shape) {
            var locations = [];

            if (shape.boundaries.length > 0 && Array.isArray(shape.boundaries[0])) {
                for (var i = 0, ilen = shape.boundaries.length; i < ilen; i++) {
                    for (var j = 0, jlen = shape.boundaries[i].length; j < jlen; j++) {
                        locations.push(shape.boundaries[i][j]);
                    }
                }
            } else {
                for (var i = 0, len = shape.boundaries.length; i < len; i++) {
                    locations.push(shape.boundaries[i]);
                }
            }

            return locations;
        };

        return SurfacePolygonEditorFragment;
    }
);
