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
    var styleWithIdDocument = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<kml xmlns="http://www.opengis.net/kml/2.2">' +
        '<Document id ="1">' +
        '   <Style id="yellowLineGreenPoly">' +
        '       <LineStyle>' +
        '           <color>7f00ffff</color>' +
        '           <width>4</width>' +
        '       </LineStyle>' +
        '       <PolyStyle>' +
        '           <color>7f00ff00</color>' +
        '       </PolyStyle>' +
        '   </Style>' +
        '   <Placemark>' +
        '       <styleUrl>#yellowLineGreenPoly</styleUrl>' +
        '   </Placemark>' +
        '</Document>' +
        '</kml>';
    var document = new XmlDocument(styleWithIdDocument).dom();
    var kmlDocument = new KmlDocument({objectNode: document.getElementById("1")});

    TestCase("Style#withIdSimpleLevel", {
        testRetrievingStyle: function() {

        }
    });
});