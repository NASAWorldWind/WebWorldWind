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

    var KmlRegion = function(node) {
        KmlObject.call(this, node);
    };

    KmlRegion.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlRegion.prototype, {
        tagName: {
            get: function() {
                return ['Region'];
            }
        }
    });

    KmlElements.addKey(KmlRegion.prototype.tagName[0], KmlRegion);

    return KmlRegion;
});