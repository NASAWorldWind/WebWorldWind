/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: app.js$
 */

requirejs.config({
    "paths": {
        "USGSSlabs": "USGSSlabs"
    }
});

requirejs(["USGSSlabs"], function (USGSSlabs) {
    new USGSSlabs()
});
