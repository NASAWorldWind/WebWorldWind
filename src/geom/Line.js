/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @exports Line
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../geom/Vec3'],
    function (ArgumentError,
              Logger,
              Vec3) {
        "use strict";

        /**
         * Constructs a line from a specified origin and direction.
         * @alias Line
         * @constructor
         * @classdesc Represents a line in Cartesian coordinates.
         * @param {Vec3} origin The line's origin.
         * @param {Vec3} direction The line's direction.
         * @throws {ArgumentError} If either the origin or the direction are null or undefined.
         */
        var Line = function (origin, direction) {
            if (!origin) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Line", "constructor",
                    "Origin is null or undefined."));
            }

            if (!direction) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Line", "constructor",
                    "Direction is null or undefined."));
            }

            /**
             * This line's origin.
             * @type {Vec3}
             */
            this.origin = origin;

            /**
             * This line's direction.
             * @type {Vec3}
             */
            this.direction = direction;
        };

        /**
         * Creates a line given two specified endpoints.
         * @param {Vec3} pointA The first endpoint.
         * @param {Vec3} pointB The second endpoint.
         * @return {Line} The new line.
         * @throws {ArgumentError} If either endpoint is null or undefined.
         */
        Line.fromSegment = function (pointA, pointB) {
            if (!pointA || !pointB) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Line", "fromSegment", "missingPoint"));
            }

            var origin = new Vec3(pointA[0], pointA[1], pointA[2]),
                direction = new Vec3(pointB[0] - pointA[0], pointB[1] - pointA[1], pointB[2] - pointA[2]);

            return new Line(origin, direction);
        };

        /**
         * Computes a Cartesian point a specified distance along this line.
         * @param {Number} distance The distance from this line's origin at which to compute the point.
         * @param {Vec3} result A pre-allocated {@Link Vec3} instance in which to return the computed point.
         * @return {Vec3} The specified result argument containing the computed point.
         * @throws {ArgumentError} If the specified result argument is null or undefined.
         */
        Line.prototype.pointAt = function (distance, result) {
            if (!result) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "Line", "pointAt", "missingResult."));
            }

            result[0] = this.origin[0] + this.direction[0] * distance;
            result[1] = this.origin[1] + this.direction[1] * distance;
            result[2] = this.origin[2] + this.direction[2] * distance;

            return result;
        };

        return Line;
    });