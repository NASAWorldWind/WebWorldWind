/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlElements',
    './KmlAbstractView'
], function (
    KmlElements,
    KmlAbstractView
) {
    "use strict";

    var KmlCamera = function(node) {
        KmlAbstractView.call(this, node);
    };

    KmlCamera.prototype = Object.create(KmlAbstractView.prototype);

    Object.defineProperties(KmlCamera.prototype, {
        tagName: {
            get: function() {
                return ['Camera'];
            }
        },

        longitude: {
            get: function() {
                return this.retrieve({name: 'longitude'});
            }
        },

        latitude: {
            get: function() {
                return this.retrieve({name: 'latitude'});
            }
        },

        altitude: {
            get: function() {
                return this.retrieve({name: 'altitude'});
            }
        },

        heading: {
            get: function() {
                return this.retrieve({name: 'heading'});
            }
        },

        tilt: {
            get: function() {
                return this.retrieve({name: 'tilt'});
            }
        },

        roll: {
            get: function() {
                return this.retrieve({name: 'roll'});
            }
        },

        altitudeMode: {
            get: function() {
                return this.retrieve({name: 'altitudeMode'});
            }
        }
    });

    KmlElements.addKey(KmlCamera.prototype.tagName[0], KmlCamera);

    return KmlCamera;
});