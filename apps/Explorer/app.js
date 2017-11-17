/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
requirejs.config({
    "paths": {
        "Explorer": "Explorer"
    }
});

requirejs(["Explorer"], function (Explorer) {
        new Explorer()
});
