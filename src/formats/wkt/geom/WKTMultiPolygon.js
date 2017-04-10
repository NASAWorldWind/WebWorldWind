/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../shapes/Polygon',
    '../../../shapes/ShapeAttributes',
    '../../../shapes/SurfacePolygon',
    '../WKTElements',
    './WKTObject',
    '../WKTType'
], function (Polygon,
             ShapeAttributes,
             SurfacePolygon,
             WKTElements,
             WKTObject,
             WKTType) {
    /**
     * @augments WKTObject
     * @constructor
     */
    var WKTMultiPolygon = function () {
        WKTObject.call(this, WKTType.SupportedGeometries.MULTI_POLYGON);

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

    WKTMultiPolygon.prototype = Object.create(WKTObject.prototype);

    /**
     * In case of right parenthesis, it means either that the boundaries ends or that the object ends or that the WKT
     * object ends.
     *
     * @inheritDoc
     * @private
     */
    WKTMultiPolygon.prototype.rightParenthesis = function(options) {
        WKTObject.prototype.rightParenthesis.call(this, options);

        // MultiPolygon object is distinguished by )),
        if(options.tokens[options.tokens.length -1].type != WKTType.TokenType.RIGHT_PARENTHESIS) {
            this.addBoundaries();
            // MultiPolygon boundaries are distinguished by ),
        } else if(options.tokens[options.tokens.length -1].type == WKTType.TokenType.RIGHT_PARENTHESIS &&
            options.tokens[options.tokens.length -2].type != WKTType.TokenType.RIGHT_PARENTHESIS) {
            this.addObject();
        }
    };

    /**
     * It adds outer or inner boundaries to current polygon.
     * @private
     */
    WKTMultiPolygon.prototype.addBoundaries = function() {
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
    WKTMultiPolygon.prototype.addObject = function() {
        this.currentIndex++;
    };

    /**
     * @inheritDoc
     */
    WKTMultiPolygon.prototype.shapes = function () {
        if (this._is3d) {
            return this.objectBoundaries.map(function (boundaries) {
                return new Polygon(boundaries, new ShapeAttributes(null));
            }.bind(this))
        } else {
            return this.objectBoundaries.map(function (boundaries) {
                return new SurfacePolygon(boundaries, new ShapeAttributes(null));
            }.bind(this))
        }
    };

    WKTElements['MULTIPOLYGON'] = WKTMultiPolygon;

    return WKTMultiPolygon;
});