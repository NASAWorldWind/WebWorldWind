/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlElements',
    '../KmlObject'
], function (KmlElements,
             KmlObject) {
    "use strict";

    /**
     * Constructs an ItemIcon. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * @alias ItemIcon
     * @constructor
     * @classdesc Contains the data associated with Kml Item Icon
     * @param node Node representing the Kml Item Icon.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#itemicon
     */
    var ItemIcon = function (node) {
        KmlObject.call(this, node);
    };

    ItemIcon.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(ItemIcon.prototype, {
        /**
         * Array of the tag names representing Item Icon.
         * @memberof ItemIcon.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function () {
                return ['ItemIcon'];
            }
        },

        /**
         * Specifies the current state of the NetworkLink or Folder. Possible values are open, closed, error,
         * fetching0, fetching1, and fetching2. These values can be combined by inserting a space between two values
         * (no comma).
         * @memberof ItemIcon.prototype
         * @readonly
         * @type {String}
         */
        state: {
            get: function () {
                return this.retrieve({name: 'state'});
            }
        },

        /**
         * Specifies the URI of the image used in the List View for the Feature.
         * @memberof ItemIcon.prototype
         * @readonly
         * @type {String}
         */
        href: {
            get: function () {
                return this.retrieve({name: 'href'});
            }
        }
    });

    KmlElements.addKey(ItemIcon.prototype.tagName[0], ItemIcon);

    return ItemIcon;
});