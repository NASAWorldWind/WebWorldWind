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
 * @exports OpenSearchNamespaces
 */

define([],
    function () {
        'use strict';

        /**
         * Provides namespace URIs used for OpenSearch.
         * @exports OpenSearchNamespaces
         */
        var OpenSearchNamespaces = {
            openSearch: 'http://a9.com/-/spec/opensearch/1.1/',
            geo: 'http://a9.com/-/opensearch/extensions/geo/1.0/',
            time: 'http://a9.com/-/opensearch/extensions/time/1.0/',
            parameters: 'http://a9.com/-/spec/opensearch/extensions/parameters/1.0/',
            eo: 'http://a9.com/-/opensearch/extensions/eo/1.0/',
            gml: 'http://www.opengis.net/gml',
            dc: 'http://purl.org/dc/elements/1.1/',
            georss: 'http://www.georss.org/georss'
        };

        return OpenSearchNamespaces;
});