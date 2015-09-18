/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlObject',
    './KmlElements'
], function(
    KmlObject,
    KmlElements
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
        timePrimitive: {
            get: function() {
                return '';
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