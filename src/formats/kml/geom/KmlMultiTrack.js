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

    var KmlMultiTrack = function(node) {
        KmlGeometry.call(this, node);
    };

    KmlMultiTrack.prototype = Object.create(KmlGeometry.prototype);

    Object.defineProperties(KmlMultiTrack.prototype, {
        tagName: {
            get: function() {
                return ['gx:MultiTrack'];
            }
        }
    });

    KmlElements.addKey(KmlMultiTrack.prototype.tagName[0], KmlMultiTrack);

    return KmlMultiTrack;
});