/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: Logger.js 3418 2015-08-22 00:17:05Z tgaskins $
 */
define(function () {
    "use strict";
    /**
     * Logs selected message types to the console.
     * @exports Logger
     */

    var Logger = {
        /**
         * Log no messages.
         * @constant
         */
        LEVEL_NONE: 0,
        /**
         * Log messages marked as severe.
         * @constant
         */
        LEVEL_SEVERE: 1,
        /**
         * Log messages marked as warnings and messages marked as severe.
         * @constant
         */
        LEVEL_WARNING: 2,
        /**
         * Log messages marked as information, messages marked as warnings and messages marked as severe.
         * @constant
         */
        LEVEL_INFO: 3,

        /**
         * Set the logging level used by subsequent invocations of the logger.
         * @param {Number} level The logging level, one of Logger.LEVEL_NONE, Logger.LEVEL_SEVERE, Logger.LEVEL_WARNING,
         * or Logger.LEVEL_INFO.
         */
        setLoggingLevel: function (level) {
            loggingLevel = level;
        },

        /**
         * Indicates the current logging level.
         * @returns {Number} The current logging level.
         */
        getLoggingLevel: function () {
            return loggingLevel;
        },

        /**
         * Logs a specified message at a specified level.
         * @param {Number} level The logging level of the message. If the current logging level allows this message to be
         * logged it is written to the console.
         * @param {String} message The message to log. Nothing is logged if the message is null or undefined.
         */
        log: function (level, message) {
            if (message && level > 0 && level <= loggingLevel) {
                if (level === Logger.LEVEL_SEVERE) {
                    console.error(message);
                } else if (level === Logger.LEVEL_WARNING) {
                    console.warn(message);
                } else if (level === Logger.LEVEL_INFO) {
                    console.info(message);
                } else {
                    console.log(message);
                }
            }
        },

        // Intentionally not documented.
        makeMessage: function (className, functionName, message) {
            var msg = this.messageTable[message] ? this.messageTable[message] : message;

            return className + "." + functionName + ": " + msg;
        },

        // Intentionally not documented.
        logMessage: function (level, className, functionName, message) {
            var msg = this.makeMessage(className, functionName, message);
            this.log(level, msg);

            return msg;
        },

        // Intentionally not documented.
        messageTable: { // KEEP THIS TABLE IN ALPHABETICAL ORDER
            abstractInvocation: "The function called is abstract and must be overridden in a subclass.",
            indexOutOfRange: "The specified index is out of range.",
            invalidHeight: "The specified height is zero or negative.",
            invalidWidth: "The specified width is zero or negative.",
            invalidSize: "The specified size is zero or negative.",
            missingAltitudeMode: "The specified altitude mode is null or undefined.",
            missingAttributeName: "The specified DBase attribute file name is null or undefined.",
            missingArray: "The specified array is null, undefined or of insufficient length.",
            missingBoundaries: "The specified boundaries array is null or undefined.",
            missingBuffer: "The specified buffer descriptor is null or undefined.",
            missingColor: "The specified color is null or undefined.",
            missingDc: "The specified draw context is null or undefined.",
            missingDomElement: "The specified DOM element is null or undefined.",
            missingEntry: "The specified entry is null or undefined.",
            missingFont: "The specified font is null or undefined.",
            missingFrustum: "The specified frustum is null or undefined.",
            missingFunction: "The specified function is null or undefined.",
            missingGlContext: "The specified WebGL rendering context is null or undefined.",
            missingGlobe: "The specified globe is null or undefined.",
            missingImage: "The specified image is null or undefined.",
            missingIndices: "The specified indices array is null or undefined.",
            missingKey: "The specified key is null or undefined.",
            missingLevel: "The specified level is null or undefined.",
            missingLine: "The specified line is null or undefined.",
            missingList: "The specified list is null or undefined.",
            missingListener: "The specified listener is null or undefined",
            missingLocation: "The specified location is null or undefined.",
            missingMatrix: "The specified matrix is null or undefined.",
            missingNavigatorState: "The specified navigator state is null or undefined.",
            missingOffset: "The specified offset is null or undefined.",
            missingPath: "The specified path is null or undefined.",
            missingPlacename: "The specified place name is null or undefined.",
            missingPlane: "The specified plane is null or undefined.",
            missingPoint: "The specified point is null or undefined.",
            missingPoints: "The specified points array is null or undefined.",
            missingPosition: "The specified position is null or undefined.",
            missingPositions: "The specified positions array is null or undefined.",
            missingProgram: "The specified program is null or undefined.",
            missingProjection: "The specified projection is null or undefined.",
            missingRectangle: "The specified rectangle is null or undefined.",
            missingRenderable: "The specified renderable is null or undefined.",
            missingResource: "The specified resource is null or undefined.",
            missingResult: "The specified result variable is null or undefined.",
            missingResults: "The specified results array is null or undefined.",
            missingSector: "The specified sector is null or undefined.",
            missingShapeType: "The specified shape type is null or undefined.",
            missingSize: "The specified size is null or undefined.",
            missingText: "The specified text is null or undefined.",
            missingTexture: "The specified texture is null or undefined.",
            missingTile: "The specified tile is null or undefined.",
            missingType: "The specified type is null or undefined.",
            missingUrl: "The specified URL is null or undefined",
            missingVector: "The specified vector is null or undefined.",
            missingVertex: "The specified vertex is null or undefined.",
            missingViewport: "The specified viewport is null or undefined.",
            missingWorldWindow: "The specified World Window is null or undefined.",
            notYetImplemented: "This function is not yet implemented"
        }
    };

    var loggingLevel = 1; // log severe messages by default

    return Logger;
});