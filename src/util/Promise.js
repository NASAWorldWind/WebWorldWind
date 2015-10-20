/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([], function () {
    "use strict";
    if(Promise) {
        return Promise;
    }

    // Promise implementation equal to ECMA Script 6 standard.
    // Skeleton for now.
    var PromiseLegacy = function() {
        this.all = function(iterable) {

        };

        this.race = function(iterable) {

        };

        this.reject = function(reason) {

        };

        this.resolve = function(value) {

        };

        this.length = 1;
    };

    Object.defineProperties(PromiseLegacy.prototype, {
        constructor: {
            get: function(){
                return PromiseLegacy;
            }
        }
    });

    PromiseLegacy.prototype.catch = function() {

    };

    PromiseLegacy.prototype.then = function() {

    };
});