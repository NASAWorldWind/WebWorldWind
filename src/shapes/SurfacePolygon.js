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
            if (!boundaries) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SurfacePolygon", "constructor",
                        "The specified boundary array is null or undefined."));
            }

            SurfaceShape.call(this, attributes);

            // Convert the boundaries to the form SurfaceShape wants them.
            // TODO: Eliminate this once the SurfaceShape code is rewritten to handle multiple boundaries in the
            // form they were specified.
            var newBoundaries = null;

            // Determine whether we've been passed a boundary or a boundary list.
            if (boundaries.length > 0 && boundaries[0].latitude) {
                newBoundaries = boundaries.slice(0);
                newBoundaries.push(boundaries[0]);
                this._boundariesSpecifiedSimply = true;
            } else if (boundaries.length > 1) {
                var lastLocation = null;

                newBoundaries = [];

                for (var b = 0; b < boundaries.length; b++) {
                    var firstLocation = boundaries[b][0];

                    for (var i = 0; i < boundaries[b].length; i++) {
                        newBoundaries.push(boundaries[b][i]);
                    }

                    newBoundaries.push(firstLocation);

                    // Close the polygon for secondary parts by returning back to the first point
                    // (which coincides with the last point of the first part in a well-formed shapefile).
                    if (!!lastLocation) {
                        newBoundaries.push(lastLocation);
                    }
                    else {
                        lastLocation = newBoundaries[newBoundaries.length - 1];
                    }
                }
            } else if (boundaries.length === 1) {
                newBoundaries = boundaries[0].slice(0);
                newBoundaries.push(boundaries[0][0]);
            }

            this._boundaries = newBoundaries;
        };

        SurfacePolygon.prototype = Object.create(SurfaceShape.prototype);

        Object.defineProperties(SurfacePolygon.prototype, {
            ///**
            // * This polygon's boundaries. A two-dimensional array containing the polygon boundaries. Each entry of the
            // * array specifies the vertices for one boundary of the polygon. If the boundaries were specified to the
            // * constructor as a simple array of locations, then this property returns them in that form.
            // * @type {Position[][] | Position[]}
            // * @memberof SurfacePolygon.prototype
            // * @readonly
            // */
            //boundaries: {
            //    // TODO: Make this property read/write once the boundaries are interpolated correctly.
            //    get: function () {
            //        return this._boundariesSpecifiedSimply ? this._boundaries[0] : this._boundaries;
            //    }
            //}
        });

        // Internal use only. Intentionally not documented.
        SurfacePolygon.staticStateKey = function (shape) {
            var shapeStateKey = SurfaceShape.staticStateKey(shape);

            return shapeStateKey;
        };

        // Internal use only. Intentionally not documented.
        SurfacePolygon.prototype.computeStateKey = function () {
            return SurfacePolygon.staticStateKey(this);
        };

        return SurfacePolygon;
    });