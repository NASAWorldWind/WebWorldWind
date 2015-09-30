/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlContainer',
    './KmlElements'
], function (
    KmlContainer,
    KmlElements
) {
    "use strict";
    var KmlFolder = function(node) {
        KmlContainer.call(this, node);
    };

    KmlFolder.prototype = Object.create(KmlContainer.prototype);

    Object.defineProperties(KmlFolder.prototype, {
        tagName: {
            get: function() {
                return ['Folder'];
            }
        },

        shapes: {
            get: function(){
                return this.parse();
            }
        }
    });

    KmlFolder.prototype.render = function(layer, style) {
        this.shapes.forEach(function(shape) {
            shape.render(layer, style);
        });
    };

    KmlElements.addKey(KmlFolder.prototype.tagName[0], KmlFolder);

    return KmlFolder;
});