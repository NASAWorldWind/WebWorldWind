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
     * Simple factory, which understands the mapping between the XML and the internal Elements. It also incorporates
     * cache, so that the data are't invalidated unless something asks for it.
     * Every Node must have an Id. If such Id doesn't exist then it is created before adding the element into the
     * cache.
     * @constructor
     */
    var KmlElementsFactory = function () {
        this.cache = new TreeKeyValueCache();
    };

    // There are two different things one of them are primitive values
    // Second thing are elements.
    /**
     * 
     * @param element {KmlObject}
     * @param options {Object}
     * @param options.name {String} Name of the element to retrieve from the element
     * @param options.transformer {Function} Function returning correct value. It accepts the node and returns value.
     *  This mechanism can be used for the attributes as well.
     * @return {KmlObject}
     */
    KmlElementsFactory.prototype.specific = function (element, options) {
        // Options contains the name of an element. The Cache must look differently as it must take into account
        // parentNode, which brings second level of cache, where you can retrieve the correct value by the type.
        var parentNode = element.node;
        var child = this.fromCache(parentNode, options.name);
        if(child) {
            return child;
        }

        // Go through children and if encountered the one with specific information store it in the cache and return.
        var result = null;
        [].forEach.call(parentNode.childNodes, function(node){
            if(node.nodeName == options.name) {
                result = options.transformer(node);
            }
        });
        return result;
    };

    /**
     *
     * @param element
     * @param options
     */
    KmlElementsFactory.prototype.all = function (element, options) {

    };


    KmlElementsFactory.prototype.fromCache = function(node, name) {
        var idAttribute = new Attribute(node, "id");
        if (!idAttribute.exists()) {
            idAttribute.save(WWUtil.guid());
        }

        return this.cache.value(node.nodeName + "#" + idAttribute.value(), name);
    };

    var applicationWide = new KmlElementsFactory();
    KmlElementsFactory.applicationWide = function () {
        return applicationWide;
    };

    // Primitives
    KmlElementsFactory.string = function(node) {
        return String(getTextOfNode(node));
    };

    KmlElementsFactory.number = function(node) {
        return Number(getTextOfNode(node));
    };

    KmlElementsFactory.boolean = function(node) {
        return WWUtil.transformToBoolean(getTextOfNode(node));
    };
    // End of primitive transformers

    KmlElementsFactory.kmlObject = function(node) {
        var nameOfElement = node.nodeName;
        var constructor = KmlElements.getKey(nameOfElement);
        return new constructor({objectNode: node});
    };

    function getTextOfNode(node){
        var result;
        if (node != null && node.childNodes[0]) {
            result = node.childNodes[0].nodeValue;
        } else if (node != null) {
            result = "";
        }
        return result;
    }

    return KmlElementsFactory;
});