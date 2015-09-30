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

    var KmlLatLonAltBox = function(node) {
        KmlObject.call(this, node);
    };

    KmlLatLonAltBox.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlLatLonAltBox.prototype, {
        tagName: {
            get: function() {
                return ['LatLonAltBox'];
            }
        },

        north: {
            get: function() {
                return this.retrieve({name: 'north'});
            }
        },

        south: {
            get: function() {
                return this.retrieve({name: 'south'});
            }
        },

        east: {
            get: function() {
                return this.retrieve({name: 'east'});
            }
        },

        west: {
            get: function() {
                return this.retrieve({name: 'west'});
            }
        },

        minAltitude: {
            get: function() {
                return this.retrieve({name: 'minAltitude'});
            }
        },

        maxAltitude: {
            get: function() {
                return this.retrieve({name: 'maxAltitude'});
            }
        }
    });

    KmlElements.addKey(KmlLatLonAltBox.prototype.tagName[0], KmlLatLonAltBox);

    return KmlLatLonAltBox;
});