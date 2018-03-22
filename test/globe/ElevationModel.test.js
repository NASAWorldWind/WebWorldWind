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

        var MockCoverage = function (numLevels, minElevation, maxElevation) {
            TiledElevationCoverage.call(this,
                Sector.FULL_SPHERE, new Location(45, 45), numLevels, "application/bil16", "MockElevations256", 256, 256, 100);

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
                    elevationModel.removeCoverageAtIndex();
                }).toThrow();
                expect(function () {
                    elevationModel.elevationAtLocation();
                }).toThrow();
                expect(function () {
                    elevationModel.elevationAtLocation(12);
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
                expect(function () {
                    elevationModel.insertCoverage();
                }).toThrow();
                expect(function () {
                    elevationModel.insertCoverage(0);
                }).toThrow();
            });
        });

        describe("Elevation result tests", function () {
            it("Returns correct min and max elevations for a sector, respects unsorted coverages", function () {
                var n = 12;
                for (var t = 0; t < 2; t++) {
                    var em = new ElevationModel();
                    em.sortCoverages = (t === 0);
                    for (var i = 0; i < n; i++) {
                        var nLevels = em.sortCoverages ? i + 1 : n - i;
                        var c = new MockCoverage(nLevels, -i - 1, i + 1);
                        em.addCoverage(c);
                    }

                    var minMax = em.minAndMaxElevationsForSector("dummySector");
                    expect(minMax[0]).toEqual(-n);
                    expect(minMax[1]).toEqual(n);
                }
            });

            it("Returns correct min and max elevations for a sector when some coverages are disabled", function () {
                var em = new ElevationModel();
                var n = 12;
                for (var i = 0; i < n; i++) {
                    var c = new MockCoverage(i + 1, -i - 1, i + 1);
                    em.addCoverage(c);
                }

                em.coverages[n - 1].enabled = false;
                em.coverages[n - 2].enabled = false;
                var minMax = em.minAndMaxElevationsForSector("dummySector");
                expect(minMax[0]).toEqual(-n + 2);
                expect(minMax[1]).toEqual(n - 2);
            });

            it("Returns correct elevation for a location", function () {
                var em = new ElevationModel();
                var n = 12;
                for (var i = 0; i < n; i++) {
                    var c = new MockCoverage(i + 1, -i - 1, i + 1);
                    em.addCoverage(c);
                }

                var e = em.elevationAtLocation(0, 0);
                expect(e).toEqual(n);
            });

            it("Returns correct elevation for a location when some coverages are disabled", function () {
                var em = new ElevationModel();
                var n = 12;
                for (var i = 0; i < n; i++) {
                    var c = new MockCoverage(i + 1, -i - 1, i + 1);
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
                    var c = new MockCoverage(i + 1, -i - 1, i + 1);
                    em.addCoverage(c);
                }

                var result = [0];
                em.elevationsForGrid("dummySector", 1, 1, 1, result);
                expect(result[0]).toEqual(n);
            });

            it("Returns correct elevations for a grid when some coverages are disabled", function () {
                var em = new ElevationModel();
                var n = 12;
                for (var i = 0; i < n; i++) {
                    var c = new MockCoverage(i + 1, -i - 1, i + 1);
                    em.addCoverage(c);
                }

                em.coverages[n - 1].enabled = false;
                em.coverages[n - 2].enabled = false;
                var result = [0];
                em.elevationsForGrid("dummySector", 1, 1, 1, result);
                expect(result[0]).toEqual(n - 2);
            });
        });

        describe("Coverage list manipulation tests", function () {
            it("Maintains coverages in the correct order, respecting the sortCoverages flag", function () {
                var n = 12;
                for (var t = 0; t < 2; t++) {
                    var em = new ElevationModel();
                    var coverages = [];
                    em.sortCoverages = (t === 0);
                    for (var i = n; i > 0; i--) {
                        var c = new MockCoverage(i);
                        em.addCoverage(c);
                        coverages.push(c);
                    }

                    for (i = 0; i < n; i++) {
                        var index = em.sortCoverages ? n - (i + 1) : i;
                        expect(coverages[index] === em.coverages[i]).toBe(true);
                    }
                }
            });

            it("Rejects duplicate coverages", function () {
                var em = new ElevationModel();
                var coverages = [];
                em.sortCoverages = false;
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
                        expect(em.insertCoverage(0, c)).toBe(expectedResult);
                        expect(em.addCoverage(c)).toBe(false);
                    }
                }
            });

            it("Inserts coverages at the correct index", function () {
                var em = new ElevationModel();
                var coverages = [];
                em.sortCoverages = false;
                var n = 12, c;
                for (var t = 0; t < 2; t++) {
                    for (var i = 0; i < n; i++) {
                        c = new MockCoverage(i + 1);
                        em.insertCoverage(i, c);
                        coverages.push(c);
                    }
                }

                for (i = 0; i < n; i++) {
                    expect(coverages[i] === em.coverages[i + n]).toBe(true);
                    expect(coverages[i + n] === em.coverages[i]).toBe(true);
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
                    var c = new MockCoverage(i + 1);
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

            it("Removes coverages using indices", function () {
                var em = new ElevationModel();
                var i, n = 12;
                var coverages = [];
                for (i = 0; i < n; i++) {
                    var c = new MockCoverage(i + 1);
                    em.addCoverage(c);
                    coverages.push(c);
                }

                for (i = n - 1; i >= 0; i -= 2) {
                    em.removeCoverageAtIndex(i);
                }

                expect(em.coverages.length).toEqual(n / 2);
                for (i = 0; i < n; i += 2) {
                    expect(coverages[i] === em.coverages[i / 2]).toBe(true);
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
                var newestCoverage, oldestCoverage;
                for (var i = 0; i < 10; i++) {
                    var c = new MockCoverage(i + 1);
                    em.addCoverage(c);
                    c.timestamp += Math.round(Math.random() * 1000);
                    if (!newestCoverage || newestCoverage.timestamp < c.timestamp) {
                        newestCoverage = c;
                    }
                    if (!oldestCoverage || oldestCoverage.timestamp > c.timestamp) {
                        oldestCoverage = c;
                    }
                }

                expect(oldestCoverage.timestamp).toEqual(em.minTimestamp);
                expect(newestCoverage.timestamp).toEqual(em.maxTimestamp);
            });

            it("Disregards timestamp for disabled coverages", function () {
                var em = new ElevationModel();
                var newestCoverage, oldestCoverage;
                for (var i = 0; i < 10; i++) {
                    var c = new MockCoverage(i + 1);
                    em.addCoverage(c);
                    c.timestamp += Math.round(Math.random() * 1000);
                    c.enabled = (i % 2) > 0;
                    if (c.enabled && (!newestCoverage || newestCoverage.timestamp < c.timestamp)) {
                        newestCoverage = c;
                    }
                    if (c.enabled && (!oldestCoverage || oldestCoverage.timestamp > c.timestamp)) {
                        oldestCoverage = c;
                    }
                }

                expect(oldestCoverage.timestamp).toEqual(em.minTimestamp);
                expect(newestCoverage.timestamp).toEqual(em.maxTimestamp);
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
                    return c1.timestamp - c2.timestamp;
                });
                expect(sortedCoverages[0].timestamp).toEqual(em.minTimestamp);
                em.removeCoverage(sortedCoverages[0]);
                expect(sortedCoverages[1].timestamp).toEqual(em.minTimestamp);

                sortedCoverages = em.coverages.slice();
                sortedCoverages.sort(function (c1, c2) {
                    return c2.timestamp - c1.timestamp;
                });
                expect(sortedCoverages[0].timestamp).toEqual(em.maxTimestamp);
                em.removeCoverage(sortedCoverages[0]);
                expect(sortedCoverages[1].timestamp).toEqual(em.maxTimestamp);
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


