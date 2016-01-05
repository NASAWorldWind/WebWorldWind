/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../util/extend',
    './KmlElements',
    './KmlObject'
], function (extend,
             KmlElements,
             KmlObject) {
    "use strict";

    /**
     * Constructs an KmlOrientation. Applications usually don't call this constructor. It is called by {@link KmlFile}
     * as objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlOrientation
     * @classdesc Contains the data associated with Orientation node.
     * @param node {Node} Node representing orientation in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#orientation
     */
    var KmlOrientation = function (node) {
        KmlObject.call(this, node);

        Object.defineProperties(this, {
            /**
             * Rotation about the z axis (normal to the Earth's surface). A value of 0 (the default) equals North. A
             * positive rotation is clockwise around the z axis and specified in degrees from 0 to 360.
             * @memberof KmlOrientation.prototype
             * @readonly
             * @type {Number}
             */
            kmlHeading: {
                get: function () {
                    return this.retrieve({name: 'heading', transformer: Number});
                }
            },

            /**
             * Rotation about the x axis. A positive rotation is clockwise around the x axis and specified in degrees
             * from 0 to 180.
             * @memberof KmlOrientation.prototype
             * @readonly
             * @type {Number}
             */
            kmlTilt: {
                get: function () {
                    return this.retrieve({name: 'tilt', transformer: Number});
                }
            },

            /**
             * Rotation about the y axis. A positive rotation is clockwise around the y axis and specified in degrees
             * from 0 to 180.
             * @memberof KmlOrientation.prototype
             * @readonly
             * @type {Number}
             */
            kmlRoll: {
                get: function () {
                    return this.retrieve({name: 'roll', transformer: Number});
                }
            }
        });

        extend(this, KmlOrientation.prototype);
    };

    /**
     * Returns tag name of this Node.
     * @returns {String[]}
     */
    KmlOrientation.prototype.getTagNames = function () {
        return ['Orientation'];
    };

    KmlElements.addKey(KmlOrientation.prototype.getTagNames()[0], KmlOrientation);

    return KmlOrientation;
});