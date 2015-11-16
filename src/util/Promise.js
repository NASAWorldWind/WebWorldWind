/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define(['./es6-promise'],
    function (LegacyPromise) {
        "use strict";
        if (window.Promise) {
            return window.Promise;
        } else {
            return LegacyPromise.Promise;
        }
    });