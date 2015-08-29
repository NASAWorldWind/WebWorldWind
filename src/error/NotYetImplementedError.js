/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports NotYetImplementedError
 * @version $Id: NotYetImplementedError.js 2631 2015-01-02 21:32:32Z tgaskins $
 */
define(['../error/AbstractError'],
    function (AbstractError) {
        "use strict";

        /**
         * Constructs a not-yet-implemented error with a specified message.
         * @alias NotYetImplementedError
         * @constructor
         * @classdesc Represents an error associated with an operation that is not yet implemented.
         * @augments AbstractError
         * @param {String} message The message.
         */
        var NotYetImplementedError = function (message) {
            AbstractError.call(this, "NotYetImplementedError", message);

            var stack;
            try {
                //noinspection ExceptionCaughtLocallyJS
                throw new Error();
            } catch (e) {
                stack = e.stack;
            }
            this.stack = stack;
        };

        NotYetImplementedError.prototype = Object.create(AbstractError.prototype);

        return NotYetImplementedError;
    });