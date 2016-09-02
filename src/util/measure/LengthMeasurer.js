/**
 * Created by Florin on 9/2/2016.
 */

define([
        '../../geom/Location',
        '../../geom/Position',
        '../../geom/Vec3'
    ],
    function (Location,
              Position,
              Vec3) {

        /**
         * Utility class to measure length along a path on a globe. <p/> <p>The measurer must be provided a list of at least two
         * positions to be able to compute a distance.</p> <p/> <p>Segments which are longer then the current maxSegmentLength
         * will be subdivided along lines following the current pathType - WorldWind.LINEAR, WorldWind.RHUMB_LINE or
         * WorldWind.GREAT_CIRCLE.</p> <p/> <p>For follow terrain, the computed length will account for
         * terrain deformations as if someone was walking along that path. Otherwise the length is the sum of the cartesian
         * distance between the positions.</p>
         * <p/>
         * <p>When following terrain the measurer will sample terrain elevations at regular intervals along the path. The
         * minimum number of samples used for the whole length can be set with setLengthTerrainSamplingSteps(). However, the
         * minimum sampling interval is 30 meters.
         * @alias LengthMeasurer
         * @constructor
         * @param {WorldWindow} wwd
         */

        var LengthMeasurer = function (wwd) {
            this.wwd = wwd;

            // Private. The minimum length of a terrain following subdivision.
            this.DEFAULT_MIN_SEGMENT_LENGTH = 30;

            // Private. Documentation is with the defined property below.
            this._maxSegmentLength = 100e3;

            // Private. Documentation is with the defined property below.
            this._lengthTerrainSamplingSteps = 128;

            // Private. A list of positions with no segment longer then maxLength and elevations following terrain or not.
            this.subdividedPositions = null;
        };

        Object.defineProperties(LengthMeasurer.prototype, {
            /**
             * The maximum length a segment can have before being subdivided along a line following the current pathType.
             * @type {Number}
             * @memberof Path.prototype
             */
            maxSegmentLength: {
                get: function () {
                    return this._maxSegmentLength;
                },
                set: function (value) {
                    this._maxSegmentLength = value;
                }
            },

            /**
             * The number of terrain elevation samples used along the path to approximate it's terrain following length.
             * @type {Number}
             * @memberof Path.prototype
             */
            lengthTerrainSamplingSteps: {
                get: function () {
                    return this._lengthTerrainSamplingSteps;
                },
                set: function (value) {
                    this._lengthTerrainSamplingSteps = value;
                }
            }
        });

        /**
         * Get the path length in meter. <p/> <p>If followTerrain is true, the computed length will account
         * for terrain deformations as if someone was walking along that path. Otherwise the length is the sum of the
         * cartesian distance between each positions.</p>
         *
         * @param {Position[]} positions
         * @param {Boolean} followTerrain
         * @param {String} pathType
         *
         * @return the current path length or -1 if the position list is too short.
         */
        LengthMeasurer.prototype.getLength = function (positions, followTerrain, pathType) {
            var _positions = this.clonePositions(positions);
            pathType = pathType || WorldWind.GREAT_CIRCLE;
            this.subdividedPositions = null;
            return this.computeLength(_positions, followTerrain, pathType);
        };

        /**
         * Get the path length in meter of a Path. <p/> <p>If the path's followTerrain is true, the computed length will account
         * for terrain deformations as if someone was walking along that path. Otherwise the length is the sum of the
         * cartesian distance between each positions.</p>
         *
         * @param {Path} path
         *
         * @return the current path length or -1 if the position list is too short.
         */
        LengthMeasurer.prototype.getPathLength = function (path) {
            var positions = this.clonePositions(path.positions);
            this.subdividedPositions = null;
            return this.computeLength(positions, path.followTerrain, path.pathType);
        };

        /**
         * Computes the length.
         * @param {Position[]} positions An array of positions
         * @param {Boolean} followTerrain
         * @param {String} pathType
         */
        LengthMeasurer.prototype.computeLength = function (positions, followTerrain, pathType) {
            if (!positions || positions.length < 2) {
                return -1;
            }

            var globe = this.wwd.globe;

            if (this.subdividedPositions == null) {
                // Subdivide path so as to have at least segments smaller then maxSegmentLength. If follow terrain,
                // subdivide so as to have at least lengthTerrainSamplingSteps segments, but no segments shorter then
                // DEFAULT_MIN_SEGMENT_LENGTH either.
                var maxLength = this._maxSegmentLength;
                if (followTerrain) {
                    // Recurse to compute overall path length not following terrain
                    var pathLength = this.computeLength(positions, false, pathType);
                    // Determine segment length to have enough sampling points
                    maxLength = pathLength / this._lengthTerrainSamplingSteps;
                    maxLength = Math.min(Math.max(maxLength, this.DEFAULT_MIN_SEGMENT_LENGTH), this._maxSegmentLength);
                }
                this.subdividedPositions = this.subdividePositions(positions, followTerrain, pathType, maxLength);
            }

            var distance = 0;
            var pos0 = this.subdividedPositions[0];
            var p1 = new Vec3(0, 0, 0);
            var p2 = new Vec3(0, 0, 0);
            p1 = globe.computePointFromPosition(pos0.latitude, pos0.longitude, pos0.altitude, p1);
            for (var i = 1; i < this.subdividedPositions.length; i++) {
                var pos = this.subdividedPositions[i];
                p2 = globe.computePointFromPosition(pos.latitude, pos.longitude, pos.altitude, p2);
                distance += p1.distanceTo(p2);
                p1.copy(p2);
            }

            return distance;
        };

        /**
         * Subdivide a list of positions so that no segment is longer then the provided maxLength.
         * <p>If needed, new intermediate positions will be created along lines that follow the given pathType one of
         * WorldWind.LINEAR, WorldWind.RHUMB_LINE or WorldWind.GREAT_CIRCLE.
         * All position elevations will be either at the terrain surface if followTerrain is true, or interpolated
         * according to the original elevations.</p>
         *
         * @param {Position[]} positions
         * @param {Boolean} followTerrain
         * @param {String} pathType
         * @param {Number} maxLength The maximum length for one segment.
         *
         * @return a list of positions with no segment longer then maxLength and elevations following terrain or not.
         */
        LengthMeasurer.prototype.subdividePositions = function (positions, followTerrain, pathType, maxLength) {
            var globe = this.wwd.globe;
            var subdividedPositions = [];
            var loc = new Location(0, 0);
            var pos1 = positions[0];

            if (followTerrain) {
                var elevation = globe.elevationAtLocation(pos1.latitude, pos1.longitude);
                subdividedPositions.push(new Position(pos1.latitude, pos1.longitude, elevation));
            }
            else {
                subdividedPositions.push(new Position(pos1.latitude, pos1.longitude, pos1.altitude));
            }

            for (var i = 1; i < positions.length; i++) {
                var pos2 = positions[i];
                var arcLengthRadians = Location.greatCircleDistance(pos1, pos2);
                loc = Location.interpolateAlongPath(pathType, 0.5, pos1, pos2, loc);
                var arcLength = arcLengthRadians * globe.radiusAt(loc.latitude, loc.longitude);
                if (arcLength > maxLength) {
                    // if necessary subdivide segment at regular intervals smaller then maxLength
                    var segmentAzimuth = null;
                    var segmentDistance = null;
                    var steps = Math.ceil(arcLength / maxLength);
                    for (var j = 1; j < steps; j++) {
                        var s = j / steps;
                        var destLatLon = new Location(0, 0);
                        if (pathType === WorldWind.LINEAR) {
                            destLatLon = Location.interpolateLinear(s, pos1, pos2, destLatLon);
                        }
                        else if (pathType === WorldWind.RHUMB_LINE) {
                            if (segmentAzimuth == null) {
                                segmentAzimuth = Location.rhumbAzimuth(pos1, pos2);
                                segmentDistance = Location.rhumbDistance(pos1, pos2);
                            }
                            destLatLon = Location.rhumbLocation(pos1, segmentAzimuth, s * segmentDistance, destLatLon);
                        }
                        else {
                            //GREAT_CIRCLE
                            if (segmentAzimuth == null) {
                                segmentAzimuth = Location.greatCircleAzimuth(pos1, pos2);
                                segmentDistance = Location.greatCircleDistance(pos1, pos2);
                            }
                            destLatLon = Location.greatCircleLocation(pos1, segmentAzimuth, s * segmentDistance, destLatLon);
                        }

                        // Set elevation
                        if (followTerrain) {
                            elevation = globe.elevationAtLocation(destLatLon.latitude, destLatLon.longitude);
                        }
                        else {
                            elevation = pos1.altitude * (1 - s) + pos2.altitude * s;
                        }

                        subdividedPositions.push(new Position(destLatLon.latitude, destLatLon.longitude, elevation));
                    }
                }

                // Finally add the segment end position
                if (followTerrain) {
                    elevation = globe.elevationAtLocation(pos2.latitude, pos2.longitude);
                    subdividedPositions.push(new Position(pos2.latitude, pos2.longitude, elevation));
                }
                else {
                    subdividedPositions.push(new Position(pos2.latitude, pos2.longitude, pos2.altitude));
                }

                // Prepare for next segment
                pos1.copy(pos2);
            }

            return subdividedPositions;
        };

        /**
         * Clones an array of positions
         * @param {Position[]} positions
         */
        LengthMeasurer.prototype.clonePositions = function (positions) {
            return positions.map(function (position) {
                return new Position(position.longitude, position.latitude, position.altitude);
            });
        };

        return LengthMeasurer;

    });