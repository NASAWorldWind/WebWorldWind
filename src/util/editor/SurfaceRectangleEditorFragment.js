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
 * @exports SurfaceRectangleEditorFragment
 */
define([
        './BaseSurfaceEditorFragment',
        '../../geom/Location',
        '../../shapes/Placemark',
        './ShapeEditorConstants',
        '../../shapes/SurfaceRectangle',
        '../../geom/Vec3'
    ],
    function (BaseSurfaceEditorFragment,
              Location,
              Placemark,
              ShapeEditorConstants,
              SurfaceRectangle,
              Vec3) {
        "use strict";

        //Internal use only. Intentionally not documented.
        var SurfaceRectangleEditorFragment = function () {};

        SurfaceRectangleEditorFragment.prototype = Object.create(BaseSurfaceEditorFragment.prototype);

        //Internal use only. Intentionally not documented.
        SurfaceRectangleEditorFragment.prototype.canEdit = function (shape) {
            return shape instanceof SurfaceRectangle;
        };

        //Internal use only. Intentionally not documented.
        SurfaceRectangleEditorFragment.prototype.createShadowShape = function (shape) {
            return new SurfaceRectangle(
                shape.center,
                shape.width,
                shape.height,
                shape.heading,
                shape.attributes
            );
        };

        //Internal use only. Intentionally not documented.
        SurfaceRectangleEditorFragment.prototype.reshape = function (shape, globe, controlPoint, terrainPosition, previousPosition, currentEvent) {
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

            if (controlPoint.userProperties.purpose === ShapeEditorConstants.WIDTH
                || controlPoint.userProperties.purpose === ShapeEditorConstants.HEIGHT) {
                var width = shape.width + (controlPoint.userProperties.id === 0 ? delta.dot(vMarker) * 2 : 0);
                var height = shape.height + (controlPoint.userProperties.id === 1 ? delta.dot(vMarker) * 2 : 0);

                if (width > 0 && height > 0) {
                    shape.width = width;
                    shape.height = height;
                }
            }
            else {
                var oldHeading = Location.greatCircleAzimuth(shape.center, this.previousPosition);
                var deltaHeading = Location.greatCircleAzimuth(shape.center, terrainPosition) - oldHeading;
                shape.heading = this.normalizedHeading(shape.heading, deltaHeading);
            }
        };

        //Internal use only. Intentionally not documented.
        SurfaceRectangleEditorFragment.prototype.updateControlPoints = function (shape, globe, controlPoints, accessories, sizeControlPointAttributes, angleControlPointAttributes, locationControlPointAttributes) {
            var widthLocation = Location.greatCircleLocation(
                shape.center,
                90 + shape.heading,
                0.5 * shape.width / globe.equatorialRadius,
                new Location(0, 0));

            var heightLocation = Location.greatCircleLocation(
                shape.center,
                shape.heading,
                0.5 * shape.height / globe.equatorialRadius,
                new Location(0, 0));

            var rotationLocation = Location.greatCircleLocation(
                shape.center,
                shape.heading,
                0.7 * shape.height / globe.equatorialRadius,
                new Location(0, 0));

            if (controlPoints.length > 0) {
                controlPoints[0].position = widthLocation;
                controlPoints[1].position = heightLocation;
                controlPoints[2].position = rotationLocation;
            }
            else {
                var controlPoint;

                controlPoint = new Placemark(
                    widthLocation,
                    false,
                    sizeControlPointAttributes
                );
                controlPoint.userProperties.isControlPoint = true;
                controlPoint.userProperties.id = 0;
                controlPoint.userProperties.purpose = ShapeEditorConstants.WIDTH;
                controlPoint.altitudeMode = WorldWind.CLAMP_TO_GROUND;
                controlPoints.push(controlPoint);

                controlPoint = new Placemark(
                    heightLocation,
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
                controlPoint.userProperties.id = 1;
                controlPoint.userProperties.purpose = ShapeEditorConstants.ROTATION;
                controlPoint.altitudeMode = WorldWind.CLAMP_TO_GROUND;
                controlPoints.push(controlPoint);
            }

            controlPoints[0].userProperties.size = shape.width;
            controlPoints[1].userProperties.size = shape.height;
            controlPoints[2].userProperties.rotation = shape.heading;

            this.updateOrientationLine(shape.center, rotationLocation, accessories);
        };

        return SurfaceRectangleEditorFragment;
    }
);