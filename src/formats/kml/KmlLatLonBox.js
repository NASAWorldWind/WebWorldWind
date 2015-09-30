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

    var KmlLatLonBox = function(node) {
        KmlObject.call(this, node);
    };

    KmlLatLonBox.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlLatLonBox.prototype, {
        tagName: {
            get: function() {
                return ['LatLonBox'];
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

        rotation: {
            get: function() {
                return this.retrieve({name: 'rotation'});
            }
        }
    });

    KmlElements.addKey(KmlLatLonBox.prototype.tagName[0], KmlLatLonBox);

    return KmlLatLonBox;
});