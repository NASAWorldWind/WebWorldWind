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
    '../../../WorldWind',
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
    WorldWind,
    WWUtil
) {
    "use strict";
    /**
     * Constructs an KmlPolygon. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * It is Polygon and KmlGeometry.
     * @alias KmlPolygon
     * @constructor
     * @classdesc Contains the data associated with Kml polygon
     * @param polygonNode Node representing the Kml polygon.
     * @param pStyle Style to be applied to current node.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#polygon
     */
    var KmlPolygon = function(polygonNode, pStyle) {
        KmlGeometry.call(this, polygonNode);
        var self = this;
        // Default locations and attributes. Invisible unless called otherwise.
        pStyle.then(function(pStyle){
            // Once style is delivered create corresponding polygon.
            Polygon.call(this, self.prepareLocations(), self.prepareAttributes(pStyle));
            self.moveValidProperties();
        });
        this._style = pStyle;
        this._layer = null;
    };

    KmlPolygon.prototype = Object.create(Polygon.prototype);
    KmlPolygon.prototype.kml = Object.create(KmlGeometry.prototype);

    Object.defineProperties(KmlPolygon.prototype.kml, {
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
        }
    });

    Object.defineProperties(KmlPolygon.prototype, {
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
     * options.style
     */
    KmlPolygon.prototype.update = function(layer) {
        this._style.then(function(pStyle) {
            var shapeOptions = this.prepareAttributes(pStyle);
            this.attributes = shapeOptions;
            this.highlightAttributes = shapeOptions;

            this.locations = this.prepareLocations();
            this.moveValidProperties();

            if(this._layer != null ) {
                // Remove renderable from this layer.
                this._layer.removeRenderable(this);
            }
            layer.addRenderable(this);
            this._layer = layer;
        });
    };

    // Well anything that contains NetworkLink must also work using promises.

    KmlPolygon.prototype.moveValidProperties = function() {
        this.extrude = this.kml.extrude || false;
        this.altitudeMode = this.kml.altitudeMode || WorldWind.ABSOLUTE;
    };

    KmlPolygon.prototype.prepareAttributes = function(pStyle) {
        var shapeOptions = KmlPolyStyle.update(pStyle && pStyle.PolyStyle);
        KmlLineStyle.update(pStyle && pStyle.LineStyle, shapeOptions);

        shapeOptions._drawVerticals = this.kml.extrude || false;
        shapeOptions._applyLighting = false;
        shapeOptions._depthTest = true;
        shapeOptions._outlineStippleFactor = 0;
        shapeOptions._outlineStipplePattern = 61680;
        shapeOptions._enableLighting = false;

        return new ShapeAttributes(shapeOptions);
    };

    KmlPolygon.prototype.prepareLocations = function() {
        var locations = [];
        if(this.kml.innerBoundary != null) {
            locations[0] = this.kml.innerBoundary.positions;
            locations[1] = this.kml.outerBoundary.positions;
        } else {
            locations = this.kml.outerBoundary.positions;
        }
        return locations;
    };

    KmlElements.addKey(KmlPolygon.prototype.tagName[0], KmlPolygon);

    return KmlPolygon;
});