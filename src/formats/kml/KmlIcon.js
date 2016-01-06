/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../util/extend',
    './KmlLink',
    './KmlElements'
], function (
    extend,
    KmlLink,
    KmlElements
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

        Object.defineProperties(this, {
            /**
             * The href can contain a pallet of icons. In this case this is offset from left border.
             * @memberof KmlIcon.prototype
             * @readonly
             * @type {Number}
             */
            kmlX: {
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
            kmlY: {
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
            kmlW: {
                get: function() {
                    return this.retrieve({name: 'gx:w'});
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
                    return this.retrieve({name: 'gx:h'});
                }
            }
        });

        extend(this, KmlIcon.prototype);
    };

    /**
     * @inheritDoc
     */
    KmlIcon.prototype.getTagNames = function () {
        return ['Icon'];
    };

    KmlElements.addKey(KmlIcon.prototype.getTagNames()[0], KmlIcon);

    return KmlIcon;
});