/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/extend',
    './../KmlElements',
    './KmlGeometry',
    '../../../geom/Position'
], function (
    extend,
    KmlElements,
    KmlGeometry,
    Position
) {
    "use strict";

    /**
     * Constructs an KmlMultiGeometry object. KmlMultiGeometry is object, which contains other geometry objects. This
     * class isn't intended to be used outside of the KmlObject hierarchy. It is already concrete implementation.
     * @param multiGeometryNode {Node} Node representing this MultiGeometry
     * @param pStyle {Promise} Promise of the style to be delivered later.
     * @constructor
     * @classdesc Class representing MultiGeometry Element of Kml Document.
     * @alias KmlMultiGeometry
     * @see https://developers.google.com/kml/documentation/kmlreference#multigeometry
     */
    var KmlMultiGeometry = function(multiGeometryNode, pStyle) {
        KmlGeometry.call(this, multiGeometryNode);
        this._style = pStyle;

        Object.defineProperties(this, {
            /**
             * It returns all shapes currently present in this node.
             * @memberof KmlMultiGeometry.prototype
             * @type {KmlObject[]}
             * @readonly
             */
            kmlShapes: {
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
            kmlCenter: {
                get: function() {
                    var positions = this.kmlShapes.map(function(shape){
                        return shape.kmlCenter;
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

        extend(this, KmlMultiGeometry.prototype);
    };

    /**
     * Returns tag name of this Node.
     * @returns {String[]}
     */
    KmlMultiGeometry.prototype.getTagNames = function() {
        return ["MultiGeometry"];
    };

    /**
     * It renders all associated shapes. It honors style associated with the MultiGeometry.
     * @param layer {Layer} Layer into which this multi geometry should be rendered.
     * @param style {Promise} Promise of style applied to the geometry objects.
     */
    KmlMultiGeometry.prototype.update = function(layer, style) {
        this.kmlShapes.forEach(function(shape) {
            shape.update(layer, style);
        });
    };

    KmlMultiGeometry.prototype.getStyle = function() {
        return this._style;
    };

    KmlElements.addKey(KmlMultiGeometry.prototype.getTagNames()[0], KmlMultiGeometry);

    return KmlMultiGeometry;
});