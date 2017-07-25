/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OwsOperationsMetadata
 */
define([
        '../../error/ArgumentError',
        '../../util/Logger',
        '../../ogc/wmts/OwsConstraint'
    ],
    function (ArgumentError,
              Logger,
              OwsConstraint) {
        "use strict";

        /**
         * Constructs an OWS Operations Metadata instance from an XML DOM.
         * @alias OwsOperationsMetadata
         * @constructor
         * @classdesc Represents an OWS Operations Metadata section of an OGC capabilities document.
         * This object holds as properties all the fields specified in the OWS Operations Metadata section.
         * Most fields can be accessed as properties named according to their document names converted to camel case.
         * For example, "operations".
         * @param {Element} element An XML DOM element representing the OWS Service Provider section.
         * @throws {ArgumentError} If the specified XML DOM element is null or undefined.
         */
        var OwsOperationsMetadata = function (element) {
            if (!element) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OwsOperationsMetadata", "constructor", "missingDomElement"));
            }

            var children = element.children;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Operation") {
                    this.operation = this.operation || [];
                    this.operation.push(OwsOperationsMetadata.assembleOperation(child));
                }
                // TODO: Parameter, Constraint, ExtendedCapabilities
            }
        };

        /**
         * Attempts to find the first OwsOperationsMetadata object named GetCapabilities.
         * @returns {OwsOperationsMetadata} if a matching OwsOperationsMetadata object is found, otherwise null.
         */
        OwsOperationsMetadata.prototype.getGetCapabilities = function () {
            return this.getOperationMetadataByName("GetCapabilities");
        };

        /**
         * Attempts to find the first OwsOperationsMetadata object named GetTile.
         * @returns {OwsOperationsMetadata} if a matching OwsOperationsMetadata object is found, otherwise null.
         */
        OwsOperationsMetadata.prototype.getGetTile = function () {
            return this.getOperationMetadataByName("GetTile");
        };

        /**
         * Searches for the OWS Operations Metadata objects for the operation with a name matching the  provided name.
         * Returns the first successful match.
         * @returns {OwsOperationsMetadata} of a matching name or null if none was found
         */
        OwsOperationsMetadata.prototype.getOperationMetadataByName = function (name) {
            if (!name) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OwsOperationsMetadata", "getOperationsMetadataByName", "missingName"));
            }

            for (var i = 0; i < this.operation.length; i++) {
                if (this.operation[i].name === name) {
                    return this.operation[i];
                }
            }

            return null;
        };

        OwsOperationsMetadata.assembleOperation = function (element) {
            var operation = {};

            operation.name = element.getAttribute("name");

            var children = element.children;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "DCP") {
                    operation.dcp = operation.dcp || [];
                    operation.dcp.push(OwsOperationsMetadata.assembleDcp(child));
                }
                // TODO: Parameter, Constraint, Metadata
            }

            return operation;
        };

        OwsOperationsMetadata.assembleDcp = function (element) {
            var dcp = {};

            var children = element.children;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "HTTP") {
                    var httpMethods = child.children || child.childNodes;
                    for (var c2 = 0; c2 < httpMethods.length; c2++) {
                        var httpMethod = httpMethods[c2];

                        if (httpMethod.localName === "Get") {
                            dcp.getMethods = dcp.getMethods || [];
                            dcp.getMethods.push(OwsOperationsMetadata.assembleMethod(httpMethod));
                        } else if (httpMethod.localName === "Post") {
                            dcp.postMethods = dcp.postMethods || [];
                            dcp.postMethods.push(OwsOperationsMetadata.assembleMethod(httpMethod));
                        }
                    }
                }
            }

            return dcp;
        };

        OwsOperationsMetadata.assembleMethod = function (element) {
            var result = {};

            result.url = element.getAttribute("xlink:href");

            var children = element.children;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Constraint") {
                    result.constraint = result.constraint || [];
                    result.constraint.push(new OwsConstraint(child));
                }
            }

            return result;
        };

        return OwsOperationsMetadata;
    });