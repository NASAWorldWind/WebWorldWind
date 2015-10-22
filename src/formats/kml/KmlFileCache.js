/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([], function () {
    "use strict";

    // Contains all files that were already retrieved as a promises.
    var KmlFileCache = function () {
        this._rootFile = null;
        this._map = {};
    };

    KmlFileCache.prototype.retrieve = function(url) {
        if(url.indexOf('#') == 0 || url == null) {
            return this._rootFile;
        } else {
            var urlNormalized = url;
            if(url.indexOf('#' != -1)) {
                urlNormalized = url.substr(0, url.indexOf('#') - 1);
            }
            // Start of the URL use to store it in the map.
            if(this._map[urlNormalized]) {
                return this._map[urlNormalized];
            }
        }

        return null;
    };

    // This shouldn't now about KmlFile per se.

    KmlFileCache.prototype.add = function(url, filePromise) {
        if(!this._rootFile) {
            this._rootFile = filePromise;
        } else {
            this._map[url] = filePromise;
        }
    };

    if (!cachedKmlFile) {
        var cachedKmlFile = new KmlFileCache();
    }
    return cachedKmlFile; // Return actually object. This is singleton used throughout the whole application.
});