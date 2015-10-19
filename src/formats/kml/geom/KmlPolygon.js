/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/Color',
    '../KmlElements',
    './KmlGeometry',
    './KmlLinearRing',
    '../styles/KmlLineStyle',
    '../styles/KmlPolyStyle',
    '../../../geom/Location',
    '../../../shapes/Polygon',
    '../../../shapes/ShapeAttributes',
    '../../../util/WWUtil'
], function (
    Color,
    KmlElements,
    KmlGeometry,
    KmlLinearRing,
    KmlLineStyle,
    KmlPolyStyle,
    Location,
    Polygon,
    ShapeAttributes,
    WWUtil
) {
    "use strict";
    /**
     * Constructs an KmlPolygon. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * @alias KmlPolygon
     * @constructor
     * @classdesc Contains the data associated with Kml polygon
     * @param polygonNode Node representing the Kml polygon.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#polygon
     */
    var KmlPolygon = function(polygonNode) {
        KmlGeometry.call(this, polygonNode);
    };

    KmlPolygon.prototype = Object.create(KmlGeometry.prototype);

    Object.defineProperties(KmlPolygon.prototype, {
        /**
         * In case that the polygon is above ground, this property decides whether there is going to be a line to the
         * ground.
         * @memberof KmlPolygon.prototype
         * @type {Boolean}
         * @readonly
         */
        extrude: {
            get: function() {
                return this.retrieve({name: 'extrude', transformer: WWUtil.transformToBoolean});
            }
        },

        /**
         * Whether tessellation should be used for current node.
         * @memberof KmlPolygon.prototype
         * @readonly
         * @type {Boolean}
         */
        tessellate: {
            get: function() {
                return this.retrieve({name: 'tessellate', transformer: WWUtil.transformToBoolean});
            }
        },

        /**
         * It explains how we should treat the altitude of the polygon. Possible choices are explained in:
         * https://developers.google.com/kml/documentation/kmlreference#point
         * @memberof KmlPolygon.prototype
         * @type {String}
         * @readonly
         */
        altitudeMode: {
            get: function() {
                return this.retrieve({name: 'altitudeMode'});
            }
        },

        /**
         * Outer boundary of this polygon represented as a LinearRing.
         * @memberof KmlPolygon.prototype
         * @type {KmlLinearRing}
         * @readonly
         */
        outerBoundary: {
            get: function() {
                var parentNode = this.retrieveNode({name: 'outerBoundaryIs'});
                return new KmlLinearRing(parentNode.getElementsByTagName("LinearRing")[0]);
            }
        },

        /**
         * Inner boundary of this polygon represented as a LinearRing. Optional property
         * @memberof KmlPolygon.prototype.
         * @type {KmlLinearRing}
         * @readonly
         */
        innerBoundary: {
            get: function() {
                var parentNode = this.retrieveNode({name: 'innerBoundaryIs'});
                if(parentNode == null) {
                    return null;
                }
                return new KmlLinearRing(parentNode.getElementsByTagName("LinearRing")[0]);
            }
        },

        /**
         * It returns center of outer boundaries of the polygon.
         * @memberof KmlPolygon.prototype
         * @readonly
         * @type {Position}
         */
        center: {
            get: function() {
                return this.outerBoundary.center;
            }
        },

        /**
         * Array of the tag names representing Kml polygon.
         * @memberof KmlPolygon.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['Polygon'];
            }
        }
    });

    /**
     * Renders polygon as polygon applying valid styles.
     * @param layer layer into which the polygon should be rendered.
     * @param pStyle Style applied on the polygon.
     */
    KmlPolygon.prototype.render = function(layer, pStyle) {
        var shapeOptions = KmlPolyStyle.render(pStyle && pStyle.PolyStyle);
        KmlLineStyle.render(pStyle && pStyle.LineStyle, shapeOptions);

        shapeOptions._drawVerticals = this.extrude || false;
        shapeOptions._applyLighting = false;
        shapeOptions._depthTest = true;
        shapeOptions._outlineStippleFactor = 0;
        shapeOptions._outlineStipplePattern = 61680;
        shapeOptions._enableLighting = false;

        var attributes = new ShapeAttributes(shapeOptions);

        var locations = [];
        if(this.innerBoundary != null) {
            locations[0] = this.innerBoundary.positions;
            locations[1] = this.outerBoundary.positions;
        } else {
            locations = this.outerBoundary.positions;
        }

        this._shape = new Polygon(locations, attributes);
        this._shape.highlightAttributes = shapeOptions;
        this._shape.extrude = this.extrude || false;
        this._shape.altitudeMode = this.altitudeMode || WorldWind.ABSOLUTE;

        layer.addRenderable(this._shape);
    };

    KmlElements.addKey(KmlPolygon.prototype.tagName[0], KmlPolygon);

    return KmlPolygon;
});