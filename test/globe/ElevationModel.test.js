/*
 * Copyright 2015-2018 WorldWind Contributors
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
define([
    'src/globe/ElevationModel',
    'src/geom/Location',
    'src/geom/Sector',
    'src/globe/TiledElevationCoverage'
], function (ElevationModel, Location, Sector, TiledElevationCoverage) {
    "use strict";
    describe("ElevationModel tests", function () {

        var MockCoverage = function (resolution, minElevation, maxElevation) {
            TiledElevationCoverage.call(this,
                Sector.FULL_SPHERE, new Location(45, 45), 1, "application/bil16", "MockElevations256", 256, 256, resolution);

            this.displayName = "Mock Elevation Coverage";
            this.minElevation = minElevation ? minElevation : -11000;
            this.maxElevation = maxElevation ? maxElevation : 8850;
        };

        MockCoverage.prototype = Object.create(TiledElevationCoverage.prototype);

        MockCoverage.prototype.minAndMaxElevationsForSector = function (sector) {
            return [this.minElevation, this.maxElevation];
        };

        MockCoverage.prototype.elevationAtLocation = function (latitude, longitude) {
            return this.maxElevation;
        };

        MockCoverage.prototype.elevationsForGrid = function (sector, numLat, numLon, targetResolution, result) {
            for (var i = 0, n = result.length; i < n; i++) {
                result[i] = this.maxElevation;
            }

            return 1;
        };

        // TODO: It would appear that Array.fill is not supported by the unit test engine. (PhantomJS 2.1.1 at the time of this writing)
        // TODO: Revisit the need for this hack with future versions of PhantomJS.
        Array.prototype.fill = function (n) {
            for (var i = 0; i < this.length; i++) {
                this[i] = n;
            }
        };

        describe("Missing parameter tests", function () {
            it("Correctly rejects calls with missing parameters", function () {
                var elevationModel = new ElevationModel();
                expect(function () {
                    elevationModel.addCoverage();
                }).toThrow();
                expect(function () {
                    elevationModel.containsCoverage();
                }).toThrow();
                expect(function () {
                    elevationModel.removeCoverage();
                }).toThrow();
                expect(function () {
                    elevationModel.elevationsForGrid();
                }).toThrow();
                expect(function () {
                    elevationModel.elevationsForGrid("dummySector");
                }).toThrow();
                expect(function () {
                    elevationModel.elevationsForGrid("dummySector", 10);
                }).toThrow();
                expect(function () {
                    elevationModel.elevationsForGrid("dummySector", 10, 10);
                }).toThrow();
                expect(function () {
                    elevationModel.elevationsForGrid("dummySector", 10, 10, 10);
                }).toThrow();
                expect(function () {
                    elevationModel.minAndMaxElevationsForSector();
                }).toThrow();
            });
        });

        describe("Elevation result tests", function () {
            it("Returns correct min and max elevations for a sector", function () {
                var n = 12;
                var em = new ElevationModel();
                for (var i = 0; i < n; i++) {
                    var c = new MockCoverage(n - i + 1, -i - 1, i + 1);
                    em.addCoverage(c);
                }

                var minMax = em.minAndMaxElevationsForSector(new Sector(-1, 1, -1, 1));
                expect(minMax[0]).toEqual(-n);
                expect(minMax[1]).toEqual(n);
            });

            it("Returns correct min and max elevations for a sector when some coverages are disabled", function () {
                var em = new ElevationModel();
                var n = 12;
                for (var i = 0; i < n; i++) {
                    var c = new MockCoverage(i + 1, -i - 1, i + 1);
                    em.addCoverage(c);
                }

                em.coverages[0].enabled = false;
                em.coverages[1].enabled = false;
                var minMax = em.minAndMaxElevationsForSector(new Sector(-1, 1, -1, 1));
                expect(minMax[0]).toEqual(-10);
                expect(minMax[1]).toEqual(10);
            });

            it("Returns correct elevation for a location", function () {
                var em = new ElevationModel();
                var n = 12;
                for (var i = 0; i < n; i++) {
                    var c = new MockCoverage(n - i + 1, -i - 1, i + 1);
                    em.addCoverage(c);
                }

                var e = em.elevationAtLocation(0, 0);
                expect(e).toEqual(n);
            });

            it("Returns correct elevation for a location when some coverages are disabled", function () {

                var em = new ElevationModel();
                var n = 12;
                for (var i = 0; i < n; i++) {
                    var c = new MockCoverage(n - i, -i - 1, i + 1);
                    em.addCoverage(c);
                }
                em.coverages[n - 1].enabled = false;
                em.coverages[n - 2].enabled = false;
                var e = em.elevationAtLocation(0, 0);
                expect(e).toEqual(n - 2);
            });

            it("Returns correct elevations for a grid", function () {
                var em = new ElevationModel();
                var n = 12;
                for (var i = 0; i < n; i++) {
                    var c = new MockCoverage(n - i, -i - 1, i + 1);
                    em.addCoverage(c);
                }

                var result = [0];
                em.elevationsForGrid(new Sector(-1, 1, -1, 1), 1, 1, 1, result);
                expect(result[0]).toEqual(n);
            });

            it("Returns correct elevations for a grid when some coverages are disabled", function () {
                var em = new ElevationModel();
                var n = 12;
                for (var i = 0; i < n; i++) {
                    var c = new MockCoverage(n - i, -i - 1, i + 1);
                    em.addCoverage(c);
                }

                em.coverages[n - 1].enabled = false;
                em.coverages[n - 2].enabled = false;
                var result = [0];
                em.elevationsForGrid(new Sector(-1, 1, -1, 1), 1, 1, 1, result);
                expect(result[0]).toEqual(n - 2);
            });
        });

        describe("Coverage list manipulation tests", function () {
            it("Maintains coverages in the correct order, respecting the sortCoverages flag", function () {
                var n = 12;
                var em = new ElevationModel();
                var coverages = [];
                for (var i = n; i > 0; i--) {
                    var c = new MockCoverage(n - i + 1);
                    em.addCoverage(c);
                    coverages.push(c);
                }

                for (i = 0; i < n; i++) {
                    expect(coverages[n - (i + 1)] === em.coverages[i]).toBe(true);
                }
            });

            it("Rejects duplicate coverages", function () {
                var em = new ElevationModel();
                var coverages = [];
                var n = 12, c;
                for (var t = 0; t < 2; t++) {
                    var expectedResult = (t === 0);
                    for (var i = 0; i < n; i++) {
                        if (expectedResult) {
                            c = new MockCoverage(i + 1);
                            coverages.push(c);
                        } else {
                            c = coverages[i];
                        }
                        expect(em.addCoverage(c)).toBe(expectedResult);
                    }
                }
            });

            it("Clears coverage list", function () {
                var em = new ElevationModel();
                for (var i = 1; i < 12; i++) {
                    var c = new MockCoverage(i);
                    em.addCoverage(c);
                }
                em.removeAllCoverages();
                expect(em.coverages.length).toEqual(0);
            });

            it("Detects coverage containment", function () {
                var em = new ElevationModel();
                var i, n = 12;
                var coverages = [];
                for (i = 0; i < n; i++) {
                    var c = new MockCoverage(i + 1);
                    em.addCoverage(c);
                    coverages.push(c);
                }

                for (i = 0; i < n; i++) {
                    expect(em.containsCoverage(coverages[i])).toBe(true);
                }
            });

            it("Removes coverages", function () {
                var em = new ElevationModel();
                var i, n = 12;
                var coverages = [];
                for (i = 0; i < n; i++) {
                    var c = new MockCoverage(n - i);
                    em.addCoverage(c);
                    coverages.push(c);
                }

                var removedCoverage = coverages.splice(3, 1);
                em.removeCoverage(removedCoverage[0]);
                n = coverages.length;
                expect(em.coverages.length).toEqual(n);
                for (i = 0; i < n; i++) {
                    expect(coverages[i] === em.coverages[i]).toBe(true);
                }
            });

            it("Clears coverage list", function () {
                var em = new ElevationModel();
                for (var i = 1; i < 12; i++) {
                    var c = new MockCoverage(i);
                    em.addCoverage(c);
                }
                em.removeAllCoverages();
                expect(em.coverages.length).toEqual(0);
            });
        });

        describe("StateKey tests", function () {
            it("StateKey changes due to list manipulation", function () {
                var em = new ElevationModel();
                var prevStateKey = em.stateKey;
                em.addCoverage(new MockCoverage(1));
                expect(em.stateKey).not.toEqual(prevStateKey);

                prevStateKey = em.stateKey;
                em.removeAllCoverages();
                expect(em.stateKey).not.toEqual(prevStateKey);

                prevStateKey = em.stateKey;
                em.addCoverage(new MockCoverage(1));
                em.addCoverage(new MockCoverage(1));
                expect(em.stateKey).not.toEqual(prevStateKey);

                prevStateKey = em.stateKey;
                em.removeCoverage(em.coverages[0]);
                expect(em.stateKey).not.toEqual(prevStateKey);
            });
        });

        describe("Timestamp calculation tests", function () {
            it("Calculates timestamp correctly", function () {
                var em = new ElevationModel();
                var newestCoverage;
                for (var i = 0; i < 10; i++) {
                    var c = new MockCoverage(i + 1);
                    em.addCoverage(c);
                    c.timestamp += Math.round(Math.random() * 1000);
                    if (!newestCoverage || newestCoverage.timestamp < c.timestamp) {
                        newestCoverage = c;
                    }
                }

                expect(newestCoverage.timestamp).toEqual(em.timestamp);
            });

            it("Returns correct timestamp after coverage removal", function () {
                var em = new ElevationModel();
                var n = 10;
                for (var i = 0; i < n; i++) {
                    var c = new MockCoverage(i + 1);
                    em.addCoverage(c);
                    c.timestamp += Math.round(Math.random() * 1000);
                }
                var sortedCoverages = em.coverages.slice();
                sortedCoverages.sort(function (c1, c2) {
                    return c2.timestamp - c1.timestamp;
                });
                expect(sortedCoverages[0].timestamp).toEqual(em.timestamp);
                em.removeCoverage(sortedCoverages[0]);
                expect(sortedCoverages[1].timestamp).toEqual(em.timestamp);
            });

        });

        describe("Min and max elevation calculation tests", function () {
            it("Calculates elevations correctly", function () {
                var em = new ElevationModel();
                var n = 10;
                for (var i = 0; i < n; i++) {
                    var c = new MockCoverage(i + 1, (Math.random() + 1) * -1000, (Math.random() + 1) * 1000);
                    em.addCoverage(c);
                }
                var sortedCoverages = em.coverages.slice();
                sortedCoverages.sort(function (c1, c2) {
                    return c1.minElevation - c2.minElevation;
                });
                expect(sortedCoverages[0].minElevation).toEqual(em.minElevation);

                sortedCoverages.sort(function (c1, c2) {
                    return c1.maxElevation - c2.maxElevation;
                });
                expect(sortedCoverages[n - 1].maxElevation).toEqual(em.maxElevation);
            });
            it("Disregards elevations for disabled coverages", function () {
                var em = new ElevationModel();
                var enabledCoverages = [];
                for (var i = 0; i < 10; i++) {
                    var c = new MockCoverage(i + 1, (Math.random() + 1) * -1000, (Math.random() + 1) * 1000);
                    em.addCoverage(c);
                    c.enabled = (i % 2) > 0;
                    if (c.enabled) {
                        enabledCoverages.push(c);
                    }
                }
                enabledCoverages.sort(function (c1, c2) {
                    return c1.minElevation - c2.minElevation;
                });
                expect(enabledCoverages[0].minElevation).toEqual(em.minElevation);

                enabledCoverages.sort(function (c1, c2) {
                    return c1.maxElevation - c2.maxElevation;
                });
                expect(enabledCoverages[enabledCoverages.length - 1].maxElevation).toEqual(em.maxElevation);
            });

            it("Returns correct elevations after coverage removal", function () {
                var em = new ElevationModel();
                var n = 10;
                for (var i = 0; i < n; i++) {
                    var c = new MockCoverage(i + 1, (Math.random() + 1) * -1000, (Math.random() + 1) * 1000);
                    em.addCoverage(c);
                }
                var sortedCoverages = em.coverages.slice();
                sortedCoverages.sort(function (c1, c2) {
                    return c1.minElevation - c2.minElevation;
                });
                expect(sortedCoverages[0].minElevation).toEqual(em.minElevation);
                em.removeCoverage(sortedCoverages[0]);
                expect(sortedCoverages[1].minElevation).toEqual(em.minElevation);

                sortedCoverages = em.coverages.slice();
                n = sortedCoverages.length;
                sortedCoverages.sort(function (c1, c2) {
                    return c1.maxElevation - c2.maxElevation;
                });
                expect(sortedCoverages[n - 1].maxElevation).toEqual(em.maxElevation);
                em.removeCoverage(sortedCoverages[n - 1]);
                expect(sortedCoverages[n - 2].maxElevation).toEqual(em.maxElevation);
            });
        });
    });
});


