/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports KmlObject
 */
define([
    '../../error/ArgumentError',
    './util/Attribute',
    './KmlElements',
    './util/KmlElementsFactoryCached',
    '../../util/Logger',
    '../../util/Promise',
    '../../render/Renderable',
    '../../util/WWUtil'
], function (ArgumentError,
             Attribute,
             KmlElements,
             KmlElementsFactoryCached,
             Logger,
             Promise,
             Renderable,
             WWUtil) {
    "use strict";

    /**
     * Constructs an Kml object. Every node in the Kml document is either basic type or Kml object. Applications usually
     * don't call this constructor. It is usually called only by its descendants.
     * It should be treated as mixin.
     * @alias KmlObject
     * @classdesc Contains the data associated with every Kml object.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing Kml Object
     * @param options.controls {KmlControls[]} Controls associated with current Node
     * @constructor
     * @throws {ArgumentError} If either node is null or id isn't present on the object.
     * @augments Renderable
     * @see https://developers.google.com/kml/documentation/kmlreference#object
     */
    var KmlObject = function (options) {
        Renderable.call(this);

        options = options || {};
        if (!options.objectNode) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "KmlObject", "constructor", "Passed node isn't defined.")
            );
        }
        this._node = options.objectNode;
        this._cache = {};
        this._factory = new KmlElementsFactoryCached();

        this._controls = options.controls || [];

        this.hook(this._controls, options);
    };

    KmlObject.prototype = Object.create(Renderable.prototype);

    Object.defineProperties(KmlObject.prototype, {
        /**
         * Every object, which is part of the KML document has its identity. We will use it for changes in the
         * document for binding.
         * @memberof KmlObject.prototype
         * @type {String}
         * @readonly
         */
        id: {
            get: function () {
                return new Attribute(this.node, "id").value();
            }
        },

        /**
         * Node of this object. It may be overridden by other users of some functions like parse.
         * @memberof KmlObject.prototype
         * @type {Node}
         * @readonly
         */
        node: {
            get: function () {
                //noinspection JSPotentiallyInvalidUsageOfThis
                return this._node;
            }
        }
    });

    /**
     * It calls all controls associated with current KmlFile with the link to this.
     * @param controls {KmlControls[]} Controls associated with current tree.
     * @param options {Object} Options to pass into the controls.
     */
    KmlObject.prototype.hook = function (controls, options) {
        var self = this;
        controls.forEach(function (control) {
            control.hook(self, options);
        });
    };

    /**
     * @inheritDoc
     *
     * Available hooks:
     * - getAppliedStyle

     * - beforeStyleResolution - If false is returned, nothing else happens.
     * - styleResolutionStarted - Style is passed in as a parameter.
     * - afterStyleResolution
     *
     * - prepareAttributes: REQUIRED
     * - moveValidProperties
     *
     * @param pOptions {Object} Options to be applied to the updating process. It will be cloned.
     */
    KmlObject.prototype.render = function (dc, pOptions) {
        var options = WWUtil.clone(pOptions || {});
        options.dc = dc;

        if (!this.beforeStyleResolution(options)) {
            return;
        }

        this.solveEnabled(options);

        var self = this;
        self.getAppliedStyle().then(function (styles) {
            self.styleResolutionStarted(styles);
            var normal = styles.normal;
            var highlight = styles.highlight;

            self.attributes = self.prepareAttributes(normal);
            self.highlightAttributes = highlight ? self.prepareAttributes(highlight) : null;
            self.moveValidProperties();

            options.style = self.getStyle();
            self.afterStyleResolution(options);
        });
    };

    /**
     * Hook to be used in relevant subclasses.
     */
    KmlObject.prototype.moveValidProperties = function() {};

    /**
     * It decides whether current shape should be enabled and therefore visible on the map. If any of the ancestors
     * in the document is disabled all their descendants also are. If it isn't and there is information about
     * visibility as a part of this Element respect it, otherwise it is visible.
     * @param options {Object}
     * @param options.enabled {Boolean} Whether this object is enabled or not.
     */
    KmlObject.prototype.solveEnabled = function (options) {
        if (options.enabled == null || typeof options.enabled == 'undefined') {
            if (this.kmlVisibility) {
                this.enabled = options.enabled = this.kmlVisibility;
            }
            else {
                this.enabled = options.enabled = true;
            }
        } else {
            this.enabled = options.enabled;
        }
    };

    /**
     * This method is called during the update lifecycle to retrieve a promise of style.
     * @returns {Promise} Promise of styles used further in the processing.
     */
    KmlObject.prototype.getAppliedStyle = function () {
        return new Promise(function (resolve, reject) {});
    };

    // The parameters are used in the descendants.
    /**
     * This method is called once the style was already resolved but before any further processing goes on.
     * @param styles {Object}
     * @param styles.normal {KmlStyle|null} Style representing the visuals in standard state
     * @param styles.highlight {KmlStyle|null} Style representing the visuals in highlighted state
     */
    KmlObject.prototype.styleResolutionStarted = function (styles) {
    };

    // The parameters are used in the descendants.
    /**
     * This method is called once the style was resolved and all general processing of the style is finished.
     * @param options {Object} Object with options passed into the update.
     */
    KmlObject.prototype.afterStyleResolution = function (options) {
    };

    // The parameters are used in the descendants.
    //noinspection JSUnusedLocalSymbols
    /**
     * This method is called as a first thing in the lifecycle of the update method. It is possible to stop further
     * processing if this method returns false.
     * @param options {Object} Object with options which was passed into the update.
     * @returns {boolean} True continue with the processing. False leave the processing be.
     */
    KmlObject.prototype.beforeStyleResolution = function (options) {
        return true;
    };

    // The parameters are used in the descendants.
    //noinspection JSUnusedLocalSymbols
    /**
     * This method is called during the processing of the update function. It is required and should therefore be
     * overridden. It prepares attributes changing how different attributes are visualized.
     * @param style {KmlStyle} Style to use when preparing different types of attributes.
     */
    KmlObject.prototype.prepareAttributes = function (style) {
        Logger.logMessage(Logger.LEVEL_WARNING, "KmlObject", "prepareAttributes", this.getTagNames()[0] + " doesn't override  " +
            "prepareAttributes.");
        return {};
    };

    /**
     * This is function, which is called to decide which style should be applied.
     * @return {Promise} Promise of the style to be delivered
     */
    KmlObject.prototype.getStyle = function () {
        Logger.logMessage(Logger.LEVEL_WARNING, "KmlObject", "getStyle", this.getTagNames()[0] + " doesn't override  " +
            "getStyle.");
    };

    /**
     * Returns tag name of all descendants of abstract node or the tag name for current node.
     * @returns {String[]}
     */
    KmlObject.prototype.getTagNames = function () {
        return [];
    };

    return KmlObject;
});