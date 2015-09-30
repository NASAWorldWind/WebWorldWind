/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlLink',
    './KmlElements'
], function (
    KmlLink,
    KmlElements
) {
    "use strict";
    /**
     * Constructs an KmlIcon. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlIcon
     * @classdesc Contains the data associated with Icon node.
     * @param iconNode Node representing icon in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     */
    var KmlIcon = function(iconNode) {
        KmlLink.call(this, iconNode);
    };

    KmlIcon.prototype = Object.create(KmlLink.prototype);

    Object.defineProperties(KmlIcon.prototype, {
        /**
         * Array containing the tag name of Icon.
         * @memberof KmlIcon.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function(){
                return ['Icon'];
            }
        },

        /**
         * Http address or a local file specification used to load the icon.
         * @memberof KmlIcon.prototype
         * @readonly
         * @type {String}
         */
        href: {
            get: function(){
                return this.retrieve({name: 'href'});
            }
        },

        /**
         * The href can contain a pallet of icons. In this case this is offset from left border.
         * @memberof KmlIcon.prototype
         * @readonly
         * @type {Number}
         */
        x: {
            get: function(){
                return this.retrieve({name: 'gx:x', transformer: Number});
            }
        },

        /**
         * The href can contain a pallet of icons. In this case this is offset from top border.
         * @memberof KmlIcon.prototype
         * @readonly
         * @type {Number}
         */
        y: {
            get: function() {
                return this.retrieve({name: 'gx:y', transformer: Number});
            }
        },

        /**
         * The href can contain a pallet of icons. In this case this is width of the icon on the pallete.
         * @memberof KmlIcon.prototype
         * @readonly
         * @type {Number}
         */
        w: {
            get: function() {
                return this.retrieve({name: 'gx:w'});
            }
        },

        /**
         * The href can contain a pallet of icons. In this case this is height of the icon on the pallete.
         * @memberof KmlIcon.prototype
         * @readonly
         * @type {Number}
         */
        h: {
            get: function() {
                return this.retrieve({name: 'gx:h'});
            }
        }
    });

    KmlElements.addKey(KmlIcon.prototype.tagName[0], KmlIcon);

    return KmlIcon;
});