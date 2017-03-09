/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

requirejs.config({
    "paths": {
        "SinergiseWMTS": "SinergiseWMTS"
    }
});

requirejs(["SinergiseWMTS"], function (SinergiseWMTS) {
  new SinergiseWMTS();
});
