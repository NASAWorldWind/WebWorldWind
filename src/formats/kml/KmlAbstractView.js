/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlObject',
    './KmlElements',
    './KmlTimePrimitive'
], function(
    KmlObject,
    KmlElements,
    KmlTimePrimitive
){
    // TODO Fix to use current implementations.
    "use strict";
    /**
     * Constructs an KmlAbstractView.
     * @param abstractViewNode
     * @constructor
     */
    var KmlAbstractView = function(abstractViewNode){
        KmlObject.call(this, abstractViewNode);
    };

    KmlAbstractView.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlAbstractView.prototype, {
        TimePrimitive: {
            get: function() {
                return this.createChildElement({
                    name: KmlTimePrimitive.prototype.tagName
                });
            }
        },

        tagName: {
            get: function(){
                return ['Camera, LookAt'];
            }
        }
    });

    KmlElements.addKey("AbstractView", KmlAbstractView);

    return KmlAbstractView;
});