/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports EarthRestElevationModel
 * @version $Id: EarthElevationModel.js 2638 2015-01-05 20:44:18Z tgaskins $
 */
define([
        '../geom/Location',
        '../geom/Sector',
        '../globe/ElevationModel',
        '../util/LevelRowColumnUrlBuilder'
    ],
    function (Location,
              Sector,
              ElevationModel,
              LevelRowColumnUrlBuilder) {
        "use strict";

        // THIS CLASS IS NOT YET MEANT TO BE EXPOSED.
        ///**
        // * Constructs an elevation model for Earth using a REST interface to retrieve the elevations from the server.
        // * @alias EarthRestElevationModel
        // * @constructor
        // * @classdesc Represents an Earth elevation model spanning the globe and using a REST interface to retrieve
        // * the elevations from the server.
        // * See [LevelRowColumnUrlBuilder]{@link LevelRowColumnUrlBuilder} for a description of the REST interface.
        // * @param {String} serverAddress The server address of the tile service. May be null, in which case the
        // * current origin is used (see <code>window.location</code>.
        // * @param {String} pathToData The path to the data directory relative to the specified server address.
        // * May be null, in which case the server address is assumed to be the full path to the data directory.
        // * @param {String} displayName The display name to associate with this elevation model.
        // */
        var EarthRestElevationModel = function (serverAddress, pathToData, displayName) {
            ElevationModel.call(this,
                Sector.FULL_SPHERE, new Location(60, 60), 5, "application/bil16", "EarthElevations", 512, 512);

            this.displayName = displayName;
            this.minElevation = -11000; // Depth of Marianas Trench, in meters
            this.maxElevation = 8850; // Height of Mt. Everest
            this.urlBuilder = new LevelRowColumnUrlBuilder(serverAddress, pathToData);
        };

        EarthRestElevationModel.prototype = Object.create(ElevationModel.prototype);

        return EarthRestElevationModel;
    });