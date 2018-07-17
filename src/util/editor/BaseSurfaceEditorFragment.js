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
 * @exports BaseSurfaceEditorFragment
 */
define([
        '../../geom/Angle',
        '../../geom/Line',
        '../../geom/Location',
        '../Logger',
        '../../shapes/Path',
        '../../shapes/Placemark',
        '../../geom/Position',
        '../../shapes/ShapeAttributes',
        '../../error/UnsupportedOperationError',
        '../../geom/Vec3'
    ],
    function (Angle,
              Line,
              Location,
              Logger,
              Path,
              Placemark,
              Position,
              ShapeAttributes,
              UnsupportedOperationError,
              Vec3) {
        "use strict";

        // Internal use only.
        var BaseSurfaceEditorFragment = function () {};

        /**
         * Returns a value indicating whether this fragment can handle the specified shape.
         *
         * @param {SurfaceShape} shape The shape to test.
         * @return {Boolean} <code>true</code> if this fragment can handle the specified shape; otherwise
         * <code>false</code>.
         */
        BaseSurfaceEditorFragment.prototype.canHandle = function (shape) {
            throw new UnsupportedOperationError(Logger.logMessage(
                Logger.LEVEL_SEVERE,
                "BaseSurfaceEditorFragment",
                "canHandle",
                "abstractInvocation")
            );
        };

        /**
         * Creates and return a shadow shape from the specified shape.
         *
         * The shadow shape must be a deep copy, i.e. acting on the properties of the specified shape afterwards must
         * not alter the appearance of the shadow shape.
         *
         * @param {SurfaceShape} shape The base shape to create a shadow from.
         * @return {SurfaceShape} The shadow shape created from the specified base shape.
         */
        BaseSurfaceEditorFragment.prototype.createShadowShape = function (shape) {
            throw new UnsupportedOperationError(Logger.logMessage(
                Logger.LEVEL_SEVERE,
                "BaseSurfaceEditorFragment",
                "createShadowShape",
                "abstractInvocation")
            );
        };

        /**
         * Returns the location at the center of the specified shape.
         *
         * @param {SurfaceShape} shape The shape to get the center from.
         * @param {Globe} globe The globe on which the shape is edited.
         * @return {Location} The location at the center of the specified shape.
         */
        BaseSurfaceEditorFragment.prototype.getShapeCenter = function (shape, globe) {
            throw new UnsupportedOperationError(Logger.logMessage(
                Logger.LEVEL_SEVERE,
                "BaseSurfaceEditorFragment",
                "getShapeCenter",
                "abstractInvocation")
            );
        };

        /**
         * Initializes the control elements required to edit the specified shape.
         *
         * This method must create the elements, but not position them. Their positioning is handled by
         * {@link BaseSurfaceEditorFragment#updateControlElements}.
         *
         * @param {SurfaceShape} shape The shape being edited.
         * @param {Renderable[]} controlPoints The array to store control points in.
         * @param {Renderable[]} accessories The array to store additional accessories in.
         * @param {PlacemarkAttributes} resizeControlPointAttributes The attributes to use for control points that
         * resize the shape.
         * @param {PlacemarkAttributes} rotateControlPointAttributes The attributes to use for control points that
         * rotate the shape.
         * @param {PlacemarkAttributes} moveControlPointAttributes The attributes to use for control points that move
         * the boundaries of the shape.
         */
        BaseSurfaceEditorFragment.prototype.initializeControlElements = function (shape,
                                                                                  controlPoints,
                                                                                  accessories,
                                                                                  resizeControlPointAttributes,
                                                                                  rotateControlPointAttributes,
                                                                                  moveControlPointAttributes) {
            throw new UnsupportedOperationError(Logger.logMessage(
                Logger.LEVEL_SEVERE,
                "BaseSurfaceEditorFragment",
                "initializeControlElements",
                "abstractInvocation")
            );
        };

        /**
         * Updates the control elements required to edit the specified shape.
         *
         * @param {SurfaceShape} shape The shape being edited.
         * @param {Globe} globe The globe on which the shape is edited.
         * @param {Renderable[]} controlPoints The array that stores the control points.
         * @param {Renderable[]} accessories The array that stores the additional accessories.
         */
        BaseSurfaceEditorFragment.prototype.updateControlElements = function (shape,
                                                                              globe,
                                                                              controlPoints,
                                                                              accessories) {
            throw new UnsupportedOperationError(Logger.logMessage(
                Logger.LEVEL_SEVERE,
                "BaseSurfaceEditorFragment",
                "updateControlElements",
                "abstractInvocation")
            );
        };

        /**
         * Reshapes the specified shape by applying the appropriate effect when the given control point is moved from
         * the previous location to the current location.
         *
         * @param {SurfaceShape} shape The shape being edited.
         * @param {Globe} globe The globe on which the shape is edited.
         * @param {Renderable} controlPoint The control point being acted on.
         * @param {Position} currentPosition The current position for this action.
         * @param {Position} previousPosition The previous position for this action.
         * @param {Boolean} secondaryBehavior A value indicating whether the secondary behavior of this action should be
         * performed or not.
         */
        BaseSurfaceEditorFragment.prototype.reshape = function (shape,
                                                                globe,
                                                                controlPoint,
                                                                currentPosition,
                                                                previousPosition,
                                                                secondaryBehavior) {
            throw new UnsupportedOperationError(Logger.logMessage(
                Logger.LEVEL_SEVERE,
                "BaseSurfaceEditorFragment",
                "reshape",
                "abstractInvocation")
            );
        };

        /**
         * Adds a new vertex to the specified shape at the closest point to the given position.
         *
         * This is an optional action for the editor fragments.
         *
         * @param {SurfaceShape} shape The shape being edited.
         * @param {Globe} globe The globe on which the shape is edited.
         * @param {Position} position The position for this action.
         */
        BaseSurfaceEditorFragment.prototype.addNewVertex = function (shape, globe, position) {
            // Not supported by default.
        };

        // Creates a control point and adds it to the array of control points.
        BaseSurfaceEditorFragment.prototype.createControlPoint = function(controlPoints, attributes, purpose, index) {
            var controlPoint = new Placemark(new Location(0, 0), false, attributes);

            controlPoint.altitudeMode = WorldWind.CLAMP_TO_GROUND

            controlPoint.userProperties.purpose = purpose;

            if (typeof index !== "undefined") {
                controlPoint.userProperties.index = index;
            }

            controlPoints.push(controlPoint);
        };

        // Computes the cartesian difference between two positions such as control points.
        BaseSurfaceEditorFragment.prototype.computeControlPointDelta = function (globe, positionA, positionB) {
            var pointA = globe.computePointFromPosition(
                positionA.latitude,
                positionA.longitude,
                0,
                new Vec3(0, 0, 0)
            );

            var pointB = globe.computePointFromPosition(
                positionB.latitude,
                positionB.longitude,
                0,
                new Vec3(0, 0, 0)
            );

            return pointA.subtract(pointB);
        };

        // Creates an accessory showing the rotation of a shape and adds it to the array of accessories.
        BaseSurfaceEditorFragment.prototype.createRotationAccessory = function (accessories, attributes) {
            var shapeAttributes = new ShapeAttributes(null);
            shapeAttributes.outlineColor = attributes.imageColor;
            shapeAttributes.outlineWidth = 2;

            var rotationLine = new Path([], shapeAttributes);
            rotationLine.altitudeMode = WorldWind.CLAMP_TO_GROUND;
            rotationLine.followTerrain = true;

            accessories.push(rotationLine);
        };

        // Updates the heading of the accessory showing the rotation of the shape.
        BaseSurfaceEditorFragment.prototype.updateRotationAccessory = function (centerPosition, controlPointPosition, accessories) {
            accessories[0].positions = [centerPosition, controlPointPosition];
        };

        // Applies a delta to a heading and normalizes it.
        BaseSurfaceEditorFragment.prototype.normalizedHeading = function (currentHeading, deltaHeading) {
            var newHeading = currentHeading * Angle.DEGREES_TO_RADIANS + deltaHeading * Angle.DEGREES_TO_RADIANS;

            if (Math.abs(newHeading) > Angle.TWO_PI) {
                newHeading = newHeading % Angle.TWO_PI;
            }

            return Angle.RADIANS_TO_DEGREES * (newHeading >= 0 ? newHeading : newHeading + Angle.TWO_PI);
        };

        // Creates and returns a deep copy of a set of locations, which can include multiple rings.
        BaseSurfaceEditorFragment.prototype.deepCopyLocations = function(locations) {
            var newLocations = [];

            if (locations.length > 0 && Array.isArray(locations[0])) {
                for (var i = 0, ilen = locations.length; i < ilen; i++) {
                    var ring = [];
                    for (var j = 0, jlen = locations[i].length; j < jlen; j++) {
                        ring.push(new Location(locations[i][j].latitude, locations[i][j].longitude));
                    }
                    newLocations.push(ring);
                }
            } else {
                for (var i = 0, len = locations.length; i < len; i++) {
                    newLocations.push(new Location(locations[i].latitude, locations[i].longitude));
                }
            }

            return newLocations;
        };

        // Returns the center of a set of locations, which can include multiple rings.
        BaseSurfaceEditorFragment.prototype.getCenterFromLocations = function (globe, locations) {
            var count = 0;
            var center = new Vec3(0, 0, 0);
            var tmpVector = new Vec3(0, 0, 0);

            if (locations.length > 0 && Array.isArray(locations[0])) {
                for (var i = 0, ilen = locations.length; i < ilen; i++) {
                    for (var j = 0, jlen = locations[i].length; j < jlen; j++) {
                        center.add(
                            globe.computePointFromPosition(
                                locations[i][j].latitude,
                                locations[i][j].longitude,
                                0,
                                tmpVector
                            )
                        );
                        count++;
                    }
                }
            } else {
                for (var i = 0, len = locations.length; i < len; i++) {
                    center.add(
                        globe.computePointFromPosition(
                            locations[i].latitude,
                            locations[i].longitude,
                            0,
                            tmpVector
                        )
                    );
                    count++;
                }
            }

            center.divide(count);

            return globe.computePositionFromPoint(center[0], center[1], center[2], new Position(0, 0, 0));
        };

        // Computes the average distance between the specified center point and the locations in the specified list.
        BaseSurfaceEditorFragment.prototype.getAverageDistance = function (globe, center, locations) {
            var centerPoint = globe.computePointFromLocation(
                center.latitude,
                center.longitude,
                new Vec3(0, 0, 0)
            );

            var count = locations.length;
            var totalDistance = 0;
            var tmpVector = new Vec3(0, 0, 0);
            for (var i = 0; i < count; i++) {
                var distance = globe.computePointFromLocation(
                    locations[i].latitude,
                    locations[i].longitude,
                    tmpVector
                ).distanceTo(centerPoint);
                totalDistance += distance / count;
            }

            return totalDistance / globe.equatorialRadius;
        };

        // Moves the location of a control point.
        BaseSurfaceEditorFragment.prototype.moveLocation = function (globe,
                                                                     controlPoint,
                                                                     currentPosition,
                                                                     previousPosition,
                                                                     result) {

            var controlPointPoint = globe.computePointFromPosition(
                currentPosition.latitude,
                currentPosition.longitude,
                0,
                new Vec3(0, 0, 0)
            );

            return globe.computePositionFromPoint(
                controlPointPoint[0],
                controlPointPoint[1],
                controlPointPoint[2],
                result
            );
        };

        // Rotates a set of locations, which can include multiple rings, around their center and returns the delta in
        // heading that was applied.
        BaseSurfaceEditorFragment.prototype.rotateLocations = function (globe, newPosition, previousPosition, locations) {
            var center = this.getCenterFromLocations(globe, locations);
            var previousHeading = Location.greatCircleAzimuth(center, previousPosition);
            var deltaHeading = Location.greatCircleAzimuth(center, newPosition) - previousHeading;

            if (locations.length > 0 && Array.isArray(locations[0])) {
                for (var i = 0, ilen = locations.length; i < ilen; i++) {
                    for (var j = 0, jlen = locations[i].length; j < jlen; j++) {
                        var heading = Location.greatCircleAzimuth(center, locations[i][j]);
                        var distance = Location.greatCircleDistance(center, locations[i][j]);
                        Location.greatCircleLocation(
                            center,
                            heading + deltaHeading,
                            distance,
                            locations[i][j]
                        );
                    }
                }
            } else {
                for (var i = 0, len = locations.length; i < len; i++) {
                    var heading = Location.greatCircleAzimuth(center, locations[i]);
                    var distance = Location.greatCircleDistance(center, locations[i]);
                    Location.greatCircleLocation(
                        center,
                        heading + deltaHeading,
                        distance,
                        locations[i]
                    );
                }
            }

            return deltaHeading;
        };

        // Returns the point on a segment that is closest to the specified point.
        BaseSurfaceEditorFragment.prototype.closestPointOnSegment = function (segmentStart, segmentEnd, point) {
            var segment = segmentEnd.subtract(segmentStart);

            var segmentCopy = new Vec3(0, 0, 0);
            segmentCopy.copy(segment);
            var dir = segmentCopy.normalize();

            var pointCopy = new Vec3(0, 0, 0);
            pointCopy.copy(point);
            var dot = pointCopy.subtract(segmentStart).dot(dir);

            if (dot < 0.0) {
                return segmentCopy.copy(segmentStart);
            } else if (dot > segment.magnitude()) {
                return segmentCopy.copy(segmentEnd);
            } else {
                return new Line(segmentStart, dir).pointAt(dot, segmentCopy);
            }
        };

        return BaseSurfaceEditorFragment;
    }
);