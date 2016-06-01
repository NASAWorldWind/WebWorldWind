/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([], function () {
    "use strict";

    /**
     * This class represents abstraction for Attribute. It is possible to test its existence, retrieve value and set
     * value.
     * @alias Attribute
     * @param node {Node} Node on which the attribute exists
     * @param name {String} Name of the attribute
     * @constructor
     */
    var Attribute = function(node, name) {
        this.node = node;
        this.name = name;
    };

    /**
     * It returns value of the attribute. If the attribute doesn't exists it returns null.
     * @returns {String|null}
     */
    Attribute.prototype.value = function(){
        return (this.node.attributes && this.node.attributes.getNamedItem(this.name)&&
            this.node.attributes.getNamedItem(this.name).value) || null;
    };

    /**
     * It returns true if there exists attribute with given name.
     * @returns {boolean}
     */
    Attribute.prototype.exists = function() {
        return this.value() != null;
    };

    /**
     * Value which should be set to the attribute. 
     * @param value {String}
     */
    Attribute.prototype.save = function(value) {
        this.node.setAttribute(this.name, value);
    };

    return Attribute;
});