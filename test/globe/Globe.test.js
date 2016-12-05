/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/globe/EarthElevationModel',
    'src/globe/Globe'
], function (EarthElevationModel,
             Globe) {
    describe ("Globe", function () {
        var globe = new Globe(new EarthElevationModel());

        describe('#horizonDistance', function() {
            it('returns correct distance to horizon with only eyeAltitude', function(){
                var horizonDistance = globe.horizonDistance(10000);
                expect(horizonDistance).toBe(357299.23033782205);
            });

            it('returns correct distance to horizon with eyeAltitude as well as objAltitude', function(){
                var horizonDistance = globe.horizonDistance(10000, 1000);
                expect(horizonDistance).toBe(470247.3334648777);
            });
        });

        describe('#computePointFromPosition', function(){

        });
    });
});
