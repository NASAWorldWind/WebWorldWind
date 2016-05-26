/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/KmlTimeStamp',
    'src/util/XmlDocument'
], function (KmlTimeStamp,
             XmlDocument) {
    describe ("KmlTimeStamp", function () {
            var validTimeStampXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<TimeStamp id=\"1\">" +
                "   <when>1997-07-16T07:30:15Z</when>" +
                "</TimeStamp>" +
                "</kml>";

            var kmlRepresentation = new XmlDocument(validTimeStampXml).dom();
            var timeStamp = new KmlTimeStamp({objectNode:kmlRepresentation.getElementsByTagName("TimeStamp")[0],style: {}});
        it('should have the time property which specifies when exactly the event happen', function(){
            expect(timeStamp.kmlWhen.toUTCString()).toBe("Wed, 16 Jul 1997 07:30:15 GMT");
        });


        });
});
