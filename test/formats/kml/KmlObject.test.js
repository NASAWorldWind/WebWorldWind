/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/formats/kml/KmlObject',
    'src/formats/kml/geom/KmlPoint',
    'src/util/XmlDocument'
], function(
    KmlObject,
    KmlPoint,
    XmlDocument
) {
    describe("KmlObjectTestCase", function () {
        describe("testUndefinedNode", function () {

            it('should raise an exception', function () {
                expect(function () {
                    new KmlObject();
                    fail("Exception should have been thrown");
                }).toThrow();
            });


            });
            describe('testNullNode', function () {


                it('should raise an Argument Error exception', function () {
                    expect(function () {
                        new KmlObject(null, {});
                        fail("Exception should have been thrown")}).toThrow();
                });
            });
        });
    });
