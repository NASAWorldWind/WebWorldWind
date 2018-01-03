/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports KmzFile
 */
define([
    '../../util/jszip',
    '../../util/Promise',
    '../../util/WWUtil'
], function (JsZip,
             Promise,
             WWUtil) {
    "use strict";

    /**
     * Constructs KmzFile. It expects binary representation of the file and the Cache to be used.
     * @constructor
     * @alias KmzFile
     * @param binary {Object} Binary representation of the file.
     * @param fileCache {KmlFileCache} Cache for the contents of the file.
     */
    var KmzFile = function (binary, fileCache) {
        this._binary = binary;

        this._fileCache = fileCache;
    };

    /**
     * It loads the whole file and register all its contents. Version 0.1 uses file cache mechanism.
     * @returns Promise
     */
    KmzFile.prototype.load = function () {
        var self = this;
        var rootDocument = null;
        var rootFound = false;

        return new JsZip().loadAsync(this._binary).then(function (zipFile) {
            return Promise.all(Object.keys(zipFile.files).map(function (key) {
                return zipFile.files[key];
            }).map(function (file) {
                if (self.hasExtension("kml", file.name) && !rootFound) {
                    rootFound = true;

                    return file.async("text")
                        .then(function (kmlTextRepresentation) {
                            rootDocument = kmlTextRepresentation;
                        });
                } else if(self.hasExtension("kml", file.name)) {
                    return file.async("base64")
                        .then(function (kmlTextRepresentation) {
                            return new WorldWind.KmlFile(kmlTextRepresentation).then(function(kmlFile){
                                self._fileCache.add('href;' + file.name, kmlFile);
                            });
                        });
                } else {
                    return file.async("base64")
                        .then(function (mediaFile) {
                            var dataURI = "data:image/jpeg;base64," + mediaFile;
                            self._fileCache.add('href;' + file.name, dataURI);
                        });
                }
            }));
        }).then(function () {
            return rootDocument;
        });
    };

    /**
     * FOR INTERNAL USE ONLY.
     * Returns a value indicating whether the URL ends with the given extension.
     * @param url {String} Url to a file
     * @param extension {String} Extension of the file.
     * @returns {boolean} true if the extension matches otherwise false
     * @private
     */
    KmzFile.prototype.hasExtension = function (extension, url) {
        return WWUtil.endsWith(url, "." + extension);
    };

    return KmzFile;
});