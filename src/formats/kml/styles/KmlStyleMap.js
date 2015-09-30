/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../KmlElements',
    './KmlSubStyle',
    '../util/Pair'
], function (
    KmlElements,
    KmlSubStyle,
    Pair
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
        },

        Pair: {
            get: function() {
                return this.createChildElement({
                    name: Pair.prototype.tagName
                });
            }
        }
    });

    KmlElements.addKey(KmlStyleMap.prototype.tagName[0], KmlStyleMap);

    return KmlStyleMap;
});