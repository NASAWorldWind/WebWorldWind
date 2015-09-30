/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../util/ImagePyramid',
    './../KmlElements',
    './KmlOverlay',
    '../geom/KmlPoint',
    '../util/ViewVolume'
], function (
    ImagePyramid,
    KmlElements,
    KmlOverlay,
    KmlPoint,
    ViewVolume
) {
    "use strict";

    var KmlPhotoOverlay = function(node) {
        KmlOverlay.call(this, node);
    };

    KmlPhotoOverlay.prototype = Object.create(KmlOverlay.prototype);

    Object.defineProperties(KmlPhotoOverlay.prototype, {
        tagName: {
            get: function() {
                return ['PhotoOverlay'];
            }
        },

        rotation: {
            get: function() {
                return this.retrieve({name: 'rotation'});
            }
        },

        shape: {
            get: function() {
                return this.retrieve({name: 'shape'});
            }
        },

        Point: {
            get: function(){
                return this.createChildElement({
                    name: KmlPoint.prototype.tagName
                });
            }
        },

        ViewVolume: {
            get: function(){
                return this.createChildElement({
                    name: ViewVolume.prototype.tagName
                });
            }
        },

        ImagePyramid: {
            get: function(){
                return this.createChildElement({
                    name: ImagePyramid.prototype.tagName
                });
            }
        }
    });

    KmlElements.addKey(KmlPhotoOverlay.prototype.tagName[0], KmlPhotoOverlay);

    return KmlPhotoOverlay;
});