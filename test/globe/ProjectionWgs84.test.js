/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/globe/EarthElevationModel',
    'src/globe/Globe',
    'src/geom/Location',
    'src/geom/Matrix',
    'src/geom/Position',
    'src/projections/ProjectionWgs84',
    'src/geom/Vec3'
], function (EarthElevationModel,
             Globe,
             Location,
             Matrix,
             Position,
             ProjectionWgs84,
             Vec3) {
    describe("ProjectionWgs84", function () {
        var projection = new ProjectionWgs84();
        var globe = new Globe(new EarthElevationModel(), projection);

        describe('#geographicToCartesian', function () {
            it('computes correct representation of all default stations', function () {
                var stations = getStations();
                stations.forEach(function (station) {
                    var position = station.position;
                    var vec = station.vec;
                    var result = new Vec3();

                    projection.geographicToCartesian(globe, position.latitude, position.longitude, position.altitude, null, result);

                    expect(result[0].toFixed(3)).toBe(vec[0].toFixed(3));
                    expect(result[1].toFixed(3)).toBe(vec[1].toFixed(3));
                    expect(result[2].toFixed(3)).toBe(vec[2].toFixed(3));
                });
            });
        });

        describe('#cartesianToGeographic', function () {
            it('correctly transform stations to geographic locations', function () {
                var stations = getStations();
                stations.forEach(function (station) {
                    var position = station.position;
                    var vec = station.vec;
                    var result = new Vec3();

                    projection.cartesianToGeographic(globe, vec[0], vec[1], vec[2], null, result);

                    expect(result.latitude.toFixed(3)).toBe(Location.normalizeLatitude(position.latitude).toFixed(3));
                    expect(result.longitude.toFixed(3)).toBe(Location.normalizeLongitude(position.longitude).toFixed(3));
                    expect(result.altitude.toFixed(3)).toBe(position.altitude.toFixed(3));
                });
            })
        });

        describe('#cartesianToLocalTransform', function () {
            it('correctly transform coordinates from cartesian space to local space', function () {
                var x = -4610466.9131683465; // KOXR airport
                var y = 3565379.0227454384;
                var z = -2576702.8642047923;
                var result = new Matrix();
                var expected = new Matrix(
                    -0.4878596591387329, 0.4906549897935131, -0.7219768929652575, -4610466.9131683465,
                    2.7755575615628914E-17, 0.8270805742745618, 0.5620833778521306, 3565379.0227454384,
                    0.8729220772698095, 0.274217805126488, -0.4034992470458552, -2576702.8642047923,
                    0.0, 0.0, 0.0, 1.0
                );

                projection.cartesianToLocalTransform(globe, x, y, z, null, result);

                expect(result.equalsWithPrecision(expected, 4)).toBe(true);
            });
        });

        /*
         'Result: ', Object{0: -1.0202361151670322e-7, 1: 1.9916835171780496e-14, 2: -1.5098335877506238e-7, 3: -4610466.9131683465,
         4: -1.8263347775997496e-8, 5: 3.6170906246266256e-14, 6: 1.175456410129028e-7, 7: 3565379.0227454384,
         8: 1.8254975837303858e-7, 9: 1.3533524007111095e-14, 10: -8.43817470833149e-8, 11: -2576702.8642047923,
         12: 0, 13: 0, 14: 0, 15: 1}
         'Expected: ', Object{0: -0.4878596591387329, 1: 0.4906549897935131, 2: -0.7219768929652575, 3: -4610466.9131683465,
          4: 2.7755575615628914e-17, 5: 0.8270805742745618, 6: 0.5620833778521306, 7: 3565379.0227454384,
          8: 0.8729220772698095, 9: 0.274217805126488, 10: -0.4034992470458552, 11: -2576702.8642047923,
          12: 0, 13: 0, 14: 0, 15: 1}

         */

        describe('#geographicToCartesianGrid', function () {
            it('', function () {

            });
        });
    });

    function getStations() {
        return [
            {
                position: new Position(38.80305456, 255.47540844, 1911.755),
                vec: fromEcef(-1248.597295e3, -4819.433239e3, 3976.500175e3)
            }, {
                position: new Position(-7.95132970, 345.58786950, 106.558),
                vec: fromEcef(6118.524122e3, -1572.350854e3, -876.463990e3)
            }, {
                position: new Position(-7.26984347, 72.37092177, -64.063),
                vec: fromEcef(1916.197142e3, 6029.999007e3, -801.737366e3)
            }, {
                position: new Position(8.72250074, 167.73052625, 39.927),
                vec: fromEcef(-6160.884370e3, 1339.851965e3, 960.843071e3)
            }, {
                position: new Position(21.56149086, 201.76066922, 426.077),
                vec: fromEcef(-5511.980484e3, -2200.247093e3, 2329.480952e3)
            }, {
                position: new Position(28.48373800, 279.42769549, -24.005),
                vec: fromEcef(918.988120e3, -5534.552966e3, 3023.721377e3)
            }
        ];
    }

    function fromEcef(xEcef, yEcef, zEcef) {
        return new Vec3(yEcef, zEcef, xEcef);
    }
});
