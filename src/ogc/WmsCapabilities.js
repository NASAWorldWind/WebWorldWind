/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WmsCapabilities
 * @version $Id: WmsCapabilities.js 3055 2015-04-29 21:39:51Z tgaskins $
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../ogc/WmsLayerCapabilities'
    ],
    function (ArgumentError,
              Logger,
              WmsLayerCapabilities) {
        "use strict";

        /**
         * Constructs an WMS Capabilities instance from an XML DOM.
         * @alias WMSCapabilities
         * @constructor
         * @classdesc Represents a WMS Capabilities document. This object holds as properties all the fields
         * specified in the given WMS Capabilities document. Most fields can be accessed as properties named
         * according to their document names converted to camel case. For example, "version", "service.title",
         * "service.contactInformation.contactPersonPrimary". The exceptions are online resources, whose property
         * path has been shortened. For example "capability.request.getMap.formats" and "capability.request.getMap.url".
         * @param {{}} xmlDom An XML DOM representing the WMS Capabilities document.
         * @throws {ArgumentError} If the specified XML DOM is null or undefined.
         */
        var WmsCapabilities = function (xmlDom) {
            if (!xmlDom) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WmsCapabilities", "constructor", "No XML DOM specified."));
            }

            this.assembleDocument(xmlDom);
        };

        WmsCapabilities.prototype.assembleDocument = function (dom) {
            var e,
                elements = dom.getElementsByTagName("WMS_Capabilities"); // WMS 1.3.0
            if (elements.length == 0) {
                elements = dom.getElementsByTagName("WMT_MS_Capabilities"); // WMS 1.1.1
                if (elements.length == 0) {
                    return;
                }
            }

            var root = elements[0];

            this.version = root.getAttribute("version");
            this.updateSequence = root.getAttribute("updateSequence");

            elements = root.getElementsByTagName("Service");
            if (elements.length > 0) {
                var serviceElement = elements[0];
                this.service = {
                    capsDoc: this
                };

                this.service.title = WmsCapabilities.getTag(serviceElement, "Title");
                this.service.abstract = WmsCapabilities.getTag(serviceElement, "Abstract");

                elements = serviceElement.getElementsByTagName("KeywordList");
                if (elements.length > 0) {
                    this.service.keywordList = [];
                    elements = elements[0].getElementsByTagName("Keyword");
                    for (e = 0; e < elements.length; e++) {
                        this.service.keywordList.push(elements[e].textContent);
                    }
                }

                elements = serviceElement.getElementsByTagName("OnlineResource");
                if (elements.length > 0) {
                    this.service.onlineResource = elements[0].getAttribute("xlink:href");
                }

                this.service.fees = WmsCapabilities.getTag(serviceElement, "Fees");
                this.service.accessConstraints = WmsCapabilities.getTag(serviceElement, "AccessConstraints");
                this.service.layerLimit = WmsCapabilities.getTag(serviceElement, "LayerLimit");

                elements = serviceElement.getElementsByTagName("ContactInformation");
                if (elements.length > 0) {
                    var contactInfoElement = elements[0];
                    this.service.contactInformation = {};

                    elements = contactInfoElement.getElementsByTagName("ContactPersonPrimary");
                    if (elements.length > 0) {
                        var contactPersonElement = elements[0];
                        this.service.contactInformation.contactPersonPrimary = {};

                        this.service.contactInformation.contactPersonPrimary.contactPerson
                            = WmsCapabilities.getTag(contactPersonElement, "ContactPerson");
                        this.service.contactInformation.contactPersonPrimary.contactOrganization
                            = WmsCapabilities.getTag(contactPersonElement, "ContactOrganization");
                    }

                    this.service.contactInformation.contactPosition
                        = WmsCapabilities.getTag(contactInfoElement, "ContactPosition");
                    this.service.contactInformation.contactVoiceTelephone
                        = WmsCapabilities.getTag(contactInfoElement, "ContactVoiceTelephone");
                    this.service.contactInformation.contactFaxsimileTelephone
                        = WmsCapabilities.getTag(contactInfoElement, "ContactFacsimileTelephone");
                    this.service.contactInformation.contactEmailAddress
                        = WmsCapabilities.getTag(contactInfoElement, "ContactEmailAddress");

                    elements = contactInfoElement.getElementsByTagName("ContactAddress");
                    if (elements.length > 0) {
                        var contactAddressElement = elements[0];
                        this.service.contactInformation.contactAddress = {};

                        this.service.contactInformation.contactAddress.addressType
                            = WmsCapabilities.getTag(contactAddressElement, "AddressType");
                        this.service.contactInformation.contactAddress.address
                            = WmsCapabilities.getTag(contactAddressElement, "Address");
                        this.service.contactInformation.contactAddress.city
                            = WmsCapabilities.getTag(contactAddressElement, "City");
                        this.service.contactInformation.contactAddress.stateOrProvince
                            = WmsCapabilities.getTag(contactAddressElement, "StateOrProvince");
                        this.service.contactInformation.contactAddress.postCode
                            = WmsCapabilities.getTag(contactAddressElement, "PostCode");
                        this.service.contactInformation.contactAddress.country
                            = WmsCapabilities.getTag(contactAddressElement, "Country");
                    }
                }
            }

            elements = root.getElementsByTagName("Capability");
            if (elements.length > 0) {
                this.capability = {
                    capsDoc: this
                };
                var capsElement = elements[0];

                elements = capsElement.getElementsByTagName("Request");
                if (elements.length > 0) {
                    var requestNode = elements[0];
                    this.capability.request = {};

                    this.capability.request.getCapabilities
                        = WmsCapabilities.getRequestInfo(requestNode, "GetCapabilities");
                    this.capability.request.getMap
                        = WmsCapabilities.getRequestInfo(requestNode, "GetMap");
                    this.capability.request.getFeatureInfo
                        = WmsCapabilities.getRequestInfo(requestNode, "GetFeatureInfo");
                }

                elements = capsElement.getElementsByTagName("Exception");
                if (elements.length > 0) {
                    this.capability.exception = {};

                    elements = elements[0].getElementsByTagName("Format");
                    if (elements.length > 0) {
                        this.capability.exception.formats = [];
                        for (e = 0; e < elements.length; e++) {
                            this.capability.exception.formats.push(elements[e].textContent);
                        }
                    }
                }

                this.capability.layers = [];
                var children = capsElement.children || capsElement.childNodes;
                for (var c = 0; c < children.length; c++) {
                    if (children[c].localName === "Layer") {
                        this.capability.layers.push(new WmsLayerCapabilities(children[c], this.capability));
                    }
                }
            }
        };

        WmsCapabilities.assembleLayers = function (parentElement, parentNode) {
            var layers = [];

            var children = parentElement.children || parentElement.childNodes;
            for (var c = 0; c < children.length; c++) {
                if (children[c].localName === "Layer") {
                    layers.push(new WmsLayerCapabilities(children[c], parentNode));
                }
            }

            return layers;
        };

        WmsCapabilities.getTag = function (parentElement, tagName) {
            var children = parentElement.children || parentElement.childNodes;
            for (var c = 0; c < children.length; c++) {
                if (children[c].localName === tagName) {
                    return children[c].textContent;
                }
            }
        };

        WmsCapabilities.getRequestInfo = function (parentElement, requestName) {
            var elements = parentElement.getElementsByTagName(requestName);
            if (elements.length > 0) {
                var requestNode = elements[0],
                    result = {};

                elements = requestNode.getElementsByTagName("Format");
                if (elements.length > 0) {
                    result.formats = [];
                    for (var e = 0; e < elements.length; e++) {
                        result.formats.push(elements[e].textContent);
                    }
                }

                elements = requestNode.getElementsByTagName("DCPType");
                if (elements.length > 0) {
                    elements = elements[0].getElementsByTagName("HTTP");
                    if (elements.length > 0) {
                        elements = elements[0].getElementsByTagName("Get");
                        if (elements.length > 0) {
                            elements = elements[0].getElementsByTagName("OnlineResource");
                            if (elements.length > 0) {
                                result.url = elements[0].getAttribute("xlink:href");
                            }
                        }
                    }
                }

                return result;
            } else {
                return undefined;
            }
        };

        return WmsCapabilities;
    });