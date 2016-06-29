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
        "testLoadingKmlFromRelativeRemote": CatchTest(function (queue) {
            var kmlLocation = "/test/test/testFile.kml";
            var loadedFile = null;
            queue.call('Load the file remotely', function (callbacks) {
                // callback is called when loaded.
                var callback = callbacks.add(function (loaded) {
                    // This means we are at the end.
                    loadedFile = loaded;
                });
                var kmlFile = new KmlFile(kmlLocation);
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