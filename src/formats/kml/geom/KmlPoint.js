/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports KmlPoint
 */
define([
    '../../../util/Color',
    '../../../util/extend',
    './KmlGeometry',
    '../../../geom/Location',
    '../../../geom/Position',
    '../../../shapes/ShapeAttributes',
    '../../../shapes/Polygon',
    '../KmlElements'
], function(
    Color,
    extend,
    KmlGeometry,
    Location,
    Position,
    ShapeAttributes,
    Polygon,
    KmlElements
){
    "use strict";
    /**
     * Constructs an KmlPoint. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read.
     * @alias KmlPoint
     * @constructor
     * @classdesc Contains the data associated with Kml point
     * @param pointNode {Node} Node representing the Kml point.
     * @throws {ArgumentError} If either the node is null or the content of the Kml point contains invalid elements.
     * @see https://developers.google.com/kml/documentation/kmlreference#point
     */
    var KmlPoint = function (pointNode) {
        KmlGeometry.call(this, pointNode);

        this._shape = null;

        Object.defineProperties(this, {
            /**
             * Position of the whole geometry.
             * @memberof KmlPoint.prototype
             * @type {Position}
             * @readonly
             */
            kmlPosition: {
                get: function() {
                    var coordinates = this.retrieve({name: 'coordinates'}).split(',');
                    return new Position(coordinates[1], coordinates[0], coordinates[2] || 0);
                }
            },

            /**
             * In case that the point is above ground, this property decides whether there is going to be a line to the
             * ground.
             * @memberof KmlPoint.prototype
             * @type {Boolean}
             * @readonly
             */
            kmlExtrude: {
                get: function() {
                    return this.retrieve({name: 'extrude', transformer: Boolean});
                }
            },

            /**
             * It explains how we should treat the altitude of the point. Possible choices are explained in:
             * https://developers.google.com/kml/documentation/kmlreference#point
             * @memberof KmlPoint.prototype
             * @type {String}
             * @readonly
             */
            kmlAltitudeMode: {
                get: function() {
                    return this.retrieve({name: 'altitudeMode'});
                }
            },

            /**
             * It returns center of the point. In case of point it means the position of the point.
             * @memberof KmlPoint.prototype
             * @type {Position}
             * @readonly
             */
            kmlCenter: {
                get: function() {
                    return this.kmlPosition;
                }
            }
        });

        extend(this, KmlPoint.prototype);
    };

    /**
     * It renders KmlPoint as Polygon.
     * @param layer Layer into which the point should be added.
     */
    KmlPoint.prototype.update = function (layer) {
        var attributes = new ShapeAttributes(null);
        attributes.outlineColor = Color.WHITE;
        attributes.interiorColor = Color.WHITE;
        attributes.drawVerticals = false;

        this._shape = new Polygon(this.createRectangleFromPosition(this.kmlPosition), attributes);

        this._shape.altitudeMode = this.kmlAltitudeMode || WorldWind.ABSOLUTE;
        this._shape.extrude = this.kmlExtrude;
        layer.addRenderable(this._shape);
    };

    // For internal use only. Intentionally left undocumented.
    KmlPoint.prototype.createRectangleFromPosition = function (position) {
        var rectangle = [];

        var latitude = Number(position.latitude),
            longitude = Number(position.longitude),
            altitude = Number(position.altitude);

        rectangle.push(position);
        rectangle.push(new Position(latitude + 0.000009, longitude, altitude));
        rectangle.push(new Position(latitude + 0.000009, longitude + 0.000009, altitude));
        rectangle.push(new Position(latitude, longitude + 0.000009, altitude));

        return rectangle;
    };

    /**
     * Returns tag name of this Node.
     * @returns {String[]}
     */
    KmlPoint.prototype.getTagNames = function () {
        return ['Point'];
    };

    KmlElements.addKey(KmlPoint.prototype.getTagNames()[0], KmlPoint);

    return KmlPoint;
});