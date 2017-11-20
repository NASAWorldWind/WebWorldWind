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
 * It is basically a collection of KmlRecords.
 * @exports KmlParser
 */
define([
    '../../error/ArgumentError',
    '../../util/jszip',
    './KmlElements',
    './KmlFileCache',
    './KmlObject',
    './styles/KmlStyle',
    './styles/KmlStyleMap',
    './KmlTimeSpan',
    './KmlTimeStamp',
    '../../util/Logger',
    '../../util/Promise',
    './util/RefreshListener',
    './util/RemoteFile',
    './util/StyleResolver',
    '../../util/XmlDocument',
    '../../util/WWUtil'
], function (ArgumentError,
             JsZip,
             KmlElements,
             KmlFileCache,
             KmlObject,
             KmlStyle,
             KmlStyleMap,
             KmlTimeSpan,
             KmlTimeStamp,
             Logger,
             Promise,
             RefreshListener,
             RemoteFile,
             StyleResolver,
             XmlDocument,
             WWUtil) {
    "use strict";

    // TODO: Make sure that the KmlFile is also rendered as a part of this hierarchy and not added to the layer.
    /**
     * Constructs an object for Kml file. Applications usually don't call this constructor.
     * Parses associated KmlFile and allows user to draw the whole KmlFile in passed layer. The whole file is
     * rendered in one Layer.
     * @constructor
     * @param url {String} Url of the remote document.
     * @param controls {KmlControls[]} List of controls applied to this File.
     * @alias KmlFile
     * @classdesc Support for Kml File parsing and display.
     * @augments KmlObject
     */
    var KmlFile = function (url, controls) {
        var self = this;
        if (!url) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "KmlFile", "constructor", "invalidDocumentPassed")
            );
        }

        // Default values.
        this._controls = controls || null;
        this._fileCache = new KmlFileCache();
        this._styleResolver = new StyleResolver(this._fileCache);
        this._listener = new RefreshListener();
        this._headers = null;
        
        var filePromise;
        // Load the document
        filePromise = new Promise(function (resolve) {
            var promise = self.requestRemote(url);
            promise.then(function (options) {
                var rootDocument = null;
                var loadedDocument = options.text;
                self._headers = options.headers;
                if (!self.hasExtension("kmz", url)) {
                    rootDocument = loadedDocument;
                } else {
                    var kmzFile = new JsZip();
                    kmzFile.load(loadedDocument);
                    for(var key in kmzFile.files) {
                        var file = kmzFile.files[key];
                        if (rootDocument == null && self.hasExtension("kml", file.name)) {
                            rootDocument = file.asText();
                        }
                    }
                }

                self._document = new XmlDocument(rootDocument).dom();
                KmlObject.call(self, {objectNode: self._document.documentElement, controls: controls});

                window.setTimeout(function () {
                    resolve(self);
                }, 0);
            });
        });
        this._fileCache.add(url, filePromise);
        return filePromise;
    };

    KmlFile.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlFile.prototype, {
        /**
         * Contains shapes present in the document. Cache so that we don't need to parse the document every time
         * it is passed through.
         * @type {KmlObject[]}
         * @memberof KmlFile.prototype
         * @readonly
         */
        shapes: {
            get: function () {
                return this._factory.all(this);
            }
        }
    });

    /**
     * @inheritDoc
     */
    KmlFile.prototype.render = function (dc, kmlOptions) {
        var self = this;
        kmlOptions = kmlOptions || {};
        this.shapes.forEach(function (shape) {
            shape.render(dc, {
                lastStyle: kmlOptions.lastStyle || null,
                lastVisibility: kmlOptions.lastVisibility || null,
                currentTimeInterval: kmlOptions.currentTimeInterval || null,
                regionInvisible: kmlOptions.regionInvisible || null,
                fileCache: self._fileCache,
                styleResolver: self._styleResolver,
                listener: self._listener,
                activeEvents: self._listener.getActiveEvents()
            });
        });
    };

    /**
     * FOR INTERNAL USE ONLY.
     * Returns a value indicating whether the URL ends with the given extension.
     * @param url {String} Url to a file
     * @returns {boolean} true if the extension matches otherwise false
     */
    KmlFile.prototype.hasExtension = function (extension, url) {
        return WWUtil.endsWith(url, "." + extension);
    };

    /**
     * FOR INTERNAL USE ONLY.
     * Based on the information from the URL, return correct Remote object.
     * @param url {String} Url of the document to retrieve.
     * @returns {Promise} Promise of Remote.
     */
    KmlFile.prototype.requestRemote = function (url) {
        var options = {};
        options.url = url;
        if (this.hasExtension("kmz", url)) {
            options.zip = true;
        } else {
            options.ajax = true;
        }

        return new RemoteFile(options).get();
    };

	/**
     * It finds the style in the document.
     * @param pId {String} Id of the style.
     */
    KmlFile.prototype.resolveStyle = function (pId) {
        var self = this;
        var id = pId.substring(pId.indexOf('#') + 1, pId.length);
        // It returns promise of the Style.
        return new Promise(function (resolve, reject) {
            var style;
            if (self._document.querySelector) {
                style = self._document.querySelector("*[id='" + id + "']");
            } else {
                style = self._document.getElementById(id);
            }
            if (!style || style == null) {
                reject();
            }

            if (style.nodeName == KmlStyle.prototype.getTagNames()[0]) {
                resolve(new KmlStyle({objectNode: style}, {styleResolver: self._styleResolver}));
            } else if (style.nodeName == KmlStyleMap.prototype.getTagNames()[0]) {
                resolve(new KmlStyleMap({objectNode: style}, {styleResolver: self._styleResolver}));
            } else {
                Logger.logMessage(Logger.LEVEL_WARNING, "KmlFile", "resolveStyle", "Style must contain either" +
                    " Style node or StyleMap node.");
            }
        });
    };

	/**
     * This function returns expire time of this file in miliseconds.
     * @returns {Number} miliseconds for this file to expire.
     */
    KmlFile.prototype.getExpired = function() {
        var expireDate = new Date(this._headers.getRequestHeader("Expires"));
        var currentDate = new Date();
        return currentDate.getTime - expireDate.getTime();
    };

    return KmlFile;
});
