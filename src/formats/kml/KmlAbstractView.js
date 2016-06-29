/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlObject',
    './KmlElements',
    './KmlTimePrimitive'
], function(
    KmlObject,
    KmlElements,
    KmlTimePrimitive
){
    // TODO Fix to use current implementations.
    "use strict";
    /**
     * Constructs an KmlAbstractView. Applications usually don't call this constructor. It is called by {@link KmlFile}
     * as objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlAbstractView
     * @classdesc Contains the data associated with AbstractView node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing abstract view in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#abstractview
     * @augments KmlObject
     */
    var KmlAbstractView = function (options) {
        KmlObject.call(this, options);
    };

    KmlAbstractView.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlAbstractView.prototype, {
        /**
         * Time associated with current view. It shouldn't be displayed outside of this time frame.
         * @memberof KmlAbstractView.prototype
         * @readonly
         * @type {KmlTimePrimitive}
         */
        kmlTimePrimitive: {
            get: function() {
                return this._factory.any(this, {
                    name: KmlTimePrimitive.prototype.getTagNames()
                });
            }
        }
    });

    /**
     * @inheritDoc
     */
    KmlAbstractView.prototype.getTagNames = function () {
        return ['Camera', 'LookAt'];
    };

    return KmlAbstractView;
});