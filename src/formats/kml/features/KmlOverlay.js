/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlFeature',
    './../KmlIcon',
    '../../../error/UnsupportedOperationError'
], function (
    KmlFeature,
    KmlIcon,
    UnsupportedOperationError
) {
    "use strict";

    var KmlOverlay = function(node) {
        KmlFeature.call(this, node);
    };

    KmlOverlay.prototype = Object.create(KmlFeature.prototype);

    Object.defineProperties(KmlOverlay.prototype, {
        tagName: {
            get: function() {
                return ['PhotoOverlay', 'ScreenOverlay', 'GroundOverlay'];
            }
        },

        color: {
            get: function() {
                return this.retrieve({name: 'color'});
            }
        },

        drawOrder: {
            get: function() {
                return this.retrieve({name: 'drawOrder'});
            }
        },

        Icon: {
            get: function(){
                return this.createChildElement({
                    name: KmlIcon.prototype.tagName
                });
            }
        },

        LatLonQuad: {
            get: function() {
                throw new UnsupportedOperationError("Not Implemented yet.");
            }
        }
    });

    return KmlOverlay;
});