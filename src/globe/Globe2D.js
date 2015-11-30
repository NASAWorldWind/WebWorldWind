/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports Globe2D
 * @version $Id: Globe2D.js 3205 2015-06-17 18:05:23Z tgaskins $
 */
define([
        '../globe/Globe',
        '../projections/ProjectionEquirectangular',
        '../globe/ZeroElevationModel'
    ],
    function (Globe,
              ProjectionEquirectangular,
              ZeroElevationModel) {
        "use strict";

        /**
         * Constructs a 2D globe with a default {@link ZeroElevationModel} and
         * [equirectangular projection]{@link ProjectionEquirectangular}.
         * @alias Globe2D
         * @constructor
         * @augments Globe
         * @classdesc Represents a 2D flat globe with a configurable projection.
         * The default rectangular projection scrolls longitudinally.
         */
        var Globe2D = function () {
            Globe.call(this, new ZeroElevationModel(), new ProjectionEquirectangular());
        };

        Globe2D.prototype = Object.create(Globe.prototype);

        return Globe2D;
    });