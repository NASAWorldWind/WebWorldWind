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

    var KmlLink = function() {
        KmlObject.call(this, node);
    };

    KmlLink.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlLink.prototype, {
        tagName: {
            get: function() {
                return ['Link', 'Icon']
            }
        }
    });

    KmlElements.addKey(KmlLink.prototype.tagName[0], KmlLink);

    return KmlLink;
});