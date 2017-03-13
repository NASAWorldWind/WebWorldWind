/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports SurfacePolygon
 * @version $Id: SurfacePolygon.js 3193 2015-06-15 22:29:13Z tgaskins $
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../shapes/ShapeAttributes',
        '../shapes/SurfaceShape'
    ],
    function (ArgumentError,
              Logger,
              ShapeAttributes,
              SurfaceShape) {
        "use strict";

        /**
         * Constructs a surface polygon.
         * @alias SurfacePolygon
         * @constructor
         * @augments SurfaceShape
         * @classdesc Represents a polygon draped over the terrain surface. The polygon may have multiple boundaries in
         * order to define holes or empty regions.
         * <p>
         * SurfacePolygon uses the following attributes from its associated shape attributes bundle:
         * <ul>
         *         <li>Draw interior</li>
         *         <li>Draw outline</li>
         *         <li>Interior color</li>
         *         <li>Outline color</li>
         *         <li>Outline width</li>
         *         <li>Outline stipple factor</li>
         *         <li>Outline stipple pattern</li>
         * </ul>
         * @param {Array} boundaries The polygons boundary locations. If this argument is an array of
         * [Locations]{@link Location} they define this polygon's outer boundary. If it is an array of arrays of
         * Locations then each array entry defines one of this polygon's boundaries.
         * @param {ShapeAttributes} attributes The attributes to apply to this shape. May be null, in which case
         * attributes must be set directly before the shape is drawn.
         *
         * @throws {ArgumentError} If the specified boundaries are null or undefined.
         */
        var SurfacePolygon = function (boundaries, attributes) {
            if (!Array.isArray(boundaries)) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SurfacePolygon", "constructor",
                        "The specified boundary is not an array."));
            }

            SurfaceShape.call(this, attributes);

            this._boundaries = boundaries;

            this._stateId = SurfacePolygon.stateId++;
        };

        SurfacePolygon.prototype = Object.create(SurfaceShape.prototype);

        Object.defineProperties(SurfacePolygon.prototype, {
            /**
             * This polygon's boundaries. The polygons boundary locations. If this argument is an array of
             * [Locations]{@link Location} they define this polygon's outer boundary. If it is an array of arrays of
             * Locations then each array entry defines one of this polygon's boundaries.
             * @type {Location[][] | Location[]}
             * @memberof SurfacePolygon.prototype
             */
            boundaries: {
                get: function () {
                    return this._boundaries;
                },
                set: function (boundaries) {
                    if (!Array.isArray(boundaries)) {
                        throw new ArgumentError(
                            Logger.logMessage(Logger.LEVEL_SEVERE, "SurfacePolygon", "set boundaries",
                                "The specified value is not an array."));
                    }
                    this._boundaries = boundaries;
                    this._stateId = SurfacePolygon.stateId++;
                    this.isPrepared = false;
                    this.stateKeyInvalid = true;
                }
            }
        });

        // Internal use only. Intentionally not documented.
        SurfacePolygon.stateId = Number.MIN_SAFE_INTEGER;

        // Internal use only. Intentionally not documented.
        SurfacePolygon.staticStateKey = function (shape) {
            var shapeStateKey = SurfaceShape.staticStateKey(shape);

            return shapeStateKey +
                " pg " + shape._stateId;
        };

        // Internal use only. Intentionally not documented.
        SurfacePolygon.prototype.computeStateKey = function () {
            return SurfacePolygon.staticStateKey(this);
        };

        return SurfacePolygon;
    });