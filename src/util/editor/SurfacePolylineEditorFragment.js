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
        '../../shapes/Placemark',
        '../../geom/Position',
        './ShapeEditorConstants',
        '../../shapes/SurfacePolyline',
        '../../geom/Vec3'
    ],
    function (BaseSurfaceEditorFragment,
              Location,
              Placemark,
              Position,
              ShapeEditorConstants,
              SurfacePolyline,
              Vec3) {
        "use strict";

        //Internal use only. Intentionally not documented.
        var SurfacePolylineEditorFragment = function () {};

        SurfacePolylineEditorFragment.prototype = Object.create(BaseSurfaceEditorFragment.prototype);

        //Internal use only. Intentionally not documented.
        SurfacePolylineEditorFragment.prototype.canEdit = function (shape) {
            return shape instanceof SurfacePolyline;
        };

        //Internal use only. Intentionally not documented.
        SurfacePolylineEditorFragment.prototype.createShadowShape = function (shape) {
            return new SurfacePolyline(shape.boundaries, shape.attributes);
        };

        //Internal use only. Intentionally not documented.
        SurfacePolylineEditorFragment.prototype.reshape = function (shape, globe, controlPoint, terrainPosition, previousPosition, currentEvent) {
            var boundaries = shape.boundaries;

            var k = 0;
            var newPos;

            if (boundaries.length > 0 && boundaries[0].length > 2) {
                outer:
                    for (var i = 0; i < boundaries.length; i++) {
                        for (var j = 0; j < boundaries[i].length; j++) {
                            if (controlPoint.userProperties.purpose === ShapeEditorConstants.LOCATION) {
                                if (controlPoint.userProperties.id === k) {
                                    newPos = this.moveLocation(globe, controlPoint, terrainPosition, previousPosition);
                                    boundaries[i][j] = newPos;
                                    shape.boundaries = boundaries;
                                    controlPoint.position = newPos;
                                    break outer;
                                }
                            }
                            else if (controlPoint.userProperties.purpose === ShapeEditorConstants.ROTATION) {
                                this.rotateLocations(globe, terrainPosition, previousPosition, boundaries);
                                shape.boundaries = boundaries;
                                break outer;
                            }
                            k++;
                        }
                    }
            }
            else if (boundaries.length >= 2) {
                //poly without whole
                for (var i = 0; i < boundaries.length; i++) {
                    if (controlPoint.userProperties.purpose === ShapeEditorConstants.LOCATION) {
                        if (controlPoint.userProperties.id === k) {
                            if (currentEvent.altKey) {
                                //remove location
                                var minSize = shape instanceof SurfacePolygon ? 3 : 2;
                                if (boundaries.length > minSize) {
                                    // Delete the control point.
                                    boundaries.splice(i, 1);
                                    shape.boundaries = boundaries;
                                    this.removeControlPoints();
                                }
                            }
                            else {
                                newPos = this.moveLocation(globe, controlPoint, terrainPosition, previousPosition);
                                boundaries[i] = newPos;
                                shape.boundaries = boundaries;
                                controlPoint.position = newPos;
                            }
                            break;
                        }
                    } else if (controlPoint.userProperties.purpose === ShapeEditorConstants.ROTATION) {
                        this.rotateLocations(globe, terrainPosition, previousPosition, boundaries);
                        shape.boundaries = boundaries;
                        break;
                    }
                    k++;
                }
            }
        };

        //Internal use only. Intentionally not documented.
        SurfacePolylineEditorFragment.prototype.updateControlPoints = function (shape, globe, controlPoints, accessories, sizeControlPointAttributes, angleControlPointAttributes, locationControlPointAttributes) {
            var locations = [];

            if (shape.boundaries.length > 0 && shape.boundaries[0].length > 2) {
                for (var i = 0; i < shape.boundaries.length; i++) {
                    for (var j = 0; j < shape.boundaries[i].length; j++) {
                        locations.push(shape.boundaries[i][j]);
                    }
                }
            }
            else if (shape.boundaries.length >= 2) {
                for (var i = 0; i < shape.boundaries.length; i++) {
                    locations.push(shape.boundaries[i]);
                }
            }

            if (locations.length < 2)
                return;

            var polygonCenter = this.getCenter(globe, locations);
            var shapeRadius = this.getAverageDistance(globe, polygonCenter, locations);
            shapeRadius = shapeRadius * 1.2;
            var heading = this.currentHeading;
            var rotationControlLocation = Location.greatCircleLocation(
                polygonCenter,
                heading,
                shapeRadius,
                new Location(0, 0));

            var rotationPosition = new Position(
                rotationControlLocation.latitude,
                rotationControlLocation.longitude,
                0);

            if (controlPoints.length > 0) {
                for (var i = 0; i < locations.length; i++) {
                    controlPoints[i].position = locations[i];
                }
                controlPoints[locations.length].position = rotationPosition;
                controlPoints[locations.length].userProperties.rotation = heading;
            }
            else {
                var controlPoint;

                for (var i = 0; i < locations.length; i++) {
                    controlPoint = new Placemark(
                        locations[i],
                        false,
                        locationControlPointAttributes);
                    controlPoint.userProperties.isControlPoint = true;
                    controlPoint.userProperties.id = i;
                    controlPoint.userProperties.purpose = ShapeEditorConstants.LOCATION;
                    controlPoint.altitudeMode = WorldWind.CLAMP_TO_GROUND;
                    controlPoints.push(controlPoint);
                }

                controlPoint = new Placemark(
                    rotationPosition,
                    false,
                    angleControlPointAttributes
                );
                controlPoint.userProperties.isControlPoint = true;
                controlPoint.userProperties.id = locations.length;
                controlPoint.userProperties.purpose = ShapeEditorConstants.ROTATION;
                controlPoint.userProperties.rotation = heading;
                controlPoint.altitudeMode = WorldWind.CLAMP_TO_GROUND;
                controlPoints.push(controlPoint);
            }

            this.updateOrientationLine(polygonCenter, rotationPosition, accessories);
        };

        return SurfacePolylineEditorFragment;
    }
);