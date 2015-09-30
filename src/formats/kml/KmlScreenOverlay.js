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

    var KmlScreenOverlay = function(node) {
        KmlOverlay.call(this, node);
    };

    KmlScreenOverlay.prototype = Object.create(KmlOverlay.prototype);

    Object.defineProperties(KmlScreenOverlay.prototype, {
        tagName: {
            get: function() {
                return ['ScreenOverlay'];
            }
        }
    });

    KmlElements.addKey(KmlScreenOverlay.prototype.tagName[0], KmlScreenOverlay);

    return KmlScreenOverlay;
});