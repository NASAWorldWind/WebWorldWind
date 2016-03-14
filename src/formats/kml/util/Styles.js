/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/Promise'
], function (Promise) {
    /**
     * This class represents style for current element. It understands what is current state and if necessary traverse
     * hierarchy to retrieve the correct style.
     * @constructor
     */
    var Style = function (element) {
        this._element = element;
    };

    Style.prototype.highlighted = function () {
        return new Promise(function(resolve, reject) {
            // There will be collection of styles in the hierarchy. The user of this will decide, whether he is 
            // interested in all the types of styles. 
        });
    };

    Style.prototype.normal = function () {

    };

    // Find a style regardless of where it belongs.
    // Take an element and look for style. If there is style take it as a basis. The nearer ones have precedence.
    // Therefore we need to start with the file itself and then go down through the hierarchy.
    function traverseElementForStyle() {
        var relevantElements = collectParents();
        relevantElements.forEach(function(element){
            
        });
        // If you run into something, then you need to apply it to the BaseStyle. The issue
    }

    function collectParents() {
        var parent = this._element.parent;
        var parents = [];
        while(parent != null) {
            parents.push(parent);
            parent = parent.parent;
        }
        return parents.reverse();
    }

    function styleForElement(element) {
        if(element.kmlStyleSelector || element.kmlStyleUrl) {
            // Resolve Style
        }
    }

    return Style;
});