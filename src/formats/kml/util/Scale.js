/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlElements',
    '../KmlObject',
    './NodeTransformers'
], function (
    KmlElements,
    KmlObject,
    NodeTransformers
) {
    "use strict";

    /**
     * Constructs a Scale. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * @alias Scale
     * @constructor
     * @classdesc Contains the data associated with Kml Scale
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Kml Scale
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#scale
     * @augments KmlObject
     */
    var Scale = function (options) {
        KmlObject.call(this, options);
    };

    Scale.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(Scale.prototype, {
        /**
         * Scales model along x axis
         * @memberof Scale.prototype
         * @readonly
         * @type {Number}
         */
        kmlX: {
            get: function() {
                return this._factory.specific(this, {name: 'x', transformer: NodeTransformers.number});
            }
        },

        /**
         * Scales model along y axis
         * @memberof Scale.prototype
         * @readonly
         * @type {Number}
         */
        kmlY: {
            get: function() {
                return this._factory.specific(this, {name: 'y', transformer: NodeTransformers.number});
            }
        },

        /**
         * Scales model along z axis
         * @memberof Scale.prototype
         * @readonly
         * @type {Number}
         */
        kmlZ: {
            get: function() {
                return this._factory.specific(this, {name: 'z', transformer: NodeTransformers.number});
            }
        }
    });

    /**
     * @inheritDoc
     */
    Scale.prototype.getTagNames = function () {
        return ['Scale'];
    };

    KmlElements.addKey(Scale.prototype.getTagNames()[0], Scale);

    return Scale;
});
