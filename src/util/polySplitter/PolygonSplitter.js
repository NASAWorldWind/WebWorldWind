/**
 * Created by Florin on 12/8/2016.
 */

define([
        '../../geom/Angle',
        '../../geom/Location',
        '../../geom/Position',
        '../../geom/Sector',
        '../../geom/Vec3',
        '../WWMath'
    ],
    function (Angle,
              Location,
              Position,
              Sector,
              Vec3,
              WWMath) {
        'use strict';

        var PolygonSplitter = function () {
            //north pole vector
            this.v1 = new Vec3(-6.123233995736766e-17, 7.498798913309288e-33, 1);

            //south pole vector
            this.v2 = new Vec3(-6.123233995736766e-17, 7.498798913309288e-33, -1);

            //cross product of north and south poles vectors
            this.c2 = new Vec3(-1.4997597826618576e-32, -1.2246467991473532e-16, 0);
        };

        PolygonSplitter.prototype.splitContours = function (contours, newContours, pathType, globe) {
            pathType = pathType || WorldWind.GREAT_CIRCLE;

            if (pathType !== WorldWind.GREAT_CIRCLE && !globe) {
                throw new Error('PolygonSplitter splitContours - missing globe');
            }

            var doesCross = false;
            for (var i = 0, len = contours.length; i < len; i++) {
                var contourInfo = this.splitContour(contours[i], pathType, globe);
                if (contourInfo.intersections.length) {
                    doesCross = true;
                }
                newContours.push(contourInfo);
            }
            return doesCross;
        };

        PolygonSplitter.prototype.splitContour = function (points, pathType, globe) {
            var newPoints = [];
            var intersections = [];
            var pole = this.findIntersectionAndPole(points, newPoints, intersections, pathType, globe);

            if (intersections.length === 0) {
                var sector = this.computeSector(newPoints);
                return this.formatContourOutput([newPoints], intersections, pole, [sector]);
            }

            if (intersections.length > 2) {
                intersections.sort(function (a, b) {
                    return b[0].latitude - a[0].latitude;
                });
            }

            if (pole !== Location.poles.NONE) {
                console.info('Polygon contains a Pole');
                newPoints = this.handleOnePole(newPoints, intersections, pole);
            }
            if (intersections.length === 0) {
                sector = this.computeSector(newPoints);
                return this.formatContourOutput([newPoints], intersections, pole, [sector]);
            }

            this.linkIntersections(intersections);

            var sectors = [];
            var polygons = this.makePolygons(newPoints, intersections, sectors, pathType);

            return this.formatContourOutput(polygons, intersections, pole, sectors);
        };

        PolygonSplitter.prototype.findIntersectionAndPole = function (points, newPoints, intersections, pathType, globe) {
            var containsPole = false;
            var minLatitude = 90.0;
            var maxLatitude = -90.0;

            for (var i = 0, lenC = points.length; i < lenC; i++) {
                var pt1 = points[i];
                var pt2 = points[(i + 1) % lenC];

                if (pt1.equals(pt2)) {
                    continue;
                }

                minLatitude = Math.min(minLatitude, pt1.latitude);
                maxLatitude = Math.max(maxLatitude, pt1.latitude);

                var doesCross = Location.locationsCrossDateLine([pt1, pt2]);
                if (doesCross) {
                    containsPole = !containsPole;

                    //var iLatitude = Location.intersectionWithMeridian(pt1, pt2, 180, globe);
                    var iLatitude = this.dateLineIntersection(pt1, pt2, pathType, globe);
                    var iLongitude = WWMath.signum(pt1.longitude) * 180 || 180;

                    var iLoc1 = new Location(iLatitude, iLongitude);
                    var iLoc2 = new Location(iLatitude, -iLongitude);
                    iLoc1.isIntersection = true;
                    iLoc2.isIntersection = true;

                    this.safeAdd(newPoints, pt1);
                    iLoc1.index = newPoints.length;
                    iLoc2.index = newPoints.length + 1;
                    this.safeAdd(newPoints, iLoc1);
                    this.safeAdd(newPoints, iLoc2);
                    this.safeAdd(newPoints, pt2);

                    intersections.push([iLoc1, iLoc2]);
                }
                else {
                    this.safeAdd(newPoints, pt1);
                    this.safeAdd(newPoints, pt2);
                }
            }

            var pole = Location.poles.NONE;
            if (containsPole) {
                pole = this.determinePole(minLatitude, maxLatitude);
            }

            return pole;
        };

        PolygonSplitter.prototype.determinePole = function (minLatitude, maxLatitude) {
            // Determine which pole is enclosed. If the shape is entirely in one hemisphere, then assume that it encloses
            // the pole in that hemisphere. Otherwise, assume that it encloses the pole that is closest to the shape's
            // extreme latitude.
            var pole;
            if (minLatitude > 0) {
                pole = Location.poles.NORTH; // Entirely in Northern Hemisphere.
            }
            else if (maxLatitude < 0) {
                pole = Location.poles.SOUTH; // Entirely in Southern Hemisphere.
            }
            else if (Math.abs(maxLatitude) >= Math.abs(minLatitude)) {
                pole = Location.poles.NORTH; // Spans equator, but more north than south.
            }
            else {
                pole = Location.poles.SOUTH; // Spans equator, but more south than north.
            }
            return pole;
        };

        PolygonSplitter.prototype.linkIntersections = function (intersections) {
            for (var i = 0, len = intersections.length - 1; i < len; i += 2) {
                var i0 = intersections[i];
                var i1 = intersections[i + 1];
                var i0end = i0[0];
                var i0start = i0[1];
                var i1end = i1[0];
                var i1start = i1[1];

                i0end.linkTo = i1start.index;
                i0start.linkTo = i1end.index;
                i1end.linkTo = i0start.index;
                i1start.linkTo = i0end.index;
            }
        };

        PolygonSplitter.prototype.makePolygons = function (points, intersections, sectors, pathType) {
            var polygons = [];
            for (var i = 0; i < intersections.length - 1; i += 2) {
                var i0 = intersections[i];
                var i1 = intersections[i + 1];

                var start = i0[1].index;
                var end = i1[0].index;
                var polygon = [];
                var sector = this.makePolygon(start, end, points, polygon, pathType);
                if (polygon.length) {
                    polygons.push(polygon);
                    sectors.push(sector);
                }

                start = i1[1].index;
                end = i0[0].index;
                polygon = [];
                sector = this.makePolygon(start, end, points, polygon, pathType);
                if (polygon.length) {
                    polygons.push(polygon);
                    sectors.push(sector);
                }
            }

            return polygons;
        };

        PolygonSplitter.prototype.makePolygon = function (start, end, points, polygon, pathType) {
            var pass = false;
            var len = points.length;

            var minLatitude = 90,
                maxLatitude = -90,
                minLongitude = 180,
                maxLongitude = -180;

            if (end < start) {
                end += len;
            }

            for (var i = start; i <= end; i++) {
                var pt = points[i % len];
                if (pt.visited) {
                    break;
                }
                polygon.push(pt);

                minLatitude = Math.min(minLatitude, pt.latitude);
                maxLatitude = Math.max(maxLatitude, pt.latitude);
                minLongitude = Math.min(minLongitude, pt.longitude);
                maxLongitude = Math.max(maxLongitude, pt.longitude);

                if (pt.isIntersection) {
                    if (pass) {
                        i = pt.linkTo - 1;//'connecting intersection index - 1?'
                        if (i + 1 === start) {
                            break;
                        }
                    }
                    pass = !pass;
                    pt.visited = true;
                }
            }

            if (polygon.length) {
                if (minLongitude === -180 && maxLongitude === 180) {
                    //spans the globe;
                }
                var sector = new Sector(minLatitude, maxLatitude, minLongitude, maxLongitude);
                if (pathType === WorldWind.GREAT_CIRCLE) {
                    var extremes = Location.greatCircleArcExtremeLocations(polygon);
                    minLatitude = Math.min(sector.minLatitude, extremes[0].latitude);
                    maxLatitude = Math.max(sector.maxLatitude, extremes[1].latitude);
                    sector.minLatitude = minLatitude;
                    sector.maxLatitude = maxLatitude;
                }
            }

            return sector;
        };

        PolygonSplitter.prototype.computeSector = function (points, pathType) {
            var sector = new Sector(-90, 90, -180, 180);
            sector.setToBoundingSector(points);
            if (pathType === WorldWind.GREAT_CIRCLE) {
                var extremes = Location.greatCircleArcExtremeLocations(points);
                var minLatitude = Math.min(sector.minLatitude, extremes[0].latitude);
                var maxLatitude = Math.max(sector.maxLatitude, extremes[1].latitude);
                sector.minLatitude = minLatitude;
                sector.maxLatitude = maxLatitude;
            }
            return sector;
        };

        PolygonSplitter.prototype.safeAdd = function (arr, el) {
            if (!el._added) {
                arr.push(el);
                el._added = true;
            }
        };

        PolygonSplitter.prototype.dateLineIntersection = function (p1, p2, pathType, globe) {
            if (pathType === WorldWind.GREAT_CIRCLE) {
                return this.greatCircleIntersection(p1, p2);
            }
            else if (pathType === WorldWind.RHUMB_LINE || pathType === WorldWind.LINEAR) {
                this.rhumbLinearIntersection(p1, p2, pathType, globe);
            }
        };

        PolygonSplitter.prototype.greatCircleIntersection = function (path1Start, path1End) {
            // if c1 & c2 are great circles through start and end points (or defined by start point + bearing),
            // then candidate intersections are simply c1 × c2 & c2 × c1; most of the work is deciding correct
            // intersection point to select! if bearing is given, that determines which intersection, if both
            // paths are defined by start/end points, take closer intersection

            var p1 = this.toVector(path1Start);
            var p2 = this.toVector(path1End);
            //var p2 = this.toVector(path2Start);

            // c1 & c2 are vectors defining great circles through start & end points; p × c gives initial bearing vector
            var c1 = this.cross(p1, p2);
            //var c2 = this.v1.cross1(this.v2);
            var c2 = this.c2;

            // there are two (antipodal) candidate intersection points; we have to choose which to return
            var i1 = this.cross(c1, c2);
            var i2 = this.cross(c2, c1);

            var mid = this.add(p1, this.v1, p2, this.v2);
            var i = mid.dot(i1) > 0 ? i1 : i2;

            var latRad = Math.atan2(i[2], Math.sqrt(i[0] * i[0] + i[1] * i[1]));
            return latRad * Angle.RADIANS_TO_DEGREES;
        };

        PolygonSplitter.prototype.rhumbLinearIntersection = function (p1, p2, pathType, globe) {
            var distanceRadians = Location.greatCircleDistance(p1, p2),
                steps = Math.round(128 * distanceRadians / Math.PI),
                dt = 1 / steps,
                location = new Location(0, 0);
            var iter = 0;
            var lastLocation = new Location(p1.latitude, p1.longitude);
            var sign = WWMath.signum(p1.longitude);

            if (steps > 0) {
                var t = this.throttledStep(dt, p1);
                while (t < 1) {
                    if (iter > 0) {
                        lastLocation.copy(location);
                    }

                    Location.interpolateAlongPath(pathType, t, p1, p2, location);
                    if (p1.longitude === p2.longitude) {
                        if (p1.longitude === 180 && location.longitude === -180) {
                            location.longitude = 180
                        }
                        else if (p1.longitude === -180 && location.longitude === 180) {
                            location.longitude = -180
                        }
                    }
                    var nextSign = WWMath.signum(location.longitude);
                    if (sign !== nextSign) {
                        break;
                    }

                    t += this.throttledStep(dt, location);
                    iter++;
                }
            }

            var intersection = Location.intersectionWithMeridian(lastLocation, location, 180, globe);
            return intersection;
        };

        PolygonSplitter.prototype.linearIntersection = function (p1, p2, globe) {

        };

        PolygonSplitter.prototype.toVector = function (point) {
            var phi = point.latitude * Angle.DEGREES_TO_RADIANS;
            var lambda = point.longitude * Angle.DEGREES_TO_RADIANS;

            // right-handed vector: x -> 0°E,0°N; y -> 90°E,0°N, z -> 90°N
            var cosPhi = Math.cos(phi);
            var x = cosPhi * Math.cos(lambda);
            var y = cosPhi * Math.sin(lambda);
            var z = Math.sin(phi);

            return new Vec3(x, y, z);
        };

        PolygonSplitter.prototype.add = function (v1, v2, v3, v4) {
            var v = new Vec3(0, 0, 0);
            v[0] = v1[0] + v2[0] + v3[0] + v4[0];
            v[1] = v1[1] + v2[1] + v3[1] + v4[1];
            v[2] = v1[2] + v2[2] + v3[2] + v4[2];
            return v;
        };

        PolygonSplitter.prototype.cross = function (v1, v2) {
            var v = new Vec3(v1[0], v1[1], v1[2]);
            return v.cross(v2);
        };

        PolygonSplitter.prototype.formatContourOutput = function (polygons, intersections, pole, sectors) {
            return {
                polygons: polygons,
                intersections: intersections,
                pole: pole,
                sectors: sectors
            };
        };

        PolygonSplitter.prototype.throttledStep = function (dt, location) {
            var cosLat = Math.cos(location.latitude * Angle.DEGREES_TO_RADIANS);
            cosLat *= cosLat; // Square cos to emphasize poles and de-emphasize equator.

            // Remap polarThrotle:
            //  0 .. INF => 0 .. 1
            // This acts as a weight between no throttle and fill throttle.
            var weight = 10 / (1 + 10);

            return dt * ((1 - weight) + weight * cosLat);
        };

        var polygonSplitter = new PolygonSplitter();
        return polygonSplitter;

    });