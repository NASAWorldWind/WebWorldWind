/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
var WorldWind = {};
define(
    ['src/formats/kml/KmlFile'],
    function (KmlFile) {
        "use strict";
        WorldWind.KmlFile = KmlFile;

        describe("KmlFile", function () {
            describe("testSimpleKml", function () {

                var kmlFileXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                    "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                    "<Point id=\"1\">" +
                    "   <extrude>true</extrude>" +
                    "   <altitudeMode>clampToGround</altitudeMode>" +
                    "   <coordinates>-122.0822035425683,37.42228990140251,0</coordinates>" +
                    "</Point>" +
                    "</kml>";

                var loadedFile = false;

                beforeEach(function (done) {
                    var kmlFile = new KmlFile({local: true, document: kmlFileXml});
                    loadedFile = true;
                    // Invoke the special done callback
                    done();
                });

                it('should be loaded from a local document', function (done) {
                    expect(loadedFile).toEqual(true);
                    done();

                });
            });

            describe("testLoadingKmlFromRelativeRemote", function () {

                //var kmlLocation = "/test/test/testFile.kml";
                var kmlLocation = "../util/testFile.kml";
                var loadedFile = false;
                beforeEach(function (done) {

                    var kmlFile = new KmlFile({url: kmlLocation});
                    loadedFile = true;
                    // Invoke the special done callback
                    done();
                });

                it('should be loaded from a remote document', function (done) {
                    expect(loadedFile).toEqual(true);
                    done();
                });
            });
        });
    });
