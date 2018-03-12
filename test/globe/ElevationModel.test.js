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

        var MockCoverage = function (numLevels) {
            TiledElevationCoverage.call(this,
                Sector.FULL_SPHERE, new Location(45, 45), numLevels, "application/bil16", "MockElevations256", 256, 256);

            this.displayName = "Mock Elevation Coverage";
            this.minElevation = -11000; // Depth of Marianas Trench, in meters
            this.maxElevation = 8850; // Height of Mt. Everest
            this.pixelIsPoint = false; // WorldWind WMS elevation layers return pixel-as-area images

            // this.urlBuilder = new WmsUrlBuilder("https://worldwind26.arc.nasa.gov/elev",
            //     "GEBCO,aster_v2,USGS-NED", "", "1.3.0");
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
                    elevationModel.elevationsForGrid("dummySector",10);
                }).toThrow();
                expect(function () {
                    elevationModel.elevationsForGrid("dummySector",10,10);
                }).toThrow();
                expect(function () {
                    elevationModel.elevationsForGrid("dummySector",10,10,10);
                }).toThrow();
                expect(function () {
                    elevationModel.minAndMaxElevationsForSector();
                }).toThrow();
            });
        });

        describe("Coverage list manipulation tests", function () {
            var em = new ElevationModel();
            it("Maintains coverages in the correct order", function () {
                var coverages=[];
                var nCoverages=12;
                for (var i=nCoverages; i>0; i--) {
                    var c=new MockCoverage(i);
                    em.addCoverage(c);
                    coverages.push(c);
                }

                for (i=0; i<nCoverages; i++) {
                    expect(coverages[nCoverages-(i+1)] === em.coverages[i]).toBe(true);
                }
            });
        });
    });
});


