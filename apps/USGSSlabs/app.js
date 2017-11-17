/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
requirejs.config({
    "paths": {
        "USGSSlabs": "USGSSlabs"
    }
});

requirejs(["USGSSlabs"], function (USGSSlabs) {
    new USGSSlabs()
});
