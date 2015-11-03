/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/extend',
    './../KmlObject',
    '../KmlAbstractView',
    '../KmlFile',
    '../KmlFileCache',
    '../styles/KmlStyle',
    '../KmlRegion',
    '../KmlTimePrimitive',
    '../../../util/Promise',
    '../../../util/WWUtil'
], function (extend,
             KmlObject,
             KmlAbstractView,
             KmlFile,
             KmlFileCache,
             KmlStyle,
             KmlRegion,
             KmlTimePrimitive,
             Promise,
             WWUtil) {
    "use strict";
    /**
     * Constructs an KmlFeature. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read
     * @alias KmlFeature
     * @classdesc Contains the data associated with KmlFeature.
     * @param featureNode {Node} Node representing Kml Feature
     * @param pStyle {Promise} Promise of the future style.
     * @constructor
     * @throws {ArgumentError} If the node is null.
     * @see https://developers.google.com/kml/documentation/kmlreference#feature
     */
    var KmlFeature = function (featureNode, pStyle) {
        KmlObject.call(this, featureNode);
        this._style = pStyle;

        Object.defineProperties(this, {
            /**
             * Name of this feature. Every feature should have name.
             * @memberof KmlFeature.prototype
             * @type {String}
             * @readonly
             */
            name: {
                get: function () {
                    return this.retrieve({name: 'name'});
                }
            },

            /**
             * Visibility of current feature. It is possible for some features to be invisible.
             * @memberof KmlFeature.prototype
             * @type {Boolean}
             * @readonly
             */
            visibility: {
                get: function () {
                    return this.retrieve({name: 'visibility', transformer: WWUtil.transformToBoolean});
                }
            },

            /**
             * It is applied only to Document, Folder and NetworkLink and represents whether they should be rendered
             * collapsed or expanded.
             * @memberof KmlFeature.prototype
             * @type {Boolean}
             * @readonly
             */
            open: {
                get: function () {
                    return this.retrieve({name: 'open', transformer: WWUtil.transformToBoolean});
                }
            },

            /**
             * It represents unstructured address associated with the Feature.
             * @memberof KmlFeature.prototype
             * @type {String}
             * @readonly
             */
            address: {
                get: function () {
                    return this.retrieve({name: 'address'});
                }
            },

            /**
             * It represents phone number associated with current feature. Quite probably irrelevant information.
             * @memberof KmlFeature.prototype
             * @type {String}
             * @readonly
             */
            phoneNumber: {
                get: function () {
                    return this.retrieve({name: 'phoneNumber'});
                }
            },

            /**
             * It represents description of this feature. It can be displayed as a part of the feature.
             * @memberof KmlFeature.prototype
             * @type {String}
             * @readonly
             */
            description: {
                get: function () {
                    return this.retrieve({name: 'description'});
                }
            },

            /**
             * URL of a <Style> or <StyleMap> defined in a Document. If the style is in the same file, use a #
             * reference. If the style is defined in an external file, use a full URL along with # referencing. If it
             * references remote URL, this server must support CORS for us to be able to download it.
             * @memberof KmlFeature.prototype
             * @type {String}
             * @readonly
             */
            styleUrl: {
                get: function () {
                    return this.retrieve({name: 'styleUrl'});
                }
            },

            /**
             * A short description of the feature. In Google Earth, this description is displayed in the Places panel
             * under the name of the feature. If a Snippet is not supplied, the first two lines of the <description>
             * are used. In Google Earth, if a Placemark contains both a description and a Snippet, the <Snippet>
             * appears beneath the Placemark in the Places panel, and the <description> appears in the Placemark's
             * description balloon. This tag does not support HTML markup. <Snippet> has a maxLines attribute, an
             * integer that specifies the maximum number of lines to display.
             * @memberof KmlFeature.prototype
             * @type {String}
             * @readonly
             */
            Snippet: {
                get: function () {
                    return this.retrieve({name: 'Snippet'});
                }
            },

            /**
             * It represents one of the AbstractViews associated with current Feature. Specific implementation of
             * AbstractView will be returned.
             * @memberof KmlFeature.prototype
             * @type {KmlAbstractView}
             * @readonly
             */
            AbstractView: {
                get: function () {
                    return this.createChildElement({
                        name: KmlAbstractView.prototype.getTagNames()
                    });
                }
            },

            /**
             * It represents one of the TimePrimitives associated with current Feature. Specific implementation of
             * TimePrimitive will be returned.
             * @memberof KmlFeature.prototype
             * @type {KmlTimePrimitive}
             * @readonly
             */
            TimePrimitive: {
                get: function () {
                    return this.createChildElement({
                        name: KmlTimePrimitive.prototype.getTagNames()
                    });
                }
            },

            /**
             * One style element per Feature, with possible children of different substyles.
             * @memberof KmlFeature.prototype
             * @type {KmlStyle}
             * @readonly
             */
            StyleSelector: {
                get: function () {
                    return this.createChildElement({
                        name: KmlStyle.prototype.getTagNames()
                    });
                }
            },

            /**
             * Features and geometry associated with a Region are drawn only when the Region is active. See <Region>.
             * @memberof KmlFeature.prototype
             * @type {KmlRegion}
             * @readonly
             */
            Region: {
                get: function () {
                    return this.createChildElement({
                        name: KmlRegion.prototype.getTagNames()
                    });
                }
            }
        });

        extend(this, KmlFeature.prototype);
    };

    /**
     * Returns tag name of all descendants of this abstract node.
     * @returns {String[]}
     */
    KmlFeature.prototype.getTagNames = function () {
        return ['NetworkLink', 'Placemark', 'PhotoOverlay', 'ScreenOverlay', 'GroundOverlay', 'Folder',
            'Document'];
    };

    /**
     * Gets promise of the style pased on the children of this node.
     * @returns {Promise} It returns promise of the style.
     */
    KmlFeature.prototype.getStyle = function () {
        var self = this;
        if (this._pStyle) {
            return this._pStyle;
        }
        this._pStyle = new Promise(function (resolve) {
            // Understand styleUrl
            var filePromise;
            if (self.styleUrl) {
                filePromise = KmlFileCache.retrieve(self.styleUrl);
                if(!filePromise) {
                    filePromise = new KmlFile({url: self.styleUrl});
                    KmlFileCache.add(filePromise);
                }
                filePromise.then(function(kmlFile){
                    kmlFile.resolveStyle(self.styleUrl).then(function(style){
                        resolve(style);
                    });
                });
            } else {
                // TODO: Take into account this._style if present.

                // Resolve this promise right now.
                // Move this resolve to the end of the stack to prevent recursion.
                window.setTimeout(function () {
                    resolve(self.StyleSelector);
                }, 0);
            }
        });
        // Use also styleUrl if valid and StyleSelector.
        return this._pStyle;
    };

    KmlFeature.prototype.isFeature = function() {
        return true;
    };

    return KmlFeature;
});