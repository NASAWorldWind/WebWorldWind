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
 * @exports FlingRecognizer
 */
define(['../gesture/GestureRecognizer'],
    function (GestureRecognizer) {
        "use strict";

        /**
         * Constructs a mouse and touch fling gesture recognizer.
         * @alias FlingRecognizer
         * @constructor
         * @augments GestureRecognizer
         * @classdesc A concrete gesture recognizer subclass that looks for flings.
         * @param {EventTarget} target The document element this gesture recognizer observes for mouse and touch events.
         * @param {Function} callback An optional function to call when this gesture is recognized. If non-null, the
         * function is called when this gesture is recognized, and is passed a single argument: this gesture recognizer,
         * e.g., <code>gestureCallback(recognizer)</code>.
         * @throws {ArgumentError} If the specified target is null or undefined.
         */
        var FlingRecognizer = function (target, callback) {
            GestureRecognizer.call(this, target, callback);

            /**
             * The minimum translation velocity that triggers a fling, in pixels per second.
             * @type {Number}
             */
            this.minVelocity = 100;
        };

        FlingRecognizer.prototype = Object.create(GestureRecognizer.prototype);

        // Documented in superclass.
        FlingRecognizer.prototype.mouseUp = function (event) {
            this.checkForFling();
        };

        // Documented in superclass.
        FlingRecognizer.prototype.touchEnd = function (touch) {
            // Check for a fling only when the last touch ends
            if (this.touchCount == 0) {
                this.checkForFling();
            }
        };

        FlingRecognizer.prototype.checkForFling = function() {
            if (this.state != WorldWind.POSSIBLE) {
                return;
            }

            if (Math.abs(this.velocityX) > this.minVelocity
                || Math.abs(this.velocityY) > this.minVelocity) {

                this.state = WorldWind.RECOGNIZED;
            }
        }

        return FlingRecognizer;
    });
