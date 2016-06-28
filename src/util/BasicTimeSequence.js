/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports BasicTimeSequence
 */

define([
        '../error/ArgumentError',
        '../util/Logger'
    ],
    function (ArgumentError, Logger) {
        "use strict";

        /**
         * Constructs a time sequence from an array of Dates.
         * @alias BasicTimeSequence
         * @constructor
         * @classdesc Represents a time sequence described as an array of Date objects as required by WMS.
         * This class provides iteration over the sequence in steps
         * specified by the period. If the start and end dates are different, iteration will start at the start
         * date and end at the end date.
         * @param {Date[]} dates An array of Date objects.
         * @throws {ArgumentError} If the specified dates array is null, undefined or has a length less than two.
         */

        var BasicTimeSequence = function (dates) {

            if (!dates && dates.length < 2) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "BasicTimeSequence", "constructor", "missingDates"));
            }

            /**
             * This sequence's list of Dates.
             * @type {Date[]}
             */
            this.dates = dates;

            /**
             * This sequence's current index.
             * @type {Number}
             * @default 0.
             */
            this.currentIndex = 0;

            /**
             * This sequence's current time.
             * @type {Date}
             * @default This sequence's start time.
             */
            this.currentTime = dates[0];
        };

        Object.defineProperties(BasicTimeSequence.prototype, {
            /**
             * Indicates the position of this sequence's current time relative to the sequence's total interval,
             * in the range [0, 1]. A value of 0 indicates this sequence's start time. A value of 1 indicates
             * this sequence's end time. A value of 0.5 indicates a current time that's exactly mid-way between
             * this sequence's start time and end time.
             * @type {Number}
             * @memberof BasicTimeSequence.prototype
             */
            scaleForCurrentTime: {
                get: function () {
                    if (!this.currentTime) {
                        return 1;
                    }
                    else {
                        return (this.currentIndex / this.dates.length);
                    }
                }
            }

        });

        /**
         * Sets this sequence's current time to the next time in the sequence and returns that time.
         * @returns {Date|null} The next time of this sequence, or null if no more times are in the sequence.
         * Use [reset]{@link BasicTimeSequence#reset} to re-start this sequence.
         * Use [previous]{@link BasicTimeSequence#previous} to step backwards through this sequence.
         */
        BasicTimeSequence.prototype.next = function () {

            if (this.currentIndex >= this.dates.length - 1) {
                return null;
            }

            this.currentIndex++;
            this.currentTime = this.dates[this.currentIndex];

            return this.currentTime;
        };

        /**
         * Sets this sequence's current time to the previous time in the sequence and returns that time.
         * @returns {Date|null} The previous time of this sequence, or null if the sequence is currently at its start
         * time.
         * Use [next]{@link BasicTimeSequence#next} to step forwards through this sequence.
         */
        BasicTimeSequence.prototype.previous = function () {

            if (this.currentIndex <= 0) {
                return null;
            }

            this.currentIndex--;
            this.currentTime = this.dates[this.currentIndex];

            return this.currentTime;
        };

        /**
         * Resets this sequence's current time to its start time.
         * Use [next]{@link BasicTimeSequence#next} to step forwards through this sequence.
         * Use [previous]{@link BasicTimeSequence#previous} to step backwards through this sequence.
         */
        BasicTimeSequence.prototype.reset = function () {
            this.currentIndex = -1;
            this.currentTime = null;
        };

        /**
         * Returns the time associated with a specified value in the range [0, 1]. A value of 0 returns this
         * sequence's start time. A value of 1 returns this sequence's end time. A value of 0.5 returs a time
         * mid-way between this sequence's start and end times.
         * @param scale The scale value. This value is clamped to the range [0, 1] before the time is determined.
         * @returns {Date}
         */
        BasicTimeSequence.prototype.getTimeForScale = function (scale) {

            if (scale <= 0) {
                this.currentIndex = 0;
            }
            else if (scale >= 1) {
                this.currentIndex = this.dates.length - 1;
            }
            else {
                this.currentIndex = Math.floor(this.dates.length * scale);
            }

            this.currentTime = this.dates[this.currentIndex];

            return this.currentTime;

        };

        return BasicTimeSequence;

    });