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
define([
    '../KmlFile',
    '../styles/KmlStyle',
    '../../../util/Logger'
], function (KmlFile,
             KmlStyle,
             Logger) {
    "use strict";

    /**
     * Provide functions for handling styles.
     * @exports StyleResolver
     */
    var StyleResolver = function (fileCache) {
        this._fileCache = fileCache;
    };

    /**
     * This function externalizes handling of the remote style based on the type of the style
     * @param styleUrl {String} Url of the style. Optional.
     * @param styleSelector {KmlStyleSelector} Style to be applied. Optional.
     * @param resolve {function} Function for resolving dependant promise
     * @param reject {function} Function for rejecting dependant promise
     * @param filePromise {Promise} Promise of the file. It is applied in the case of style url.
     */
    StyleResolver.prototype.handleRemoteStyle = function (styleUrl, styleSelector, resolve, reject, filePromise) {
        if (styleUrl) {
            this.handleStyleUrl(styleUrl, resolve, reject, filePromise);
        } else if (styleSelector) {
            this.handleStyleSelector(styleSelector, resolve, reject);
        } else {
            Logger.logMessage(Logger.LEVEL_WARNING, "StyleResolver", "handleRemoteStyle", "Style was null.");
            resolve(KmlStyle.default());
        }
    };

    // Intentionally undocumented. For internal use only
    StyleResolver.prototype.handleStyleUrl = function (styleUrl, resolve, reject, filePromise) {
        var self = this;
        filePromise = this.handlePromiseOfFile(styleUrl, filePromise);
        filePromise.then(function (kmlFile) {
            kmlFile.resolveStyle(styleUrl).then(function (style) {
                if (style.isMap) {
                    style.resolve(resolve, self);
                } else {
                    resolve({normal: style, highlight: null});
                }
            });
        });
    };

    // Intentionally undocumented. For internal use only
    StyleResolver.prototype.handlePromiseOfFile = function (styleUrl, filePromise) {
        if (!filePromise) {
            filePromise = this._fileCache.retrieve(styleUrl);
            if (!filePromise) {
                // This is an issue of circular dependency again.
                filePromise = new WorldWind.KmlFile({url: styleUrl});
                this._fileCache.add(filePromise);
            }
        }
        return filePromise;
    };

    // Intentionally undocumented. For internal use only
    StyleResolver.prototype.handleStyleSelector = function (styleSelector, resolve, reject) {
        if (styleSelector.isMap) {
            styleSelector.resolve(resolve, this);
        } else {
            // Move this resolve to the end of the stack to prevent recursion.
            window.setTimeout(function () {
                resolve({normal: styleSelector, highlight: null});
            }, 0);
        }
    };

    return StyleResolver;
});