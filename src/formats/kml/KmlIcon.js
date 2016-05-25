/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlLink',
    './KmlElements',
    './util/NodeTransformers'
], function (
    KmlLink,
    KmlElements,
    NodeTransformers
) {
    "use strict";
    /**
     * Constructs an KmlIcon. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlIcon
     * @classdesc Contains the data associated with Icon node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing icon in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#icon
     * @augments KmlLink
     */
    var KmlIcon = function (options) {
        KmlLink.call(this, options);
    };

    KmlIcon.prototype = Object.create(KmlLink.prototype);

    Object.defineProperties(KmlIcon.prototype, {
        /**
         * The href can contain a pallet of icons. In this case this is offset from left border.
         * @memberof KmlIcon.prototype
         * @readonly
         * @type {Number}
         */
        kmlX: {
            get: function(){
                return this._factory.specific(this, {name: 'gx:x', transformer: NodeTransformers.number});
            }
        },

        /**
         * The href can contain a pallet of icons. In this case this is offset from top border.
         * @memberof KmlIcon.prototype
         * @readonly
         * @type {Number}
         */
        kmlY: {
            get: function() {
                return this._factory.specific(this, {name: 'gx:y', transformer: NodeTransformers.number});
            }
        },

        /**
         * The href can contain a pallet of icons. In this case this is width of the icon on the pallete.
         * @memberof KmlIcon.prototype
         * @readonly
         * @type {Number}
         */
        kmlW: {
            get: function() {
                return this._factory.specific(this, {name: 'gx:w', transformer: NodeTransformers.number});
            }
        },

        /**
         * The href can contain a pallet of icons. In this case this is height of the icon on the palette.
         * @memberof KmlIcon.prototype
         * @readonly
         * @type {Number}
         */
        kmlH: {
            get: function() {
                return this._factory.specific(this, {name: 'gx:h', transformer: NodeTransformers.number});
            }
        }
    });

    /**
     * @inheritDoc
     */
    KmlIcon.prototype.getTagNames = function () {
        return ['Icon'];
    };

    KmlElements.addKey(KmlIcon.prototype.getTagNames()[0], KmlIcon);

    return KmlIcon;
});