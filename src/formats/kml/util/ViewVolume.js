/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/extend',
    '../KmlElements',
    '../KmlObject'
], function (extend,
             KmlElements,
             KmlObject) {
    "use strict";
    /**
     * Constructs a ViewVolume. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * @alias ViewVolume
     * @constructor
     * @classdesc Contains the data associated with Kml View Volume
     * @param node {Node} Node representing the Kml View Volume.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#viewvolume
     */
    var ViewVolume = function (node) {
        KmlObject.call(this, node);

        Object.defineProperties(this, {
            /**
             * Angle, in degrees, between the camera's viewing direction and the left side of the view volume.
             * @memberof ViewVolume.prototype
             * @readonly
             * @type {Number}
             */
            leftFov: {
                get: function () {
                    return this.retrieve({name: 'leftFov', transformer: Number});
                }
            },

            /**
             * Angle, in degrees, between the camera's viewing direction and the right side of the view volume.
             * @memberof ViewVolume.prototype
             * @readonly
             * @type {Number}
             */
            rightFov: {
                get: function () {
                    return this.retrieve({name: 'rightFov', transformer: Number});
                }
            },

            /**
             * Angle, in degrees, between the camera's viewing direction and the bottom side of the view volume.
             * @memberof ViewVolume.prototype
             * @readonly
             * @type {Number}
             */
            bottomFov: {
                get: function () {
                    return this.retrieve({name: 'bottomFov', transformer: Number});
                }
            },

            /**
             * Angle, in degrees, between the camera's viewing direction and the top side of the view volume.
             * @memberof ViewVolume.prototype
             * @readonly
             * @type {Number}
             */
            topFov: {
                get: function () {
                    return this.retrieve({name: 'topFov', transformer: Number});
                }
            },

            /**
             * Measurement in meters along the viewing direction from the camera viewpoint to the PhotoOverlay shape.
             * The field of view for a PhotoOverlay is defined by four planes, each of which is specified by an angle
             * relative to the view vector. These four planes define the top, bottom, left, and right sides of the field
             *  of view, which has the shape of a truncated pyramid, as shown here:
             * @memberof ViewVolume.prototype
             * @readonly
             * @type {String}
             */
            near: {
                get: function () {
                    return this.retrieve({name: 'near'});
                }
            }
        });

        extend(this, ViewVolume.prototype);
    };

    /**
     * Returns tag name of this Node.
     * @returns {String[]}
     */
    ViewVolume.prototype.getTagNames = function() {
        return ['ViewVolume'];
    };

    KmlElements.addKey(ViewVolume.prototype.getTagNames()[0], ViewVolume);

    return ViewVolume;
});