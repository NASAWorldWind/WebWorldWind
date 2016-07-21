/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([], function () {
    "use strict";

    // Contains all files that were already retrieved as a promises.
    /**
     * Provides Cache for Promises representing KmlFiles in current KmlDocument.
     * @exports KmlFileCache
     */
    var KmlFileCache = function () {
        this._rootFile = null;
        this._map = {};
    };

    /**
     * Retrieve relevant KmlFile from the cache representing this Document.
     * @param url {String} Url of the file to retrieve from this cache.
     * @returns {Promise|null}
     */
    KmlFileCache.prototype.retrieve = function (url) {
        if (url.indexOf('#') == 0 || url == null || url.indexOf('http') != 0) {
            return this._rootFile;
        } else {
            var urlNormalized = url;
            if (url.indexOf('#') != -1) {
                urlNormalized = url.substr(0, url.indexOf('#') - 1);
            }
            // Start of the URL use to store it in the map.
            if (this._map[urlNormalized]) {
                return this._map[urlNormalized];
            }
        }

        return null;
    };

    /**
     * Adds new KmlFile to the KmlDocument represented by this Cache.
     * @param url {String} Url of the file for internal mapping
     * @param filePromise {Promise} Promise of the file to be stored.
     */
    KmlFileCache.prototype.add = function (url, filePromise) {
        if (!this._rootFile) {
            this._rootFile = filePromise;
        } else {
            this._map[url] = filePromise;
        }
    };

    return KmlFileCache; // Return actually object. This is singleton used throughout the whole application.
});