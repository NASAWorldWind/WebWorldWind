/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

requirejs.config({
    "paths": {
        "SentinelWMTS": "SentinelWMTS"
    }
});

requirejs(["SentinelWMTS"], function (SentinelWMTS) {
    new SentinelWMTS();
});
