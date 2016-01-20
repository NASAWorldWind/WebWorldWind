/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/util/Remote'
], function (CatchTest,
             Remote) {
    "use strict";
    AsyncTestCase('Remote', {
        testRetrievingRemoteFile: CatchTest(function (queue) {
            var fileLocation = "/test/test/testFile.kml";
            var loadedFile = null;
            queue.call('Prepare remote', function (callbacks) {
                var success = callbacks.add(function (fileContent) {
                    loadedFile = fileContent;
                });
                var promise = new Remote({url: fileLocation, ajax: true});
                promise.then(success);
            });

            queue.call('Remote request finished', function () {
                assertTrue(loadedFile != null);
            });
        })
    })
});