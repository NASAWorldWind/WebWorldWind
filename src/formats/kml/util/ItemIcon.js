/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlElements',
    '../KmlObject',
    './NodeTransformers'
], function (KmlElements,
             KmlObject,
             NodeTransformers) {
    "use strict";

    /**
     * Constructs an ItemIcon. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * @alias ItemIcon
     * @constructor
     * @classdesc Contains the data associated with Kml Item Icon
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Kml Item Icon.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#itemicon
     * @augments KmlObject
     */
    var ItemIcon = function (options) {
        KmlObject.call(this, options);
    };

    ItemIcon.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(ItemIcon.prototype, {
        /**
         * Specifies the current state of the NetworkLink or Folder. Possible values are open, closed, error,
         * fetching0, fetching1, and fetching2. These values can be combined by inserting a space between two values
         * (no comma).
         * @memberof ItemIcon.prototype
         * @readonly
         * @type {String}
         */
        kmlState: {
            get: function () {
                return this._factory.specific(this, {name: 'state', transformer: NodeTransformers.string});
            }
        },

        /**
         * Specifies the URI of the image used in the List View for the Feature.
         * @memberof ItemIcon.prototype
         * @readonly
         * @type {String}
         */
        kmlHref: {
            get: function () {
                return this._factory.specific(this, {name: 'href', transformer: NodeTransformers.string});
            }
        }
    });

    /**
     * @inheritDoc
     */
    ItemIcon.prototype.getTagNames = function () {
        return ['ItemIcon'];
    };

    KmlElements.addKey(ItemIcon.prototype.getTagNames()[0], ItemIcon);

    return ItemIcon;
});