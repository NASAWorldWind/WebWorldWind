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
        var StyleResolver = function () {
        };

        StyleResolver.handleRemoteStyle = function (styleUrl, styleSelector, resolve, reject, filePromise) {
            if (styleUrl) {
                if(!filePromise) {
                    filePromise = KmlFileCache.retrieve(styleUrl);
                    if (!filePromise) {
                        // This is an issue of circular dependency again.
                        filePromise = new WorldWind.KmlFile({url: styleUrl});
                        KmlFileCache.add(filePromise);
                    }
                }
                filePromise.then(function (kmlFile) {
                    kmlFile.resolveStyle(styleUrl).then(function (style) {
                        if (style.isMap) {
                            style.resolve(resolve, reject);
                        } else {
                            resolve({normal: style, highlight: null});
                        }
                    });
                });
            } else if(styleSelector) {
                if (styleSelector.isMap) {
                    styleSelector.resolve(resolve, reject);
                } else {
                    // Move this resolve to the end of the stack to prevent recursion.
                    window.setTimeout(function () {
                        resolve({normal: styleSelector, highlight: null});
                    }, 0);
                }
            } else {
                Logger.logMessage(Logger.LEVEL_WARNING, "StyleResolver", "handleRemoteStyle", "Style was null.");
            }
        };

        return StyleResolver;
    });