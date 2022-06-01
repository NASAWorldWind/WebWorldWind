/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
define([
    'src/formats/collada/ColladaScene',
    'src/globe/ElevationModel',
    'src/globe/Globe',
    'src/geom/Line',
    'src/geom/Matrix',
    'src/geom/Position',
    'src/projections/ProjectionWgs84',
    'src/geom/Vec3'
], function (ColladaScene, ElevationModel, Globe, Line, Matrix, Position, ProjectionWgs84, Vec3) {
    "use strict";

    describe("ColladaScene calculation and data manipulation testing", function () {

        it("Should properly calculate new normals and create proper vertex order", function () {
            var indices = [0, 1, 2, 3, 2, 1, 4, 5, 6, 7, 6, 5, 8, 9, 10, 11, 10, 9, 12, 13, 14, 15, 14, 13, 16, 17, 18,
                19, 18, 17, 20, 21, 22, 23, 22, 21];
            var vertices = [-0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5,
                0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
                -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5,
                0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
                0.5, -0.5];
            var mesh = {
                indices: indices,
                vertices: vertices,
                indexedRendering: true
            };
            var expectedVertices = [-0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
                0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5,
                -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
                -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5,
                0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5,
                0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5,
                -0.5];
            var expectedNormals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0,
                0, -1, 0, 0, -1, 0, 0, -1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0,
                0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0,
                -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1];
            var scene = new ColladaScene(new Position(43, -93, 1000), null);
            mesh = scene.rewriteBufferNormals(mesh);
            expect(mesh.indexedRendering).toBe(false);
            expect(mesh.indices).toBe(null);
            expect(mesh._normalsComputed).toBe(true);
            expect(mesh.vertices.length).toBe(expectedVertices.length);
            for (var i = 0, len = mesh.vertices.length; i < len; i++) {
                expect(mesh.vertices[i]).toBe(expectedVertices[i]);
            }

            expect(mesh.normals.length).toBe(expectedNormals.length);
            for (i = 0, len = mesh.normals.length; i < len; i++) {
                expect(mesh.normals[i]).toBe(expectedNormals[i]);
            }

            var uvs = [-0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5,
                0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
                -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5,
                0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
                -0.5];
            var expectedUvs = [-0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
                0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5,
                0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5,
                -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5];
            mesh = {
                indices: indices,
                vertices: vertices,
                uvs: uvs,
                indexedRendering: true
            };
            mesh = scene.rewriteBufferNormals(mesh);
            expect(mesh.uvs.length).toBe(expectedUvs.length);
            for (i = 0, len = mesh.uvs.length; i < len; i++) {
                expect(mesh.uvs[i]).toBe(expectedUvs[i]);
            }
        });

        it("Should properly compute intersection points with a ray", function () {
            var colladaLoader = new WorldWind.ColladaLoader(new Position(44, -96, 10000));
            colladaLoader.init({dirPath: '../base/test/formats/collada/'});
            colladaLoader.load('bad_normals.dae', function (scene) {
                scene.scale = 5000;
                var transformation = new Matrix(-522.6423163382683, 3454.283622726456, -3576.9777274867624, -4577455.847120033,
                    -5.898059818402838e-13, 3596.6807208022315, 3473.3107826121095, 4415038.196148923,
                    4972.609476841367, 363.05983855741573, -375.9555086098537, -481109.9962739506,
                    0, 0, 0, 1);
                scene._transformationMatrix = transformation;
                var origin = new Vec3(-12416258.178691395, 10375578.62866234, -2479066.981438789);
                var direction = new Vec3(0.8649427998779189, -0.4976765198118716, 0.06474592317119227);
                var pointRay = new Line(origin, direction);
                var intersections = [];
                var globe = new Globe(new WorldWind.ElevationModel(), new WorldWind.ProjectionWgs84());
                var intersectionsFound = scene.computePointIntersections(globe, pointRay, intersections);
                expect(intersectionsFound).toBe(false);
                expect(intersections.length).toBe(0);
                origin = new Vec3(-5117511.089956183, 4226332.17224274, -193896.81490928633);
                direction = new Vec3(0.862977304871313, 0.24683805077319543, -0.4408414090889536);
                pointRay = new Line(origin, direction);
                intersectionsFound = scene.computePointIntersections(globe, pointRay, intersections);
                expect(intersectionsFound).toBe(true);
                expect(intersections.length).toBe(2);
                var i0 = new Position(43.088776730634535, -95.18631436743668, 29685.22045946613);
                var i1 = new Position(43.30646919618773, -95.39472743244926, 15659.079434582456);
                // Using toBeCloseToPosition may be causing weird unreliability
                // expect(intersections[0]).toBeCloseToPosition(i1, 7, 7, 7);
                // expect(intersections[1]).toBeCloseToPosition(i2, 7, 7, 7);
                expect(intersections[0].latitude).toBeCloseTo(i0.latitude, 7);
                expect(intersections[0].longitude).toBeCloseTo(i0.longitude, 7);
                expect(intersections[0].altitude).toBeCloseTo(i0.altitude, 7);
                expect(intersections[1].latitude).toBeCloseTo(i1.latitude, 7);
                expect(intersections[1].longitude).toBeCloseTo(i1.longitude, 7);
                expect(intersections[1].altitude).toBeCloseTo(i1.altitude, 7);
                expect(function () {
                    scene.computePointIntersections(null, pointRay, intersections);
                }).toThrow();
                expect(function () {
                    scene.computePointIntersections(globe, null, intersections);
                }).toThrow();
                expect(function () {
                    scene.computePointIntersections(globe, pointRay, null);
                }).toThrow();
            });
        });
    });
});
