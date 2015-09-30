/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlColorStyle',
    '../KmlElements'
], function (
    KmlColorStyle,
    KmlElements
) {
    "use strict";
    /**
     * Constructs an KmlLabelStyle. Applications don't usually call this constructor. It is called by {@link KmlFile} as
     * objects from KmlFile are read. This object is already concrete implementation.
     * @alias KmlLabelStyle
     * @classdesc Contains the data associated with LabelStyle
     * @param labelStyleNode Node representing the LabelStyle in the document.
     * @constructor
     * @throws {ArgumentError} If node is null or undefined.
     */
    var KmlLabelStyle = function(labelStyleNode) {
        KmlColorStyle.call(this, labelStyleNode);
    };

    KmlLabelStyle.prototype = Object.create(KmlColorStyle.prototype);

    Object.defineProperties(KmlLabelStyle.prototype, {
        /**
         * Array of the tag names representing Kml icon style.
         * @memberof KmlLabelStyle.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function(){
                return ['LabelStyle'];
            }
        },

        /**
         * Scale in which to resize the icon.
         * @memberof KmlLabelStyle.prototype
         * @readonly
         * @type {Number}
         */
        scale: {
            get: function() {
                return this.retrieve({name: 'scale', transformer: Number});
            }
        }
    });

    KmlElements.addKey(KmlLabelStyle.prototype.tagName[0], KmlLabelStyle);

    return KmlLabelStyle;
});