/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports KmlPoint
 */
define([
    '../../util/Color',
    './KmlGeometry',
    '../../geom/Location',
    '../../geom/Position',
    '../../shapes/ShapeAttributes',
    '../../shapes/Polygon',
    './KmlElements'
], function(
    Color,
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
     * @param pointNode Node representing the Kml point.
     * @throws {ArgumentError} If either the node is null or the content of the Kml point contains invalid elements.
     */
    var KmlPoint = function(pointNode) {
        if(!this) {
            return new KmlPoint(pointNode);
        }
        KmlGeometry.call(this, pointNode);

        this._shape = null;
    };

    KmlPoint.prototype = Object.create(KmlGeometry.prototype);

    Object.defineProperties(KmlPoint.prototype, {
        /**
         * Position of the whole geometry.
         * @memberof KmlPoint.prototype
         * @type {Position}
         * @readonly
         */
        position: {
            get: function() {
                var coordinates = this.retrieve({name: 'coordinates'}).split(',');
                return new Position(coordinates[1], coordinates[0], coordinates[2]);
            }
        },

        /**
         * In case that the point is above ground, this property decides whether there is going to be a line to the
         * ground.
         * @memberof KmlPoint.prototype
         * @type {Boolean}
         * @readonly
         */
        extrude: {
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
        altitudeMode: {
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
        center: {
            get: function() {
                return this.position;
            }
        },

        /**
         * Array of the tag names representing Kml point.
         * @memberof KmlPoint.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['Point'];
            }
        }
    });

    /**
     * It renders KmlPoint as Polygon.
     * @param layer Layer into which the point should be added.
     */
    KmlPoint.prototype.render = function(layer) {
        var attributes = new ShapeAttributes(null);
        attributes.outlineColor = Color.WHITE;
        attributes.interiorColor = Color.WHITE;
        attributes.drawVerticals = false;

        this._shape = new Polygon(this.createRectangleFromPosition(this.position), attributes);

        this._shape.altitudeMode = this.altitudeMode || WorldWind.ABSOLUTE;
        this._shape.extrude = this.extrude;
        layer.addRenderable(this._shape);
    };

    // For internal use only. Intentionally left undocumented.
    KmlPoint.prototype.createRectangleFromPosition = function(position) {
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

    KmlElements.addKey(KmlPoint.prototype.tagName[0], KmlPoint);

    return KmlPoint;
});