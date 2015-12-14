/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports GeoTiff
 */
define([],
    function () {
        "use strict";

        var GeoTiff = function () {
        };

        GeoTiff.Tag = {
            'MODEL_PIXEL_SCALE': 33550,
            'MODEL_TRANSFORMATION': 34264,
            'MODEL_TIEPOINT': 33922,
            'GEO_KEY_DIRECTORY': 34735,
            'GEO_DOUBLE_PARAMS': 34736,
            'GEO_ASCII_PARAMS': 34737
        };

        return GeoTiff;
    }
);


