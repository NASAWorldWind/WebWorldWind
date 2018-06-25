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
 * @exports BaseSurfaceEditorFragment
 */
define([
        '../../geom/Angle',
        '../../geom/Location',
        '../../shapes/Path',
        '../../geom/Position',
        '../../shapes/ShapeAttributes',
        '../../geom/Vec3'
    ],
    function (Angle,
              Location,
              Path,
              Position,
              ShapeAttributes,
              Vec3) {
        "use strict";

        //Internal use only. Intentionally not documented.
        var BaseSurfaceEditorFragment = function () {};

        /**
         * Add a specified increment to an angle and normalize the result to be between 0 and 360 degrees.
         * @param {Number} originalHeading The base angle.
         * @param {Number} deltaHeading The increment to add prior to normalizing.
         * @returns {Number} The normalized angle.
         */
        BaseSurfaceEditorFragment.prototype.normalizedHeading = function (originalHeading, deltaHeading) {
            var newHeading = originalHeading * Angle.DEGREES_TO_RADIANS + deltaHeading * Angle.DEGREES_TO_RADIANS;

            if (Math.abs(newHeading) > Angle.TWO_PI) {
                newHeading = newHeading % Angle.TWO_PI;
            }

            return Angle.RADIANS_TO_DEGREES * (newHeading >= 0 ? newHeading : newHeading + Angle.TWO_PI);
        };

        /**
         * Computes the Cartesian difference between two control points.
         * @param {Position} previousPosition The position of the previous control point.
         * @param {Position} currentPosition  The position of the current control point.
         * @returns {Vec3} The Cartesian difference between the two control points.
         */
        BaseSurfaceEditorFragment.prototype.computeControlPointDelta = function (globe, previousPosition, currentPosition) {
            var terrainPoint = globe.computePointFromPosition(
                currentPosition.latitude,
                currentPosition.longitude,
                currentPosition.altitude,
                new Vec3(0, 0, 0)
            );

            var previousPoint = globe.computePointFromPosition(
                previousPosition.latitude,
                previousPosition.longitude,
                previousPosition.altitude,
                new Vec3(0, 0, 0)
            );

            return terrainPoint.subtract(previousPoint);
        };

        /**
         * Updates the line designating the shape's central axis.
         * @param {Position} centerPosition The shape's center location and altitude at which to place one of the line's
         * end points.
         * @param {Position} controlPointPosition  The shape orientation control point's position.
         */
        BaseSurfaceEditorFragment.prototype.updateOrientationLine = function (centerPosition, controlPointPosition, accessories) {
            if (accessories.length == 0) {
                return;
            }

            var positions = [];
            positions.push(centerPosition, controlPointPosition);
            accessories[0].positions = positions;
        };

        /**
         * Computes the average location of a specified array of locations.
         * @param {Location[]} locations The array of locations for the shape.
         * @return {Position} the average of the locations specified in the array.
         */
        BaseSurfaceEditorFragment.prototype.getCenter = function (globe, locations) {
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

        /**
         * Computes the average distance between a specified center point and a list of locations.
         * @param {Globe} globe The globe to use for the computations.
         * @param {Location} center The center point.
         * @param {Array} locations The locations.
         * @returns {Number} The average distance.
         */
        BaseSurfaceEditorFragment.prototype.getAverageDistance = function (globe, center, locations) {
            var count = locations.length;

            var centerPoint = globe.computePointFromLocation(
                center.latitude,
                center.longitude,
                new Vec3(0, 0, 0)
            );

            var totalDistance = 0;
            for (var i = 0; i < locations.length; i++) {
                var distance = globe.computePointFromLocation(
                    locations[i].latitude,
                    locations[i].longitude,
                    new Vec3(0, 0, 0)).distanceTo(centerPoint);
                totalDistance += distance / count;
            }

            return (count === 0) ? 0 : totalDistance / globe.equatorialRadius;
        };

        /**
         * Set up the Path for the rotation line.
         */
        BaseSurfaceEditorFragment.prototype.makeAccessory = function (accessories, attributes) {
            var pathPositions = [];
            pathPositions.push(new Position(0, 0, 0));
            pathPositions.push(new Position(0, 0, 0));
            var rotationLine = new Path(pathPositions, null);
            rotationLine.altitudeMode = WorldWind.CLAMP_TO_GROUND;
            rotationLine.followTerrain = true;

            var pathAttributes = new ShapeAttributes(null);
            pathAttributes.outlineColor = attributes.imageColor;
            pathAttributes.outlineWidth = 2;

            rotationLine.attributes = pathAttributes;

            accessories.push(rotationLine);
        };

        BaseSurfaceEditorFragment.prototype.addNewControlPoint = function (globe, terrainPosition, altitude, locations) {
            // Find the nearest edge to the picked point and insert a new position on that edge.
            var pointPicked = globe.computePointFromPosition(
                terrainPosition.latitude,
                terrainPosition.longitude,
                altitude,
                new Vec3(0, 0, 0)
            );

            var nearestPoint = null;
            var nearestSegmentIndex = 0;
            var nearestDistance = Number.MAX_VALUE;
            for (var i = 1; i <= locations.length; i++) // <= is intentional, to handle the closing segment
            {
                // Skip the closing segment if the shape is not a polygon.
                if (!(this._shape instanceof SurfacePolygon ) && i == locations.length) {
                    continue;
                }

                var locationA = locations[i - 1];
                var locationB = locations[i == locations.length ? 0 : i];

                var pointA = globe.computePointFromPosition(
                    locationA.latitude,
                    locationA.longitude,
                    altitude,
                    new Vec3(0, 0, 0)
                );

                var pointB = this._worldWindow.globe.computePointFromPosition(
                    locationB.latitude,
                    locationB.longitude,
                    altitude,
                    new Vec3(0, 0, 0)
                );

                var pointOnEdge = this.nearestPointOnSegment(pointA, pointB, new Vec3(pointPicked[0], pointPicked[1], pointPicked[2]));

                var distance = pointOnEdge.distanceTo(pointPicked);
                if (distance < nearestDistance) {
                    nearestPoint = pointOnEdge;
                    nearestSegmentIndex = i;
                    nearestDistance = distance;
                }
            }

            if (nearestPoint) {
                // Compute the location of the nearest point and add it to the shape.
                var nearestLocation = globe.computePositionFromPoint(
                    nearestPoint[0],
                    nearestPoint[1],
                    nearestPoint[2],
                    new Position(0, 0, 0)
                );

                if (nearestSegmentIndex == locations.length)
                    locations.push(nearestLocation);
                else
                    locations.splice(nearestSegmentIndex, 0, nearestLocation);

                this.removeControlPoints();
                this._shape.boundaries = locations;
                this.updateControlElements();
            }
        };



        BaseSurfaceEditorFragment.prototype.nearestPointOnSegment = function (p1, p2, point) {
            var segment = p2.subtract(p1);

            var segmentCopy = new Vec3(0, 0, 0);
            segmentCopy.copy(segment);
            var dir = segmentCopy.normalize();

            var dot = point.subtract(p1).dot(dir);
            if (dot < 0.0) {
                return p1;
            }
            else if (dot > segment.magnitude()) {
                return p2;
            }
            else {
                return Vec3.fromLine(p1, dot, dir); // FIXME This is broken
            }
        };
        
        /**
         * Moves a control point location.
         * @param {Placemark} controlPoint The control point being moved.
         * @param {Position} terrainPosition The position selected by the user.
         * @returns {Position} The position after move.
         */
        BaseSurfaceEditorFragment.prototype.moveLocation = function (globe, controlPoint, terrainPosition, previousPosition) {
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
        BaseSurfaceEditorFragment.prototype.rotateLocations = function (globe, terrainPosition, previousPosition, locations) {
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

        return BaseSurfaceEditorFragment;
    }
);