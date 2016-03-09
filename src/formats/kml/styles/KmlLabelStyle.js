/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlColorStyle',
    '../KmlElements',
    '../util/NodeTransformers'
], function (
    KmlColorStyle,
    KmlElements,
    NodeTransformers
) {
    "use strict";
    /**
     * Constructs an KmlLabelStyle. Applications don't usually call this constructor. It is called by {@link KmlFile} as
     * objects from KmlFile are read. This object is already concrete implementation.
     * @alias KmlLabelStyle
     * @classdesc Contains the data associated with LabelStyle
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the LabelStyle in the document.
     * @constructor
     * @throws {ArgumentError} If node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#labelstyle
     * @augments KmlColorStyle
     */
    var KmlLabelStyle = function (options) {
        KmlColorStyle.call(this, options);
    };

    KmlLabelStyle.prototype = Object.create(KmlColorStyle.prototype);

    Object.defineProperties(KmlLabelStyle.prototype, {
        /**
         * Scale in which to resize the icon.
         * @memberof KmlLabelStyle.prototype
         * @readonly
         * @type {Number}
         */
        kmlScale: {
            get: function() {
                return this._factory.specific(this, {name: 'scale', transformer: NodeTransformers.number});
            }
        }
    });


    KmlLabelStyle.update = function () {

    };

    /**
     * @inheritDoc
     */
    KmlLabelStyle.prototype.getTagNames = function () {
        return ['LabelStyle'];
    };

    KmlElements.addKey(KmlLabelStyle.prototype.getTagNames()[0], KmlLabelStyle);

    return KmlLabelStyle;
});