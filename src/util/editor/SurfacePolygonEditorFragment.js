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
        '../../shapes/Placemark',
        '../../geom/Position',
        './ShapeEditorConstants',
        '../../shapes/SurfacePolygon',
        '../../geom/Vec3'
    ],
    function (BaseSurfaceEditorFragment,
              Location,
              Placemark,
              Position,
              ShapeEditorConstants,
              SurfacePolygon,
              Vec3) {
        "use strict";

        //Internal use only. Intentionally not documented.
        var SurfacePolygonEditorFragment = function () {
            this.currentHeading = 0;
        };

        SurfacePolygonEditorFragment.prototype = Object.create(BaseSurfaceEditorFragment.prototype);

        //Internal use only. Intentionally not documented.
        SurfacePolygonEditorFragment.prototype.canEdit = function (shape) {
            return shape instanceof SurfacePolygon;
        };

        //Internal use only. Intentionally not documented.
        SurfacePolygonEditorFragment.prototype.createShadowShape = function (shape) {
            return new SurfacePolygon(shape.boundaries, shape.attributes);
        };

        //Internal use only. Intentionally not documented.
        SurfacePolygonEditorFragment.prototype.reshape = function (shape, globe, controlPoint, terrainPosition, previousPosition, currentEvent) {
            var boundaries = shape.boundaries;

            var k = 0;
            var newPos;

            if (boundaries.length > 0 && boundaries[0].length > 2) {
                outer:
                    for (var i = 0; i < boundaries.length; i++) {
                        for (var j = 0; j < boundaries[i].length; j++) {
                            if (controlPoint.userProperties.purpose === ShapeEditor.LOCATION) {
                                if (controlPoint.userProperties.id === k) {
                                    newPos = this.moveLocation(globe, controlPoint, terrainPosition, previousPosition);
                                    boundaries[i][j] = newPos;
                                    shape.boundaries = boundaries;
                                    controlPoint.position = newPos;
                                    break outer;
                                }
                            }
                            else if (controlPoint.userProperties.purpose === ShapeEditor.ROTATION) {
                                this.rotateLocations(terrainPosition, boundaries);
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
        SurfacePolygonEditorFragment.prototype.updateControlPoints = function (shape, globe, controlPoints, accessories, sizeControlPointAttributes, angleControlPointAttributes, locationControlPointAttributes) {
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

        /**
         * Moves a control point location.
         * @param {Placemark} controlPoint The control point being moved.
         * @param {Position} terrainPosition The position selected by the user.
         * @returns {Position} The position after move.
         */
        SurfacePolygonEditorFragment.prototype.moveLocation = function (globe, controlPoint, terrainPosition, previousPosition) {
            var delta = this.computeControlPointDelta(globe, previousPosition, terrainPosition);
            var markerPoint = globe.computePointFromPosition(
                controlPoint.position.latitude,
                controlPoint.position.longitude,
                0,
                new Vec3(0, 0, 0)
            );

            markerPoint.add(delta);
            return globe.computePositionFromPoint(
                markerPoint[0],
                markerPoint[1],
                markerPoint[2],
                new Position(0, 0, 0)
            );
        };

        /**
         * Rotates a shape's locations.
         * @param {Position} terrainPosition The position selected by the user.
         * @param {Location[]} locations The array of locations for the shape.
         */
        SurfacePolygonEditorFragment.prototype.rotateLocations = function (globe, terrainPosition, previousPosition, locations) {
            var center = this.getCenter(globe, locations);
            var previousHeading = Location.greatCircleAzimuth(center, previousPosition);
            var deltaHeading = Location.greatCircleAzimuth(center, terrainPosition) - previousHeading;
            this.currentHeading = this.normalizedHeading(this.currentHeading, deltaHeading);

            if (locations.length > 0 && locations[0].length > 2) {
                for (var i = 0; i < locations.length; i++) {
                    for (var j = 0; j < locations[i].length; j++) {
                        var heading = Location.greatCircleAzimuth(center, locations[i][j]);
                        var distance = Location.greatCircleDistance(center, locations[i][j]);
                        var newLocation = Location.greatCircleLocation(center, heading + deltaHeading, distance,
                            new Location(0, 0));
                        locations[i][j] = newLocation;
                    }
                }
            }
            else if (locations.length >= 2) {
                for (var i = 0; i < locations.length; i++) {
                    var heading = Location.greatCircleAzimuth(center, locations[i]);
                    var distance = Location.greatCircleDistance(center, locations[i]);
                    var newLocation = Location.greatCircleLocation(center, heading + deltaHeading, distance,
                        new Location(0, 0));
                    locations[i] = newLocation;
                }
            }
        };

        /**
         * Computes the average location of a specified array of locations.
         * @param {Location[]} locations The array of locations for the shape.
         * @return {Position} the average of the locations specified in the array.
         */
        SurfacePolygonEditorFragment.prototype.getCenter = function (globe, locations) {
            var count = 0;
            var center = new Vec3(0, 0, 0);

            if (locations.length > 0 && locations[0].length > 2) {
                for (var i = 0; i < locations.length; i++) {
                    for (var j = 0; j < locations[i].length; j++) {
                        center = center.add(globe.computePointFromPosition(
                            locations[i][j].latitude,
                            locations[i][j].longitude,
                            0,
                            new Vec3(0, 0, 0)));
                        ++count;
                    }
                }
            }
            else if (locations.length >= 2) {
                for (var i = 0; i < locations.length; i++) {
                    center = center.add(globe.computePointFromPosition(
                        locations[i].latitude,
                        locations[i].longitude,
                        0,
                        new Vec3(0, 0, 0)));
                    ++count;
                }
            }

            center = center.divide(count);

            return globe.computePositionFromPoint(
                center[0],
                center[1],
                center[2],
                new Position(0, 0, 0)
            );
        };

        return SurfacePolygonEditorFragment;
    }
);