/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WorldWindowController
 */
define([
    '../geom/Angle',
    '../gesture/DragRecognizer',
    '../geom/Frustum',
    '../gesture/GestureRecognizer',
    '../geom/Line',
    '../geom/Location',
    '../navigate/LookAt',
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
             DragRecognizer,
             Frustum,
             GestureRecognizer,
             Line,
             Location,
             LookAt,
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
     * Default controller for WorldWind, which uses LookAt as a basic model for controlling the globe via user
     * interactions.
     * @param worldWindow {WorldWindow} WorldWindow this controller is associated with.
     * @constructor
     */
    var WorldWindowController = function (worldWindow) {
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
         * @type {LookAt}
         */
        this.lookAt = worldWindow.navigator.getAsLookAt(this.worldWindow.globe, new LookAt());

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
    WorldWindowController.prototype.handlePanOrDrag = function (recognizer) {
        if (this.worldWindow.globe.is2D()) {
            this.handlePanOrDrag2D(recognizer);
        } else {
            this.handlePanOrDrag3D(recognizer);
        }
    };

    // Intentionally not documented.
    WorldWindowController.prototype.handlePanOrDrag3D = function (recognizer) {
        var state = recognizer.state,
            tx = recognizer.translationX,
            ty = recognizer.translationY;

        if (state == WorldWind.BEGAN) {
            this.worldWindow.navigator.getAsLookAt(this.worldWindow.globe, this.lookAt);

            this.lastPoint.set(0, 0);
        } else if (state == WorldWind.CHANGED) {
            // Convert the translation from screen coordinates to arc degrees. Use this navigator's range as a
            // metric for converting screen pixels to meters, and use the globe's radius for converting from meters
            // to arc degrees.
            var canvas = this.worldWindow.canvas,
                globe = this.worldWindow.globe,
                globeRadius = WWMath.max(globe.equatorialRadius, globe.polarRadius),
                distance = WWMath.max(1, this.lookAt.range),
                metersPerPixel = WWMath.perspectivePixelSize(canvas.clientWidth, canvas.clientHeight, distance),
                forwardMeters = (ty - this.lastPoint[1]) * metersPerPixel,
                sideMeters = -(tx - this.lastPoint[0]) * metersPerPixel,
                forwardDegrees = (forwardMeters / globeRadius) * Angle.RADIANS_TO_DEGREES,
                sideDegrees = (sideMeters / globeRadius) * Angle.RADIANS_TO_DEGREES;

            // Apply the change in latitude and longitude to this navigator, relative to the current heading.
            var sinHeading = Math.sin(this.lookAt.heading * Angle.DEGREES_TO_RADIANS),
                cosHeading = Math.cos(this.lookAt.heading * Angle.DEGREES_TO_RADIANS);

            this.lookAt.latitude += forwardDegrees * cosHeading - sideDegrees * sinHeading;
            this.lookAt.longitude += forwardDegrees * sinHeading + sideDegrees * cosHeading;
            this.lastPoint.set(tx, ty);
            this.applyLimits();
            this.worldWindow.navigator.setAsLookAt(this.worldWindow.globe, this.lookAt);
            this.worldWindow.redraw();
        }
    };

    // Intentionally not documented.
    WorldWindowController.prototype.handlePanOrDrag2D = function (recognizer) {
        var state = recognizer.state,
            x = recognizer.clientX,
            y = recognizer.clientY,
            tx = recognizer.translationX,
            ty = recognizer.translationY;

        if (state == WorldWind.BEGAN) {
            this.worldWindow.navigator.getAsLookAt(this.worldWindow.globe, this.lookAt);

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
            this.lookAt.set(params.origin);
            this.lookAt.range = params.range;
            this.lookAt.heading = params.heading;
            this.lookAt.tilt = params.tilt;
            this.lookAt.roll = params.roll;
            this.applyLimits();
            this.worldWindow.navigator.setAsLookAt(this.worldWindow.globe, this.lookAt);
            this.worldWindow.redraw();
        }
    };

    // Intentionally not documented.
    WorldWindowController.prototype.handleSecondaryDrag = function (recognizer) {
        var state = recognizer.state,
            tx = recognizer.translationX,
            ty = recognizer.translationY;

        this.worldWindow.navigator.getAsLookAt(this.worldWindow.globe, this.lookAt);

        if (state == WorldWind.BEGAN) {
            this.beginHeading = this.lookAt.heading;
            this.beginTilt = this.lookAt.tilt;
        } else if (state == WorldWind.CHANGED) {
            // Compute the current translation from screen coordinates to degrees. Use the canvas dimensions as a
            // metric for converting the gesture translation to a fraction of an angle.
            var headingDegrees = 180 * tx / this.worldWindow.canvas.clientWidth,
                tiltDegrees = 90 * ty / this.worldWindow.canvas.clientHeight;

            // Apply the change in heading and tilt to this navigator's corresponding properties.
            this.lookAt.heading = this.beginHeading + headingDegrees;
            this.lookAt.tilt = this.beginTilt + tiltDegrees;
            this.applyLimits();
            this.worldWindow.navigator.setAsLookAt(this.worldWindow.globe, this.lookAt);
            this.worldWindow.redraw();
        }
    };

    // Intentionally not documented.
    WorldWindowController.prototype.handlePinch = function (recognizer) {
        var state = recognizer.state,
            scale = recognizer.scale;

        if (state == WorldWind.BEGAN) {
            this.worldWindow.navigator.getAsLookAt(this.worldWindow.globe, this.lookAt);

            this.beginRange = this.lookAt.range;
        } else if (state == WorldWind.CHANGED) {
            if (scale != 0) {
                // Apply the change in pinch scale to this navigator's range, relative to the range when the gesture
                // began.
                this.lookAt.range = this.beginRange / scale;
                this.applyLimits();
                this.worldWindow.navigator.setAsLookAt(this.worldWindow.globe, this.lookAt);
                this.worldWindow.redraw();
            }
        }
    };

    // Intentionally not documented.
    WorldWindowController.prototype.handleRotation = function (recognizer) {
        var state = recognizer.state,
            rotation = recognizer.rotation;

        if (state == WorldWind.BEGAN) {
            this.worldWindow.navigator.getAsLookAt(this.worldWindow.globe, this.lookAt);

            this.lastRotation = 0;
        } else if (state == WorldWind.CHANGED) {
            // Apply the change in gesture rotation to this navigator's current heading. We apply relative to the
            // current heading rather than the heading when the gesture began in order to work simultaneously with
            // pan operations that also modify the current heading.
            this.lookAt.heading -= rotation - this.lastRotation;
            this.lookAt.lastRotation = rotation;
            this.applyLimits();
            this.worldWindow.navigator.setAsLookAt(this.worldWindow.globe, this.lookAt);
            this.worldWindow.redraw();
        }
    };

    // Intentionally not documented.
    WorldWindowController.prototype.handleTilt = function (recognizer) {
        var state = recognizer.state,
            ty = recognizer.translationY;

        if (state == WorldWind.BEGAN) {
            this.worldWindow.navigator.getAsLookAt(this.worldWindow.globe, this.lookAt);

            this.beginTilt = this.lookAt.tilt;
        } else if (state == WorldWind.CHANGED) {
            // Compute the gesture translation from screen coordinates to degrees. Use the canvas dimensions as a
            // metric for converting the translation to a fraction of an angle.
            var tiltDegrees = -90 * ty / this.worldWindow.canvas.clientHeight;
            // Apply the change in heading and tilt to this navigator's corresponding properties.
            this.lookAt.tilt = this.beginTilt + tiltDegrees;
            this.applyLimits();
            this.worldWindow.navigator.setAsLookAt(this.worldWindow.globe, this.lookAt);
            this.worldWindow.redraw();
        }
    };

    // Intentionally not documented.
    WorldWindowController.prototype.handleWheelEvent = function (event) {
        // Normalize the wheel delta based on the wheel delta mode. This produces a roughly consistent delta across
        // browsers and input devices.
        this.worldWindow.navigator.getAsLookAt(this.worldWindow.globe, this.lookAt);

        var normalizedDelta;
        if (event.deltaMode == WheelEvent.DOM_DELTA_PIXEL) {
            normalizedDelta = event.deltaY;
        } else if (event.deltaMode == WheelEvent.DOM_DELTA_LINE) {
            normalizedDelta = event.deltaY * 40;
        } else if (event.deltaMode == WheelEvent.DOM_DELTA_PAGE) {
            normalizedDelta = event.deltaY * 400;
        }

        // Compute a zoom scale factor by adding a fraction of the normalized delta to 1. When multiplied by the
        // navigator's range, this has the effect of zooming out or zooming in depending on whether the delta is
        // positive or negative, respectfully.
        var scale = 1 + (normalizedDelta / 1000);

        // Apply the scale to this navigator's properties.
        this.lookAt.range *= scale;
        this.applyLimits();
        this.worldWindow.navigator.setAsLookAt(this.worldWindow.globe, this.lookAt);
        this.worldWindow.redraw();
    };

    // Intentionally not documented.
    WorldWindowController.prototype.applyLimits = function () {
        // Clamp latitude to between -90 and +90, and normalize longitude to between -180 and +180.
        this.lookAt.latitude = WWMath.clamp(this.lookAt.latitude, -90, 90);
        this.lookAt.longitude = Angle.normalizedDegreesLongitude(this.lookAt.longitude);

        // Clamp range to values greater than 1 in order to prevent degenerating to a first-person navigator when
        // range is zero.
        this.lookAt.range = WWMath.clamp(this.lookAt.range, 1, Number.MAX_VALUE);

        // Normalize heading to between -180 and +180.
        this.lookAt.heading = Angle.normalizedDegrees(this.lookAt.heading);

        // Clamp tilt to between 0 and +90 to prevent the viewer from going upside down.
        this.lookAt.tilt = WWMath.clamp(this.lookAt.tilt, 0, 90);

        // Normalize heading to between -180 and +180.
        this.lookAt.roll = Angle.normalizedDegrees(this.lookAt.roll);

        // Apply 2D limits when the globe is 2D.
        if (this.worldWindow.globe.is2D() && this.enable2DLimits) {
            // Clamp range to prevent more than 360 degrees of visible longitude. Assumes a 45 degree horizontal
            // field of view.
            var maxRange = 2 * Math.PI * this.worldWindow.globe.equatorialRadius;
            this.lookAt.range = WWMath.clamp(this.lookAt.range, 1, maxRange);

            // Force tilt to 0 when in 2D mode to keep the viewer looking straight down.
            this.lookAt.tilt = 0;
        }
    };

    return WorldWindowController;
});