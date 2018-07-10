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
 * @exports OpenSearchLayer
 */

define([
    '../../formats/geojson/GeoJSONParser',
    './OpenSearchConstants',
    '../../layer/RenderableLayer'
], function (GeoJSONParser,
             OpenSearchConstants,
             RenderableLayer) {
    /**
     * It represents layer, which takes the Description Document and based on the provided shape configuration displays
     * the shapes on the globe. THe shapes are drawn as appropriate renderables.
     *
     * @param document {OpenSearchDescriptionDocument} The document to display.
     * @param shapeConfigurationCallback {Function|null} The function which can adapt the way the renderables will look like.
     * @constructor
     * @alias OpenSearchLayer
     */
    var OpenSearchLayer = function (document, shapeConfigurationCallback) {
        RenderableLayer.call(this);

        // There needs to be a mechanism to provide parsers for different types of responses.
        var geoJSON = new GeoJSONParser(document);
        geoJSON.load(null, shapeConfigurationCallback, this);
    };

    OpenSearchLayer.prototype = Object.create(RenderableLayer.prototype);

    return OpenSearchLayer;
});