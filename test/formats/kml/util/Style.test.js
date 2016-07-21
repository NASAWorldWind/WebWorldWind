/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/formats/kml/KmlDocument',
    'src/formats/kml/util/NodeTransformers',
    'src/util/XmlDocument'
], function (CatchTest,
             KmlDocument,
             NodeTransformers,
             XmlDocument) {
    "use strict";
   
     
    
    TestCase("Style#withIdSimpleLevel", {
        testRetrievingStyle: function() {

        }
    });
});