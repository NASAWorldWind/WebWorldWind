/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @exports OpenSearchParameter
 */

define([
        '../OpenSearchUtils'
    ],
    function (OpenSearchUtils) {
        'use strict';

        /**
         * Constructs an OpenSearchParameter.
         * @alias OpenSearchParameter
         * @constructor
         * @classdesc Represents an OpenSearchParameter.
         *
         * @param {String} type Internal parameter, indicates from where this parameter was generated (template or
         * parameter extension).
         * @param {String} name The name of this parameter.
         * @param {String} value The value indicated by the template or parameter extension.
         * @param {Boolean} required Indicated if this param is required for searches.
         * @param {Boolean} replaceable Indicates if this param value should be replaced when making a search query.
         * @param {String} ns The namespace of this param's name.
         * @param {Number} minimum The minimum number of times this param should appear in a query.
         * @param {Number|String} maximum The maximum number of times this param should appear in a query. A value of
         * '*' indicates no limit.
         * @param {RegExp} pattern A regexp pattern for the param's value.
         * @param {String} title Advisory information for the format and valid values of the parameter, such as would be
         * appropriate for a tooltip or label.
         * @param {Number} minExclusive Indicates the minimum value for the element that cannot be reached.
         * @param {Number} maxExclusive Indicates the maximum value for the element that cannot be reached.
         * @param {Number} minInclusive Indicates the minimum value for the element that can be reached.
         * @param {Number} maxInclusive Indicates the maximum value for the element that can be reached.
         * @param {Number} step Indicates the granularity of the allowed values between the minimal and maximal range.
         * @param {Object[]} options A list of objects that describes a value/label pair suggested to the client for the
         * parent element.
         */
        var OpenSearchParameter = function (type, name, value, required, replaceable, ns, minimum, maximum, pattern,
                                            title, minExclusive, maxExclusive, minInclusive, maxInclusive, step,
                                            options) {
            this._internalType = type;
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

        /**
         * Internal. Applications should not call this method.
         * Creates an OpenSearchParameter from a template query string.
         *
         * @param {'name={value?}'} query The query string part from the URL template.
         * @return {OpenSearchParameter} The resulting OpenSearchParameter.
         */
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

            return new OpenSearchParameter(OpenSearchParameter.types.TEMPLATE, name, value, required, replaceable, ns);
        };

        /**
         * Internal. Applications should not call this method.
         * Creates an OpenSearchParameter from a Parameter node.
         *
         * @param {Node} node The Parameter node.
         * @return {OpenSearchParameter} The resulting OpenSearchParameter.
         */
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
            var required;
            if (!minimum) {
                minimum = 1;
                required= false;
            }
            else {
                minimum = +minimum;
                required = minimum > 0;
            }

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
            return new OpenSearchParameter(
                OpenSearchParameter.types.NODE,
                name,
                value,
                required,
                replaceable,
                ns,
                minimum,
                maximum,
                pattern,
                title,
                minExclusive,
                maxExclusive,
                minInclusive,
                maxInclusive,
                step,
                options
            );
        };

        /**
         * Internal. Applications should not call this method.
         * Merges this parameter with the specified parameter and returns a new OpenSearchParameter object.
         * This is done for parameters that appear in the template and the Parameter node.
         *
         * @param {OpenSearchParameter} param The parameter to merge from.
         * @return {OpenSearchParameter} The merged parameter.
         */
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
            if (this._internalType === OpenSearchParameter.types.TEMPLATE) {
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
                OpenSearchParameter.types.MIX,
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

        /**
         * Internal constants for OpenSearchParameter.
         * Indicates from where the parameter was generated.
         */
        OpenSearchParameter.types = {
            TEMPLATE: 'TEMPLATE',
            NODE: 'NODE',
            MIX: 'MIX'
        };

        return OpenSearchParameter;

    });