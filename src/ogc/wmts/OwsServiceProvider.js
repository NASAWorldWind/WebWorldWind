/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OwsServiceProvider
 */
define([
        '../../error/ArgumentError',
        '../../util/Logger'
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

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "ProviderName") {
                    this.providerName = child.textContent;
                } else if (child.localName === "ProviderSite") {
                    this.providerSiteUrl = child.getAttribute("xlink:href");
                } else if (child.localName === "ServiceContact") {
                    this.serviceContact = OwsServiceProvider.assembleServiceContact(child);
                }
            }
        };

        OwsServiceProvider.assembleServiceContact = function (element) {
            if (!element) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OwsServiceProvider", "assembleServiceContact", "missingDomElement"));
            }

            var result = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "IndividualName") {
                    result.individualName = child.textContent;
                } else if (child.localName === "PositionName") {
                    result.positionName = child.textContent;
                } else if (child.localName === "ContactInfo") {
                    result.contactInfo = OwsServiceProvider.assembleContacts(child);
                }
            }

            return result;
        }

        OwsServiceProvider.assembleContacts = function (element) {
            if (!element) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OwsServiceProvider", "assembleContacts", "missingDomElement"));
            }

            var result = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "HoursOfService") {
                    result.hoursOfService = child.textContent;
                } else if (child.localName === "ContactInstructions") {
                    result.contactInstructions = child.textContent;
                } else if (child.localName === "Phone") {
                    result.phone = OwsServiceProvider.assemblePhone(child);
                } else if (child.localName === "Address") {
                    result.address = OwsServiceProvider.assembleAddress(child);
                }
            }

            return result;
        }

        OwsServiceProvider.assemblePhone = function (element) {
            if (!element) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OwsServiceProvider", "assemblePhone", "missingDomElement"));
            }

            var result = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Voice") {
                    result.voice = child.textContent;
                } else if (child.localName === "Facsimile") {
                    result.facsimile = child.textContent;
                }
            }

            return result;
        }

        OwsServiceProvider.assembleAddress = function (element) {
            if (!element) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OwsServiceProvider", "assembleAddress", "missingDomElement"));
            }

            var result = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "DeliveryPoint") {
                    result.deliveryPoints = result.deliveryPoints || [];
                    result.deliveryPoints.push(child.textContent);
                } else if (child.localName === "City") {
                    result.city = child.textContent;
                } else if (child.localName === "AdministrativeArea") {
                    result.administrativeArea = child.textContent;
                } else if (child.localName === "PostalCode") {
                    result.postalCodes = result.postalCodes || [];
                    result.postalCodes.push(child.textContent);
                } else if (child.localName === "Country") {
                    result.countries = result.countries || [];
                    result.countries.push(child.textContent);
                } else if (child.localName === "ElectronicMailAddress") {
                    result.electronicMailAddresses = result.electronicMailAddresses || [];
                    result.electronicMailAddresses.push(child.textContent);
                }
            }

            return result;
        }

        return OwsServiceProvider;
    });