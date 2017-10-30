/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../shapes/Polygon',
    '../../../shapes/ShapeAttributes',
    '../../../shapes/SurfacePolygon',
    '../WktElements',
    './WktObject',
    '../WktType'
], function (Polygon,
             ShapeAttributes,
             SurfacePolygon,
             WktElements,
             WktObject,
             WktType) {
    /**
     * It represents multiple polygons.
     * @alias WktMultiPolygon
     * @augments WktObject
     * @constructor
     */
    var WktMultiPolygon = function () {
        WktObject.call(this, WktType.SupportedGeometries.MULTI_POLYGON);

        /**
         * Internal object boundaries for used polygons. Some polygons may have inner and outer boundaries.
         * @type {Array}
         */
        this.objectBoundaries = [];

        /**
         * Used to decide what objects do we add the boundaries to.
         * @type {number}
         */
        this.currentIndex = 0;
    };

    WktMultiPolygon.prototype = Object.create(WktObject.prototype);

    /**
     * In case of right parenthesis, it means either that the boundaries ends or that the object ends or that the WKT
     * object ends.
     *
     * @inheritDoc
     * @private
     */
    WktMultiPolygon.prototype.rightParenthesis = function(options) {
        WktObject.prototype.rightParenthesis.call(this, options);

        // MultiPolygon object is distinguished by )),
        if(options.tokens[options.tokens.length -1].type != WktType.TokenType.RIGHT_PARENTHESIS) {
            this.addBoundaries();
            // MultiPolygon boundaries are distinguished by ),
        } else if(options.tokens[options.tokens.length -1].type == WktType.TokenType.RIGHT_PARENTHESIS &&
            options.tokens[options.tokens.length -2].type != WktType.TokenType.RIGHT_PARENTHESIS) {
            this.addObject();
        }
    };

    /**
     * It adds outer or inner boundaries to current polygon.
     * @private
     */
    WktMultiPolygon.prototype.addBoundaries = function() {
        if(!this.objectBoundaries[this.currentIndex]) {
            this.objectBoundaries[this.currentIndex] = [];
        }
        this.objectBoundaries[this.currentIndex].push(this.coordinates.slice());
        this.coordinates = [];
    };

    /**
     * It ends boundaries for current polygon.
     * @private
     */
    WktMultiPolygon.prototype.addObject = function() {
        this.currentIndex++;
    };

    /**
     * It returns array of SurfacePolygon in 2D or array of Polygons in 3D
     * @inheritDoc
     * @return {Polygon[]|SurfacePolygon[]}
     */
    WktMultiPolygon.prototype.shapes = function () {
        if (this._is3d) {
            return this.objectBoundaries.map(function (boundaries) {
                return new Polygon(boundaries, new ShapeAttributes(null));
            }.bind(this));
        } else {
            return this.objectBoundaries.map(function (boundaries) {
                return new SurfacePolygon(boundaries, new ShapeAttributes(null));
            }.bind(this));
        }
    };

    WktElements['MULTIPOLYGON'] = WktMultiPolygon;

    return WktMultiPolygon;
});