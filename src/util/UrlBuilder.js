/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports UrlBuilder
 * @version $Id: UrlBuilder.js 2938 2015-03-30 15:02:00Z tgaskins $
 */
define(['../util/Logger',
        '../error/UnsupportedOperationError'
    ],
    function (Logger,
              UnsupportedOperationError) {
        "use strict";

        /**
         * Applications must not call this constructor. It is an interface class and is not meant to be instantiated.
         * @alias UrlBuilder
         * @constructor
         * @classdesc
         * Defines an interface for tile URL builders. This is an interface class and not meant to be instantiated.
         */
        var UrlBuilder = function () {};

        /**
         * Creates the URL string for a resource.
         * @param {Tile} tile The tile for which to create the URL.
         * @param {String} format The format to request.
         * @returns {String} A string identifying the URL for the specified tile's resource.
         * @throws {ArgumentError} If either the specified tile or format is null or undefined.
         */
        UrlBuilder.prototype.urlForTile = function (tile, format) {
            throw new UnsupportedOperationError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "UrlBuilder", "urlForTile", "abstractInvocation"));
        };

        return UrlBuilder;
    })
;