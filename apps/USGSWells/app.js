/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

requirejs.config({
    "paths": {
        "USGSWells": "USGSWells"
    }
});

requirejs(["USGSWells"], function (USGSWells) {
    new USGSWells()
});
