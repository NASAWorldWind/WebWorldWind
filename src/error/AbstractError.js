/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports AbstractError
 * @version $Id: AbstractError.js 2913 2015-03-19 19:01:18Z tgaskins $
 */
define(function () {
    "use strict";

    /**
     * Constructs an error with a specified name and message.
     * @alias AbstractError
     * @constructor
     * @abstract
     * @classdesc Provides an abstract base class for error classes. This class is not meant to be instantiated
     * directly but used only by subclasses.
     * @param {String} name The error's name.
     * @param {String} message The message.
     */
    var AbstractError = function (name, message) {
        this.name = name;
        this.message = message;
    };

    /**
     * Returns the message and stack trace associated with this error.
     * @returns {String} The message and stack trace associated with this error.
     */
    AbstractError.prototype.toString = function () {
        var str = this.name + ': ' + this.message;

        if (this.stack) {
            str += '\n' + this.stack.toString();
        }

        return str;
    };

    return AbstractError;

});