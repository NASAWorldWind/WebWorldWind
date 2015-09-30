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

    var KmlLod = function(node) {
        KmlObject.call(this, node);
    };

    KmlLod.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlLod.prototype, {
        tagName: {
            get: function() {
                return ['Lod'];
            }
        }
    });

    KmlElements.addKey(KmlLod.prototype.tagName[0], KmlLod);

    return KmlLod;
});