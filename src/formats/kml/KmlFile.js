/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
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
    './util/Remote',
    './util/StyleResolver',
    '../../util/XmlDocument'
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
             Remote,
             StyleResolver,
             XmlDocument) {
    "use strict";

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
        
        var filePromise;
        // Load the document
        filePromise = new Promise(function (resolve) {
            var promise = self.requestRemote(url);
            promise.then(function (loadedDocument) {
                var rootDocument;
                if (url.indexOf('.kmz') == -1) {
                    rootDocument = loadedDocument;
                } else {
                    var kmzFile = new JsZip();
                    kmzFile.load(loadedDocument);
                    kmzFile.files.forEach(function (file) {
                        if (file.endsWith(".kml") && rootDocument == null) {
                            rootDocument = file.asText();
                        }
                    });
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
    KmlFile.prototype.render = function (dc) {
        var self = this;
        this.shapes.forEach(function (shape) {
            shape.render(dc, {
                lastStyle: null,
                lastVisibility: null,
                currentTimeInterval: null,
                regionInvisible: null,
                fileCache: self._fileCache,
                styleResolver: self._styleResolver
            });
        });
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
        if ((url.endsWith && url.endsWith(".kmz")) || (url.indexOf(".kmz") != -1)) {
            options.zip = true;
        } else {
            options.ajax = true;
        }

        return new Remote(options);
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
                resolve(new KmlStyle({objectNode: style}));
            } else if (style.nodeName == KmlStyleMap.prototype.getTagNames()[0]) {
                resolve(new KmlStyleMap({objectNode: style}));
            } else {
                Logger.logMessage(Logger.LEVEL_WARNING, "KmlFile", "resolveStyle", "Style must contain either" +
                    " Style node or StyleMap node.");
            }
        });
    };

    return KmlFile;
});
