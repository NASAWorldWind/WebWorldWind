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

    var KmlNetworkLink = function(node) {
        KmlFeature.call(this, node);
    };

    KmlNetworkLink.prototype = Object.create(KmlFeature.prototype);

    Object.defineProperties(KmlNetworkLink.prototype, {
        tagName: {
            get: function() {
                return ['NetworkLink'];
            }
        }
    });

    KmlNetworkLink.prototype.render = function(){
        // TODO render network link.
    };

    return KmlNetworkLink;
});