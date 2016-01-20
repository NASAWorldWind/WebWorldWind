/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports KmlObject
 */
define([
    '../../error/ArgumentError',
    '../../util/extend',
    './KmlElements',
    '../../util/Logger',
    '../../util/Promise',
    '../../util/WWUtil'
], function (ArgumentError,
             extend,
             KmlElements,
             Logger,
             Promise,
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
     * @see https://developers.google.com/kml/documentation/kmlreference#object
     */
    var KmlObject = function (options) {
        options = options || {};
        if (!options.objectNode) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "KmlObject", "constructor", "Passed node isn't defined.")
            );
        }
        this._node = options.objectNode;
        this._shape = null;
        this._cache = {};

        this._controls = options.controls || [];

        Object.defineProperties(this, {
            /**
             * Every object, which is part of the KML document has its identity. We will use it for changes in the
             * document for binding.
             * @memberof KmlObject.prototype
             * @type {String}
             * @readonly
             */
            id: {
                get: function () {
                    return this.retrieve({
                        name: 'id',
                        isAttribute: true
                    });
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

        extend(this, KmlObject.prototype);

        this.hook(this._controls, options);
    };


    /**
     * It returns last node found with given name. It accepts array of possible node names
     * for the node.
     * @param options {Object} name: ['name', 'name2']
     * @returns {Node} Retrieved node or null, if none such node is found.
     */
    KmlObject.prototype.retrieveNode = function (options) {
        var nodes = this.retrieveNodes(options);
        if (nodes.length == 0) {
            return null;
        } else {
            return nodes[0];
        }
    };

    /**
     * It allows retrieval of attributes from any child node. If kml node contains another node, where the values
     * are given as attributes, this is way to go. It can retrieve the node and find the correct attribute on it.
     * @param options {Object}
     * @param options.name {String} Name of the node to retrieve.
     * @param options.attributeName {String} Name of the attribute to retrieve from given Node
     * @returns {String | null} Either found value or null if such value doesn't exist.
     */
    KmlObject.prototype.retrieveAttribute = function (options) {
        if (!options.name || !options.attributeName) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_WARNING, "KmlObject", "retrieveAttribute", "name and attributeName" +
                    " must be specified. Name: " + options.name + " Attribute Name: " + options.attributeName)
            );
        }
        var validNode = this.retrieveNode(options);
        if (this.doesAttributeExist(validNode, options.attributeName)) {
            return this.getValueOfAttribute(validNode, options.attributeName);
        }
        return null;
    };

    // Intentionally undocumented. Internal use only.
    KmlObject.prototype.doesAttributeExist = function (node, attribute) {
        return node.attributes && node.attributes && node.attributes.getNamedItem(attribute) &&
            node.attributes.getNamedItem(attribute).value;
    };

    // Intentionally undocumented. Internal use only.
    KmlObject.prototype.getValueOfAttribute = function (node, attributeName) {
        return node.attributes.getNamedItem(attributeName).value;
    };

    /**
     * It retrieves value based on the options. It support retrieving top level attribute as well as value of node.
     * @param options {Object}
     * @param options.isAttribute {Boolean} Whether it is attribute or Node.
     * @param options.name {String} Name of either the Node or the attribute
     * @returns {String} Retrieved value of either node or attribute. If the node doesn't exist return null.
     */
    KmlObject.prototype.retrieve = function (options) {
        var self = this;
        var result = null;
        if (options.isAttribute && self.doesAttributeExist(self.node, options.name)) {
            result = self.getValueOfAttribute(self.node, options.name);
        } else {
            options.name = [options.name];
            result = self.retrieveNode(options);
            if (result != null && result.childNodes[0]) {
                result = result.childNodes[0].nodeValue;
            } else if (result != null) {
                result = "";
            }
        }

        if (options.transformer && result != null) {
            result = options.transformer(result);
        }

        return result;
    };

    /**
     * It retrieves all nodes with names in the options.name
     * @param options {Object}
     * @param options.name {String[]} Names representing childNodes to be retrieved.
     * @returns {Node[]} Array of nodes with given names. If there is no such node empty array is returned.
     */
    KmlObject.prototype.retrieveNodes = function (options) {
        var self = this;
        var result = [];
        [].forEach.call(self.node.childNodes, function (node) {
            if (options.name.indexOf(node.nodeName) != -1) {
                result.push(node);
            }
        });

        return result;
    };

    /**
     * Retrieve all shapes, which are children of current node. It fails if there is some element for which there is no
     * adequate internal representation.
     * @param options {Object}
     * @param options.node {Node} Node to parse.
     * @returns {KmlObject[]} Array of retrieved shapes.
     */
    KmlObject.prototype.parse = function (options) {
        // Implement internal cache.
        var self = this;
        if (!self._cache) {
            self._cache = {};
        }
        var node = options && options.node || self.node;
        var shapes = [];
        [].forEach.call(node.childNodes, function (childNode) {
            if (childNode.nodeType != 1) {
                return;
            }

            self.parseOneNode(childNode, shapes);
        });

        return shapes;
    };

    /**
     * It parses one node and create valid object based on this information.
     * @param childNode {Node} Node which is being parsed into the element.
     * @param shapes {KmlObject[]} Array of returned shapes it is in as well as out parameter.
     */
    KmlObject.prototype.parseOneNode = function (childNode, shapes) {
        var cached = this.retrieveFromCache(childNode);
        if (cached.element) {
            shapes.push(cached.element);
            return;
        }

        var self = this;
        var style = new Promise(function (resolve) {
            if (self.getStyle) {
                resolve(self.getStyle());
            } else {
                // Maybe reject. We will see later.
                resolve(null);
            }
        });

        var shape = this.instantiateDescendant(childNode.nodeName, childNode, style);
        if (!shape) {
            return;
        }
        this._cache[cached.id] = shape;
        shapes.push(shape);
    };

    /**
     * Looks into the internal cache. If the node was already parsed it is stored in the cache associated with the
     * current node. If the cache doesn't exist so far, create one.
     * @param node {Node} node to be retrieved from cache.
     * @returns {*}
     */
    KmlObject.prototype.retrieveFromCache = function (node) {
        var id;
        if (this.doesAttributeExist(node, "id")) {
            id = this.getValueOfAttribute(node, "id");
        } else {
            id = WWUtil.guid();
            var idAttr = node.ownerDocument.createAttribute("id");
            idAttr.value = id;
            node.setAttributeNode(idAttr);
        }

        if (this._cache[id]) {
            return {id: id, element: this._cache[id]};
        } else {
            return {id: id, element: null};
        }
    };

    /**
     * It returns either associated shape for given element or null, if no such node exist.
     * @param name {String} Name of the element.
     * @returns {KmlObject|null}
     */
    KmlObject.prototype.retrieveElementForNode = function (name) {
        return KmlElements.getKey(name) || null;
    };

    /**
     * Create correct child element for node retrieve by the options.
     * @param options {Object}
     * @param options.name {String[]} Names of children to retrieve.
     * @returns {KmlObject|null}
     */
    KmlObject.prototype.createChildElement = function (options) {
        var node = this.retrieveNode(options);
        if (node == null) {
            return null;
        }

        // Take cache into account.
        var cached = this.retrieveFromCache(node);
        if (cached.element) {
            return cached.element;
        }

        var element = this.instantiateDescendant(node.nodeName, node, this.getStyle());
        this._cache[cached.id] = element;
        return element;
    };

    /**
     * It finds correct element and then it retrieves
     * @param name {String} Name of the node.
     * @param node {Node} Node which is represented by this Kml Element
     * @param style {Promise} Promise of the style to be delivered.
     * @returns {KmlObject} Descendant of the KmlObject.
     */
    KmlObject.prototype.instantiateDescendant = function (name, node, style) {
        var constructor = this.retrieveElementForNode(name);
        if (constructor == null) {
            Logger.logMessage(Logger.LEVEL_WARNING, "KmlObject", "parse", "Element, which doesn't have internal " +
                "representation. Node name: " + name);
            return null;
        }

        return new constructor({
            objectNode: node,
            style: style,
            controls: this._controls
        });
    };

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
     * This function solves update. It offers some hooks, which may be overridden in subclasses.
     * What does this method do, when there are no renderables to speak about?
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
    KmlObject.prototype.update = function (pOptions) {
        var options = WWUtil.clone(pOptions);

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