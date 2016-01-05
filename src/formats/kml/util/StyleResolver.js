/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define(['../KmlFile',
        '../KmlFileCache',
        '../../../util/Logger'],
    function (KmlFile,
              KmlFileCache,
              Logger) {
        "use strict";

        /**
         * Provide functions for handling styles.
         * @exports StyleResolver
         */
        var StyleResolver = function () {
        };

        /**
         * This function externalizes handling of the remote style based on the type of the style
         * @param styleUrl {String} Url of the style. Optional.
         * @param styleSelector {KmlStyleSelector} Style to be applied. Optional.
         * @param resolve {function} Function for resolving dependant promise
         * @param reject {function} Function for rejecting dependant promise
         * @param filePromise {Promise} Promise of the file. It is applied in the case of style url.
         */
        StyleResolver.handleRemoteStyle = function (styleUrl, styleSelector, resolve, reject, filePromise) {
            if (styleUrl) {
                StyleResolver.handleStyleUrl(styleUrl, resolve, reject, filePromise);
            } else if(styleSelector) {
                StyleResolver.handleStyleSelector(styleSelector, resolve, reject);
            } else {
                Logger.logMessage(Logger.LEVEL_WARNING, "StyleResolver", "handleRemoteStyle", "Style was null.");
            }
        };

        // Intentionally undocumented. For internal use only
        StyleResolver.handleStyleUrl = function(styleUrl, resolve, reject, filePromise) {
            filePromise = StyleResolver.handlePromiseOfFile(styleUrl, filePromise);
            filePromise.then(function (kmlFile) {
                kmlFile.resolveStyle(styleUrl).then(function (style) {
                    if (style.isMap) {
                        style.resolve(resolve, reject);
                    } else {
                        resolve({normal: style, highlight: null});
                    }
                });
            });
        };

        // Intentionally undocumented. For internal use only
        StyleResolver.handlePromiseOfFile = function(styleUrl, filePromise) {
            if(!filePromise) {
                filePromise = KmlFileCache.retrieve(styleUrl);
                if (!filePromise) {
                    // This is an issue of circular dependency again.
                    filePromise = new WorldWind.KmlFile({url: styleUrl});
                    KmlFileCache.add(filePromise);
                }
            }
            return filePromise;
        };

        // Intentionally undocumented. For internal use only
        StyleResolver.handleStyleSelector = function(styleSelector, resolve, reject) {
            if (styleSelector.isMap) {
                styleSelector.resolve(resolve, reject);
            } else {
                // Move this resolve to the end of the stack to prevent recursion.
                window.setTimeout(function () {
                    resolve({normal: styleSelector, highlight: null});
                }, 0);
            }
        };

        return StyleResolver;
    });