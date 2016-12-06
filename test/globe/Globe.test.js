/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/globe/EarthElevationModel',
    'src/globe/Globe',
    'src/geom/Matrix'
], function (EarthElevationModel,
             Globe,
             Matrix) {
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

        describe('#computeViewHeading', function(){
            it('returns correct heading when it is applied', function(){
                var source = new Matrix(
                    -0.4878596591387329, 0.4906549897935131, -0.7219768929652575, -4610466.9131683465,
                    2.7755575615628914E-17, 0.8270805742745618, 0.5620833778521306, 3565379.0227454384,
                    0.8729220772698095, 0.274217805126488, -0.4034992470458552, -2576702.8642047923,
                    0.0, 0.0, 0.0, 1.0
                );
                var viewHeading = globe.computeViewHeading(source, 10);
                expect(viewHeading).toBe(-144.74739580118177);
            });
        });

        describe('#computeViewTilt', function(){
            it('returns correct tilt when it is applied', function(){
                var source = new Matrix(
                    -0.4878596591387329, 0.4906549897935131, -0.7219768929652575, -4610466.9131683465,
                    2.7755575615628914E-17, 0.8270805742745618, 0.5620833778521306, 3565379.0227454384,
                    0.8729220772698095, 0.274217805126488, -0.4034992470458552, -2576702.8642047923,
                    0.0, 0.0, 0.0, 1.0
                );
                var viewTilt = globe.computeViewTilt(source);
                expect(viewTilt).toBe(113.79711637384179);
            });
        });
    });
});
