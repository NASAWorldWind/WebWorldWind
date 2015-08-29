/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: app.js 3411 2015-08-17 04:23:28Z tgaskins $
 */

requirejs.config({
    "paths": {
        "NEO": "NEO"
    }
});

requirejs(["NEO"], function (NEO) {
    new NEO()
});
