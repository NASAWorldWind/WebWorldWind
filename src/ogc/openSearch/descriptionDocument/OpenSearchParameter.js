/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OpenSearchParameter
 */

define([
    '../OpenSearchUtils'
    ],
    function (OpenSearchUtils) {
        'use strict';

        var OpenSearchParameter = function (type, name, value, required, replaceable, ns, minimum, maximum, pattern, title,
                                            minExclusive, maxExclusive, minInclusive, maxInclusive, step, options) {
            this.type = type;
            this.name = name;
            this.value = value;
            this.required = required;
            this.replaceable = replaceable;
            this.ns = ns || '';
            this.minimum = minimum;
            this.maximum = maximum;
            this.pattern = pattern;
            this.title = title;
            this.minExclusive = minExclusive;
            this.maxExclusive = maxExclusive;
            this.minInclusive = minInclusive;
            this.maxInclusive = maxInclusive;
            this.step = step;
            this.options = options || [];
        };

        OpenSearchParameter.fromQuery = function (query) {
            var queryParts = query.split('=');
            var name = queryParts[0];
            var queryValue = queryParts[1];

            var replaceable = true;
            if (queryValue[0] === '{') {
                var value = queryValue.slice(1, queryValue.length - 1);
            }
            else {
                value = queryValue;
                replaceable = false;
            }

            var required = true;
            if (value[value.length - 1] === '?') {
                required = false;
                value = value.slice(0, value.length - 1);
            }

            var paramNameParts = value.split(':');
            var ns = '';
            if (paramNameParts && paramNameParts.length === 2) {
                ns = paramNameParts[0];
                value = paramNameParts[1];
            }

            return new OpenSearchParameter('template', name, value, required, replaceable, ns);
        };

        OpenSearchParameter.fromNode = function (node) {
            var name = node.getAttribute('name');
            var queryValue = node.getAttribute('value') || '';

            var replaceable = true;
            if (queryValue[0] === '{') {
                var value = queryValue.slice(1, queryValue.length - 1);
            }
            else {
                value = queryValue;
                replaceable = false;
            }

            var ns = '';
            var valueParts = value.split(':');
            if (valueParts && valueParts.length === 2) {
                ns = valueParts[0];
                value = valueParts[1];
            }

            var minimum = node.getAttribute('minimum');
            if (!minimum) {
                minimum = 1;
            }
            else {
                minimum = +minimum;
            }
            var required = minimum > 0;

            var max = node.getAttribute('maximum');
            var maximum = 1;
            if (max) {
                if (max === '*') {
                    maximum = max;
                }
                else {
                    maximum = +max;
                }
            }

            var pattern = node.getAttribute('pattern') || '';
            var title = node.getAttribute('title') || '';
            var minExclusive = +node.getAttribute('minExclusive') || '';
            var maxExclusive = +node.getAttribute('maxExclusive') || '';
            var minInclusive = +node.getAttribute('minInclusive') || '';
            var maxInclusive = +node.getAttribute('maxInclusive') || '';
            var step = +node.getAttribute('step') || '';

            var optionNodes = OpenSearchUtils.getXmlElements(node, 'Option');
            var options = [];
            if (optionNodes.length) {
                for (var i = 0, len = optionNodes.length; i < len; i++) {
                    options.push({
                        label: optionNodes[i].getAttribute('label') || '',
                        value: optionNodes[i].getAttribute('value')
                    });
                }
            }
            return new OpenSearchParameter('node', name, value, required, replaceable, ns, minimum, maximum, pattern, title,
                minExclusive, maxExclusive, minInclusive, maxInclusive, step, options);
        };

        OpenSearchParameter.prototype.merge = function (param) {
            /* In case of inconsistency between the Parameter extension annotations and the <Url>
             * template in the OSDD, the <Url> template prevails.
             * CEOS best practice document v1.1.1 pag. 27
             * http://ceos.org/document_management/Working_Groups/WGISS/Interest_Groups/OpenSearch/CEOS-OPENSEARCH-BP-V1.1.1-Final.pdf
             * */
            var name = param.name;
            var value = param.value;
            var required = param.required;
            var replaceable = param.replaceable;
            var ns = param.ns;
            if (this.type === 'template') {
                name = this.name;
                value = this.value;
                required = this.required;
                replaceable = this.replaceable;
                ns = this.ns;
            }

            if (this.options && param.options) {
                var options = this.options.concat(param.options);
            }
            else {
                options = this.options || param.options || [];
            }

            return new OpenSearchParameter(
                'mix',
                name,
                value,
                required,
                replaceable,
                ns,
                this.minimum || param.minimum,
                this.maximum || param.maximum,
                this.pattern || param.pattern,
                this.title || param.title,
                this.minExclusive || param.minExclusive,
                this.maxExclusive || param.maxExclusive,
                this.minInclusive || param.minInclusive,
                this.maxInclusive || param.maxInclusive,
                this.step || param.step,
                options
            );
        };

        return OpenSearchParameter;

    });