/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../util/extend',
    './KmlObject',
    './KmlElements',
    './KmlTimePrimitive'
], function(
    extend,
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

        Object.defineProperties(this, {
            /**
             * Time associated with current view. It shouldn't be displayed outside of this time frame.
             * @memberof KmlAbstractView.prototype
             * @readonly
             * @type {KmlTimePrimitive}
             */
            kmlTimePrimitive: {
                get: function() {
                    return this.createChildElement({
                        name: KmlTimePrimitive.prototype.getTagNames()
                    });
                }
            }
        });

        extend(this, KmlAbstractView.prototype);
    };

    /**
     * @inheritDoc
     */
    KmlAbstractView.prototype.getTagNames = function () {
        return ['Camera', 'LookAt'];
    };

    return KmlAbstractView;
});