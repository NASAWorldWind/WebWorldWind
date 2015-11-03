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
     * Constructs an KmlLookAt. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlLookAt
     * @classdesc Contains the data associated with LookAt node.
     * @param node {Node} Node representing looking at something in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#lookat
     */
    var KmlLookAt = function (node) {
        KmlAbstractView.call(this, node);

        Object.defineProperties(this, {
            /**
             * Longitude of the point the camera is looking at. Angular distance in degrees, relative to the Prime
             * Meridian. Values west of the Meridian range from -180 to 0 degrees. Values east of the Meridian range
             * from 0 to 180 degrees.
             * @memberof KmlLookAt.prototype
             * @readonly
             * @type {Number}
             */
            longitude: {
                get: function () {
                    return this.retrieve({name: 'longitude', transformer: Number});
                }
            },

            /**
             * Latitude of the point the camera is looking at. Degrees north or south of the Equator (0 degrees). Values
             * range from -90 degrees to 90 degrees.
             * @memberof KmlLookAt.prototype
             * @readonly
             * @type {Number}
             */
            latitude: {
                get: function () {
                    return this.retrieve({name: 'latitude', transformer: Number});
                }
            },

            /**
             * Distance from the earth's surface, in meters. Interpreted according to the LookAt's altitude mode.
             * @memberof KmlLookAt.prototype
             * @readonly
             * @type {Number}
             */
            altitude: {
                get: function () {
                    return this.retrieve({name: 'altitude', transformer: Number});
                }
            },

            /**
             * Direction (that is, North, South, East, West), in degrees. Default=0 (North). (See diagram below.) Values
             * range from 0 to 360 degrees.
             * @memberof KmlLookAt.prototype
             * @readonly
             * @type {Number}
             */
            heading: {
                get: function () {
                    return this.retrieve({name: 'heading', transformer: Number});
                }
            },

            /**
             * Angle between the direction of the LookAt position and the normal to the surface of the earth. (See
             * diagram below.) Values range from 0 to 90 degrees. Values for &lt;tilt&gt; cannot be negative. A &lt;tilt&gt; value
             * of 0 degrees indicates viewing from directly above. A &lt;tilt&gt; value of 90 degrees indicates viewing along
             * the horizon.
             * @memberof KmlLookAt.prototype
             * @readonly
             * @type {Number}
             */
            tilt: {
                get: function () {
                    return this.retrieve({name: 'tilt', transformer: Number});
                }
            },

            /**
             * Distance in meters from the point specified by &lt;longitude&gt;, &lt;latitude&gt;, and &lt;altitude&gt; to the LookAt
             * position. (See diagram below.)
             * @memberof KmlLookAt.prototype
             * @readonly
             * @type {Number}
             */
            range: {
                get: function () {
                    return this.retrieve({name: 'range', transformer: Number});
                }
            },

            /**
             * Specifies how the &lt;altitude&gt; specified for the LookAt point is interpreted. Possible values are as
             * follows: clampToGround - (default) Indicates to ignore the &lt;altitude&gt; specification and place the LookAt
             * position on the ground. relativeToGround - Interprets the &lt;altitude&gt; as a value in meters above the
             * ground. absolute - Interprets the &lt;altitude&gt; as a value in meters above sea level.
             * @memberof KmlLookAt.prototype
             * @readonly
             * @type {String}
             */
            altitudeMode: {
                get: function () {
                    return this.retrieve({name: 'altitudeMode'});
                }
            }
        });

        extend(this, KmlLookAt.prototype);
    };

    /**
     * Returns tag name of this Node.
     * @returns {String[]}
     */
    KmlLookAt.prototype.getTagNames = function () {
        return ['LookAt'];
    };

    KmlElements.addKey(KmlLookAt.prototype.getTagNames()[0], KmlLookAt);

    return KmlLookAt;
});