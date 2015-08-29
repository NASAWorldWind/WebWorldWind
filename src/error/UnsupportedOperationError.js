/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports UnsupportedOperationError
 * @version $Id: UnsupportedOperationError.js 2631 2015-01-02 21:32:32Z tgaskins $
 */
define(['../error/AbstractError'],
    function (AbstractError) {
        "use strict";

        /**
         * Constructs an unsupported-operation error with a specified message.
         * @alias UnsupportedOperationError
         * @constructor
         * @classdesc Represents an error associated with an operation that is not available or should not be invoked.
         * Typically raised when an abstract function of an abstract base class is called because a subclass has not
         * implemented the function.
         * @augments AbstractError
         * @param {String} message The message.
         */
        var UnsupportedOperationError = function (message) {
            AbstractError.call(this, "UnsupportedOperationError", message);

            var stack;
            try {
                //noinspection ExceptionCaughtLocallyJS
                throw new Error();
            } catch (e) {
                stack = e.stack;
            }
            this.stack = stack;
        };

        UnsupportedOperationError.prototype = Object.create(AbstractError.prototype);

        return UnsupportedOperationError;
    });