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

    var KmlLookAt = function(node) {
        KmlAbstractView.call(this, node);
    };

    KmlLookAt.prototype = Object.create(KmlAbstractView.prototype);

    Object.defineProperties(KmlLookAt.prototype, {
        tagName: {
            get: function() {
                return ['LookAt'];
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

        range: {
            get: function() {
                return this.retrieve({name: 'range'});
            }
        },

        altitudeMode: {
            get: function() {
                return this.retrieve({name: 'altitudeMode'});
            }
        }
    });

    KmlElements.addKey(KmlLookAt.prototype.tagName[0], KmlLookAt);

    return KmlLookAt;
});