/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlElements',
    '../KmlObject'
], function (
    KmlElements,
    KmlObject
) {
    "use strict";

    var ItemIcon = function(node) {
        KmlObject.call(this, node);
    };

    ItemIcon.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(ItemIcon.prototype, {
        tagName: {
            get: function() {
                return ['ItemIcon'];
            }
        },

        state: {
            get: function() {
                return this.retrieve({name: 'state'});
            }
        },

        href: {
            get: function() {
                return this.retrieve({name: 'href'});
            }
        }
    });

    KmlElements.addKey(ItemIcon.prototype.tagName[0], ItemIcon);

    return ItemIcon;
});