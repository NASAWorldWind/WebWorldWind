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
        }
    });

    KmlElements.addKey(KmlLatLonAltBox.prototype.tagName[0], KmlLatLonAltBox);

    return KmlLatLonAltBox;
});