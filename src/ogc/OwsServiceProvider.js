/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OwsServiceProvider
 */
define([
        '../error/ArgumentError',
        '../util/Logger'
    ],
    function (ArgumentError,
              Logger) {
        "use strict";

        /**
         * Constructs an OWS Service Provider instance from an XML DOM.
         * @alias OwsServiceProvider
         * @constructor
         * @classdesc Represents an OWS Service Provider section of an OGC capabilities document.
         * This object holds as properties all the fields specified in the OWS Service Provider section.
         * Fields can be accessed as properties named according to their document names converted to camel case.
         * For example, "providerName".
         * @param {Element} element An XML DOM element representing the OWS Service Provider section.
         * @throws {ArgumentError} If the specified XML DOM element is null or undefined.
         */
        var OwsServiceProvider = function (element) {
            if (!element) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OwsServiceProvider", "constructor", "missingDomElement"));
            }

            var children = element.children;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "ProviderName") {
                    this.providerName = child.textContent;
                } else if (child.localName === "ProviderSite") {
                    this.providerSite = child.getAttribute("xlink:href");
                }
                // TODO: Service Contact
            }
        };

        return OwsServiceProvider;
    });