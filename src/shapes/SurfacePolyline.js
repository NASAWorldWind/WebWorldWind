/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports SurfacePolyline
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

            this._stateId = SurfacePolyline.stateId++;

            // Internal use only.
            this._isInteriorInhibited = true;
        };

        SurfacePolyline.prototype = Object.create(SurfaceShape.prototype);

        Object.defineProperties(SurfacePolyline.prototype, {
            /**
             * This polyline's boundaries. The polylines locations.
             * @type {Location[]}
             * @memberof SurfacePolyline.prototype
             */
            boundaries: {
                get: function () {
                    return this._boundaries;
                },
                set: function (boundaries) {
                    if (!Array.isArray(boundaries)) {
                        throw new ArgumentError(
                            Logger.logMessage(Logger.LEVEL_SEVERE, "SurfacePolyline", "set boundaries",
                                "The specified value is not an array."));
                    }
                    this.resetBoundaries();
                    this._boundaries = boundaries;
                    this._stateId = SurfacePolyline.stateId++;
                    this.stateKeyInvalid = true;
                }
            }
        });

        // Internal use only. Intentionally not documented.
        SurfacePolyline.stateId = Number.MIN_SAFE_INTEGER;

        // Internal use only. Intentionally not documented.
        SurfacePolyline.staticStateKey = function(shape) {
            var shapeStateKey = SurfaceShape.staticStateKey(shape);

            return shapeStateKey +
                " pl " + shape._stateId;
        };

        // Internal use only. Intentionally not documented.
        SurfacePolyline.prototype.computeStateKey = function() {
            return SurfacePolyline.staticStateKey(this);
        };

        // Internal. Polyline doesn't generate its own boundaries. See SurfaceShape.prototype.computeBoundaries.
        SurfacePolyline.prototype.computeBoundaries = function(dc) {
        };

        // Internal use only. Intentionally not documented.
        SurfacePolyline.prototype.getReferencePosition = function () {
            return this.boundaries.length > 1 ? this.boundaries[0] : null;
        };

        // Internal use only. Intentionally not documented.
        SurfacePolyline.prototype.moveTo = function (oldReferenceLocation, newReferenceLocation) {
            var locations = [];
            for (var i = 0; i < this.boundaries.length; i++){
                var heading = Location.greatCircleAzimuth(oldReferenceLocation,
                    new Location(this.boundaries[i].latitude, this.boundaries[i].longitude));
                var pathLength = Location.greatCircleDistance(oldReferenceLocation,
                    new Location(this._boundaries[i].latitude, this._boundaries[i].longitude));
                var location = new Location(0, 0);
                Location.greatCircleLocation(newReferenceLocation, heading, pathLength, location);
                locations.push(new Location(location.latitude, location.longitude));
            }
            this.boundaries = locations;
        };

        return SurfacePolyline;
    });