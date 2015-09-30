/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../KmlElements',
    './KmlSubStyle'
], function (
    KmlElements,
    KmlSubStyle
) {
    "use strict";
    var KmlStyleMap = function(node) {
        KmlSubStyle.call(this, node);
    };

    KmlStyleMap.prototype = Object.create(KmlSubStyle.prototype);

    Object.defineProperties(KmlStyleMap.prototype, {
        tagName: {
            get: function() {
                return ['StyleMap'];
            }
        }
    });

    KmlElements.addKey(KmlStyleMap.prototype.tagName[0], KmlStyleMap);

    return KmlStyleMap;
});