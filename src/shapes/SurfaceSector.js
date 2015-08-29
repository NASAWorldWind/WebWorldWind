/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports SurfaceSector
 * @version $Id: SurfaceSector.js 3014 2015-04-14 01:06:17Z danm $
 */
define([
        '../error/ArgumentError',
        '../geom/Location',
        '../util/Logger',
        '../shapes/ShapeAttributes',
        '../shapes/SurfaceShape'
    ],
    function (ArgumentError,
              Location,
              Logger,
              ShapeAttributes,
              SurfaceShape) {
        "use strict";

        /**
         * Constructs a surface sector.
         * @alias SurfaceSector
         * @constructor
         * @augments SurfaceShape
         * @classdesc Represents a sector draped over the terrain surface. The sector is specified as a rectangular
         * region in geographic coordinates.
         * <p>
         * SurfaceSector uses the following attributes from its associated shape attributes bundle:
         * <ul>
         *         <li>Draw interior</li>
         *         <li>Draw outline</li>
         *         <li>Interior color</li>
         *         <li>Outline color</li>
         *         <li>Outline width</li>
         *         <li>Outline stipple factor</li>
         *         <li>Outline stipple pattern</li>
         * </ul>
         * @param {Sector} sector This surface sector's sector.
         * @param {ShapeAttributes} attributes The attributes to apply to this shape. May be null, in which case
         * attributes must be set directly before the shape is drawn.
         * @throws {ArgumentError} If the specified boundaries are null or undefined.
         */
        var SurfaceSector = function (sector, attributes) {
            if (!sector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "SurfaceSector", "constructor", "missingSector"));
            }

            SurfaceShape.call(this, attributes);

            /**
             * This shape's sector.
             * @type {Sector}
             */
            this._sector = sector;
        };

        SurfaceSector.prototype = Object.create(SurfaceShape.prototype);

        // Internal use only. Intentionally not documented.
        SurfaceSector.staticStateKey = function(shape) {
            var shapeStateKey = SurfaceShape.staticStateKey(shape);

            return shapeStateKey;
        };

        // Internal use only. Intentionally not documented.
        SurfaceSector.prototype.computeStateKey = function() {
            return SurfaceSector.staticStateKey(this);
        };

        // Internal. Intentionally not documented.
        SurfaceSector.prototype.computeBoundaries = function(dc) {
            var sector = this._sector;

            this._boundaries = new Array(4);

            this._boundaries[0] = new Location(sector.minLatitude, sector.minLongitude);
            this._boundaries[1] = new Location(sector.maxLatitude, sector.minLongitude);
            this._boundaries[2] = new Location(sector.maxLatitude, sector.maxLongitude);
            this._boundaries[3] = new Location(sector.minLatitude, sector.maxLongitude);
        };

        return SurfaceSector;
    });