/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlObject',
    '../KmlAbstractView',
    '../KmlFile',
    '../KmlFileCache',
    '../styles/KmlStyleMap',
    '../styles/KmlStyleSelector',
    '../KmlRegion',
    '../KmlTimePrimitive',
    '../util/NodeTransformers',
    '../../../util/Promise',
    '../util/StyleResolver'
], function (KmlObject,
             KmlAbstractView,
             KmlFile,
             KmlFileCache,
             KmlStyleMap,
             KmlStyleSelector,
             KmlRegion,
             KmlTimePrimitive,
             NodeTransformers,
             Promise,
             StyleResolver) {
    "use strict";
    /**
     * Constructs an KmlFeature. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read
     * @alias KmlFeature
     * @classdesc Contains the data associated with KmlFeature.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Feature
     * @constructor
     * @throws {ArgumentError} If the node is null.
     * @see https://developers.google.com/kml/documentation/kmlreference#feature
     * @augments KmlObject
     */
    var KmlFeature = function (options) {
        //noinspection JSUndefinedPropertyAssignment
        this.isFeature = options.isFeature = true;

        KmlObject.call(this, options);

        this._pStyle = null;
    };

    KmlFeature.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlFeature.prototype, {
		/**
         * Style of this feature. Every feature should have a style. If there is no Style, null is returned.
         */
        style: {
            get: function() {
                return this._pStyle;
            }
        },

        /**
         * Name of this feature. Every feature should have name.
         * @memberof KmlFeature.prototype
         * @type {String}
         * @readonly
         */
        kmlName: {
            get: function () {
                return this._factory.specific(this, {name: 'name', transformer: NodeTransformers.string});
            }
        },

        /**
         * Visibility of current feature. It is possible for some features to be invisible.
         * @memberof KmlFeature.prototype
         * @type {Boolean}
         * @readonly
         */
        kmlVisibility: {
            get: function () {
                return this._factory.specific(this, {name: 'visibility', transformer: NodeTransformers.boolean});
            }
        },

        /**
         * It is applied only to Document, Folder and NetworkLink and represents whether they should be rendered
         * collapsed or expanded.
         * @memberof KmlFeature.prototype
         * @type {Boolean}
         * @readonly
         */
        kmlOpen: {
            get: function () {
                return this._factory.specific(this, {name: 'open', transformer: NodeTransformers.boolean});
            }
        },

        /**
         * It represents unstructured address associated with the Feature.
         * @memberof KmlFeature.prototype
         * @type {String}
         * @readonly
         */
        kmlAddress: {
            get: function () {
                return this._factory.specific(this, {name: 'address', transformer: NodeTransformers.string});
            }
        },

        /**
         * It represents phone number associated with current feature. Quite probably irrelevant information.
         * @memberof KmlFeature.prototype
         * @type {String}
         * @readonly
         */
        kmlPhoneNumber: {
            get: function () {
                return this._factory.specific(this, {name: 'phoneNumber', transformer: NodeTransformers.string});
            }
        },

        /**
         * It represents description of this feature. It can be displayed as a part of the feature.
         * @memberof KmlFeature.prototype
         * @type {String}
         * @readonly
         */
        kmlDescription: {
            get: function () {
                return this._factory.specific(this, {name: 'description', transformer: NodeTransformers.string});
            }
        },

        /**
         * URL of a &lt;Style&gt; or &lt;StyleMap&gt; defined in a Document. If the style is in the same file, use
         * a # reference. If the style is defined in an external file, use a full URL along with # referencing. If
         * it references remote URL, this server must support CORS for us to be able to download it.
         * @memberof KmlFeature.prototype
         * @type {String}
         * @readonly
         */
        kmlStyleUrl: {
            get: function () {
                return this._factory.specific(this, {name: 'styleUrl', transformer: NodeTransformers.string});
            }
        },

        /**
         * A short description of the feature. In Google Earth, this description is displayed in the Places panel
         * under the name of the feature. If a Snippet is not supplied, the first two lines of the
         * &lt;description&gt; are used. In Google Earth, if a Placemark contains both a description and a Snippet,
         * the &lt;Snippet&gt; appears beneath the Placemark in the Places panel, and the &lt;description&gt;
         * appears in the Placemark's description balloon. This tag does not support HTML markup. &lt;Snippet&gt;
         * has a maxLines attribute, an integer that specifies the maximum number of lines to display.
         * @memberof KmlFeature.prototype
         * @type {String}
         * @readonly
         */
        kmlSnippet: {
            get: function () {
                return this._factory.specific(this, {name: 'Snippet', transformer: NodeTransformers.string});
            }
        },

        /**
         * It represents one of the AbstractViews associated with current Feature. Specific implementation of
         * AbstractView will be returned.
         * @memberof KmlFeature.prototype
         * @type {KmlAbstractView}
         * @readonly
         */
        kmlAbstractView: {
            get: function () {
                return this._factory.any(this, {name: KmlAbstractView.prototype.getTagNames()});
            }
        },

        /**
         * It represents one of the TimePrimitives associated with current Feature. Specific implementation of
         * TimePrimitive will be returned.
         * @memberof KmlFeature.prototype
         * @type {KmlTimePrimitive}
         * @readonly
         */
        kmlTimePrimitive: {
            get: function () {
                return this._factory.any(this, {
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
        kmlStyleSelector: {
            get: function () {
                return this._factory.any(this, {
                    name: KmlStyleSelector.prototype.getTagNames()
                });
            }
        },

        /**
         * Features and geometry associated with a Region are drawn only when the Region is active. See
         * &lt;Region&gt;.
         * @memberof KmlFeature.prototype
         * @type {KmlRegion}
         * @readonly
         */
        kmlRegion: {
            get: function () {
                return this._factory.any(this, {
                    name: KmlRegion.prototype.getTagNames()
                });
            }
        }
    });

	/**
	 * @inheritDoc
     */
    KmlFeature.prototype.render = function(dc, kmlOptions) {
        KmlObject.prototype.render.call(this, dc, kmlOptions);

        this.solveRegion(dc, kmlOptions);
        this.solveStyle(dc, kmlOptions);
        this.solveVisibility(dc, kmlOptions);
    };

    KmlFeature.prototype.solveStyle = function(dc, kmlOptions) {
        this.getStyle(dc);
        if(this.style != null) {
            kmlOptions.lastStyle = this.style;
        } else {
            dc.redrawRequested = true;
        }
    };

    KmlFeature.prototype.solveRegion = function(dc, kmlOptions) {
        if(this.kmlRegion && !this.kmlRegion.intersectsVisible(dc.navigatorState.frustumInModelCoordinates)) {
            kmlOptions.regionInvisible = false;
        }
    };

    KmlFeature.prototype.solveVisibility = function(dc, kmlOptions) {
        if(kmlOptions.lastVisibility === false || kmlOptions.regionInvisible === false) {
            this.enabled = false;
        } else {
            if(this.kmlVisibility === false) {
                kmlOptions.lastVisibility = false;
                this.enabled = false;
            } else {
                if(!this.solveTimeVisibility(dc)) {
                    kmlOptions.lastVisibility = false;
                    this.enabled = false;
                }
            }
        }

        if(this._renderable) {
            this._renderable.enabled = this.enabled;
        }
    };

    /**
     * Internal function for solving the time visibility. The element is visible when its whole range is inside the
     * time range chosen by user.
     */
    KmlFeature.prototype.solveTimeVisibility = function (dc) {
        if (dc.currentTimeInterval) {
            var timeRangeOfFeature = this.kmlTimePrimitive && this.kmlTimePrimitive.timeRange();
            var from = dc.currentTimeInterval[0];
            var to = dc.currentTimeInterval[1];

            if (
                timeRangeOfFeature &&
                (
                    timeRangeOfFeature.from < from ||
                    timeRangeOfFeature.from > to ||
                    timeRangeOfFeature.to > to
                )
            ) {
                return false;
            }
        }

        return true;
    };

    /**
     * @inheritDoc
     */
    KmlFeature.prototype.getStyle = function (dc) {
        if (this._pStyle || (!this.kmlStyleUrl && !this.kmlStyleSelector)) {
            return;
        }

        var self = this;
        new Promise(function (resolve, reject) {
            window.setTimeout(function () {
                // TODO: Refactor handle Remote Style.
                StyleResolver.handleRemoteStyle(self.kmlStyleUrl, self.kmlStyleSelector, resolve, reject);
            }, 0);
        }).then(function(styles){
            self._pStyle = styles;
            dc.redrawRequested = true;
        });
    };

    /**
     * @inheritDoc
     */
    KmlFeature.prototype.getTagNames = function () {
        return ['NetworkLink', 'Placemark', 'PhotoOverlay', 'ScreenOverlay', 'GroundOverlay', 'Folder',
            'Document'];
    };

    return KmlFeature;
});