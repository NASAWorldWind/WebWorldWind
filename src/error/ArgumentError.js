/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports ArgumentError
 * @version $Id: ArgumentError.js 2631 2015-01-02 21:32:32Z tgaskins $
 */
define(['../error/AbstractError'],
    function (AbstractError) {
        "use strict";

        /**
         * Constructs an argument error with a specified message.
         * @alias ArgumentError
         * @constructor
         * @classdesc Represents an error associated with invalid function arguments.
         * @augments AbstractError
         * @param {String} message The message.
         */
        var ArgumentError = function (message) {
            AbstractError.call(this, "ArgumentError", message);

            var stack;
            try {
                //noinspection ExceptionCaughtLocallyJS
                throw new Error();
            } catch (e) {
                stack = e.stack;
            }
            this.stack = stack;
        };

        ArgumentError.prototype = Object.create(AbstractError.prototype);

        return ArgumentError;
    });