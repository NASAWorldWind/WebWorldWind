/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WWMessage
 * @version $Id: WWMessage.js 3418 2015-08-22 00:17:05Z tgaskins $
 */
define([],
    function () {
        "use strict";

        /**
         * Create a WWMessage instance.
         * @classdesc Defines a class to hold message information.
         * @param {String} type The message type.
         * @param {{}} source The source of the message.
         * @constructor
         */
        var WWMessage = function(type, source) {

            /**
             * This object's message type.
             * @type {String}
             * @readonly
             */
            this.type = type;

            /**
             * The source object of this message.
             * @type {{}}
             * @readonly
             */
            this.source = source;
        };

        return WWMessage;
    }
);