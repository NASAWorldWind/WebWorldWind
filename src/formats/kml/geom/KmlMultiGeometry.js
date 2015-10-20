/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlElements',
    './KmlGeometry',
    '../../../geom/Position'
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
     * @param pStyle {StyleSelector}
     * @constructor
     * @classdesc Class representing MultiGeometry Element of Kml Document.
     * @alias KmlMultiGeometry
     * @see https://developers.google.com/kml/documentation/kmlreference#multigeometry
     */
    var KmlMultiGeometry = function(multiGeometryNode, pStyle) {
        KmlGeometry.call(this, multiGeometryNode);
        this._style = pStyle;
    };

    KmlMultiGeometry.prototype.kml = Object.create(KmlGeometry.prototype);

    Object.defineProperties(KmlMultiGeometry.prototype.kml, {
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
                    return shape.kml.center;
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
        }
    });

    Object.defineProperties(KmlMultiGeometry.prototype, {
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
    KmlMultiGeometry.prototype.update = function(layer, style) {
        this.shapes.forEach(function(shape) {
            shape.update(layer, style);
        });
    };

    KmlMultiGeometry.prototype.getStyle = function() {
        return this._style;
    };

    KmlElements.addKey(KmlMultiGeometry.prototype.tagName[0], KmlMultiGeometry);

    return KmlMultiGeometry;
});