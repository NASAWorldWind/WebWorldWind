/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
 * @exports BasicWorldWindowController
 */
define([
        './geom/Angle',
        './error/ArgumentError',
        './gesture/DragRecognizer',
        './gesture/GestureRecognizer',
        './util/Logger',
        './geom/Matrix',
        './gesture/PanRecognizer',
        './gesture/PinchRecognizer',
        './geom/Position',
        './gesture/RotationRecognizer',
        './gesture/TiltRecognizer',
        './geom/Vec3',
        './WorldWindowController',
        './util/WWMath'
    ],
    function (Angle,
              ArgumentError,
              DragRecognizer,
              GestureRecognizer,
              Logger,
              Matrix,
              PanRecognizer,
              PinchRecognizer,
              Position,
              RotationRecognizer,
              TiltRecognizer,
              Vec3,
              WorldWindowController,
              WWMath) {
        "use strict";

        /**
         * Constructs a window controller with basic capabilities.
         * @alias BasicWorldWindowController
         * @constructor
         * @augments WorldWindowController
         * @classDesc This class provides the default window controller for WorldWind for controlling the globe via user interaction.
         * @param {WorldWindow} worldWindow The WorldWindow associated with this layer.
         */
        var BasicWorldWindowController = function (worldWindow) {
            WorldWindowController.call(this, worldWindow); // base class checks for a valid worldWindow

            // Intentionally not documented.
            this.primaryDragRecognizer = new DragRecognizer(worldWindow, null);

            // Intentionally not documented.
            this.secondaryDragRecognizer = new DragRecognizer(worldWindow, null);
            this.secondaryDragRecognizer.button = 2; // secondary mouse button

            // Intentionally not documented.
            this.panRecognizer = new PanRecognizer(worldWindow, null);

            // Intentionally not documented.
            this.pinchRecognizer = new PinchRecognizer(worldWindow, null);

            // Intentionally not documented.
            this.rotationRecognizer = new RotationRecognizer(worldWindow, null);

            // Intentionally not documented.
            this.tiltRecognizer = new TiltRecognizer(worldWindow, null);
            // TODO: Wheel events
            this.allMouseRecognizers = [this.primaryDragRecognizer, this.secondaryDragRecognizer];
            for (var i = 0; i < this.allMouseRecognizers.length; i++) {
                this.allMouseRecognizers[i].addListener(this);
            }

            this.allTouchRecognizers = [this.panRecognizer, this.pinchRecognizer, this.rotationRecognizer, this.tiltRecognizer];
            for (i = 0; i < this.allTouchRecognizers.length; i++) {
                this.allTouchRecognizers[i].addListener(this);
            }
        };

        BasicWorldWindowController.prototype = Object.create(WorldWindowController.prototype);

        BasicWorldWindowController.prototype.onMouseEvent = function (e) {
            var handled = false;

            for (var i = 0; i < this.allMouseRecognizers.length; i++) {
                handled |= this.allMouseRecognizers[i].onMouseEvent(e); // use or-assignment to indicate if any recognizer handled the event
            }

            return handled;
        };

        BasicWorldWindowController.prototype.onTouchEvent = function (e) {
            var handled = false;

            for (var i = 0; i < this.allTouchRecognizers.length; i++) {
                handled |= this.allTouchRecognizers[i].onTouchEvent(e); // use or-assignment to indicate if any recognizer handled the event
            }

            return handled;
        };

        BasicWorldWindowController.prototype.gestureStateChanged = function (recognizer) {
            if (recognizer === this.primaryDragRecognizer || recognizer === this.panRecognizer) {
                this.handlePanOrDrag(recognizer);
            }
        };

        // Intentionally not documented.
        BasicWorldWindowController.prototype.handlePanOrDrag = function (recognizer) {
            if (this.wwd.globe.is2D()) {
                this.handlePanOrDrag2D(recognizer);
            } else {
                this.handlePanOrDrag3D(recognizer);
            }
        };

        // Intentionally not documented.
        BasicWorldWindowController.prototype.handlePanOrDrag3D = function (recognizer) {
            var state = recognizer.state,
                tx = recognizer.translationX,
                ty = recognizer.translationY;

            var navigator=this.wwd.navigator;
            if (state === WorldWind.BEGAN) {
                navigator.lastPoint.set(0, 0);
            } else if (state === WorldWind.CHANGED) {
                // Convert the translation from screen coordinates to arc degrees. Use this navigator's range as a
                // metric for converting screen pixels to meters, and use the globe's radius for converting from meters
                // to arc degrees.
                var canvas = this.wwd.canvas,
                    globe = this.wwd.globe,
                    globeRadius = WWMath.max(globe.equatorialRadius, globe.polarRadius),
                    distance = WWMath.max(1, navigator.range),
                    metersPerPixel = WWMath.perspectivePixelSize(canvas.clientWidth, canvas.clientHeight, distance),
                    forwardMeters = (ty - navigator.lastPoint[1]) * metersPerPixel,
                    sideMeters = -(tx - navigator.lastPoint[0]) * metersPerPixel,
                    forwardDegrees = (forwardMeters / globeRadius) * Angle.RADIANS_TO_DEGREES,
                    sideDegrees = (sideMeters / globeRadius) * Angle.RADIANS_TO_DEGREES;

                // Apply the change in latitude and longitude to this navigator, relative to the current heading.
                var sinHeading = Math.sin(navigator.heading * Angle.DEGREES_TO_RADIANS),
                    cosHeading = Math.cos(navigator.heading * Angle.DEGREES_TO_RADIANS);

                navigator.lookAtLocation.latitude += forwardDegrees * cosHeading - sideDegrees * sinHeading;
                navigator.lookAtLocation.longitude += forwardDegrees * sinHeading + sideDegrees * cosHeading;
                navigator.lastPoint.set(tx, ty);
                this.applyLimits();
                this.wwd.redraw();
            }
        };

        // Intentionally not documented.
        BasicWorldWindowController.prototype.handlePanOrDrag2D = function (recognizer) {
            var state = recognizer.state,
                x = recognizer.clientX,
                y = recognizer.clientY,
                tx = recognizer.translationX,
                ty = recognizer.translationY;

            var navigator=this.wwd.navigator;
            if (state === WorldWind.BEGAN) {
                navigator.beginPoint.set(x, y);
                navigator.lastPoint.set(x, y);
            } else if (state === WorldWind.CHANGED) {
                var x1 = navigator.lastPoint[0],
                    y1 = navigator.lastPoint[1],
                    x2 = navigator.beginPoint[0] + tx,
                    y2 = navigator.beginPoint[1] + ty;
                navigator.lastPoint.set(x2, y2);

                var navState = this.currentState(),
                    globe = this.wwd.globe,
                    ray = navState.rayFromScreenPoint(this.wwd.canvasCoordinates(x1, y1)),
                    point1 = new Vec3(0, 0, 0),
                    point2 = new Vec3(0, 0, 0),
                    origin = new Vec3(0, 0, 0);
                if (!globe.intersectsLine(ray, point1)) {
                    return;
                }

                ray = navState.rayFromScreenPoint(this.wwd.canvasCoordinates(x2, y2));
                if (!globe.intersectsLine(ray, point2)) {
                    return;
                }

                // Transform the original navigator state's modelview matrix to account for the gesture's change.
                var modelview = Matrix.fromIdentity();
                modelview.copy(navState.modelview);
                modelview.multiplyByTranslation(point2[0] - point1[0], point2[1] - point1[1], point2[2] - point1[2]);

                // Compute the globe point at the screen center from the perspective of the transformed navigator state.
                modelview.extractEyePoint(ray.origin);
                modelview.extractForwardVector(ray.direction);
                if (!globe.intersectsLine(ray, origin)) {
                    return;
                }

                // Convert the transformed modelview matrix to a set of navigator properties, then apply those
                // properties to this navigator.
                var params = modelview.extractViewingParameters(origin, navigator.roll, globe, {});
                navigator.lookAtLocation.copy(params.origin);
                navigator.range = params.range;
                navigator.heading = params.heading;
                navigator.tilt = params.tilt;
                navigator.roll = params.roll;
                this.applyLimits();
                this.wwd.redraw();
            }
        };

        // Intentionally not documented.
        BasicWorldWindowController.prototype.applyLimits = function () {
            var navigator=this.wwd.navigator;

            // Clamp latitude to between -90 and +90, and normalize longitude to between -180 and +180.
            navigator.lookAtLocation.latitude = WWMath.clamp(navigator.lookAtLocation.latitude, -90, 90);
            navigator.lookAtLocation.longitude = Angle.normalizedDegreesLongitude(navigator.lookAtLocation.longitude);

            // Clamp range to values greater than 1 in order to prevent degenerating to a first-person navigator when
            // range is zero.
            navigator.range = WWMath.clamp(navigator.range, 1, Number.MAX_VALUE);

            // Normalize heading to between -180 and +180.
            navigator.heading = Angle.normalizedDegrees(navigator.heading);

            // Clamp tilt to between 0 and +90 to prevent the viewer from going upside down.
            navigator.tilt = WWMath.clamp(navigator.tilt, 0, 90);

            // Normalize heading to between -180 and +180.
            navigator.roll = Angle.normalizedDegrees(navigator.roll);

            // Apply 2D limits when the globe is 2D.
            if (this.wwd.globe.is2D() && navigator.enable2DLimits) {
                // Clamp range to prevent more than 360 degrees of visible longitude. Assumes a 45 degree horizontal
                // field of view.
                var maxRange = 2 * Math.PI * this.wwd.globe.equatorialRadius;
                navigator.range = WWMath.clamp(navigator.range, 1, maxRange);

                // Force tilt to 0 when in 2D mode to keep the viewer looking straight down.
                navigator.tilt = 0;
            }
        };

        BasicWorldWindowController.prototype.currentState = function () {
            var navigator=this.wwd.navigator;

            this.applyLimits();

            var globe = this.wwd.globe,
                lookAtPosition = new Position(navigator.lookAtLocation.latitude, navigator.lookAtLocation.longitude, 0),
                modelview = Matrix.fromIdentity();
            modelview.multiplyByLookAtModelview(lookAtPosition, navigator.range, navigator.heading, navigator.tilt, navigator.roll, globe);

            return navigator.currentStateForModelview(modelview);
        };

        return BasicWorldWindowController;
    }
);
