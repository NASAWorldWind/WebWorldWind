/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OwsConstraint
 */
define([
        '../../error/ArgumentError',
        '../../util/Logger'
    ],
    function (ArgumentError,
              Logger) {
        "use strict";

        /**
         * Constructs an OWS Constraint instance from an XML DOM.
         * @alias OwsConstraint
         * @constructor
         * @classdesc Represents an OWS Constraint element of an OGC capabilities document.
         * This object holds as properties all the fields specified in the OWS Constraint definition.
         * Fields can be accessed as properties named according to their document names converted to camel case.
         * For example, "operation".
         * @param {Element} element An XML DOM element representing the OWS Constraint element.
         * @throws {ArgumentError} If the specified XML DOM element is null or undefined.
         */
        var OwsConstraint = function (element) {
            if (!element) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OwsConstraint", "constructor", "missingDomElement"));
            }

            this.name = element.getAttribute("name");

            var children = element.children;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "AllowedValues") {
                    this.allowedValues = this.allowedValues || [];

                    for (var cc = 0; cc < child.children.length; cc++) {
                        if (child.children[cc].localName === "Value") {
                            this.allowedValues.push(child.children[cc].textContent);
                        }
                    }
                } else if (child.localName === "AnyValue") {
                    this.anyValue = true;
                } else if (child.localName === "NoValues") {
                    this.noValues = true;
                }
                // TODO: ValuesReference
            }

        };

        return OwsConstraint;
    });