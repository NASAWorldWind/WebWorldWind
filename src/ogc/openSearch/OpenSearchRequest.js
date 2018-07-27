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
 * @exports OpenSearchRequest
 */

define([
        './OpenSearchConstants'
    ],
    function (OpenSearchConstants) {

        /**
         * Constructs a request object with the specified options.
         * @alias OpenSearchRequest
         * @constructor
         * @classdesc Object representing an OpenSearch request.
         * @param {Object} options
         */
        var OpenSearchRequest = function (options) {
            var defaultOptions = OpenSearchRequest.defaultOptions;
            options = options || defaultOptions;

            /**
             * Url for a resource such as a description document.
             * @type {String}
             */
            this.url = options.url || defaultOptions.url;

            /**
             * A valid http method.
             * @type {String}
             */
            this.method = options.method || defaultOptions.method;

            /**
             * A valid encoding for POST, PUT requests.
             * @type {String}
             */
            this.encType = options.encType || defaultOptions.encType;

            /**
             * A valid mime type.
             * @type {String}
             */
            this.type = options.type || defaultOptions.type;

            /**
             * A valid open search rel. Possible values are 'collection' or 'results'.
             * @type {String}
             */
            this.relation = options.relation || defaultOptions.relation;

            /**
             * A flag to indicate if the request should include credentials.
             * @type {Boolean}
             */
            this.withCredentials = options.withCredentials || defaultOptions.withCredentials;

            /**
             * A timeout in milliseconds for the ajax request.
             * @type {Number}
             */
            this.timeout = options.timeout || defaultOptions.timeout;

            /**
             * Request headers.
             * Use the addHeader method.
             * @type {Object}
             */
            this.headers = options.headers || {};

            /**
             * Payload data for POST, PUT requests.
             * @type {FormData|Object}
             */
            this.body = options.body || defaultOptions.body;

            /**
             * The response type for XHR.
             * @type {String}
             */
            this.responseType = options.responseType || defaultOptions.responseType;

            /**
             * Username for authentication purposes.
             * @type {String}
             */
            this.user = options.user || defaultOptions.user;

            /**
             * Password for authentication purposes.
             * @type {String}
             */
            this.password = options.password || defaultOptions.password;
        };

        /**
         * Adds a header to an OpenSearchRequest request object
         * @param {String} name The name of the header
         * @param {String} value The value of the header
         */
        OpenSearchRequest.prototype.addHeader = function (name, value) {
            var header = this.getHeader(name);
            if (header) {
                this.headers[name] = header + ',' + value;
            }
            else {
                this.headers[name] = value;
            }
        };

        /**
         * Gets the value of a header
         * @param {String} name The name of the header
         * @return {String|undefined} The value of the header or undefined if the header does not exist
         */
        OpenSearchRequest.prototype.getHeader = function (name) {
            return this.headers[name];
        };

        /**
         * Internal. Applications should not modify these values.
         * Default values for an OpenSearchRequest
         * @static
         */
        OpenSearchRequest.defaultOptions = {
            url: '',
            method: '',
            encType: 'application/x-www-form-urlencoded',
            type: '',
            relation: OpenSearchConstants.RESULTS,
            withCredentials: false,
            timeout: 0,
            headers: null,
            body: null,
            responseType: 'text',
            user: null,
            password: null
        };

        return OpenSearchRequest;
    });