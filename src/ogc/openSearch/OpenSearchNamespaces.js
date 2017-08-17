/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OpenSearchNamespaces
 */

define([],
    function() {
        'use strict';

        var OpenSearchNamespaces = {
            openSearch: 'http://a9.com/-/spec/opensearch/1.1/',
            geo: 'http://a9.com/-/opensearch/extensions/geo/1.0/',
            time: 'http://a9.com/-/opensearch/extensions/time/1.0/',
            parameters: 'http://a9.com/-/spec/opensearch/extensions/parameters/1.0/',
            eo: 'http://a9.com/-/opensearch/extensions/eo/1.0/',
            eop: 'http://www.opengis.net/eop/2.0',
            sar: 'http://www.opengis.net/sar/2.1',
            om: 'http://www.opengis.net/om/2.0',
            gml: 'http://www.opengis.net/gml',
            dc: 'http://purl.org/dc/elements/1.1/',
            georss: 'http://www.georss.org/georss'
        };

        return OpenSearchNamespaces;
});