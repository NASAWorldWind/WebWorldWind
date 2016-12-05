/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    'src/globe/EarthElevationModel',
    'src/globe/Globe',
    'src/geom/Position',
    'src/projections/ProjectionWgs84',
    'src/geom/Vec3'
], function (EarthElevationModel,
             Globe,
             Position,
             ProjectionWgs84,
             Vec3) {
    describe("ProjectionWgs84", function () {
        var projection = new ProjectionWgs84();
        var globe = new Globe(new EarthElevationModel());

        describe('#geographictoCartesian', function () {
            it('computes correct representation of all default stations', function(){
                var stations = getStations();
                stations.forEach(function(station) {
                    var position = station.position;
                    var vec = station.vec;
                    var result = new Vec3();

                    projection.geographicToCartesian(globe, position.latitude, position.longitude, position.altitude, null, result);

                    expect(result[0]).toBe(vec[0]);
                    expect(result[1]).toBe(vec[1]);
                    expect(result[2]).toBe(vec[2]);
                });
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
                vec: fromEcef(6118.524122e3, -1572.350853e3, -876.463990e3)
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
        return new Vec3(xEcef, yEcef, zEcef);
    }
});
