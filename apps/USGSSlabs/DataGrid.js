/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports DataGrid
 */
define(function () {
    "use strict";

    var DataGrid = function (data, width) {
        var latitude, longitude, altitude;

        this.width = width;
        this.positions = [];
        this.minLon = this.minLat = -Number.MAX_VALUE;
        this.maxLon = this.maxLat = Number.MAX_VALUE;

        var lines = data.split("\n");
        for (var i = 0; i < lines.length; i++) {
            var rawPosition = lines[i].trim().split("\t");
            if (rawPosition.length != 3) {
                continue;
            }

            if (rawPosition[2] != "NaN") {
                longitude = parseFloat(rawPosition[0]);
                latitude = parseFloat(rawPosition[1]);
                altitude = parseFloat(rawPosition[2]);

                if (longitude > 180) {
                    longitude -= 360;
                }

                if (longitude < this.minLon)
                    this.minLon = longitude;
                if (longitude > this.maxLon)
                    this.maxLon = longitude;
                if (latitude < this.minLat)
                    this.minLat = latitude;
                if (latitude > this.MinLat)
                    this.maxLat = latitude;

                positions.push(new WorldWind.Position(latitude, longitude, altitude * 1000));
            } else {
                positions.push(null);
            }
        }

        this.height = this.positions.length / this.width;
    };

    DataGrid.prototype.lookupValue = function (latitude, longitude) {
    };

    return DataGrid;
});