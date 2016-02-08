/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/Color',
    '../../../util/extend',
    '../KmlElements',
    './KmlGeometry',
    './KmlLinearRing',
    '../styles/KmlStyle',
    '../../../geom/Location',
    '../../../shapes/Polygon',
    '../../../shapes/ShapeAttributes',
    '../../../util/WWUtil'
], function (Color,
             extend,
             KmlElements,
             KmlGeometry,
             KmlLinearRing,
             KmlStyle,
             Location,
             Polygon,
             ShapeAttributes,
             WWUtil) {
    "use strict";
    /**
     * Constructs an KmlPolygon. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * It is Polygon and KmlGeometry.
     * @alias KmlPolygon
     * @constructor
     * @classdesc Contains the data associated with Kml polygon
     * @param options {Object}
     * @param options.objectNode {Node} Node representing Polygon
     * @param options.style {Promise} Promise of styles to be applied to this Polygon.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#polygon
     */
    var KmlPolygon = function (options) {
        KmlGeometry.call(this, options);

        this.initialized = false;
        var self = this;
        // Default locations and attributes. Invisible unless called otherwise.
        if (options.style) {
            options.style.then(function (styles) {
                self.createPolygon(styles);
            });
            this._style = options.style;
        } else {
            self.createPolygon();
        }
        this._layer = null;

        Object.defineProperties(this, {
            /**
             * In case that the polygon is above ground, this property decides whether there is going to be a line to
             * the ground.
             * @memberof KmlPolygon.prototype
             * @type {Boolean}
             * @readonly
             */
            kmlExtrude: {
                get: function () {
                    return this.retrieve({name: 'extrude', transformer: WWUtil.transformToBoolean});
                }
            },

            /**
             * Whether tessellation should be used for current node.
             * @memberof KmlPolygon.prototype
             * @readonly
             * @type {Boolean}
             */
            kmlTessellate: {
                get: function () {
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
            kmlAltitudeMode: {
                get: function () {
                    return this.retrieve({name: 'altitudeMode'});
                }
            },

            /**
             * Outer boundary of this polygon represented as a LinearRing.
             * @memberof KmlPolygon.prototype
             * @type {KmlLinearRing}
             * @readonly
             */
            kmlOuterBoundary: {
                get: function () {
                    var parentNode = this.retrieveNode({name: 'outerBoundaryIs'});
                    return new KmlLinearRing({
                        objectNode: parentNode.getElementsByTagName("LinearRing")[0],
                        style: this.getStyle()
                    });
                }
            },

            /**
             * Inner boundary of this polygon represented as a LinearRing. Optional property
             * @memberof KmlPolygon.prototype.
             * @type {KmlLinearRing}
             * @readonly
             */
            kmlInnerBoundary: {
                get: function () {
                    var parentNode = this.retrieveNode({name: 'innerBoundaryIs'});
                    if (parentNode == null) {
                        return null;
                    }
                    return new KmlLinearRing({
                        objectNode: parentNode.getElementsByTagName("LinearRing")[0],
                        style: this.getStyle()
                    });
                }
            },

            /**
             * It returns center of outer boundaries of the polygon.
             * @memberof KmlPolygon.prototype
             * @readonly
             * @type {Position}
             */
            kmlCenter: {
                get: function () {
                    return this.kmlOuterBoundary.kmlCenter;
                }
            }
        });

        extend(this, KmlPolygon.prototype);
    };

    KmlPolygon.prototype = Object.create(Polygon.prototype);

    /**
     * Internal use only. Once create the instance of actual polygon.
     * @param styles {Object}
     * @param styles.normal {KmlStyle} Style to apply when not highlighted
     * @param styles.highlight {KmlStyle} Style to apply when item is highlighted. Currently ignored.
     */
    KmlPolygon.prototype.createPolygon = function(styles) {
        if(!this.initialized) {
            Polygon.call(this, this.prepareLocations(), this.prepareAttributes(styles.normal));
            this.moveValidProperties();
            this.initialized = true;
        }
    };

    /**
     * @inheritDoc
     */
    KmlPolygon.prototype.styleResolutionStarted = function (styles) {
        this.createPolygon(styles);
    };

    // For internal use only. Intentionally left undocumented.
    KmlPolygon.prototype.moveValidProperties = function () {
        this.extrude = this.kmlExtrude || true;
        this.altitudeMode = this.kmlAltitudeMode || WorldWind.CLAMP_TO_GROUND;
    };

    /**
     * @inheritDoc
     */
    KmlPolygon.prototype.prepareAttributes = function (style) {
        var shapeOptions = style && style.generate() || {};

        shapeOptions._drawVerticals = this.kmlExtrude || false;
        shapeOptions._applyLighting = true;
        shapeOptions._depthTest = true;
        shapeOptions._outlineStippleFactor = 0;
        shapeOptions._outlineStipplePattern = 61680;
        shapeOptions._enableLighting = true;

        return new ShapeAttributes(KmlStyle.shapeAttributes(shapeOptions));
    };

    // For internal use only. Intentionally left undocumented.
    KmlPolygon.prototype.prepareLocations = function () {
        var locations = [];
        if (this.kmlInnerBoundary != null) {
            locations[0] = this.kmlInnerBoundary.kmlPositions;
            locations[1] = this.kmlOuterBoundary.kmlPositions;
        } else {
            locations = this.kmlOuterBoundary.kmlPositions;
        }
        return locations;
    };

    /**
     * @inheritDoc
     */
    KmlPolygon.prototype.getStyle = function () {
        return this._style;
    };

    /**
     * @inheritDoc
     */
    KmlPolygon.prototype.getTagNames = function () {
        return ['Polygon'];
    };

    KmlElements.addKey(KmlPolygon.prototype.getTagNames()[0], KmlPolygon);

    return KmlPolygon;
});