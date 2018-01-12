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
define([
    'src/layer/heatmap/IntensityLocation',
    'src/geom/Sector'
], function (IntensityLocation,
             Sector) {
    describe('IntensityLocation', function () {
        var location = new IntensityLocation(12, 15, 2);

        describe('#isInSector', function () {
            var sectorItIsIn = new Sector(10, 20, 10, 20);
            var sectorItIsOutsideOf = new Sector();

            it('is in the sector', function(){
                expect(location.isInSector(sectorItIsIn)).toEqual(true);
            });

            it('is outside of the sector', function(){
                expect(location.isInSector(sectorItIsOutsideOf)).toEqual(false);
            })
        });

        describe('#latitudeInSector', function(){
            var sector = new Sector(10, 20, 10, 20);

            it('return correct pixel for the sector.', function(){
                expect(location.latitudeInSector(sector, 10)).toEqual(2);
            });

            it('returns correct start pixel', function(){
                var location = new IntensityLocation(10, 15, 2);
                expect(location.latitudeInSector(sector, 10)).toEqual(0);
            });

            it('returns correct end pixel', function(){
                var location = new IntensityLocation(20, 15, 2);
                expect(location.latitudeInSector(sector, 10)).toEqual(9); // It is actually tenth pixel.
            });
        });

        describe('#longitudeInSector', function(){
            var sector = new Sector(10, 20, 10, 20);

            it('return correct pixel for the sector.', function(){
                expect(location.longitudeInSector(sector, 10)).toEqual(5);
            });
        });
    });
});