/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlElements',
    './KmlOverlay'
], function (
    KmlElements,
    KmlOverlay
) {
    "use strict";

    var KmlPhotoOverlay = function(node) {
        KmlOverlay.call(this, node);
    };

    KmlPhotoOverlay.prototype = Object.create(KmlOverlay.prototype);

    Object.defineProperties(KmlPhotoOverlay.prototype, {
        tagName: {
            get: function() {
                return ['PhotoOverlay'];
            }
        }
    });

    KmlElements.addKey(KmlPhotoOverlay.prototype.tagName[0], KmlPhotoOverlay);

    return KmlPhotoOverlay;
});