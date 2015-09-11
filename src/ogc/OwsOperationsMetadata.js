/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OwsOperationsMetadata
 */
define([
        '../error/ArgumentError',
        '../util/Logger',
        '../ogc/OwsConstraint'
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
                    dcp.http = OwsOperationsMetadata.assembleHttp(child);
                }
            }

            return dcp;
        };

        OwsOperationsMetadata.assembleHttp = function (element) {
            var result = {};

            var children = element.children;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Get") {
                    result.get = result.get || [];
                    result.get.push(OwsOperationsMetadata.assembleGet(child));
                }

                // TODO: Post
            }

            return result;
        };

        OwsOperationsMetadata.assembleGet = function (element) {
            var result = {};

            result.href = element.getAttribute("xlink:href");

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