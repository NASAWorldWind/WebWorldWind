/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports KmlObject
 */
define([
    '../../error/ArgumentError',
    './KmlElements',
    '../../util/Logger',
    '../../error/UnsupportedOperationError'
], function(
    ArgumentError,
    KmlElements,
    Logger,
    UnsupportedOperationError
){
    "use strict";
    /**
     * Constructs an Kml object. Every node in the Kml document is either basic type or Kml object. Applications usually
     * don't call this constructor. It is usually called only by its descendants.
     * @alias KmlObject
     * @classdesc Contains the data associated with every Kml object.
     * @param objectNode Node representing Kml Object
     * @constructor
     * @throws {ArgumentError} If either node is null or id isn't present on the object.
     */
    var KmlObject = function(objectNode) {
        if(!objectNode) {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "KmlObject", "constructor", "Passed node isn't defined.")
            );
        }
        this._node = objectNode;
        this._shape = null;
    };

    Object.defineProperties(KmlObject.prototype, {
        /**
         * Every object, which is part of the KML document has its identity. We will use it for changes in the document
         * for binding.
         * @memberof KmlObject.prototype
         * @type {Number}
         * @readonly
         */
        id: {
            get: function() {
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
            get: function() {
                return this._node;
            }
        }
    });

    /**
     * It returns last node found with given name. It accepts array of possible node names
     * for the node.
     * @param options {Object} name: ['name', 'name2']
     * @returns {Node} Retrieved node or null, if none such node is found.
     */
    KmlObject.prototype.retrieveNode = function(options){
        var nodes = this.retrieveNodes(options);
        if(nodes.length == 0) {
            return null;
        } else {
            return nodes[0];
        }
    };

    /**
     * It retrieves value based on the options. It support retrieving top level attribute as well as value of node.
     * @param options {Object} isAttribute: Boolean, name: String
     * @returns {String} Retrieved value of either node or attribute. If the node doesn't exist return null.
     */
    KmlObject.prototype.retrieve = function(options) {
        var self = this;
        var result = null;
        if(options.isAttribute && self.node.attributes && self.node.attributes &&
            self.node.attributes.getNamedItem(options.name) && self.node.attributes.getNamedItem(options.name).value) {
            result = self.node.attributes.getNamedItem(options.name).value;
        } else {
            options.name = [options.name];
            result = self.retrieveNode(options);
            if(result != null && result.childNodes[0]) {
                result = result.childNodes[0].nodeValue;
            } else if(result != null) {
                result = "";
            }
        }

        if(options.transformer && result != null) {
            result = options.transformer(result);
        }

        return result;
    };

    /**
     * It retrieves all nodes with names in the options.name
     * @param options {Object} name: Array
     * @returns {Array} Array of nodes with given names. If there is no such node empty array is returned.
     */
    KmlObject.prototype.retrieveNodes = function(options) {
        var self = this;
        var result = [];
        [].forEach.call(self.node.childNodes, function(node){
            if(options.name.indexOf(node.nodeName) != -1) {
                result.push(node);
            }
        });

        return result;
    };

    /**
     * Retrieve all shapes, which are children of current node. It fails if there is some element for which there is no
     * adequate internal representation.
     * @returns {Array} Array of retrieved shapes.
     */
    KmlObject.prototype.parse = function(options){
        var self = this;
        var node = options && options.node || self.node;
        var shapes = [];
        [].forEach.call(node.childNodes, function(shape) {
            if(shape.nodeType != 1) {
                return;
            }

            var ShapeClass = self.retrieveElementForNode(shape.nodeName);
            if(ShapeClass == null) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "KmlObject", "parse", "Element, which doesn't have internal representation. Node name: " + shape.nodeName)
                );
            }
            shapes.push(new ShapeClass(shape));
        });

        return shapes;
    };

    /**
     * It returns either associated shape for given element or null, if no such node exist.
     * @param name Name of the element.
     * @returns {KmlObject|null}
     */
    KmlObject.prototype.retrieveElementForNode = function(name) {
        return KmlElements.getKey(name) || null;
    };

    /**
     * Create correct child element for node retrieve by the options.
     * @param options {Object} name: Array
     * @returns {KmlObject|null}
     */
    KmlObject.prototype.createChildElement = function(options) {
        var node = this.retrieveNode(options);
        return new this.retrieveElementForNode(node.nodeName)(node);
    };

    /**
     * To be overridden in subclasses.
     * It renders all objects that are part of the element, which are renderable.
     */
    KmlObject.prototype.render = function() {
        throw new UnsupportedOperationError(
            Logger.logMessage(Logger.LEVEL_SEVERE, "KmlObject", "draw", "Trying to call function on the Object instead of subclasses.")
        );
    };

    return KmlObject;
});