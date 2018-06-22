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
var WorldWind = {};
define([
    'src/formats/kml/KmlFile'
], function (KmlFile) {
    "use strict";
    WorldWind.KmlFile = KmlFile;

    describe("KmlFile", function () {
        describe("testLoadingKmlFromRelativeRemote", function () {
            var kmlLocation = "../base/examples/data/KML_Samples.kml";
            var loadedFile = false;

            beforeEach(function (done) {
                new KmlFile(kmlLocation).then(function () {
                    loadedFile = true;
                    done();
                }).catch(function (err) {
                    done(err);
                });
            });

            it('should be loaded from a remote document', function () {
                expect(loadedFile).toEqual(true);
            });
        });
    });
});
