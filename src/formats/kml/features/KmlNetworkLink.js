/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlElements',
    './KmlFeature',
    '../KmlLink'
], function (
    KmlElements,
    KmlFeature,
    KmlLink
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
        },

        refreshVisibility: {
            get: function() {
                return this.retrieve({name: 'refreshVisibility'});
            }
        },

        flyToView: {
            get: function() {
                return this.retrieve({name: 'flyToView'});
            }
        },

        Link: {
            get: function() {
                return this.createChildElement({
                    name: KmlLink.prototype.tagName
                });
            }
        }
    });

    return KmlNetworkLink;
});