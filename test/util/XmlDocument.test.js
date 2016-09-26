/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
require([
    'src/util/XmlDocument'
], function(
    XmlDocument
){
    describe("XmlDocument", function() {
        it("testGettingDomOfValidXml", function() {
            var xmlDocument = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<Placemark>" +
                "   <Point>" +
                "       <coordinates>-122.0822035425683,37.42228990140251,0</coordinates>" +
                "   </Point>" +
                "</Placemark>" +
                "</kml>";
            var document = new XmlDocument(xmlDocument);
            var resultingDom = document.dom();

            expect(resultingDom.childNodes.length).toEqual(1);
        });
    });
});