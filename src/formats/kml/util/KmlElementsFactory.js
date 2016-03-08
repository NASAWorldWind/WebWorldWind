/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './Attribute',
    '../KmlElements',
    './TreeKeyValueCache',
    '../../../util/WWUtil'
], function (Attribute,
             KmlElements,
             TreeKeyValueCache,
             WWUtil) {
    "use strict";

    /**
     * Simple factory, which understands the mapping between the XML and the internal Elements.
     * @constructor
     */
    var KmlElementsFactory = function () {
    };

    /**
     * It retrieves specific child of the element. This one can retrieve primitive as well as KmlObject. Transformer
     * is used to get relevant value from the node.
     * @param element {KmlObject} Element whose children are considered.
     * @param options {Object}
     * @param options.name {String} Name of the element to retrieve from the element
     * @param options.transformer {Function} Function returning correct value. It accepts the node and returns value.
     *  This mechanism can be used for the attributes as well.
     * @return Relevant value.
     */
    KmlElementsFactory.prototype.specific = function (element, options) {
        var parentNode = element.node;
        var result = null;
        [].forEach.call(parentNode.childNodes, function (node) {
            if (node.nodeName == options.name) {
                result = options.transformer(node);
            }
        });
        return result;
    };

    /**
     * It returns child which is among the ones in the options.name. It is meant to be used when any descendant is
     * accepted.
     * @param element {KmlObject} Element whose children are scanned.
     * @param options {Object}
     * @param options.name {String[]} All names which are accepted to return.
     */
    KmlElementsFactory.prototype.any = function (element, options) {
        var parentNode = element.node;

        var result = null;
        [].forEach.call(parentNode.childNodes, function (node) {
            if (options.name.indexOf(node.nodeName) != -1) {
                result = KmlElementsFactory.kmlObject(node);
            }
        });
        return result;
    };

    /**
     * It returns all children, which it is possible to map on the KmlObject.
     * @param element Element whose children we want to retrieve.
     */
    KmlElementsFactory.prototype.all = function (element) {
        var parentNode = element.node;
        
        var results = [];
        [].forEach.call(parentNode.childNodes, function (node) {
            var element = KmlElementsFactory.kmlObject(node);
            if (element) {
                results.push(element);
            }
        });
        return results;
    };

    var applicationWide = new KmlElementsFactory();
    /**
     * It returns application wide instance of the factory.
     * @returns {KmlElementsFactory} Singleton instance of factory for Application.
     */
    KmlElementsFactory.applicationWide = function () {
        return applicationWide;
    };

    // Primitives
    /**
     * Transforms node to its String value.
     * @param node {Node} Node to transform
     * @returns {String} Text representation of node value.
     */
    KmlElementsFactory.string = function (node) {
        return String(getTextOfNode(node));
    };

    /**
     * Transforms node to its Numeric value.
     * @param node {Node} Node to transform
     * @returns {Number} Numeric representation of node value.
     */
    KmlElementsFactory.number = function (node) {
        return Number(getTextOfNode(node));
    };

    /**
     * Transforms node to its boolean value.
     * @param node {Node} Node to transform
     * @returns {Boolean} Boolean representation of node value.
     */
    KmlElementsFactory.boolean = function (node) {
        return WWUtil.transformToBoolean(getTextOfNode(node));
    };

    /**
     * This function retrieves the current value for node.
     * @param node {Node} Node for which we want to retrieve the value.
     * @returns {String} Text value of the node.
     */
    function getTextOfNode(node) {
        var result;
        if (node != null && node.childNodes[0]) {
            result = node.childNodes[0].nodeValue;
        } else if (node != null) {
            result = "";
        }
        return result;
    }
    // End of primitive transformers

    /**
     * This function retrieves relevant KmlObject to the Node. If there is such element it returns created element,
     * otherwise it returns null
     * @param node {Node} Node to transform
     * @returns {KmlObject|null} KmlObject representation for the node.
     */
    KmlElementsFactory.kmlObject = function (node) {
        var nameOfElement = node.nodeName;
        var constructor = KmlElements.getKey(nameOfElement);
        if (!constructor) {
            return null;
        }
        return new constructor({objectNode: node});
    };

    return KmlElementsFactory;
});