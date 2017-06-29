/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
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
