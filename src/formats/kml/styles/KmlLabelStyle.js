/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/extend',
    './KmlColorStyle',
    '../KmlElements'
], function (extend,
             KmlColorStyle,
             KmlElements) {
    "use strict";
    /**
     * Constructs an KmlLabelStyle. Applications don't usually call this constructor. It is called by {@link KmlFile} as
     * objects from KmlFile are read. This object is already concrete implementation.
     * @alias KmlLabelStyle
     * @classdesc Contains the data associated with LabelStyle
     * @param labelStyleNode {Node} Node representing the LabelStyle in the document.
     * @constructor
     * @throws {ArgumentError} If node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#labelstyle
     */
    var KmlLabelStyle = function (labelStyleNode) {
        KmlColorStyle.call(this, labelStyleNode);

        Object.defineProperties(this, {
            /**
             * Scale in which to resize the icon.
             * @memberof KmlLabelStyle.prototype
             * @readonly
             * @type {Number}
             */
            scale: {
                get: function () {
                    return this.retrieve({name: 'scale', transformer: Number});
                }
            }
        });

        extend(this, KmlLabelStyle.prototype);
    };

    KmlLabelStyle.update = function () {

    };

    /**
     * Returns tag name of this Node.
     * @returns {String[]}
     */
    KmlLabelStyle.prototype.getTagNames = function () {
        return ['LabelStyle'];
    };

    KmlElements.addKey(KmlLabelStyle.prototype.getTagNames()[0], KmlLabelStyle);

    return KmlLabelStyle;
});