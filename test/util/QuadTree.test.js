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
require([
    'src/util/QuadTree'
], function (QuadTree) {
    "use strict";

    describe("QuadTree", function () {
        describe('doesnt have more levels by default', function () {
            var quadTree = new QuadTree({
                bounds: {
                    x: 0,
                    y: 0,
                    width: 360,
                    height: 180
                },
                maxObjects: 10,
                maxLevels: 4
            });

            it('has no sub nodes', function () {
                expect(quadTree.nodes.length).toEqual(0);
            })
        });

        describe('has second level when there are above 10 objects.', function () {
            var quadTree = new QuadTree({
                bounds: {
                    x: 0,
                    y: 0,
                    width: 360,
                    height: 180
                },
                maxObjects: 10,
                maxLevels: 4
            });

            for (var i = 0; i < 11; i++) {
                quadTree.insert({
                    data: 'Test' + i,
                    x: 10 * i,
                    y: 5 * i,
                    width: 1,
                    height: 1
                })
            }

            it("has second level", function () {
                expect(quadTree.nodes.length).toEqual(4);
            });
        });

        describe('returns only points in given quadrant', function () {
            // Prepare QuadTree with 20 points scattered across the planet.
            var quadTree = new QuadTree({
                bounds: {
                    x: 0,
                    y: 0,
                    width: 360,
                    height: 180
                },
                maxObjects: 10,
                maxLevels: 4
            });

            for (var i = 0; i < 20; i++) {
                quadTree.insert({
                    data: 'Test' + i,
                    x: 10 * i,
                    y: 5 * i,
                    width: 1,
                    height: 1
                })
            }

            it('returns points in the area', function () {
                var points = quadTree.retrieve({
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 5
                });

                expect(points.length).toEqual(2);
            });
        });
    })
});