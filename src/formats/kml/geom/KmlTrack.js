/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlElements',
    './KmlGeometry'
], function (
    KmlElements,
    KmlGeometry
) {
    "use strict";

    var KmlTrack = function(node) {
        KmlGeometry.call(this, node);
    };

    KmlTrack.prototype = Object.create(KmlGeometry.prototype);

    Object.defineProperties(KmlTrack.prototype, {
        tagName: {
            get: function() {
                return ['gx:Track'];
            }
        }
    });

    KmlElements.addKey(KmlTrack.prototype.tagName[0], KmlTrack);

    return KmlTrack;
});