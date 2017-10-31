/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([],
    function () {
        "use strict";

        /**
         * Defines constants for the resampling mode of images.
         */
        var ResamplingMode = {

            /**
             * Using the the weighted average of the four texture elements that are closest to the center of the pixel being textured.
             * @constant
             */
            LINEAR: "LINEAR",
            
            /**
             * Using the value of the texture element that is nearest (in Manhattan distance) to the center of the pixel being textured.
             * @constant
             */
            NEAREST: "NEAREST"
        };

        return ResamplingMode;
    });