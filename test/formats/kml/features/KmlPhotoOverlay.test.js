/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define( [
    'src/formats/kml/util/ImagePyramid',
    'src/formats/kml/util/ViewVolume',
    'src/formats/kml/geom/KmlPoint',
    'src/formats/kml/features/KmlPhotoOverlay',
    'src/util/XmlDocument'
], function (
    ImagePyramid,
    ViewVolume,
    KmlPoint,
    KmlPhotoOverlay,
    XmlDocument
) {
    "use strict";
    describe("KmlPhotoOverlayTest", function () {
            var validKml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
                "<PhotoOverlay>" +
                "   <rotation>0</rotation>" +
                "   <ViewVolume></ViewVolume>" +
                "   <ImagePyramid></ImagePyramid>" +
                "   <Point></Point>" +
                "   <shape>rectangle</shape>" +
                "</PhotoOverlay>" +
                "</kml>";
            var kmlRepresentation = new XmlDocument(validKml).dom();
            var photoOverlay = new KmlPhotoOverlay({objectNode:
                kmlRepresentation.getElementsByTagName("PhotoOverlay")[0]});
            it("should have the Rotation, Shape properties and have the prototype properties of ViewVolume,ImagePyramid," +
                "KmlPoint", function(){
                expect(photoOverlay.kmlRotation).toEqual('0');
                expect(photoOverlay.kmlShape).toEqual('rectangle');

                expect(photoOverlay.kmlViewVolume instanceof ViewVolume).toBeTruthy();
                expect(photoOverlay.kmlImagePyramid instanceof ImagePyramid).toBeTruthy();
                expect(photoOverlay.kmlPoint instanceof KmlPoint).toBeTruthy();

            });



        });
    });
