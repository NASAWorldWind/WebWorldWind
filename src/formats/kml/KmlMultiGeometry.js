/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlElements',
    './KmlGeometry',
    '../../geom/Position'
], function (
    KmlElements,
    KmlGeometry,
    Position
) {
    "use strict";

    /**
     * Constructs an KmlMultiGeometry object. KmlMultiGeometry is object, which contains other geometry objects. This
     * class isn't intended to be used outside of the KmlObject hierarchy. It is already concrete implementation.
     * @param multiGeometryNode {Node} Node representing this MultiGeometry
     * @constructor
     * @classdesc Class representing MultiGeometry Element of Kml Document.
     * @alias KmlMultiGeometry
     */
    var KmlMultiGeometry = function(multiGeometryNode) {
        KmlGeometry.call(this, multiGeometryNode)
    };

    KmlMultiGeometry.prototype = Object.create(KmlGeometry.prototype);

    Object.defineProperties(KmlMultiGeometry.prototype, {
        /**
         * It returns all shapes currently present in this node.
         * @memberof KmlMultiGeometry.prototype
         * @type {Array}
         * @readonly
         */
        shapes: {
            get: function(){
                return this.parse();
            }
        },

        /**
         * Center of all the geometries implemented as average of centers of all shapes.
         * @memberof KmlMultiGeometry.prototype
         * @type {Position}
         * @readonly
         */
        center: {
            get: function() {
                var positions = this.shapes.map(function(shape){
                    return shape.center;
                });
                var midLatitude = 0;
                var midLongitude = 0;
                var midAltitude = 0;
                positions.forEach(function(position){
                    midLatitude += position.latitude;
                    midLongitude += position.longitude;
                    midAltitude += position.altitude;
                });
                return new Position(
                    midLatitude / positions.length,
                    midLongitude / positions.length,
                    midAltitude / positions.length
                );
            }
        },

        /**
         * Array of the tag names representing Kml multi geometry.
         * @memberof KmlMultiGeometry.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ["MultiGeometry"]
            }
        }
    });

    /**
     * It renders all associated shapes. It honors style associated with the MultiGeometry.
     */
    KmlMultiGeometry.prototype.render = function(layer, style) {
        this.shapes.forEach(function(shape) {
            shape.render(layer, style);
        });
    };

    KmlElements.addKey(KmlMultiGeometry.prototype.tagName[0], KmlMultiGeometry);

    return KmlMultiGeometry;
});