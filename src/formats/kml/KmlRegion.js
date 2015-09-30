/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlElements',
    './KmlLatLonAltBox',
    './KmlLod',
    './KmlObject'
], function (
    KmlElements,
    KmlLatLonAltBox,
    KmlLod,
    KmlObject
) {
    "use strict";

    var KmlRegion = function(node) {
        KmlObject.call(this, node);
    };

    KmlRegion.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlRegion.prototype, {
        tagName: {
            get: function() {
                return ['Region'];
            }
        },

        LatLonAltBox: {
            get: function() {
                return this.createChildElement({
                    name: KmlLatLonAltBox.prototype.tagName
                });
            }
        },

        Lod: {
            get: function() {
                return this.createChildElement({
                    name: KmlLod.prototype.tagName
                });
            }
        }
    });

    KmlElements.addKey(KmlRegion.prototype.tagName[0], KmlRegion);

    return KmlRegion;
});