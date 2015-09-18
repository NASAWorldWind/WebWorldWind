/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require({
    baseUrl: '/test/'
}, [
    'test/CatchTest',
    'src/util/XmlDocument',
    'src/formats/kml/KmlTimeSpan'
], function(
    CatchTest,
    XmlDocument,
    KmlTimeSpan
){
    TestCase("KmlTimeSpanTest", {
        testValidTimeSpan: CatchTest(function() {
            var validTimeSpanXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<TimeSpan id=\"1\">" +
                "   <begin>1997-07-16T07:30:15Z</begin>" +
                "   <end>1997-07-16T08:30:15Z</end>" +
                "</TimeSpan>" +
                "</kml>";

            var kmlRepresentation = new XmlDocument(validTimeSpanXml).dom();
            var timeSpan = new KmlTimeSpan(kmlRepresentation.getElementsByTagName("TimeSpan")[0],{});

            assertEquals("1997-07-16T07:30:15Z", timeSpan.begin);
            assertEquals("1997-07-16T08:30:15Z", timeSpan.end);
        })
    });
});