/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports KmlGeometry
 */
define([
    './../KmlObject',
    '../KmlElements'
], function(
    KmlObject,
    KmlElements
){
    "use strict";
    /**
     * Constructs an KmlGeometry. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read.
     * @alias KmlGeometry
     * @constructor
     * @classdesc Contains the data associated with Kml geometry
     * @param geometryNode Node representing the Kml geometry.
     * @throws {ArgumentError} If either the node is null or the content of the Kml point contains invalid elements.
     */
    var KmlGeometry = function(geometryNode) {
        KmlObject.call(this, geometryNode);
    };

    KmlGeometry.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlGeometry.prototype, {
        /**
         * Array of tag names representing Kml geometry types.
         * @memberof KmlGeometry.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['Point', 'LinearRing', 'LineString', 'MultiGeometry', 'Polygon'];
            }
        }
    });

    KmlElements.addKey("Geometry", KmlGeometry);

    return KmlGeometry;
});