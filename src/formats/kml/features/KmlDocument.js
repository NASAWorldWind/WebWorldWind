/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlContainer',
    '../KmlElements',
    './KmlFeature',
    '../util/Schema'
], function (
    KmlContainer,
    KmlElements,
    KmlFeature,
    Schema
) {
    "use strict";
    var KmlDocument = function(node) {
        KmlContainer.call(this, node);
    };

    KmlDocument.prototype = Object.create(KmlContainer.prototype);

    Object.defineProperties(KmlDocument.prototype, {
        tagName: {
            get: function() {
                return ['Document'];
            }
        },

        shapes: {
            get: function(){
                var allElements = this.parse();
                return allElements.filter(function(element){
                    return element instanceof KmlFeature;
                });
            }
        },

        schemas: {
            get: function(){
                var allElements = this.parse();
                return allElements.filter(function(element){
                    return element instanceof Schema;
                });
            }
        }

    });

    KmlDocument.prototype.render = function(layer, style) {
        this.shapes.forEach(function(shape) {
            shape.render(layer, style);
        });
    };

    KmlElements.addKey(KmlDocument.prototype.tagName[0], KmlDocument);

    return KmlDocument;
});