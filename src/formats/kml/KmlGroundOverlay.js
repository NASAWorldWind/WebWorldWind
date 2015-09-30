/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlElements',
    './KmlLatLonBox',
    './KmlOverlay'
], function (
    KmlElements,
    KmlLatLonBox,
    KmlOverlay
) {
    "use strict";

    var KmlGroundOverlay = function(node) {
        KmlOverlay.call(this, node);
    };

    KmlGroundOverlay.prototype = Object.create(KmlOverlay.prototype);

    Object.defineProperties(KmlGroundOverlay.prototype, {
        tagName: {
            get: function() {
                return ['GroundOverlay'];
            }
        },

        altitude: {
            get: function() {
                return this.retrieve({name: 'altitude'});
            }
        },

        altitudeMode: {
            get: function() {
                return this.retrieve({name: 'altitudeMode'});
            }
        },

        LatLonBox: {
            get: function() {
                return this.createChildElement({
                    name: KmlLatLonBox.prototype.tagName
                });
            }
        }
    });

    KmlElements.addKey(KmlGroundOverlay.prototype.tagName[0], KmlGroundOverlay);

    return KmlGroundOverlay;
});