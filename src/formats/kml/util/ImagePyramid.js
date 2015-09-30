/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../KmlElements',
    '../KmlObject'
], function (
    KmlElements,
    KmlObject
) {
    // TODO KmlSchema isn't actually descendant of the KmlObject. The relevant logic should be applied differently.
    "use strict";
    var ImagePyramid = function(node) {
        KmlObject.call(this, node);
    };

    ImagePyramid.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(ImagePyramid.prototype, {
        tagName: {
            get: function() {
                return ['ImagePyramid']
            }
        },

        tileSize: {
            get: function() {
                return this.retrieve({name: 'tileSize'});
            }
        },

        maxWidth: {
            get: function() {
                return this.retrieve({name: 'maxWidth'});
            }
        },

        maxHeight: {
            get: function() {
                return this.retrieve({name: 'maxHeight'});
            }
        },

        gridOrigin: {
            get: function() {
                return this.retrieve({name: 'gridOrigin'});
            }
        }
    });

    KmlElements.addKey("ImagePyramid", ImagePyramid);

    return ImagePyramid;
});