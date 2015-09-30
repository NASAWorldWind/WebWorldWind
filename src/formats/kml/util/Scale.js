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

    var Scale = function(node) {
        KmlObject.call(this, node);
    };

    Scale.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(Scale.prototype, {
        tagName: {
            get: function() {
                return ['Scale'];
            }
        },

        x: {
            get: function() {
                return this.retrieve({name: 'x'});
            }
        },

        y: {
            get: function() {
                return this.retrieve({name: 'y'});
            }
        },

        z: {
            get: function() {
                return this.retrieve({name: 'z'});
            }
        }
    });

    KmlElements.addKey(Scale.prototype.tagName[0], Scale);

    return Scale;
});