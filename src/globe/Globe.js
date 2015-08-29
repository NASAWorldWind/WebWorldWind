/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports Globe
 * @version $Id: Globe.js 2940 2015-03-30 17:58:36Z tgaskins $
 */
define([
        '../geom/Angle',
        '../error/ArgumentError',
        '../globe/ElevationModel',
        '../geom/Line',
        '../geom/Location',
        '../util/Logger',
        '../geom/Position',
        '../geom/Sector',
        '../globe/Tessellator',
        '../geom/Vec3',
        '../util/WWMath'],
    function (Angle,
              ArgumentError,
              ElevationModel,
              Line,
              Location,
              Logger,
              Position,
              Sector,
              Tessellator,
              Vec3,
              WWMath) {
        "use strict";

        /**
         * Constructs an ellipsoidal Globe with default radii for Earth (WGS84).
         * @alias Globe
         * @constructor
         * @classdesc Represents an ellipsoidal globe. The default configuration represents Earth but may be changed.
         * To configure for another planet, set the globe's equatorial and polar radii properties and its
         * eccentricity-squared property.
         * <p>
         * A globe uses a Cartesian coordinate system whose origin is at the globe's center. It's Y axis points to the
         * north pole, the Z axis points to the intersection of the prime meridian and the equator,
         * and the X axis completes a right-handed coordinate system, is in the equatorial plane and 90 degrees east
         * of the Z axis.
         * <p>
         *     All Cartesian coordinates and elevations are in meters.

         * @param {ElevationModel} elevationModel The elevation model to use for this globe.
         * @throws {ArgumentError} If the specified elevation model is null or undefined.
         */
        var Globe = function (elevationModel) {
            if (!elevationModel) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe",
                    "constructor", "Elevation model is null or undefined."));
            }
            /**
             * This globe's elevation model.
             * @type {ElevationModel}
             */
            this.elevationModel = elevationModel;

            /**
             * This globe's equatorial radius.
             * @type {Number}
             * @default 6378137.0 meters
             */
            this.equatorialRadius = 6378137.0;

            /**
             * This globe's polar radius.
             * @type {Number}
             * @default 6356752.3 meters
             */
            this.polarRadius = 6356752.3;

            /**
             * This globe's eccentricity squared.
             * @type {Number}
             * @default 0.00669437999013
             */
            this.eccentricitySquared = 0.00669437999013;

            /**
             * The tessellator used to create this globe's terrain.
             * @type {Tessellator}
             */
            this.tessellator = new Tessellator();

            // Used internally to eliminate temporary allocations for certain calculations.
            this.scratchPosition = new Position(0, 0, 0);
            this.scratchPoint = new Vec3(0, 0, 0);

            // A unique ID for this globe. Intentionally not documented.
            this.id = ++Globe.idPool;

            this._stateKey = "globe " + this.id.toString() + " ";
        };

        Globe.idPool = 0; // Used to assign unique IDs to globes for use in their state keys.

        Object.defineProperties(Globe.prototype, {
            /**
             * A string identifying this globe's current state. Used to compare states during rendering to
             * determine whether globe-state dependent cached values must be updated. Applications typically do not
             * interact with this property.
             * @memberof Globe.prototype
             * @readonly
             * @type {String}
             */
            stateKey: {
                get: function () {
                    return this._stateKey + this.elevationModel.stateKey;
                }
            }
        });

        /**
         * Indicates whether this is a 2D globe.
         * @returns {Boolean} true if this is a 2D globe, otherwise false.
         */
        Globe.prototype.is2D = function () {
            return false;
        };

        /**
         * Computes a Cartesian point from a specified position.
         * See this class' Overview section for a description of the Cartesian coordinate system used.
         * @param {Number} latitude The position's latitude.
         * @param {Number} longitude The position's longitude.
         * @param {Number} altitude The position's altitude.
         * @param {Vec3} result A reference to a pre-allocated {@link Vec3} in which to return the computed X,
         * Y and Z Cartesian coordinates.
         * @returns {Vec3} The result argument.
         * @throws {ArgumentError} If the specified result argument is null or undefined.
         */
        Globe.prototype.computePointFromPosition = function (latitude, longitude, altitude, result) {
            if (!result) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "computePointFromPosition",
                    "missingResult"));
            }

            var cosLat = Math.cos(latitude * Angle.DEGREES_TO_RADIANS),
                sinLat = Math.sin(latitude * Angle.DEGREES_TO_RADIANS),
                cosLon = Math.cos(longitude * Angle.DEGREES_TO_RADIANS),
                sinLon = Math.sin(longitude * Angle.DEGREES_TO_RADIANS),
                rpm = this.equatorialRadius / Math.sqrt(1.0 - this.eccentricitySquared * sinLat * sinLat);

            result[0] = (rpm + altitude) * cosLat * sinLon;
            result[1] = (rpm * (1.0 - this.eccentricitySquared) + altitude) * sinLat;
            result[2] = (rpm + altitude) * cosLat * cosLon;

            return result;
        };

        /**
         * Computes a Cartesian point from a specified location.
         * See this class' Overview section for a description of the Cartesian coordinate system used.
         * @param {Number} latitude The position's latitude.
         * @param {Number} longitude The position's longitude.
         * @param {Vec3} result A reference to a pre-allocated {@link Vec3} in which to return the computed X,
         * Y and Z Cartesian coordinates.
         * @returns {Vec3} The result argument.
         * @throws {ArgumentError} If the specified result argument is null or undefined.
         */
        Globe.prototype.computePointFromLocation = function (latitude, longitude, result) {
            if (!result) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "computePointFromLocation",
                    "missingResult"));
            }

            return this.computePointFromPosition(latitude, longitude, 0, result);
        };

        /**
         * Computes a grid of Cartesian points within a specified sector and relative to a specified Cartesian
         * reference point.
         * <p>
         * This method is used to compute a collection of points within a sector. It is used by tessellators to
         * efficiently generate a tile's interior points. The number of points to generate is indicated by the numLon
         * and numLat parameters.
         * <p>
         * For each implied position within the sector, an elevation value is specified via an array of elevations. The
         * calculation at each position incorporates the associated elevation. There must be numLat x numLon elevations
         * in the array.
         *
         * @param {Sector} sector The sector for which to compute the points.
         * @param {Number} numLat The number of latitudinal points in the grid.
         * @param {Number} numLon The number of longitudinal points in the grid.
         * @param {Number[]} elevations An array of elevations to incorporate in the point calculations. There must be
         * one elevation value in the array for each generated point. Elevations are in meters. There must be
         * numLat x numLon elevations in the array.
         * @param {Vec3} referencePoint The X, Y and Z Cartesian coordinates to subtract from the computed coordinates.
         * This makes the computed coordinates relative to the specified point.
         * @param {Float32Array} result A typed array to hold the computed coordinates. It must be at least of
         * size numLat x numLon. The points are returned in row major order, beginning with the row of minimum latitude.
         * @returns {Float32Array} The specified result argument.
         * @throws {ArgumentError} if the specified sector, elevations array or results arrays are null or undefined, or
         * if the lengths of any of the arrays are insufficient.
         */
        Globe.prototype.computePointsForGrid = function (sector, numLat, numLon, elevations, referencePoint, result) {
            if (!sector) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe",
                    "computePointsFromPositions", "missingSector"));
            }

            if (numLat < 1 || numLon < 1) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "computePointsFromPositions",
                    "Number of latitude or longitude locations is less than one."));
            }

            var numPoints = numLat * numLon;
            if (!elevations || elevations.length < numPoints) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "computePointsFromPositions",
                    "Elevations array is null, undefined or insufficient length."));
            }

            if (!result || result.length < numPoints) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "computePointsFromPositions",
                    "Result array is null, undefined or insufficient length."));
            }

            var minLat = sector.minLatitude * Angle.DEGREES_TO_RADIANS,
                maxLat = sector.maxLatitude * Angle.DEGREES_TO_RADIANS,
                minLon = sector.minLongitude * Angle.DEGREES_TO_RADIANS,
                maxLon = sector.maxLongitude * Angle.DEGREES_TO_RADIANS,
                deltaLat = (maxLat - minLat) / (numLat > 1 ? numLat - 1 : 1),
                deltaLon = (maxLon - minLon) / (numLon > 1 ? numLon - 1 : 1),
                refCenter = referencePoint ? referencePoint : new Vec3(0, 0, 0),
                latIndex, lonIndex,
                elevIndex = 0, resultIndex = 0,
                lat, lon, rpm, elev,
                cosLat, sinLat,
                cosLon = new Float64Array(numLon), sinLon = new Float64Array(numLon);

            // Compute and save values that are a function of each unique longitude value in the specified sector. This
            // eliminates the need to re-compute these values for each column of constant longitude.
            for (lonIndex = 0, lon = minLon; lonIndex < numLon; lonIndex++, lon += deltaLon) {
                if (lonIndex === numLon - 1) {
                    lon = maxLon; // explicitly set the last lon to the max longitude to ensure alignment
                }

                cosLon[lonIndex] = Math.cos(lon);
                sinLon[lonIndex] = Math.sin(lon);
            }

            // Iterate over the latitude and longitude coordinates in the specified sector, computing the Cartesian
            // point corresponding to each latitude and longitude.
            for (latIndex = 0, lat = minLat; latIndex < numLat; latIndex++, lat += deltaLat) {
                if (latIndex === numLat - 1) {
                    lat = maxLat; // explicitly set the last lat to the max longitude to ensure alignment
                }

                // Latitude is constant for each row. Values that are a function of latitude can be computed once per row.
                cosLat = Math.cos(lat);
                sinLat = Math.sin(lat);
                rpm = this.equatorialRadius / Math.sqrt(1.0 - this.eccentricitySquared * sinLat * sinLat);

                for (lonIndex = 0; lonIndex < numLon; lonIndex++) {
                    elev = elevations[elevIndex++];
                    result[resultIndex++] = (rpm + elev) * cosLat * sinLon[lonIndex] - refCenter[0];
                    result[resultIndex++] = (rpm * (1.0 - this.eccentricitySquared) + elev) * sinLat - refCenter[1];
                    result[resultIndex++] = (rpm + elev) * cosLat * cosLon[lonIndex] - refCenter[2];
                }
            }

            return result;
        };

        /**
         * Computes a geographic position from a specified Cartesian point.
         *
         * See this class' Overview section for a description of the Cartesian coordinate system used.
         *
         * @param {Number} x The X coordinate.
         * @param {Number} y The Y coordinate.
         * @param {Number} z The Z coordinate.
         * @param {Position} result A pre-allocated {@link Position} instance in which to return the computed position.
         * @returns {Position} The specified result position.
         * @throws {ArgumentError} If the specified result argument is null or undefined.
         */
        Globe.prototype.computePositionFromPoint = function (x, y, z, result) {
            if (!result) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "computePositionFromPoint",
                    "missingResult"));
            }

            // Contributed by Nathan Kronenfeld. Updated on 1/24/2011. Brings this calculation in line with Vermeille's most
            // recent update.

            // According to H. Vermeille, "An analytical method to transform geocentric into geodetic coordinates"
            // http://www.springerlink.com/content/3t6837t27t351227/fulltext.pdf
            // Journal of Geodesy, accepted 10/2010, not yet published
            var X = z,
                Y = x,
                Z = y,
                XXpYY = X * X + Y * Y,
                sqrtXXpYY = Math.sqrt(XXpYY),
                a = this.equatorialRadius,
                ra2 = 1 / (a * a),
                e2 = this.eccentricitySquared,
                e4 = e2 * e2,
                p = XXpYY * ra2,
                q = Z * Z * (1 - e2) * ra2,
                r = (p + q - e4) / 6,
                h,
                phi,
                u,
                evoluteBorderTest = 8 * r * r * r + e4 * p * q,
                rad1,
                rad2,
                rad3,
                atan,
                v,
                w,
                k,
                D,
                sqrtDDpZZ,
                e,
                lambda,
                s2;

            if (evoluteBorderTest > 0 || q != 0) {
                if (evoluteBorderTest > 0) {
                    // Step 2: general case
                    rad1 = Math.sqrt(evoluteBorderTest);
                    rad2 = Math.sqrt(e4 * p * q);

                    // 10*e2 is my arbitrary decision of what Vermeille means by "near... the cusps of the evolute".
                    if (evoluteBorderTest > 10 * e2) {
                        rad3 = WWMath.cbrt((rad1 + rad2) * (rad1 + rad2));
                        u = r + 0.5 * rad3 + 2 * r * r / rad3;
                    }
                    else {
                        u = r + 0.5 * WWMath.cbrt((rad1 + rad2) * (rad1 + rad2))
                        + 0.5 * WWMath.cbrt((rad1 - rad2) * (rad1 - rad2));
                    }
                }
                else {
                    // Step 3: near evolute
                    rad1 = Math.sqrt(-evoluteBorderTest);
                    rad2 = Math.sqrt(-8 * r * r * r);
                    rad3 = Math.sqrt(e4 * p * q);
                    atan = 2 * Math.atan2(rad3, rad1 + rad2) / 3;

                    u = -4 * r * Math.sin(atan) * Math.cos(Math.PI / 6 + atan);
                }

                v = Math.sqrt(u * u + e4 * q);
                w = e2 * (u + v - q) / (2 * v);
                k = (u + v) / (Math.sqrt(w * w + u + v) + w);
                D = k * sqrtXXpYY / (k + e2);
                sqrtDDpZZ = Math.sqrt(D * D + Z * Z);

                h = (k + e2 - 1) * sqrtDDpZZ / k;
                phi = 2 * Math.atan2(Z, sqrtDDpZZ + D);
            }
            else {
                // Step 4: singular disk
                rad1 = Math.sqrt(1 - e2);
                rad2 = Math.sqrt(e2 - p);
                e = Math.sqrt(e2);

                h = -a * rad1 * rad2 / e;
                phi = rad2 / (e * rad2 + rad1 * Math.sqrt(p));
            }

            // Compute lambda
            s2 = Math.sqrt(2);
            if ((s2 - 1) * Y < sqrtXXpYY + X) {
                // case 1 - -135deg < lambda < 135deg
                lambda = 2 * Math.atan2(Y, sqrtXXpYY + X);
            }
            else if (sqrtXXpYY + Y < (s2 + 1) * X) {
                // case 2 - -225deg < lambda < 45deg
                lambda = -Math.PI * 0.5 + 2 * Math.atan2(X, sqrtXXpYY - Y);
            }
            else {
                // if (sqrtXXpYY-Y<(s2=1)*X) {  // is the test, if needed, but it's not
                // case 3: - -45deg < lambda < 225deg
                lambda = Math.PI * 0.5 - 2 * Math.atan2(X, sqrtXXpYY + Y);
            }

            result.latitude = Angle.RADIANS_TO_DEGREES * phi;
            result.longitude = Angle.RADIANS_TO_DEGREES * lambda;
            result.altitude = h;

            return result;
        };

        /**
         * Computes the radius of this globe at a specified location.
         * @param {Number} latitude The locations' latitude.
         * @param {Number} longitude The locations' longitude.
         * @returns {Number} The radius at the specified location.
         */
        Globe.prototype.radiusAt = function (latitude, longitude) {
            var sinLat = Math.sin(latitude * Angle.DEGREES_TO_RADIANS),
                rpm = this.equatorialRadius / Math.sqrt(1.0 - this.eccentricitySquared * sinLat * sinLat);

            return rpm * Math.sqrt(1.0 + (this.eccentricitySquared * this.eccentricitySquared - 2.0 * this.eccentricitySquared) * sinLat * sinLat);
        };

        /**
         * Computes the normal vector to this globe's surface at a specified location.
         * @param {Number} latitude The location's latitude.
         * @param {Number} longitude The location's longitude.
         * @param {Vec3} result A pre-allocated {@Link Vec3} instance in which to return the computed vector. The returned
         * normal vector is unit length.
         * @returns {Vec3} The specified result vector.  The returned normal vector is unit length.
         * @throws {ArgumentError} If the specified result argument is null or undefined.
         */
        Globe.prototype.surfaceNormalAtLocation = function (latitude, longitude, result) {
            if (!result) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "surfaceNormalAtLocation",
                    "missingResult"));
            }

            var cosLat = Math.cos(latitude * Angle.DEGREES_TO_RADIANS),
                cosLon = Math.cos(longitude * Angle.DEGREES_TO_RADIANS),
                sinLat = Math.sin(latitude * Angle.DEGREES_TO_RADIANS),
                sinLon = Math.sin(longitude * Angle.DEGREES_TO_RADIANS),
                eqSquared = this.equatorialRadius * this.equatorialRadius,
                polSquared = this.polarRadius * this.polarRadius;

            result[0] = cosLat * sinLon / eqSquared;
            result[1] = (1 - this.eccentricitySquared) * sinLat / polSquared;
            result[2] = cosLat * cosLon / eqSquared;

            return result.normalize();
        };

        /**
         * Computes the normal vector to this globe's surface at a specified Cartesian point.
         * @param {Number} x The point's X coordinate.
         * @param {Number} y The point's Y coordinate.
         * @param {Number} z The point's Z coordinate.
         * @param {Vec3} result A pre-allocated {@Link Vec3} instance in which to return the computed vector. The returned
         * normal vector is unit length.
         * @returns {Vec3} The specified result vector.
         * @throws {ArgumentError} If the specified result argument is null or undefined.
         */
        Globe.prototype.surfaceNormalAtPoint = function (x, y, z, result) {
            if (!result) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "surfaceNormalAtPoint",
                    "missingResult"));
            }

            var eSquared = this.equatorialRadius * this.equatorialRadius,
                polSquared = this.polarRadius * this.polarRadius;

            result[0] = x / eSquared;
            result[1] = y / polSquared;
            result[2] = z / eSquared;

            return result.normalize();
        };

        /**
         * Computes the north-pointing tangent vector to this globe's surface at a specified location.
         * @param {Number} latitude The location's latitude.
         * @param {Number} longitude The location's longitude.
         * @param {Vec3} result A pre-allocated {@Link Vec3} instance in which to return the computed vector. The returned
         * tangent vector is unit length.
         * @returns {Vec3} The specified result vector.
         * @throws {ArgumentError} If the specified result argument is null or undefined.
         */
        Globe.prototype.northTangentAtLocation = function (latitude, longitude, result) {
            if (!result) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "northTangentAtLocation",
                    "missingResult"));
            }

            // The north-pointing tangent is derived by rotating the vector (0, 1, 0) about the Y-axis by longitude degrees,
            // then rotating it about the X-axis by -latitude degrees. The latitude angle must be inverted because latitude
            // is a clockwise rotation about the X-axis, and standard rotation matrices assume counter-clockwise rotation.
            // The combined rotation can be represented by a combining two rotation matrices Rlat, and Rlon, then
            // transforming the vector (0, 1, 0) by the combined transform:
            //
            // NorthTangent = (Rlon * Rlat) * (0, 1, 0)
            //
            // This computation can be simplified and encoded inline by making two observations:
            // - The vector's X and Z coordinates are always 0, and its Y coordinate is always 1.
            // - Inverting the latitude rotation angle is equivalent to inverting sinLat. We know this by the
            //  trigonometric identities cos(-x) = cos(x), and sin(-x) = -sin(x).

            var cosLat = Math.cos(latitude * Angle.DEGREES_TO_RADIANS),
                cosLon = Math.cos(longitude * Angle.DEGREES_TO_RADIANS),
                sinLat = Math.sin(latitude * Angle.DEGREES_TO_RADIANS),
                sinLon = Math.sin(longitude * Angle.DEGREES_TO_RADIANS);

            result[0] = -sinLat * sinLon;
            result[1] = cosLat;
            result[2] = -sinLat * cosLon;

            return result.normalize();
        };

        /**
         * Computes the north-pointing tangent vector to this globe's surface at a specified Cartesian point.
         * @param {Number} x The point's X coordinate.
         * @param {Number} y The point's Y coordinate.
         * @param {Number} z The point's Z coordinate.
         * @param {Vec3} result A pre-allocated {@Link Vec3} instance in which to return the computed vector. The returned
         * tangent vector is unit length.
         * @returns {Vec3} The specified result vector.
         * @throws {ArgumentError} If the specified result argument is null or undefined.
         */
        Globe.prototype.northTangentAtPoint = function (x, y, z, result) {
            if (!result) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "northTangentAtPoint",
                    "missingResult"));
            }

            this.computePositionFromPoint(x, y, z, this.scratchPosition);

            return this.northTangentAtLocation(this.scratchPosition.latitude, this.scratchPosition.longitude, result);
        };

        /**
         * Indicates whether this globe intersects a specified frustum.
         * @param {Frustum} frustum The frustum to test.
         * @returns {Boolean} true if this globe intersects the frustum, otherwise false.
         * @throws {ArgumentError} If the specified frustum is null or undefined.
         */
        Globe.prototype.intersectsFrustum = function (frustum) {
            if (!frustum) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "intersectsFrustum", "missingFrustum"));
            }

            if (frustum.far.distance <= this.equatorialRadius)
                return false;
            if (frustum.left.distance <= this.equatorialRadius)
                return false;
            if (frustum.right.distance <= this.equatorialRadius)
                return false;
            if (frustum.top.distance <= this.equatorialRadius)
                return false;
            if (frustum.bottom.distance <= this.equatorialRadius)
                return false;
            if (frustum.near.distance <= this.equatorialRadius)
                return false;

            return true;
        };

        /**
         * Computes the first intersection of this globe with a specified line. The line is interpreted as a ray;
         * intersection points behind the line's origin are ignored.
         * @param {Line} line The line to intersect with this globe.
         * @param {Vec3} result A pre-allocated Vec3 in which to return the computed point.
         * @returns {boolean} true If the ray intersects the globe, otherwise false.
         * @throws {ArgumentError} If the specified line or result argument is null or undefined.
         */
        Globe.prototype.intersectsLine = function (line, result) {
            if (!line) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "intersectWithRay", "missingLine"));
            }

            if (!result) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "intersectsLine", "missingResult"));
            }

            return WWMath.computeEllipsoidalGlobeIntersection(line, this.equatorialRadius, this.polarRadius, result);
        };

        /**
         * Returns the time at which any elevations associated with this globe last changed.
         * @returns {Number} The time in milliseconds relative to the Epoch of the most recent elevation change.
         */
        Globe.prototype.elevationTimestamp = function () {
            return this.elevationModel.timestamp;
        };

        /**
         * Returns this globe's minimum elevation.
         * @returns {Number} This globe's minimum elevation.
         */
        Globe.prototype.minElevation = function () {
            return this.elevationModel.minElevation
        };

        /**
         * Returns this globe's maximum elevation.
         * @returns {Number} This globe's maximum elevation.
         */
        Globe.prototype.maxElevation = function () {
            return this.elevationModel.maxElevation
        };

        /**
         * Returns the minimum and maximum elevations within a specified sector of this globe.
         * @param {Sector} sector The sector for which to determine extreme elevations.
         * @returns {Number[]} The An array containing the minimum and maximum elevations.
         * @throws {ArgumentError} If the specified sector is null or undefined.
         */
        Globe.prototype.minAndMaxElevationsForSector = function (sector) {
            if (!sector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "minAndMaxElevationsForSector",
                        "missingSector"));
            }

            return this.elevationModel.minAndMaxElevationsForSector(sector);
        };

        /**
         * Returns the elevation at a specified location.
         * @param {Number} latitude The location's latitude in degrees.
         * @param {Number} longitude The location's longitude in degrees.
         * @returns {Number} The elevation at the specified location, in meters. Returns zero if the location is
         * outside the coverage area of this elevation model.
         */
        Globe.prototype.elevationAtLocation = function (latitude, longitude) {
            return this.elevationModel.elevationAtLocation(latitude, longitude);
        };

        /**
         * Returns the elevations at locations within a specified sector.
         * @param {Sector} sector The sector for which to determine the elevations.
         * @param {Number} numLat The number of latitudinal sample locations within the sector.
         * @param {Number} numLon The number of longitudinal sample locations within the sector.
         * @param {Number} targetResolution The desired elevation resolution, in radians. (To compute radians from
         * meters, divide the number of meters by the globe's radius.)
         * @param {Number[]} result An array in which to return the requested elevations.
         * @returns {Number} The resolution actually achieved, which may be greater than that requested if the
         * elevation data for the requested resolution is not currently available.
         * @throws {ArgumentError} If the specified sector or result array is null or undefined, or if either of the
         * specified numLat or numLon values is less than one.
         */
        Globe.prototype.elevationsForGrid = function (sector, numLat, numLon, targetResolution, result) {
            if (!sector) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Globe", "elevationsForSector", "missingSector"));
            }

            if (numLat <= 0 || numLon <= 0) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe",
                    "elevationsForSector", "numLat or numLon is less than 1"));
            }

            if (!result || result.length < numLat * numLon) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Globe",
                    "elevationsForSector", "missingArray"));
            }

            return this.elevationModel.elevationsForGrid(sector, numLat, numLon, targetResolution, result);
        };

        return Globe;
    }
)
;