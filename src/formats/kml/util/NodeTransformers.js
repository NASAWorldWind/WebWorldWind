/**
 * Created by jbalhar on 9. 3. 2016.
 */
define([
    './Attribute',
    '../KmlElements',
    '../../../util/WWUtil'
], function(Attribute,
            KmlElements,
            WWUtil){
    var NodeTransformers = function(){};

    // Primitives
    /**
     * Transforms node to its String value.
     * @param node {Node} Node to transform
     * @returns {String} Text representation of node value.
     */
    NodeTransformers.string = function (node) {
        return String(getTextOfNode(node));
    };

    /**
     * Transforms node to its Numeric value.
     * @param node {Node} Node to transform
     * @returns {Number} Numeric representation of node value.
     */
    NodeTransformers.number = function (node) {
        return Number(getTextOfNode(node));
    };

    /**
     * Transforms node to its boolean value.
     * @param node {Node} Node to transform
     * @returns {Boolean} Boolean representation of node value.
     */
    NodeTransformers.boolean = function (node) {
        return WWUtil.transformToBoolean(getTextOfNode(node));
    };

    /**
     * Transform node to the date
     * @param node {Node} Node to transform
     * @returns {Date} Date representing current node.
     */
    NodeTransformers.date = function(node) {
        return WWUtil.date(getTextOfNode(node));
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
    NodeTransformers.kmlObject = function (node) {
        var nameOfElement = node.nodeName;
        var constructor = KmlElements.getKey(nameOfElement);
        if (!constructor) {
            return null;
        }
        return new constructor({objectNode: node});
    };

    /**
     * This transforming function works with attributes.
     * @param name {String} Name of the attribute to retrieve.
     * @returns {Function} Transformer function.
     */
    NodeTransformers.attribute = function(name) {
        return function(node) {
            return new Attribute(node, name).value();
        };
    };
    
    return NodeTransformers;
});