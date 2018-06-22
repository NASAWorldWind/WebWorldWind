/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
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
    'src/formats/kml/KmlObject',
    'src/formats/kml/geom/KmlPoint',
    'src/util/XmlDocument'
], function(
    KmlObject,
    KmlPoint,
    XmlDocument
) {
    describe("KmlObjectTestCase", function () {
        describe("testUndefinedNode", function () {

            it('should raise an exception', function () {
                expect(function () {
                    new KmlObject();
                    fail("Exception should have been thrown");
                }).toThrow();
            });


            });
            describe('testNullNode', function () {


                it('should raise an Argument Error exception', function () {
                    expect(function () {
                        new KmlObject(null, {});
                        fail("Exception should have been thrown")}).toThrow();
                });
            });
        });
    });
