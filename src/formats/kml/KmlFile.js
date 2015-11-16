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
        './KmlFileCache',
        './styles/KmlStyle',
        './styles/KmlStyleMap',
        '../../util/Logger',
        '../../util/Promise',
        '../../util/Remote',
        '../../util/XmlDocument',
        './KmlElements',
        './KmlObject'
    ],
    function (ArgumentError,
              JsZip,
              KmlFileCache,
              KmlStyle,
              KmlStyleMap,
              Logger,
              Promise,
              Remote,
              XmlDocument,
              KmlElements,
              KmlObject) {
        "use strict";

        /**
         * Constructs an object for Kml file. Applications usually don't call this constructor.
         * Parses associated KmlFile and allows user to draw the whole KmlFile in passed layer. The whole file is
         * rendered in one Layer.
         * @constructor
         * @param {Object} Different options specifying how will the file behave.
         * @alias KmlFile
         * @classdesc Support for Kml File parsing and display.
         */
        var KmlFile = function (options) {
            var self = this;
            if (!options || (!options.document && !options.url)) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "KmlFile", "constructor", "invalidDocumentPassed")
                );
            }

            // Default values.
            options.local = options.local || false;

            var filePromise;
            if (options.local) {
                this._document = new XmlDocument(options.document).dom();
                filePromise = new Promise(function (resolve) {
                    window.setTimeout(function () {
                        resolve(self);
                    }, 0);
                });
                KmlFileCache.add('', filePromise);
                return filePromise;
            } else {
                // Load the document
                filePromise = new Promise(function (resolve) {
                    var promise = self.requestUrl(options.url, options);
                    promise.then(function (loadedDocument) {
                        var rootDocument;
                        if (options.url.indexOf('.kmz') == -1) {
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
                        window.setTimeout(function () {
                            resolve(self);
                        }, 0);
                    });
                });
                KmlFileCache.add(options.url, filePromise);
                return filePromise;
            }
        };

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
                    return this.parseDocument();
                }
            },

            /**
             * Root node of current document associated with this file.
             * @type {Node}
             * @memberof KmlFile.prototype
             * @readonly
             */
            node: {
                get: function () {
                    return this._document.getElementsByTagName("kml")[0];
                }
            }
        });

        /**
         * @see KmlObject.prototype.parse
         */
        KmlFile.prototype.parseDocument = function () {
            return KmlObject.prototype.parse.call(this);
        };

        /**
         * It understands the name of the node and based on this name returns correct shape, which must be instantiated.
         * @param name
         * @returns {KmlObject} Descendant of KmlObject or null if none with given name exists.
         */
        KmlFile.prototype.retrieveElementForNode = KmlObject.prototype.retrieveElementForNode;

        /**
         * It renders all shapes, which are associated with current file.
         * @param layer
         * @throws {ArgumentError} In case the layer into which it should be rendered isn't supplied
         */
        KmlFile.prototype.update = function (layer) {
            if (!layer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "KmlFile", "update", "Layer must be defined in order to update document.")
                );
            }

            this.shapes.forEach(function (shape) {
                shape.update(layer);
            });
        };

        KmlFile.prototype.requestUrl = function (url, options) {
            options.url = url;
            if ((url.endsWith && url.endsWith(".kmz")) || (url.indexOf(".kmz") != -1)) {
                options.zip = true;
            } else {
                options.ajax = true;
            }

            return new Remote(options);
        };

        KmlFile.prototype.resolveStyle = function (id) {
            var self = this;
            id = id.substring(id.indexOf('#') + 1, id.length);
            // It returns promise of the Style.
            return new Promise(function (resolve, reject) {
                var style = self._document.getElementById(id);
                if (!style) {
                    reject();
                }

                if(style.nodeName == KmlStyle.prototype.getTagNames()[0]) {
                    resolve(new KmlStyle(style));
                } else if(style.nodeName == KmlStyleMap.prototype.getTagNames()[0]) {
                    resolve(new KmlStyleMap(style));
                } else {
                    Logger.logMessage(Logger.LEVEL_WARNING, "KmlFile", "resolveStyle", "Style must contain either" +
                        " Style node or StyleMap node.");
                }
            });
        };

        return KmlFile;
    });
