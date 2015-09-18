/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlColorStyle',
    './KmlElements',
    '../../util/WWUtil'
], function (
    KmlColorStyle,
    KmlElements,
    WWUtil
) {
    "use strict";

    /**
     * Constructs an KmlPolyStyle. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * @alias KmlPolyStyle
     * @constructor
     * @classdesc Contains the data associated with Kml poly style
     * @param polyStyleNode Node representing the Kml poly style.
     * @throws {ArgumentError} If either the node is null or undefined.
     */
    var KmlPolyStyle = function(polyStyleNode){
        if(!this) {
            return new KmlPolyStyle(polyStyleNode);
        }
        KmlColorStyle.call(this, polyStyleNode);
    };

    KmlPolyStyle.prototype = Object.create(KmlColorStyle.prototype);

    Object.defineProperties(KmlPolyStyle.prototype, {
        /**
         * If true the polygon's surface will be filled with color
         * @memberof KmlPolyStyle.prototype
         * @readonly
         * @type {Boolean}
         */
        fill: {
            get: function(){
                return this.retrieve({name: 'fill', transformer: WWUtil.transformToBoolean});
            }
        },

        /**
         * Specifies whether outline polygon. Outline style is defined by line style if present.
         * @memberof KmlPolyStyle.prototype
         * @readonly
         * @type {Boolean}
         */
        outline: {
            get: function(){
                return this.retrieve({name: 'outline', transformer: WWUtil.transformToBoolean});
            }
        },

        /**
         * Array of the tag names representing Kml poly style.
         * @memberof KmlPolyStyle.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['PolyStyle'];
            }
        }
    });

    KmlElements.addKey(KmlPolyStyle.prototype.tagName[0], KmlPolyStyle);

    return KmlPolyStyle;
});