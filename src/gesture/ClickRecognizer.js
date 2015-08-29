/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports ClickRecognizer
 * @version $Id: ClickRecognizer.js 3223 2015-06-19 23:16:36Z dcollins $
 */
define(['../gesture/GestureRecognizer'],
    function (GestureRecognizer) {
        "use strict";

        /**
         * Constructs a mouse click gesture recognizer.
         * @alias ClickRecognizer
         * @constructor
         * @augments GestureRecognizer
         * @classdesc A concrete gesture recognizer subclass that looks for single or multiple mouse clicks.
         * @param {EventTarget} target The document element this gesture recognizer observes for mouse and touch events.
         * @param {Function} callback An optional function to call when this gesture is recognized. If non-null, the
         * function is called when this gesture is recognized, and is passed a single argument: this gesture recognizer,
         * e.g., <code>gestureCallback(recognizer)</code>.
         * @throws {ArgumentError} If the specified target is null or undefined.
         */
        var ClickRecognizer = function (target, callback) {
            GestureRecognizer.call(this, target, callback);

            /**
             *
             * @type {Number}
             */
            this.numberOfClicks = 1;

            /**
             *
             * @type {Number}
             */
            this.button = 0;

            // Intentionally not documented.
            this.maxMouseMovement = 5;

            // Intentionally not documented.
            this.maxClickDuration = 500;

            // Intentionally not documented.
            this.maxClickInterval = 400;

            // Intentionally not documented.
            this.clicks = [];

            // Intentionally not documented.
            this.timeout = null;
        };

        ClickRecognizer.prototype = Object.create(GestureRecognizer.prototype);

        // Documented in superclass.
        ClickRecognizer.prototype.reset = function () {
            GestureRecognizer.prototype.reset.call(this);

            this.clicks = [];
            this.cancelFailAfterDelay();
        };

        // Documented in superclass.
        ClickRecognizer.prototype.mouseDown = function (event) {
            if (this.state != WorldWind.POSSIBLE) {
                return;
            }

            if (this.button != event.button) {
                this.state = WorldWind.FAILED;
            } else {
                var click = {
                    clientX: this.clientX,
                    clientY: this.clientY
                };
                this.clicks.push(click);
                this.failAfterDelay(this.maxClickDuration); // fail if the click is down too long
            }
        };

        // Documented in superclass.
        ClickRecognizer.prototype.mouseMove = function (event) {
            if (this.state != WorldWind.POSSIBLE) {
                return;
            }

            var dx = this.translationX,
                dy = this.translationY,
                distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > this.maxMouseMovement) {
                this.state = WorldWind.FAILED;
            }
        };

        // Documented in superclass.
        ClickRecognizer.prototype.mouseUp = function (event) {
            if (this.state != WorldWind.POSSIBLE) {
                return;
            }

            if (this.mouseButtonMask != 0) {
                return; // wait until the last button is up
            }

            var clickCount = this.clicks.length;
            if (clickCount == this.numberOfClicks) {
                this.clientX = this.clicks[0].clientX;
                this.clientY = this.clicks[0].clientY;
                this.state = WorldWind.RECOGNIZED;
            } else {
                this.failAfterDelay(this.maxClickInterval); // fail if the interval between clicks is too long
            }
        };

        // Documented in superclass.
        ClickRecognizer.prototype.touchStart = function (touch) {
            if (this.state != WorldWind.POSSIBLE) {
                return;
            }

            this.state = WorldWind.FAILED; // mouse gestures fail upon receiving a touch event
        };

        // Intentionally not documented.
        ClickRecognizer.prototype.failAfterDelay = function (delay) {
            var self = this;
            if (self.timeout) {
                window.clearTimeout(self.timeout);
            }

            self.timeout = window.setTimeout(function () {
                self.timeout = null;
                if (self.state == WorldWind.POSSIBLE) {
                    self.state = WorldWind.FAILED; // fail if we haven't already reached a terminal state
                }
            }, delay);
        };

        // Intentionally not documented.
        ClickRecognizer.prototype.cancelFailAfterDelay = function () {
            var self = this;
            if (self.timeout) {
                window.clearTimeout(self.timeout);
                self.timeout = null;
            }
        };

        return ClickRecognizer;
    });
