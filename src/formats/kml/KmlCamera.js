/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../util/extend',
    './KmlElements',
    './KmlAbstractView'
], function (extend,
             KmlElements,
             KmlAbstractView) {
    "use strict";

    /**
     * Constructs an KmlCamera. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlCamera
     * @classdesc Contains the data associated with Camera node.
     * @param node Node representing camera in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#camera
     */
    var KmlCamera = function (node) {
        KmlAbstractView.call(this, node);

        Object.defineProperties(this, {
            /**
             * Longitude of the virtual camera (eye point). Angular distance in degrees, relative to the Prime Meridian.
             * Values west of the Meridian range from ?180 to 0 degrees. Values east of the Meridian range from 0 to 180
             * degrees.
             * @memberof KmlCamera.prototype
             * @readonly
             * @type {Array}
             */
            longitude: {
                get: function () {
                    return this.retrieve({name: 'longitude'});
                }
            },

            /**
             * Latitude of the virtual camera. Degrees north or south of the Equator (0 degrees). Values range from ?90
             * degrees to 90 degrees.
             * @memberof KmlCamera.prototype
             * @readonly
             * @type {Array}
             */
            latitude: {
                get: function () {
                    return this.retrieve({name: 'latitude'});
                }
            },

            /**
             * Distance of the camera from the earth's surface, in meters. Interpreted according to the Camera's
             * <altitudeMode> or <gx:altitudeMode>.
             * @memberof KmlCamera.prototype
             * @readonly
             * @type {Array}
             */
            altitude: {
                get: function () {
                    return this.retrieve({name: 'altitude'});
                }
            },

            /**
             * Direction (azimuth) of the camera, in degrees. Default=0 (true North). (See diagram.) Values range from 0 to
             * 360 degrees.
             * @memberof KmlCamera.prototype
             * @readonly
             * @type {Array}
             */
            heading: {
                get: function () {
                    return this.retrieve({name: 'heading'});
                }
            },

            /**
             * Rotation, in degrees, of the camera around the X axis. A value of 0 indicates that the view is aimed
             * straight down toward the earth (the most common case). A value for 90 for <tilt> indicates that the view is
             * aimed toward the horizon. Values greater than 90 indicate that the view is pointed up into the sky. Values
             * for <tilt> are clamped at +180 degrees.
             * @memberof KmlCamera.prototype
             * @readonly
             * @type {Array}
             */
            tilt: {
                get: function () {
                    return this.retrieve({name: 'tilt'});
                }
            },

            /**
             * Rotation, in degrees, of the camera around the Z axis. Values range from ?180 to +180 degrees.
             * @memberof KmlCamera.prototype
             * @readonly
             * @type {Array}
             */
            roll: {
                get: function () {
                    return this.retrieve({name: 'roll'});
                }
            },

            /**
             * Specifies how the <altitude> specified for the Camera is interpreted. Possible values are as follows:
             * relativeToGround - (default) Interprets the <altitude> as a value in meters above the ground. If the point
             *  is over water, the <altitude> will be interpreted as a value in meters above sea level. See
             * <gx:altitudeMode> below to specify points relative to the sea floor. clampToGround - For a camera, this
             * setting also places the camera relativeToGround, since putting the camera exactly at terrain height would
             * mean that the eye would intersect the terrain (and the view would be blocked). absolute - Interprets the
             * <altitude> as a value in meters above sea level.
             * @memberof KmlCamera.prototype
             * @readonly
             * @type {Array}
             */
            altitudeMode: {
                get: function () {
                    return this.retrieve({name: 'altitudeMode'});
                }
            }
        });

        extend(this, KmlCamera.prototype);
    };

    KmlCamera.prototype.getTagNames = function() {
        return ['Camera'];
    };

    KmlElements.addKey(KmlCamera.prototype.getTagNames()[0], KmlCamera);

    return KmlCamera;
});