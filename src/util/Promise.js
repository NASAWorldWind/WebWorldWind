/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define(['./es6-promise'], function (ES6Promise) {
    "use strict";
    if (Promise) {
        return Promise;
    } else {
        return ES6Promise.Promise;
    }
});