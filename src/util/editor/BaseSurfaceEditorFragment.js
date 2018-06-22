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
        '../../geom/Vec3'
    ],
    function (Angle,
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
            var rotationLine = accessories[0];
            rotationLine.positions = positions;
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

        return BaseSurfaceEditorFragment;
    }
);