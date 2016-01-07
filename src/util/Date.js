/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([], function () {
    "use strict";
    /**
     * Descendant of Date.
     * @param dateInFormat {String} Any format of date accepted by the Date constructor.
     * @constructor
     * @alias DateWW
     */
    var DateWW = function(dateInFormat) {
        if(dateInFormat) {
            this._date = new Date(dateInFormat);
        } else {
            this._date = new Date();
        }
    };

    DateWW.prototype = Object.create(Date.prototype);

    DateWW.prototype.isAfter = function(date) {
        return this.compare(date) == -1;
    };

    DateWW.prototype.isBefore = function(date) {
        return this.compare(date) == 1;
    };

    DateWW.prototype.valueOf = function() {
        return this._date.valueOf();
    };

    DateWW.prototype.getTime = function() {
        return this._date.getTime();
    };

    DateWW.prototype.compare = function(date) {
        var currentDate = this._date.valueOf();
        var comparedDate = date.valueOf();

        if(currentDate > comparedDate) {
            return -1;
        } else if(currentDate < comparedDate) {
            return 1;
        } else {
            return 0;
        }
    };

    return DateWW;
});