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

    var KmlLatLonQuad = function(node) {
        KmlObject.call(this, node);
    };

    KmlLatLonQuad.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlLatLonQuad.prototype, {
        tagName: {
            get: function() {
                return ['gx:LatLonQuad'];
            }
        },

        coordinates: {
            get: function() {
                return this.retrieve({name: 'coordinates'});
            }
        }
    });

    KmlElements.addKey(KmlLatLonQuad.prototype.tagName[0], KmlLatLonQuad);

    return KmlLatLonQuad;
});