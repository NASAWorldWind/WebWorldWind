/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlElements',
    './KmlFeature'
], function (
    KmlElements,
    KmlFeature
) {
    "use strict";

    var KmlTour = function(node) {
        KmlFeature.call(this, node);
    };

    KmlTour.prototype = Object.create(KmlFeature.prototype);

    Object.defineProperties(KmlTour.prototype, {
        tagName: {
            get: function() {
                return ['gx:Tour'];
            }
        }
    });

    KmlElements.addKey(KmlTour.prototype.tagName[0], KmlTour);

    return KmlTour;
});