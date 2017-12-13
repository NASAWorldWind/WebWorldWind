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
 * @exports WorldWindowController
 */
define([
        './error/ArgumentError',
        './util/Logger',
        './error/UnsupportedOperationError'
    ],
    function (ArgumentError,
              Logger,
              UnsupportedOperationError) {
        "use strict";

        /**
         * Constructs a root window controller.
         * @alias WorldWindowController
         * @constructor
         * @abstract
         * @classDesc This class provides a base window controller with required properties and methods which sub-classes may
         * inherit from to create custom window controllers for controlling the globe via user interaction.
         * @param {WorldWindow} worldWindow The WorldWindow associated with this layer.
         * @throws {ArgumentError} If the specified WorldWindow is null or undefined.
         */
        var WorldWindowController = function (worldWindow) {
            if (!worldWindow) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindowController", "constructor", "missingWorldWindow"));
            }

            /**
             * The WorldWindow associated with this controller.
             * @type {WorldWindow}
             * @readonly
             */
            this.wwd = worldWindow;
        };

        WorldWindowController.prototype.onMouseEvent = function (event) {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindowController", "onMouseEvent", "abstractInvocation"));
        };

        WorldWindowController.prototype.onTouchEvent = function (event) {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindowController", "onTouchEvent", "abstractInvocation"));
        };

        WorldWindowController.prototype.gestureStateChanged = function (recognizer) {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindowController", "gestureStateChanged", "abstractInvocation"));
        };

        return WorldWindowController;
    }
);
