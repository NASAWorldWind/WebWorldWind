/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlColorStyle',
    './../KmlElements',
    '../KmlIcon'
], function (
    KmlColorStyle,
    KmlElements,
    KmlIcon
) {
    "use strict";
    /**
     * Constructs an KmlIconStyle. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from KmlFile are read. This object is already concrete implementation.
     * @alias KmlIconStyle
     * @classdesc Contains the data associated with IconStyle node
     * @param iconStyleNode Node representing IconStyle in the document.
     * @returns {KmlIconStyle}
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined
     * @see https://developers.google.com/kml/documentation/kmlreference#iconstyle
     */
    var KmlIconStyle = function(iconStyleNode){
        KmlColorStyle.call(this, iconStyleNode);
    };

    KmlIconStyle.prototype = Object.create(KmlColorStyle.prototype);

    Object.defineProperties(KmlIconStyle.prototype, {
        /**
         * Array of the tag names representing Kml icon style.
         * @memberof KmlIconStyle.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['IconStyle'];
            }
        },

        /**
         * Scale in which to resize the icon.
         * @memberof KmlIconStyle.prototype
         * @readonly
         * @type {Number}
         */
        scale: {
            get: function() {
                return this.retrieve({name: 'scale', transformer: Number});
            }
        },

        /**
         * Direction in degrees of the icon.
         * @memberof KmlIconStyle.prototype
         * @readonly
         * @type {Number}
         */
        heading: {
            get: function() {
                return this.retrieve({name: 'heading'});
            }
        },

        /**
         * Custom Icon. If the icon is part of the IconStyle, only href is allowed for the icon.
         * @memberof KmlIconStyle.prototype
         * @readonly
         * @type {KmlIcon}
         */
        Icon: {
            get: function(){
                return this.createChildElement({
                    name: KmlIcon.prototype.tagName
                })
            }
        },

        hotSpot: {
            get: function() {
                // TODO find support for hotSpot
            }
        }
    });

    KmlElements.addKey(KmlIconStyle.prototype.tagName[0], KmlIconStyle);

    return KmlIconStyle;
});