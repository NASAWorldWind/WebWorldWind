/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports SurfacePolyline
 * @version $Id: SurfacePolyline.js 3014 2015-04-14 01:06:17Z danm $
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
         * Constructs a surface polyline.
         * @alias SurfacePolyline
         * @constructor
         * @augments SurfaceShape
         * @classdesc Represents a polyline draped over the terrain surface.
         * <p>
         * SurfacePolyline uses the following attributes from its associated shape attributes bundle:
         * <ul>
         *         <li>Draw outline</li>
         *         <li>Outline color</li>
         *         <li>Outline width</li>
         *         <li>Outline stipple factor</li>
         *         <li>Outline stipple pattern</li>
         * </ul>
         * @param {Location[]} locations This polyline's locations.
         * @param {ShapeAttributes} attributes The attributes to apply to this shape. May be null, in which case
         * attributes must be set directly before the shape is drawn.
         * @throws {ArgumentError} If the specified locations are null or undefined.
         */
        var SurfacePolyline = function (locations, attributes) {
            if (!locations) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SurfacePolyline", "constructor",
                        "The specified locations array is null or undefined."));
            }

            SurfaceShape.call(this, attributes);

            /**
             * This shape's locations, specified as an array locations.
             * @type {Array}
             */
            this._boundaries = locations;

            // Internal use only.
            this._isInteriorInhibited = true;
        };

        SurfacePolyline.prototype = Object.create(SurfaceShape.prototype);

        // Internal use only. Intentionally not documented.
        SurfacePolyline.staticStateKey = function(shape) {
            var shapeStateKey = SurfaceShape.staticStateKey(shape);

            return shapeStateKey;
        };

        // Internal use only. Intentionally not documented.
        SurfacePolyline.prototype.computeStateKey = function() {
            return SurfacePolyline.staticStateKey(this);
        };

        return SurfacePolyline;
    });