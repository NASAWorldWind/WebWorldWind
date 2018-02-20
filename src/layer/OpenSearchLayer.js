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
 * @exports OpenSearchService
 */

define([
        '../error/ArgumentError',
        '../formats/geojson/GeoJSONParser',
        '../util/Logger',
        '../ogc/openSearch/OpenSearchService',
        './RenderableLayer'
    ],
    function (ArgumentError,
              GeoJSONParser,
              Logger,
              OpenSearchService,
              RenderableLayer) {
        'use strict';

        /**
         * Constructs a Open search layer.
         *
         * @alias OpenSearchLayer
         * @constructor
         * @augments RenderableLayer
         * @classdesc Provides a layer for working with OpenSearch requests.
         *
         * For working with OpenSearch, this layer exposes two methods:
         *  - discover used to get the description document;
         *  - search used for querying the search engine.
         *
         * By default, this layer can handle Atom for EO and GeoJSON responses.
         * Other types of response formats can by added using the registerParser method.
         *
         * Renderables can by filtered by time by setting the currentTimeInterval property.
         *
         * @param {String} displayName This layer's display name.
         */
        var OpenSearchLayer = function (displayName) {
            RenderableLayer.call(this, displayName);

            this._shapeConfigurationCallback = function() {};
            this._searchService = new OpenSearchService();
            this._currentTimeInterval = [];
        };

        OpenSearchLayer.prototype = Object.create(RenderableLayer.prototype);

        Object.defineProperties(OpenSearchLayer.prototype, {
            /**
             * URL of the description document used by this layer.
             * @memberof OpenSearchLayer.prototype
             * @type {String}
             */
            url: {
                get: function () {
                    return this.searchService.url;
                },
                set: function (value) {
                    this.searchService.url = value;
                }
            },

            /**
             * A function called prior to creating a shape for the indicated GeoJSON geometry.
             *
             * This function can be used to assign attributes to newly created shapes.
             * The callback function's first argument is the current geometry object.
             * The second argument to the callback function is the object containing the properties read from the
             * corresponding GeoJSON properties member, if any.
             *
             * @memberof OpenSearchLayer.prototype
             * @type {Function}
             */
            shapeConfigurationCallback: {
                get: function () {
                    return this._shapeConfigurationCallback;
                },
                set: function (value) {
                    if (typeof value !== 'function') {
                        throw new ArgumentError(
                            Logger.logMessage(Logger.LEVEL_SEVERE, "OpenSearchLayer", "setShapeConfigurationCallback",
                                "The specified shapeConfigurationCallback is not a function."));
                    }
                    this._shapeConfigurationCallback = value;
                }
            },

            /**
             * The list with start and end time for filtering renderables within the specified time interval.
             * @memberof OpenSearchLayer.prototype
             * @type {Date[]}
             */
            currentTimeInterval: {
                get: function () {
                    return this._currentTimeInterval;
                },
                set: function (value) {
                    this._currentTimeInterval = value;
                    this.filterByDate();
                }
            },

            /**
             * The search service of this layer.
             * @memberof OpenSearchLayer.prototype
             * @type {OpenSearchService}
             */
            searchService: {
                get: function () {
                    return this._searchService;
                },
                set: function (value) {
                    this._searchService = value;
                }
            },

            /**
             * The parsed description document.
             * @memberof OpenSearchLayer.prototype
             * @type {OpenSearchDescriptionDocument}
             */
            descriptionDocument: {
                get: function () {
                    return this.searchService.descriptionDocument;
                }
            }
        });

        /**
         * Fetches and parses an OpenSearch description document.
         *
         * @param {OpenSearchRequest|null} options See {@link OpenSearchRequest} for possible options.
         * @return {Promise} A promise which when resolved returns this layer, or an error when rejected
         * @example openSearchLayer
         *                      .discover({url: 'http://example.com/opensearch'})
         *                      .then(result => console.log(result))
         *                      .catch(err => console.error(err));
         */
        OpenSearchLayer.prototype.discover = function (options) {
            var self = this;
            return this._searchService.discover(options)
                .then(function () {
                    return self;
                });
        };

        /**
         * Performs a search query.
         *
         * @param {Object[]|null} searchParams The list of search parameters, each object must have a name and value
         * property.
         * @param {OpenSearchRequest|null} options See {@link OpenSearchRequest} for possible options.
         * @return {Promise} A promise which when resolved returns a geoJSON collection, or an error when rejected.
         * @example openSearchService
         *                      .search([
         *                          {name: 'count', value: 50}, {name: 'lat', value: 50}, {name: 'lon', value: 20}
         *                      ])
         *                      .then(result => console.log(result))
         *                      .catch(err => console.error(err));
         */
        OpenSearchLayer.prototype.search = function (searchParams, options) {
            var self = this;

            if (!options || options.replaceShapes !== false) {
                this.removeAllRenderables();
            }

            return this._searchService.search(searchParams, options)
                .then(function (geoJSONCollection) {
                    self.loadFromGeoJSON(geoJSONCollection, self._shapeConfigurationCallback);
                    self.filterByDate();
                    return geoJSONCollection;
                });
        };

        /**
         * Loads a GeoJSON object in this layer.
         *
         * @param {Object} geoJSONCollection The GeoJSON collection to load.
         * @param {Function} shapeConfigurationCallback The optional function called prior to creating a shape for
         * the indicated GeoJSON geometry.
         * This function can be used to assign attributes to newly created shapes.
         * The callback function's first argument is the current geometry object.
         * The second argument to the callback function is the object containing the properties read from the
         * corresponding GeoJSON properties member, if any.
         */
        OpenSearchLayer.prototype.loadFromGeoJSON = function (geoJSONCollection, shapeConfigurationCallback) {
            var shapeCb = shapeConfigurationCallback || this._shapeConfigurationCallback || null;
            var polygonGeoJSON = new GeoJSONParser(JSON.stringify(geoJSONCollection));
            polygonGeoJSON.load(null, shapeCb, this);
        };

        /**
         * Returns the URLs of the description document.
         *
         * @return {OpenSearchUrl[]} A list of OpenSearchUrl.
         */
        OpenSearchLayer.prototype.getUrls = function () {
            if (!this._searchService.descriptionDocument) {
                return [];
            }
            return this._searchService.descriptionDocument.urls;
        };

        /**
         * Returns the list of search parameters for each URL in the description document.
         *
         * @return {OpenSearchParameter[][]} The list of OpenSearchParameter per URL.
         */
        OpenSearchLayer.prototype.getSearchParams = function () {
            return this.getUrls().map(function (url) {
                return url.parameters;
            });
        };

        /**
         * Finds an URL that satisfies the provided predicate function.
         *
         * @param {Function} predicate Function to execute on each value in the description document URLs array,
         * taking three arguments:
         * element The current element being processed in the array.
         * index The index of the current element being processed in the array.
         * array The array find was called upon.
         * @param {Object|null} context Object to use as "this" when executing the predicate function.
         * @return {OpenSearchUrl|undefined} The first URL in the array that satisfies the provided predicate
         * function. Otherwise, undefined is returned.
         */
        OpenSearchLayer.prototype.findUrl = function(predicate, context) {
            return this._searchService.findUrl(predicate, context);
        };

        /**
         * Registers a parser for the specified mime type and relation.
         *
         * The parse method of the parser will be called with the response of the server when the mime type and
         * relation type matches.
         *
         * @param {String} type Mime type of the parser to register.
         * @param {String} rel Relation type of the parser to register.
         * @param {Object} parser An object with a parse method.
         */
        OpenSearchLayer.prototype.registerParser = function (type, rel, parser) {
            this._searchService.registerParser(type, rel, parser);
        };

        /**
         * Removes the response parser for the specified mime type and relation.
         *
         * @param {String} type Mime type of the registered parser.
         * @param {String} rel Relation type of the registered parser.
         */
        OpenSearchLayer.prototype.removeParser = function (type, rel) {
            this._searchService.removeParser(type, rel);
        };

        /**
         * Filters the renderables of this layer by the interval specified by currentTimeInterval.
         *
         * This method is called automatically when currentTimeInterval is set or when renderables are added to this
         * layer as a result of a search.
         */
        OpenSearchLayer.prototype.filterByDate = function () {
            if (!Array.isArray(this._currentTimeInterval) ||
                !this.isValidDate(this._currentTimeInterval[0]) ||
                !this.isValidDate(this._currentTimeInterval[1])) {
                return;
            }

            for (var i = this.renderables.length - 1; i >= 0; i--) {
                var renderable = this.renderables[i];
                renderable.enabled = this.isRenderableWithinTimeLimits(renderable);
            }
        };

        /**
         * Shows all renderables in this layer.
         */
        OpenSearchLayer.prototype.showAll = function () {
            for (var i = this.renderables.length - 1; i >= 0; i--) {
                this.renderables[i].enabled = true;
            }
        };

        /**
         * Internal. Applications should not call this method.
         * Checks whether a renderable is within the time limits specified by the currentTimeInterval.
         *
         * @param {Renderable} renderable
         * @return {Boolean}
         */
        OpenSearchLayer.prototype.isRenderableWithinTimeLimits = function (renderable) {
            var dcDate = renderable.userProperties.date;
            if (!dcDate) {
                return false;
            }
            var dateParts = dcDate.split('/');
            var startTime = (new Date(dateParts[0])).getTime();
            var endTime = (new Date(dateParts[1])).getTime();
            if (isNaN(startTime) || isNaN(endTime)) {
                return false;
            }
            return (
                this.timeIntersection(startTime, endTime) ||
                this.timeInclusion(startTime, endTime)
            );
        };

        /**
         * Internal. Applications should not call this method.
         * Checks whether the provided interval intersects the currentTimeInterval.
         *
         * @param {Number} startTime
         * @param {Number} endTime
         * @return {Boolean}
         */
        OpenSearchLayer.prototype.timeIntersection = function (startTime, endTime) {
            var startInterval = this._currentTimeInterval[0].getTime();
            var endInterval = this._currentTimeInterval[1].getTime();
            return (
                (startTime >= startInterval && startTime <= endInterval) ||
                (endTime >= startInterval && endTime <= endInterval)
            );
        };

        /**
         * Internal. Applications should not call this method.
         * Checks whether the provided interval fully includes the currentTimeInterval.
         *
         * @param {Number} startTime
         * @param {Number} endTime
         * @return {Boolean}
         */
        OpenSearchLayer.prototype.timeInclusion = function (startTime, endTime) {
            var startInterval = this._currentTimeInterval[0].getTime();
            var endInterval = this._currentTimeInterval[1].getTime();
            return (startTime <= startInterval && endTime >= endInterval);
        };

        /**
         * Internal. Applications should not call this method.
         * Checks whether the provided value is a valid JavaScript Date object.
         *
         * @param {Date} value
         * @return {Boolean}
         */
        OpenSearchLayer.prototype.isValidDate = function (value) {
            if (Object.prototype.toString.call(value) === "[object Date]") {
                return !isNaN(value.getTime());
            }
            return false;
        };

        return OpenSearchLayer;

    });