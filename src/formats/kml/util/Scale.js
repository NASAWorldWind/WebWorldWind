/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlElements',
    '../KmlObject'
], function (
    KmlElements,
    KmlObject
) {
    "use strict";

    /**
     * Constructs a Scale. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * @alias Scale
     * @constructor
     * @classdesc Contains the data associated with Kml Scale
     * @param node Node representing the Kml Scale
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#scale
     */
    var Scale = function(node) {
        KmlObject.call(this, node);

        Object.defineProperties(this, {
            /**
             * Scales model along x axis
             * @memberof Scale.prototype
             * @readonly
             * @type {Array}
             */
            x: {
                get: function() {
                    return this.retrieve({name: 'x'});
                }
            },

            /**
             * Scales model along y axis
             * @memberof Scale.prototype
             * @readonly
             * @type {Array}
             */
            y: {
                get: function() {
                    return this.retrieve({name: 'y'});
                }
            },

            /**
             * Scales model along z axis
             * @memberof Scale.prototype
             * @readonly
             * @type {Array}
             */
            z: {
                get: function() {
                    return this.retrieve({name: 'z'});
                }
            }
        });
    };

    Scale.prototype.getTagNames = function() {
        return ['Scale'];
    };

    KmlElements.addKey(Scale.prototype.getTagNames()[0], Scale);

    return Scale;
});
