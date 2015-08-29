/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports ProjectionEquirectangular
 * @version $Id: ProjectionEquirectangular.js 2821 2015-02-20 16:59:27Z dcollins $
 */
define([
        '../geom/Angle',
        '../error/ArgumentError',
        '../projections/GeographicProjection',
        '../util/Logger',
        '../geom/Vec3'
    ],
    function (Angle,
              ArgumentError,
              GeographicProjection,
              Logger,
              Vec3) {
        "use strict";

        /**
         * Constructs an Equirectangular geographic projection, also known as Equidistant Cylindrical, Plate Carree and
         * Rectangular. The projected globe is spherical, not ellipsoidal.
         * @alias ProjectionEquirectangular
         * @constructor
         * @augments GeographicProjection
         * @classdesc Represents an equirectangular geographic projection.
         */
        var ProjectionEquirectangular = function () {

            GeographicProjection.call(this, "Equirectangular", true, null);
        };

        ProjectionEquirectangular.prototype = Object.create(GeographicProjection.prototype);

        Object.defineProperties(ProjectionEquirectangular.prototype, {
            /**
             * A string identifying this projection's current state. Used to compare states during rendering to
             * determine whether globe-state dependent cached values must be updated. Applications typically do not
             * interact with this property.
             * @memberof ProjectionEquirectangular.prototype
             * @readonly
             * @type {String}
             */
            stateKey: {
                get: function () {
                    return "projection equirectangular ";
                }
            }
        });

        // Documented in base class.
        ProjectionEquirectangular.prototype.geographicToCartesian = function (globe, latitude, longitude, elevation,
                                                                              offset, result) {
            if (!globe) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionEquirectangular",
                    "geographicToCartesian", "missingGlobe"));
            }

            if (!result) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionEquirectangular",
                    "geographicToCartesian", "missingResult"));
            }

            result[0] = globe.equatorialRadius * longitude * Angle.DEGREES_TO_RADIANS + (offset ? offset[0] : 0);
            result[1] = globe.equatorialRadius * latitude * Angle.DEGREES_TO_RADIANS;
            result[2] = elevation;

            return result;
        };

        // Documented in base class.
        ProjectionEquirectangular.prototype.geographicToCartesianGrid = function (globe, sector, numLat, numLon,
                                                                                  elevations, referencePoint,
                                                                                  offset, result) {
            if (!globe) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionEquirectangular",
                    "geographicToCartesianGrid", "missingGlobe"));
            }

            if (!sector) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionEquirectangular",
                    "geographicToCartesianGrid", "missingSector"));
            }

            if (!elevations || elevations.length < numLat * numLon) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionEquirectangular",
                    "geographicToCartesianGrid",
                    "The specified elevations array is null, undefined or insufficient length"));
            }

            if (!result) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionEquirectangular",
                    "geographicToCartesianGrid", "missingResult"));
            }

            var eqr = globe.equatorialRadius,
                minLat = sector.minLatitude * Angle.DEGREES_TO_RADIANS,
                maxLat = sector.maxLatitude * Angle.DEGREES_TO_RADIANS,
                minLon = sector.minLongitude * Angle.DEGREES_TO_RADIANS,
                maxLon = sector.maxLongitude * Angle.DEGREES_TO_RADIANS,
                deltaLat = (maxLat - minLat) / (numLat > 1 ? numLat - 1 : 1),
                deltaLon = (maxLon - minLon) / (numLon > 1 ? numLon - 1 : 1),
                refPoint = referencePoint ? referencePoint : new Vec3(0, 0, 0),
                offsetX = offset ? offset[0] : 0,
                latIndex, lonIndex,
                elevIndex = 0, resultIndex = 0,
                lat, lon, y;

            // Iterate over the latitude and longitude coordinates in the specified sector, computing the Cartesian
            // point corresponding to each latitude and longitude.
            for (latIndex = 0, lat = minLat; latIndex < numLat; latIndex++, lat += deltaLat) {
                if (latIndex === numLat - 1) {
                    lat = maxLat; // explicitly set the last lat to the max latitude to ensure alignment
                }

                // Latitude is constant for each row. Values that are a function of latitude can be computed once per row.
                y = eqr * lat - refPoint[1];

                for (lonIndex = 0, lon = minLon; lonIndex < numLon; lonIndex++, lon += deltaLon) {
                    if (lonIndex === numLon - 1) {
                        lon = maxLon; // explicitly set the last lon to the max longitude to ensure alignment
                    }

                    result[resultIndex++] = eqr * lon - refPoint[0] + offsetX;
                    result[resultIndex++] = y;
                    result[resultIndex++] = elevations[elevIndex++] - refPoint[2];
                }
            }

            return result;
        };

        // Documented in base class.
        ProjectionEquirectangular.prototype.cartesianToGeographic = function (globe, x, y, z, offset, result) {
            if (!globe) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionEquirectangular",
                    "cartesianToGeographic", "missingGlobe"));
            }

            if (!result) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ProjectionEquirectangular",
                    "cartesianToGeographic", "missingResult"));
            }

            result.latitude = (y / globe.equatorialRadius) * Angle.RADIANS_TO_DEGREES;
            result.longitude = ((x - (offset ? offset[0] : 0)) / globe.equatorialRadius) * Angle.RADIANS_TO_DEGREES;
            result.altitude = z;

            return result;
        };

        return ProjectionEquirectangular;
    });