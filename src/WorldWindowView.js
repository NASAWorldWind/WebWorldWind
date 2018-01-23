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
 * @exports WorldWindowView
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

        var WorldWindowView = function (worldWindow) {
            this.viewType = this.constructor.name;
            this.wwd = worldWindow;
        };

        WorldWindowView.prototype.computeViewingTransform = function (modelview) {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindowView", "computeViewingTransform", "abstractInvocation"));
        };

        WorldWindowView.prototype.equals = function (otherView) {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindowView", "equals", "abstractInvocation"));
        };

        WorldWindowView.prototype.asLookAt = function (result) {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindowView", "asLookAt", "abstractInvocation"));
        };

        WorldWindowView.prototype.asCamera = function (result) {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindowView", "asCamera", "abstractInvocation"));
        };

        WorldWindowView.prototype.clone = function () {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindowView", "clone", "abstractInvocation"));
        };

        WorldWindowView.prototype.copy = function (copyObject) {
            if (!copyObject) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WorldWindowView", "copy", "missingObject"));
            }

            this.wwd = copyObject.wwd;
        };

        return WorldWindowView;
    });

