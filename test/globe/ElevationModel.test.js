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
                Sector.FULL_SPHERE, new Location(45, 45), numLevels, "application/bil16", "MockElevations256", 256, 256);

            this.displayName = "Mock Elevation Coverage";
            this.minElevation = minElevation ? minElevation : -11000;
            this.maxElevation = maxElevation ? maxElevation : 8850;
        };

        MockCoverage.prototype = Object.create(TiledElevationCoverage.prototype);

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
            });
        });

        describe("Coverage list manipulation tests", function () {
            it("Maintains coverages in the correct order", function () {
                var em = new ElevationModel();
                var coverages = [];
                var nCoverages = 12;
                for (var i = nCoverages; i > 0; i--) {
                    var c = new MockCoverage(i);
                    em.addCoverage(c);
                    coverages.push(c);
                }

                for (i = 0; i < nCoverages; i++) {
                    expect(coverages[nCoverages - (i + 1)] === em.coverages[i]).toBe(true);
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

            it("Disregards timestamp for disabled coverages", function () {
                var em = new ElevationModel();
                var newestCoverage;
                for (var i = 0; i < 10; i++) {
                    var c = new MockCoverage(i + 1);
                    em.addCoverage(c);
                    c.timestamp += Math.round(Math.random() * 1000);
                    c.enabled = (i % 2) > 0;
                    if (c.enabled && (!newestCoverage || newestCoverage.timestamp < c.timestamp)) {
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
                    return c1.timestamp - c2.timestamp;
                });
                expect(sortedCoverages[n - 1].timestamp).toEqual(em.timestamp);
                em.removeCoverage(sortedCoverages[n - 1]);
                expect(sortedCoverages[n - 2].timestamp).toEqual(em.timestamp);
            });

            describe("Min and max elevation calculation tests", function () {
                it("Calculates elevations correctly", function () {
                    var em = new ElevationModel();
                    var n=10;
                    for (var i = 0; i < n; i++) {
                        var c = new MockCoverage(i + 1,(Math.random()+1)*-1000,(Math.random()+1)*1000);
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
                    expect(sortedCoverages[n-1].maxElevation).toEqual(em.maxElevation);
                });
                // it("Disregards elevations for disabled coverages", function () {
                //     var em = new ElevationModel();
                //     for (var i = 0; i < 10; i++) {
                //         var c = new MockCoverage(i + 1,(Math.random()+1)*-1000,(Math.random()+1)*1000);
                //         em.addCoverage(c);
                //         c.enabled = (i % 2) > 0;
                //     }
                //     var sortedCoverages = em.coverages.slice();
                //     sortedCoverages.sort(function (c1, c2) {
                //         return c1.minElevation - c2.minElevation;
                //     });
                //     expect(newestCoverage.timestamp).toEqual(em.timestamp);
                // });
                //
                // it("Returns correct elevations after coverage removal", function () {
                //     var em = new ElevationModel();
                //     var n = 10;
                //     for (var i = 0; i < n; i++) {
                //         var c = new MockCoverage(i + 1,(Math.random()+1)*-1000,(Math.random()+1)*1000);
                //         em.addCoverage(c);
                //     }
                //     var sortedCoverages = em.coverages.slice();
                //     sortedCoverages.sort(function (c1, c2) {
                //         return c1.minElevation - c2.minElevation;
                //     });
                //     expect(sortedCoverages[n - 1].minElevation).toEqual(em.minElevation);
                //     em.removeCoverage(sortedCoverages[n - 1]);
                //     expect(sortedCoverages[n - 2].minElevation).toEqual(em.minElevation);
                //
                //     sortedCoverages = em.coverages.slice();
                //     sortedCoverages.sort(function (c1, c2) {
                //         return c1.maxElevation - c2.maxElevation;
                //     });
                //     expect(sortedCoverages[n - 1].maxElevation).toEqual(em.maxElevation);
                //     em.removeCoverage(sortedCoverages[n - 1]);
                //     expect(sortedCoverages[n - 2].maxElevation).toEqual(em.maxElevation);
                // });
            });
        });
    });
});


