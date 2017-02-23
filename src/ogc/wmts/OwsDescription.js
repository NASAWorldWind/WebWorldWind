/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OwsDescription
 */
define([
        '../../error/ArgumentError',
        '../../util/Logger',
        '../../ogc/wmts/OwsLanguageString'
    ],

    function (ArgumentError,
              Logger,
              OwsLanguageString) {
        "use strict";

        /**
         * Constructs an OWS Description instance from an XML DOM.
         * @alias OwsDescription
         * @constructor
         * @classdesc Represents an OWS Description element of an OGC document.
         * This object holds as properties all the fields specified in the OWS Description definition.
         * Fields can be accessed as properties named according to their document names converted to camel case.
         * For example, "value".
         * @param {Element} element An XML DOM element representing the OWS Description element.
         * @throws {ArgumentError} If the specified XML DOM element is null or undefined.
         */
        var OwsDescription = function (element) {
            if (!element) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OwsDescription", "assembleDescriptions", "missingDomElement"));
            }

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Title") {
                    this.titles = this.titles || [];
                    this.titles.push(new OwsLanguageString(child));
                } else if (child.localName === "Abstract") {
                    this.abstracts = this.abstracts || [];
                    this.abstracts.push(new OwsLanguageString(child));
                } else if (child.localName === "Keywords") {
                    this.keywords = this.keywords || [];
                    var keywords = child.children || child.childNodes;
                    for (var i = 0; i < keywords.length; i++) {
                        var keyword = keywords[i];
                        this.keywords.push(new OwsLanguageString(keyword));
                    }
                }
            }

        };

        return OwsDescription;
    }
);