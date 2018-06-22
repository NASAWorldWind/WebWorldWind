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
        './ShapeEditorConstants',
        '../../shapes/SurfacePolyline',
        '../../geom/Vec3'
    ],
    function (BaseSurfaceEditorFragment,
              Location,
              Placemark,
              ShapeEditorConstants,
              SurfacePolyline,
              Vec3) {
        "use strict";

        //Internal use only. Intentionally not documented.
        var SurfacePolylineEditorFragment = function () {};

        SurfacePolylineEditorFragment.prototype = Object.create(BaseSurfaceEditorFragment.prototype);

        //Internal use only. Intentionally not documented.
        SurfacePolylineEditorFragment.prototype.canHandle = function (shape) {
            return shape instanceof SurfacePolyline;
        };

        //Internal use only. Intentionally not documented.
        SurfacePolylineEditorFragment.prototype.createShadowShape = function (shape) {
            return new SurfacePolyline(shape.boundaries, shape.attributes);
        };

        //Internal use only. Intentionally not documented.
        SurfacePolylineEditorFragment.prototype.getShapeCenter = function (shape) {
            return null;
        };

        //Internal use only. Intentionally not documented.
        SurfacePolylineEditorFragment.prototype.reshape = function (shape, globe, controlPoint, terrainPosition, previousPosition, alternateAction) {
            var delta = this.computeControlPointDelta(globe, previousPosition, terrainPosition);
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

            var radius = shape.radius + delta.dot(vMarker);
            if (radius > 0) {
                shape.radius = radius;
            }
        };

        //Internal use only. Intentionally not documented.
        SurfacePolylineEditorFragment.prototype.updateControlPoints = function (shape, globe, controlPoints, accessories, sizeControlPointAttributes, angleControlPointAttributes, locationControlPointAttributes) {
            var radiusLocation = Location.greatCircleLocation(
                shape.center,
                90,
                shape.radius / globe.equatorialRadius,
                new Location(0, 0));

            if (controlPoints.length > 0) {
                controlPoints[0].position = radiusLocation;
            }
            else {
                var controlPoint = new Placemark(
                    radiusLocation,
                    false,
                    sizeControlPointAttributes
                );
                controlPoint.userProperties.isControlPoint = true;
                controlPoint.userProperties.id = 0;
                controlPoint.userProperties.purpose = ShapeEditorConstants.OUTER_RADIUS;
                controlPoint.altitudeMode = WorldWind.CLAMP_TO_GROUND;
                controlPoints.push(controlPoint);
            }

            controlPoints[0].userProperties.size = shape.radius;
        };

        return SurfacePolylineEditorFragment;
    }
);