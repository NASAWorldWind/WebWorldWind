/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OwsServiceIdentification
 */
define([
        '../../error/ArgumentError',
        '../../util/Logger',
        '../../ogc/wmts/OwsDescription'
    ],
    function (ArgumentError,
              Logger,
              OwsDescription) {
        "use strict";

        /**
         * Constructs an OWS Service Identification instance from an XML DOM.
         * @alias OwsServiceIdentification
         * @constructor
         * @classdesc Represents an OWS Service Identification section of an OGC capabilities document.
         * This object holds as properties all the fields specified in the OWS Service Identification.
         * Fields can be accessed as properties named according to their document names converted to camel case.
         * For example, "serviceType" and "title".
         * Note that fields with multiple possible values are returned as arrays, such as "titles" and "abstracts".
         * @param {Element} element An XML DOM element representing the OWS Service Identification section.
         * @throws {ArgumentError} If the specified XML DOM element is null or undefined.
         */
        var OwsServiceIdentification = function (element) {
            if (!element) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OwsServiceIdentification", "constructor", "missingDomElement"));
            }

            OwsDescription.call(this, element);

            var children = element.children;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "ServiceType") {
                    this.serviceType = child.textContent;
                } else if (child.localName === "ServiceTypeVersion") {
                    this.serviceTypeVersions = this.serviceTypeVersions || [];
                    this.serviceTypeVersions.push(child.textContent);
                } else if (child.localName === "Profile") {
                    this.profile = this.profiles || [];
                    this.profile.push(child.textContent);
                } else if (child.localName === "Fees") {
                    this.fees = child.textContent;
                } else if (child.localName === "AccessConstraints") {
                    this.accessConstraints = this.accessConstraints || [];
                    this.accessConstraints.push(child.textContent);
                }
            }
        };

        OwsServiceIdentification.prototype = Object.create(OwsDescription.prototype);

        return OwsServiceIdentification;
    });