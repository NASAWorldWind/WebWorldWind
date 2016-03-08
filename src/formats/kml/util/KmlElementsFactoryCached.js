/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './Attribute',
    './KmlElementsFactory',
    './TreeKeyValueCache',
    '../../../util/WWUtil'
], function (
    Attribute,
    KmlElementsFactory,
    TreeKeyValueCache,
    WWUtil
) {
    "use strict";

    /**
     *
     * @constructor
     */
    var KmlElementsFactoryCached = function() {
        this.internalFactory = new KmlElementsFactory();
        this.cache = new TreeKeyValueCache();
    };

    KmlElementsFactoryCached.prototype.all = function(element){
        var parentNode = element.node;
        var children = this.cache.level(this.cacheKey(element.node));
        if (children) {
            var results = [];
            for(var key in children) {
                if(children.hasOwnProperty(key)) {
                    results.push(children[key]);
                }
            }
            return results;
        }

        var elements = this.internalFactory.all(element);

        var self = this;
        elements.forEach(function(element){
            self.cache.add(self.cacheKey(parentNode), self.cacheKey(element.node), element);
        });
        return elements;
    };

    KmlElementsFactoryCached.prototype.specific = function(element, options){
        var parentNode = element.node;
        var child = this.cache.value(this.cacheKey(parentNode), options.name);
        if (child) {
            return child;
        }

        var result = this.internalFactory.specific(element, options);
        
        this.cache.add(this.cacheKey(parentNode), this.cacheKey(result.node), result);
        return result;
    };

    KmlElementsFactoryCached.prototype.any = function(element, options){
        var parentNode = element.node;

        var self = this;
        var child = null;
        var potentialChild;
        options.name.forEach(function(name){
            potentialChild = self.cache.value(self.cacheKey(parentNode), name);
            if(potentialChild) {
                child = potentialChild;
            }
        });
        if (child) {
            return child;
        }

        var result = this.internalFactory.any(element, options);

        this.cache.add(self.cacheKey(parentNode), self.cacheKey(result.node), result);
        return result;
    };

    KmlElementsFactoryCached.prototype.cacheKey = function(node) {
        var idAttribute = new Attribute(node, "id");
        if (!idAttribute.exists()) {
            idAttribute.save(WWUtil.guid());
        }
        return node.nodeName + "#" + idAttribute.value();
    };

    var applicationWide = new KmlElementsFactoryCached();
    KmlElementsFactoryCached.applicationWide = function(){
        return applicationWide;
    };

    return KmlElementsFactoryCached;
});