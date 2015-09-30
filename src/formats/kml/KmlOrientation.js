/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlElements',
    './KmlObject'
], function (
    KmlElements,
    KmlObject
) {
    "use strict";

    var KmlOrientation = function(node) {
        KmlObject.call(this, node);
    };

    KmlOrientation.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlOrientation.prototype, {
        tagName: {
            get: function() {
                return ['Orientation'];
            }
        },

        heading: {
            get: function() {
                return this.retrieve({name: 'heading'})
            }
        },

        tilt: {
            get: function() {
                return this.retrieve({name: 'tilt'})
            }
        },

        roll: {
            get: function() {
                return this.retrieve({name: 'roll'})
            }
        }
    });

    KmlElements.addKey(KmlOrientation.prototype.tagName[0], KmlOrientation);

    return KmlOrientation;
});