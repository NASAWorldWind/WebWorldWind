/*
 * Copyright 2015-2018 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
 * @exports OpenSearchLayer
 */

define([
    './OpenSearchConstants',
    '../../layer/RenderableLayer'
], function (OpenSearchConstants,
             RenderableLayer) {
    /**
     *
     * @param document {OpenSearchDescriptionDocument}
     * @constructor
     */
    var OpenSearchLayer = function (document) {
        RenderableLayer.call(this);

        // There needs to be a mechanism to provide parsers for different types of responses.
        let geoJSON = new GeoJSONParser(document);
        geoJSON.load(null, null, this);
    };

    OpenSearchLayer.prototype = Object.create(RenderableLayer.prototype);

    return OpenSearchLayer;
});