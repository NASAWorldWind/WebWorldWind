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
 * @exports SurfacePolygonEditorFragment
 */
define([
        './BaseSurfaceEditorFragment',
        '../../geom/Location',
        '../../geom/Position',
        './ShapeEditorConstants',
        '../../shapes/SurfacePolygon'
    ],
    function (BaseSurfaceEditorFragment,
              Location,
              Position,
              ShapeEditorConstants,
              SurfacePolygon) {
        "use strict";

        // Internal use only.
        var SurfacePolygonEditorFragment = function () {
            this.currentHeading = 0;
            this.locationControlPointAttributes = null;
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
            return this.getCenter(globe, shape.boundaries);
        };

        // Internal use only.
        SurfacePolygonEditorFragment.prototype.initializeControlElements = function (shape,
                                                                                       controlPoints,
                                                                                       accessories,
                                                                                       sizeControlPointAttributes,
                                                                                       angleControlPointAttributes,
                                                                                       locationControlPointAttributes) {
            this.currentHeading = 0;
            this.locationControlPointAttributes = locationControlPointAttributes;

            var locations = this.getLocations(shape);

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
        SurfacePolygonEditorFragment.prototype.updateControlElements = function (shape,
                                                                                 globe,
                                                                                 controlPoints,
                                                                                 accessories) {
            var locations = this.getLocations(shape);

            var rotationControlPoint = controlPoints.pop();

            var lenControlPoints = controlPoints.length;
            var lenLocations = locations.length;

            for (var i = 0; i < lenLocations; i++) {
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

            if (lenControlPoints > lenLocations) {
                controlPoints.splice(lenLocations, lenControlPoints - lenLocations)
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
        SurfacePolygonEditorFragment.prototype.reshape = function (shape,
                                                                   globe,
                                                                   controlPoint,
                                                                   newPosition,
                                                                   previousPosition,
                                                                   alternateAction) {
            var locations = this.getLocations(shape);

            if (controlPoint.userProperties.purpose === ShapeEditorConstants.ROTATION) {
                var deltaHeading = this.rotateLocations(globe, newPosition, previousPosition, locations);
                this.currentHeading = this.normalizedHeading(this.currentHeading, deltaHeading);
                shape.resetBoundaries();
                shape._stateId = SurfacePolygon.stateId++;
                shape.stateKeyInvalid = true;

            } else if (controlPoint.userProperties.purpose === ShapeEditorConstants.LOCATION) {
                var index = controlPoint.userProperties.index;

                if (alternateAction) {
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

                        console.log(ringIndex);
                        console.log(locationIndex);

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
                    this.moveLocation(globe, controlPoint, previousPosition, newPosition, locations[index]);
                }
                shape.resetBoundaries();
                shape._stateId = SurfacePolygon.stateId++;
                shape.stateKeyInvalid = true;
            }
        };

        // Internal use only.
        SurfacePolygonEditorFragment.prototype.getLocations = function (shape) {
            var locations = [];

            if (shape.boundaries.length > 0 && shape.boundaries[0].length > 2) {
                for (var i = 0; i < shape.boundaries.length; i++) {
                    for (var j = 0; j < shape.boundaries[i].length; j++) {
                        locations.push(shape.boundaries[i][j]);
                    }
                }
            } else if (shape.boundaries.length >= 2) {
                for (var i = 0; i < shape.boundaries.length; i++) {
                    locations.push(shape.boundaries[i]);
                }
            }

            return locations;
        };

        return SurfacePolygonEditorFragment;
    }
);
