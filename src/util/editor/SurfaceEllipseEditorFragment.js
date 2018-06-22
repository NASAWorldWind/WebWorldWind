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
 * @exports SurfaceEllipseEditorFragment
 */
define([
        './BaseSurfaceEditorFragment',
        '../../geom/Location',
        '../../shapes/Placemark',
        './ShapeEditorConstants',
        '../../shapes/SurfaceEllipse',
        '../../geom/Vec3'
    ],
    function (BaseSurfaceEditorFragment,
              Location,
              Placemark,
              ShapeEditorConstants,
              SurfaceEllipse,
              Vec3) {
        "use strict";

        //Internal use only. Intentionally not documented.
        var SurfaceEllipseEditorFragment = function () {};

        SurfaceEllipseEditorFragment.prototype = Object.create(BaseSurfaceEditorFragment.prototype);

        //Internal use only. Intentionally not documented.
        SurfaceEllipseEditorFragment.prototype.canEdit = function (shape) {
            return shape instanceof SurfaceEllipse;
        };

        //Internal use only. Intentionally not documented.
        SurfaceEllipseEditorFragment.prototype.createShadowShape = function (shape) {
            return new SurfaceEllipse(
                shape.center,
                shape.majorRadius,
                shape.minorRadius,
                shape.heading,
                shape.attributes
            );
        };

        //Internal use only. Intentionally not documented.
        SurfaceEllipseEditorFragment.prototype.reshape = function (shape, globe, controlPoint, terrainPosition, previousPosition, currentEvent) {
            var terrainPoint = globe.computePointFromPosition(
                terrainPosition.latitude,
                terrainPosition.longitude,
                0,
                new Vec3(0, 0, 0)
            );
            var previousPoint = globe.computePointFromPosition(
                previousPosition.latitude,
                previousPosition.longitude,
                0,
                new Vec3(0, 0, 0)
            );
            var delta = terrainPoint.subtract(previousPoint);

            var centerPoint = globe.computePointFromPosition(
                shape.center.latitude,
                shape.center.longitude,
                0,
                new Vec3(0, 0, 0)
            );
            var markerPoint = globe.computePointFromPosition(
                controlPoint.position.latitude,
                controlPoint.position.longitude,
                0,
                new Vec3(0, 0, 0)
            );
            var vMarker = markerPoint.subtract(centerPoint).normalize();

            if (controlPoint.userProperties.purpose === ShapeEditorConstants.WIDTH ||
                controlPoint.userProperties.purpose === ShapeEditorConstants.HEIGHT) {
                var majorRadius = shape.majorRadius + (controlPoint.userProperties.id === 0 ? delta.dot(vMarker) : 0);
                var minorRadius = shape.minorRadius + (controlPoint.userProperties.id === 1 ? delta.dot(vMarker) : 0);

                if (majorRadius > 0 && minorRadius > 0) {
                    shape.majorRadius = majorRadius;
                    shape.minorRadius = minorRadius;
                }
            } else {
                var oldHeading = Location.greatCircleAzimuth(shape.center, previousPosition);
                var deltaHeading = Location.greatCircleAzimuth(shape.center, terrainPosition) - oldHeading;
                shape.heading = this.normalizedHeading(shape.heading, deltaHeading);
            }
        };

        //Internal use only. Intentionally not documented.
        SurfaceEllipseEditorFragment.prototype.updateControlPoints = function (shape, globe, controlPoints, accessories, sizeControlPointAttributes, angleControlPointAttributes, locationControlPointAttributes) {
            var majorLocation = Location.greatCircleLocation(
                shape.center,
                90 + shape.heading,
                shape.majorRadius / globe.equatorialRadius,
                new Location(0, 0));

            var minorLocation = Location.greatCircleLocation(
                shape.center,
                shape.heading,
                shape.minorRadius / globe.equatorialRadius,
                new Location(0, 0));

            var rotationLocation = Location.greatCircleLocation(
                shape.center,
                shape.heading,
                1.15 * shape.minorRadius / globe.equatorialRadius,
                new Location(0, 0)
            );

            if (controlPoints.length > 0) {
                controlPoints[0].position = majorLocation;
                controlPoints[1].position = minorLocation;
                controlPoints[2].position = rotationLocation;
            }
            else {
                var controlPoint;

                controlPoint = new Placemark(
                    majorLocation,
                    false,
                    sizeControlPointAttributes
                );
                controlPoint.userProperties.isControlPoint = true;
                controlPoint.userProperties.id = 0;
                controlPoint.userProperties.purpose = ShapeEditorConstants.WIDTH;
                controlPoint.altitudeMode = WorldWind.CLAMP_TO_GROUND;
                controlPoints.push(controlPoint);

                controlPoint = new Placemark(
                    minorLocation,
                    false,
                    sizeControlPointAttributes
                );
                controlPoint.userProperties.isControlPoint = true;
                controlPoint.userProperties.id = 1;
                controlPoint.userProperties.purpose = ShapeEditorConstants.HEIGHT;
                controlPoint.altitudeMode = WorldWind.CLAMP_TO_GROUND;
                controlPoints.push(controlPoint);

                controlPoint = new Placemark(
                    rotationLocation,
                    false,
                    angleControlPointAttributes
                );
                controlPoint.userProperties.isControlPoint = true;
                controlPoint.userProperties.id = 2;
                controlPoint.userProperties.purpose = ShapeEditorConstants.ROTATION;
                controlPoint.altitudeMode = WorldWind.CLAMP_TO_GROUND;
                controlPoints.push(controlPoint);
            }

            controlPoints[0].userProperties.size = shape.majorRadius;
            controlPoints[1].userProperties.size = shape.minorRadius;
            controlPoints[2].userProperties.rotation = shape.heading;

            this.updateOrientationLine(shape.center, rotationLocation, accessories);
        };

        return SurfaceEllipseEditorFragment;
    }
);