/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: app.js 3185 2015-06-12 19:12:09Z tgaskins $
 */

requirejs.config({
    "paths": {
        "Explorer": "Explorer"
    }
});

requirejs(["Explorer"], function (Explorer) {
        new Explorer()
});
