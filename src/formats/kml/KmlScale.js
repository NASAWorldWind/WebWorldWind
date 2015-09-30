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

    var KmlScale = function(node) {
        KmlObject.call(this, node);
    };

    KmlScale.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlScale.prototype, {
        tagName: {
            get: function() {
                return ['Scale'];
            }
        }
    });

    KmlElements.addKey(KmlScale.prototype.tagName[0], KmlScale);

    return KmlScale;
});