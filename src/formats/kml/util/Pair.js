/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlElements',
    '../KmlObject',
    '../styles/KmlStyle'
], function (
    KmlElements,
    KmlObject,
    KmlStyle
) {
    "use strict";

    var Pair = function(node) {
        KmlObject.call(this, node);
    };

    Pair.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(Pair.prototype, {
        tagName: {
            get: function() {
                return ['Pair'];
            }
        },

        key: {
            get: function() {
                return this.retrieve({name: 'key'});
            }
        },

        styleUrl: {
            get: function() {
                return this.retrieve({name: 'styleUrl'});
            }
        },

        Style: {
            get: function() {
                return this.createChildElement({
                    name: KmlStyle.prototype.tagName
                });
            }
        }
    });

    KmlElements.addKey(Pair.prototype.tagName[0], Pair);

    return Pair;
});