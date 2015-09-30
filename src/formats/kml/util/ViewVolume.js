/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../KmlElements',
    '../KmlObject'
], function (
    KmlElements,
    KmlObject
) {
    // TODO KmlSchema isn't actually descendant of the KmlObject. The relevant logic should be applied differently.
    "use strict";
    var ViewVolume = function(node) {
        KmlObject.call(this, node);
    };

    ViewVolume.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(ViewVolume.prototype, {
        tagName: {
            get: function() {
                return ['ViewVolume']
            }
        },

        leftFov: {
            get: function() {
                return this.retrieve({name: 'leftFov'});
            }
        },

        rightFov: {
            get: function() {
                return this.retrieve({name: 'rightFov'});
            }
        },

        bottomFov: {
            get: function() {
                return this.retrieve({name: 'bottomFov'});
            }
        },

        topFov: {
            get: function() {
                return this.retrieve({name: 'topFov'});
            }
        },

        near: {
            get: function() {
                return this.retrieve({name: 'near'});
            }
        }
    });

    KmlElements.addKey("ViewVolume", ViewVolume);

    return ViewVolume;
});