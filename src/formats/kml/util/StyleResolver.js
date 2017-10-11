/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../KmlFile',
    '../styles/KmlStyle',
    '../../../util/Logger',
    '../../../util/Promise'
], function (KmlFile,
             KmlStyle,
             Logger,
             Promise) {
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
     * @return {Promise} Promise of the style.
     */
    StyleResolver.prototype.handleRemoteStyle = function (styleUrl, styleSelector) {
        if (styleUrl) {
            return this.handleStyleUrl(styleUrl);
        } else if (styleSelector) {
            return this.handleStyleSelector(styleSelector);
        } else {
            Logger.logMessage(Logger.LEVEL_WARNING, "StyleResolver", "handleRemoteStyle", "Style was null.");
            return Promise.resolve(KmlStyle.default());
        }
    };

    /**
     * It receives the url of the style and load it.
     * @param styleUrl {String} Url of the style. Url contain a file and a id of the style contained there.
     * @return {Promise} Promise of the style.
     * @private
     */
    StyleResolver.prototype.handleStyleUrl = function (styleUrl) {
        var self = this;
        return this.handlePromiseOfFile(styleUrl).then(function (kmlFile) {
            return kmlFile.resolveStyle(styleUrl)
        }).then(function (style) {
            if (style.isMap) {
                return style.resolve(self);
            } else {
                return Promise.resolve({normal: style, highlight: null});
            }
        });
    };

    /**
     * It either retrieves the file from the cache or build a new file from the URL.
     * @param styleUrl {String} Url used to store the information in the cache.
     * @returns {Promise} Promise of the resolved KmlFile
     * @private
     */
    StyleResolver.prototype.handlePromiseOfFile = function (styleUrl) {
        var file = this._fileCache.retrieve(styleUrl);
        if (!file) {
            // This is an issue of circular dependency again.
            return new WorldWind.KmlFile({url: styleUrl}).then(function(kmlFile){
                this._fileCache.add(styleUrl, kmlFile);

                return kmlFile;
            }.bind(this));
        } else {
            return Promise.resolve(file);
        }
    };

    /**
     * It handles style selector. Either by resolving a map or by simply returning the resolved promise with style data.
     * @param styleSelector
     * @returns {Promise|*}
     * @private
     */
    StyleResolver.prototype.handleStyleSelector = function (styleSelector) {
        console.log(styleSelector);
        if (styleSelector.isMap) {
            return styleSelector.resolve(this);
        } else {
            // Move this resolve to the end of the stack to prevent recursion.
            return new Promise(function(resolve){
                window.setTimeout(function () {
                    resolve({normal: styleSelector, highlight: null});
                }, 0)
            });
        }
    };

    return StyleResolver;
});