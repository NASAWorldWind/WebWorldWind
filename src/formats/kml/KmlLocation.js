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

    var KmlLocation = function(node) {
        KmlObject.call(this, node);
    };

    KmlLocation.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlLocation.prototype, {
        tagName: {
            get: function() {
                return ['Location'];
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
        }
    });

    KmlElements.addKey(KmlLocation.prototype.tagName[0], KmlLocation);

    return KmlLocation;
});