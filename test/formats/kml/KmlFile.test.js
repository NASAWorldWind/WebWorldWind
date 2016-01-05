/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/KmlFile'
], function (CatchTest,
             KmlFile) {
    "use strict";
    AsyncTestCase("KmlFile", {
        "testSimpleKml": CatchTest(function (queue) {
            var kmlFileXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Point id=\"1\">" +
                "   <extrude>true</extrude>" +
                "   <altitudeMode>clampToGround</altitudeMode>" +
                "   <coordinates>-122.0822035425683,37.42228990140251,0</coordinates>" +
                "</Point>" +
                "</kml>";

            var loadedFile = null;
            queue.call('Load the file remotely', function (callbacks) {
                // callback is called when loaded.
                var callback = callbacks.add(function (loaded) {
                    // This means we are at the end.
                    loadedFile = loaded;
                });
                var kmlFile = new KmlFile({local: true, document: kmlFileXml});
                kmlFile.then(callback);
            });

            queue.call('File was loaded.', function () {
                assertTrue(loadedFile != null);
                assertEquals(loadedFile.shapes.length, 1);
            });
        }),

        "testLoadingKmlFromRelativeRemote": CatchTest(function (queue) {
            var kmlLocation = "/test/test/testFile.kml";
            var loadedFile = null;
            queue.call('Load the file remotely', function (callbacks) {
                // callback is called when loaded.
                var callback = callbacks.add(function (loaded) {
                    // This means we are at the end.
                    loadedFile = loaded;
                });
                var kmlFile = new KmlFile({
                    url: kmlLocation
                });
                kmlFile.then(callback);
            });

            queue.call('File was loaded.', function () {
                assertTrue(loadedFile != null);
                assertEquals(loadedFile.shapes.length, 1);
            });
        }),

        // TODO parametrize tests.
        "testLoadingKmzFile": CatchTest(function(queue){
            // jsTestDriver server doesn't work correctly with these files
            // TODO fix jsTestDriver to correctly serve kmz files.
            /*var kmzLocation = "http://kml-samples.googlecode.com/svn/trunk/kml/Model/ResourceMap/macky-alt.kmz";
            var kmlFile = null;
            var loadedFile = null;
            queue.call('Load the file remotely', function (callbacks) {
                // callback is called when loaded.
                kmlFile = new KmlFile({
                    url: kmzLocation, callback: callbacks.add(function (loaded) {
                        // This means we are at the end.
                        loadedFile = loaded;
                    })
                });
            });

            queue.call('File was loaded.', function () {
                assertTrue(loadedFile != null);
                assertEquals(kmlFile.shapes.length, 1);
            });*/
        })
    });
});