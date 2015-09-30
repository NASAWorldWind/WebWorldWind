/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlFeature'
], function (
    KmlFeature
) {
    "use strict";
    var KmlContainer = function(node) {
        KmlFeature.call(this, node);
    };

    KmlContainer.prototype = Object.create(KmlFeature.prototype);

    Object.defineProperties(KmlContainer.prototype, {
        /**
         * Array of tag names representing Kml geometry types.
         * @memberof KmlGeometry.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['Folder', 'Document'];
            }
        }
    });

    return KmlContainer;
});