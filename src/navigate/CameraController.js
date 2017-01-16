/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WorldWindowController
 */
define([
    '../geom/Angle',
    './Camera',
    '../gesture/DragRecognizer',
    '../geom/Frustum',
    '../gesture/GestureRecognizer',
    '../geom/Line',
    '../geom/Location',
    '../util/Logger',
    '../geom/Matrix',
    '../navigate/Navigator',
    '../gesture/PanRecognizer',
    '../gesture/PinchRecognizer',
    '../geom/Position',
    '../gesture/RotationRecognizer',
    '../gesture/TiltRecognizer',
    '../geom/Vec2',
    '../geom/Vec3',
    '../util/WWMath'
], function (Angle,
             Camera,
             DragRecognizer,
             Frustum,
             GestureRecognizer,
             Line,
             Location,
             Logger,
             Matrix,
             Navigator,
             PanRecognizer,
             PinchRecognizer,
             Position,
             RotationRecognizer,
             TiltRecognizer,
             Vec2,
             Vec3,
             WWMath) {
    "use strict";
    /**
     * Alternative controller for World wind, which controls the globe via user interaction as if the user was handling
     * a camera to watch the place.
     * @param worldWindow {WorldWindow} WorldWindow this controller is associated with.
     * @constructor
     */
    var CameraController = function (worldWindow) {
        var thisNavigator = this;
        // Prevent the browser's default actions in response to mouse and touch events, which interfere with
        // navigation. Register these event listeners  before any others to ensure that they're called last.
        function preventDefaultListener(event) {
            event.preventDefault();
        }

        worldWindow.addEventListener("mousedown", preventDefaultListener);
        worldWindow.addEventListener("touchstart", preventDefaultListener);
        worldWindow.addEventListener("contextmenu", preventDefaultListener);
        worldWindow.addEventListener("wheel", preventDefaultListener);

        // Prevent the browser's default actions in response to to pointer events, which interfere with navigation.
        // This CSS style property is configured here to ensure that it's set for all applications.
        if (window.PointerEvent) {
            worldWindow.canvas.style.setProperty("touch-action", "none");
        }

        this.worldWindow = worldWindow;

        /**
         * The geographic location at the center of the viewport.
         * @type {Camera}
         */
        this.camera = worldWindow.navigator.getAsCamera(this.worldWindow.globe, new Camera());
        this.beginCamera = new Camera();

        this.modelview = Matrix.fromIdentity();

        /**
         * The distance from this navigator's eye point to its look-at location.
         * @type {Number}
         * @default 10,000 kilometers
         */
        this.range = 10e6; // TODO: Compute initial range to fit globe in viewport.

        // Development testing only. Set this to false to suppress default navigator limits on 2D globes.
        this.enable2DLimits = true;

        this.primaryDragRecognizer = new DragRecognizer(worldWindow, function (recognizer) {
            thisNavigator.handlePanOrDrag(recognizer);
        });

        // Intentionally not documented.
        this.secondaryDragRecognizer = new DragRecognizer(worldWindow, function (recognizer) {
            thisNavigator.handleSecondaryDrag(recognizer);
        });
        this.secondaryDragRecognizer.button = 2; // secondary mouse button

        // Intentionally not documented.
        this.panRecognizer = new PanRecognizer(worldWindow, function (recognizer) {
            thisNavigator.handlePanOrDrag(recognizer);
        });

        // Intentionally not documented.
        this.pinchRecognizer = new PinchRecognizer(worldWindow, function (recognizer) {
            thisNavigator.handlePinch(recognizer);
        });

        // Intentionally not documented.
        this.rotationRecognizer = new RotationRecognizer(worldWindow, function (recognizer) {
            thisNavigator.handleRotation(recognizer);
        });

        // Intentionally not documented.
        this.tiltRecognizer = new TiltRecognizer(worldWindow, function (recognizer) {
            thisNavigator.handleTilt(recognizer);
        });

        // Register wheel event listeners on the WorldWindow's canvas.
        worldWindow.addEventListener("wheel", function (event) {
            thisNavigator.handleWheelEvent(event);
        });

        // Establish the dependencies between gesture recognizers. The pan, pinch and rotate gesture may recognize
        // simultaneously with each other.
        this.panRecognizer.recognizeSimultaneouslyWith(this.pinchRecognizer);
        this.panRecognizer.recognizeSimultaneouslyWith(this.rotationRecognizer);
        this.pinchRecognizer.recognizeSimultaneouslyWith(this.rotationRecognizer);

        // Since the tilt gesture is a subset of the pan gesture, pan will typically recognize before tilt,
        // effectively suppressing tilt. Establish a dependency between the other touch gestures and tilt to provide
        // tilt an opportunity to recognize.
        this.panRecognizer.requireRecognizerToFail(this.tiltRecognizer);
        this.pinchRecognizer.requireRecognizerToFail(this.tiltRecognizer);
        this.rotationRecognizer.requireRecognizerToFail(this.tiltRecognizer);

        // Intentionally not documented.
        this.beginPoint = new Vec2(0, 0);
        this.lastPoint = new Vec2(0, 0);
        this.beginHeading = 0;
        this.beginTilt = 0;
        this.beginRange = 0;
        this.lastRotation = 0;
    };

    // Intentionally not documented.
    CameraController.prototype.handlePanOrDrag = function (recognizer) {
        if (this.worldWindow.globe.is2D()) {
            this.handlePanOrDrag2D(recognizer);
        } else {
            this.handlePanOrDrag3D(recognizer);
        }
    };

    // Intentionally not documented.
    CameraController.prototype.handlePanOrDrag3D = function (recognizer) {
        var state = recognizer.state,
            tx = recognizer.translationX,
            ty = recognizer.translationY;

        if (state == WorldWind.BEGAN) {
            this.gestureDidBegin();
            this.lastPoint.set(0, 0);
        } else if (state == WorldWind.CHANGED) {
            // Convert the translation from screen coordinates to arc degrees. Use this navigator's range as a
            // metric for converting screen pixels to meters, and use the globe's radius for converting from meters
            // to arc degrees.
            var canvas = this.worldWindow.canvas,
                globe = this.worldWindow.globe,
                globeRadius = WWMath.max(globe.equatorialRadius, globe.polarRadius),
                distance = WWMath.max(1, this.camera.altitude),
                metersPerPixel = WWMath.perspectivePixelSize(canvas.clientWidth, canvas.clientHeight, distance),
                forwardMeters = (ty - this.lastPoint[1]) * metersPerPixel,
                sideMeters = -(tx - this.lastPoint[0]) * metersPerPixel,
                forwardDegrees = (forwardMeters / globeRadius) * Angle.RADIANS_TO_DEGREES,
                sideDegrees = (sideMeters / globeRadius) * Angle.RADIANS_TO_DEGREES,
                lat = this.camera.latitude,
                lon = this.camera.longitude;


            // Apply the change in latitude and longitude to this navigator, relative to the current heading.
            var sinHeading = Math.sin(this.camera.heading * Angle.DEGREES_TO_RADIANS),
                cosHeading = Math.cos(this.camera.heading * Angle.DEGREES_TO_RADIANS);

            lat += forwardDegrees * cosHeading - sideDegrees * sinHeading;
            lon += forwardDegrees * sinHeading + sideDegrees * cosHeading;
            // If the navigator has panned over either pole, compensate by adjusting the longitude and heading to move
            // the navigator to the appropriate spot on the other side of the pole.
            if (lat < -90 || lat > 90) {
                this.camera.latitude = Location.normalizeLatitude(lat);
                this.camera.longitude = Location.normalizeLongitude(lon + 180);
            } else if (lon < -180 || lon > 180) {
                this.camera.latitude = lat;
                this.camera.longitude = Location.normalizeLongitude(lon);
            } else {
                this.camera.latitude = lat;
                this.camera.longitude = lon;
            }
            this.lastPoint.set(tx, ty);
            this.applyLimits(this.camera);
            this.worldWindow.navigator.setAsCamera(this.worldWindow.globe, this.camera);
            this.worldWindow.redraw();
        }
    };

    // Intentionally not documented.
    CameraController.prototype.handlePanOrDrag2D = function (recognizer) {
        // TODO: Fix
        var state = recognizer.state,
            x = recognizer.clientX,
            y = recognizer.clientY,
            tx = recognizer.translationX,
            ty = recognizer.translationY;

        if (state == WorldWind.BEGAN) {
            this.gestureDidBegin();
            this.beginPoint.set(x, y);
            this.lastPoint.set(x, y);
        } else if (state == WorldWind.CHANGED) {
            var x1 = this.lastPoint[0],
                y1 = this.lastPoint[1],
                x2 = this.beginPoint[0] + tx,
                y2 = this.beginPoint[1] + ty;
            this.lastPoint.set(x2, y2);

            var navState = this.currentState(),
                globe = this.worldWindow.globe,
                ray = navState.rayFromScreenPoint(this.worldWindow.canvasCoordinates(x1, y1)),
                point1 = new Vec3(0, 0, 0),
                point2 = new Vec3(0, 0, 0),
                origin = new Vec3(0, 0, 0);
            if (!globe.intersectsLine(ray, point1)) {
                return;
            }

            ray = navState.rayFromScreenPoint(this.worldWindow.canvasCoordinates(x2, y2));
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
            var params = modelview.extractViewingParameters(origin, this.roll, globe, {});
            this.camera.set(params.origin);
            this.camera.range = params.range;
            this.camera.heading = params.heading;
            this.camera.tilt = params.tilt;
            this.camera.roll = params.roll;
            this.applyLimits(this.camera);
            this.wwd.navigator.setAsCamera(this.wwd.globe, this.camera);
            this.worldWindow.navigator.setAsCamera(this.worldWindow.globe, this.camera);
            this.worldWindow.redraw();
        }
    };

    // Intentionally not documented.
    CameraController.prototype.handleSecondaryDrag = function (recognizer) {
        var state = recognizer.state,
            tx = recognizer.translationX,
            ty = recognizer.translationY;

        if (state == WorldWind.BEGAN) {
            this.gestureDidBegin();
            this.beginHeading = this.camera.heading;
            this.beginTilt = this.camera.tilt;
        } else if (state == WorldWind.CHANGED) {
            // Compute the current translation from screen coordinates to degrees. Use the canvas dimensions as a
            // metric for converting the gesture translation to a fraction of an angle.
            var headingDegrees = 180 * tx / this.worldWindow.canvas.clientWidth,
                tiltDegrees = 90 * ty / this.worldWindow.canvas.clientHeight;

            // Apply the change in heading and tilt to this navigator's corresponding properties.
            this.camera.heading = this.beginHeading + headingDegrees;
            this.camera.tilt = this.beginTilt + tiltDegrees;
            this.applyLimits(this.camera);
            this.worldWindow.navigator.setAsCamera(this.worldWindow.globe, this.camera);
            this.worldWindow.redraw();
        }
    };

    // Intentionally not documented.
    CameraController.prototype.handlePinch = function (recognizer) {
        var state = recognizer.state,
            scale = recognizer.scale;

        if (state == WorldWind.BEGAN) {
            this.gestureDidBegin();
        } else if (state == WorldWind.CHANGED) {
            if (scale != 0) {
                // Apply the change in scale to the navigator, relative to when the gesture began.
                scale = ((scale - 1) * 0.1) + 1; // dampen the scale factor
                this.camera.altitude = this.camera.altitude * scale;
                this.applyLimits(this.camera);

                this.worldWindow.navigator.setAsCamera(this.worldWindow.globe, this.camera);
                this.worldWindow.redraw();
            }
        }
    };

    // Intentionally not documented.
    CameraController.prototype.handleRotation = function (recognizer) {
        var state = recognizer.state,
            rotation = recognizer.rotation;

        if (state == WorldWind.BEGAN) {
            this.lastRotation = 0;
            this.gestureDidBegin();
        } else if (state == WorldWind.CHANGED) {
            // Apply the change in rotation to the navigator, relative to the navigator's current values.
            var headingDegrees = this.lastRotation - rotation;
            this.camera.heading = WWMath.normalizeAngle360(this.camera.heading + headingDegrees);
            this.lastRotation = rotation;

            this.worldWindow.navigator.setAsCamera(this.wwd.getGlobe(), this.camera);
            this.worldWindow.redraw();
        }
    };

    // Intentionally not documented.
    CameraController.prototype.handleTilt = function (recognizer) {
        var state = recognizer.state,
            tx = recognizer.translationX,
            ty = recognizer.translationY;

        if (state == WorldWind.BEGAN) {
            this.lastRotation = 0;
            this.gestureDidBegin();
        } else if (state == WorldWind.CHANGED) {
            // Apply the change in tilt to the navigator, relative to when the gesture began.
            var headingDegrees = 180 * tx / this.worldWindow.canvas.clientWidth;
            var tiltDegrees = -180 * ty / this.worldWindow.canvas.clientHeight;

            this.camera.heading = WWMath.normalizeAngle360(this.beginCamera.heading + headingDegrees);
            this.camera.tilt = this.beginCamera.tilt + tiltDegrees;
            this.applyLimits(this.camera);

            this.worldWindow.navigator.setAsCamera(this.wwd.getGlobe(), this.camera);
            this.worldWindow.redraw();
        }
    };

    // Intentionally not documented.
    CameraController.prototype.handleWheelEvent = function (event) {
        // Normalize the wheel delta based on the wheel delta mode. This produces a roughly consistent delta across
        // browsers and input devices.
        var normalizedDelta;
        if (event.deltaMode == WheelEvent.DOM_DELTA_PIXEL) {
            normalizedDelta = event.deltaY;
        } else if (event.deltaMode == WheelEvent.DOM_DELTA_LINE) {
            normalizedDelta = event.deltaY * 40;
        } else if (event.deltaMode == WheelEvent.DOM_DELTA_PAGE) {
            normalizedDelta = event.deltaY * 400;
        }

        this.gestureDidBegin();

        // Compute a zoom scale factor by adding a fraction of the normalized delta to 1. When multiplied by the
        // navigator's range, this has the effect of zooming out or zooming in depending on whether the delta is
        // positive or negative, respectfully.
        var scale = 1 + (normalizedDelta / 1000);

        // Apply the scale to this navigator's properties.
        this.camera.altitude *= scale;
        this.applyLimits(this.camera);
        this.worldWindow.navigator.setAsCamera(this.worldWindow.globe, this.camera);
        this.worldWindow.redraw();
    };

    // Intentionally not documented.
    CameraController.prototype.gestureDidBegin = function() {
        this.worldWindow.navigator.getAsCamera(this.worldWindow.globe, this.beginCamera);
        this.camera.set(this.beginCamera);
    };

    // Intentionally not documented.
    CameraController.prototype.applyLimits = function (camera) {
        var distanceToExtents = this.worldWindow.distanceToViewGlobeExtents();

        var minAltitude = 100;
        var maxAltitude = distanceToExtents;
        camera.altitude = WWMath.clamp(camera.altitude, minAltitude, maxAltitude);

        camera.tilt = WWMath.clamp(camera.tilt, 0, 180);
    };

    return CameraController;
});