/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([], function () {
    "use strict";

    /**
     * 
     * @param node
     * @param name
     * @constructor
     */
    var Attribute = function(node, name) {
        this.node = node;
        this.name = name;
    };
    
    Attribute.prototype.value = function(){
        return (this.node.attributes && this.node.attributes.getNamedItem(this.name)&&
            this.node.attributes.getNamedItem(this.name).value) || null;
    };
    
    Attribute.prototype.exists = function() {
        return this.value() != null;
    };
    
    Attribute.prototype.save = function(value) {
        this.node.setAttribute(this.name, value);
    };

    return Attribute;
});