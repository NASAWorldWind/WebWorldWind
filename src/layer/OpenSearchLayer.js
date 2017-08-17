/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OpenSearchService
 */

define([
        '../formats/geojson/GeoJSONParser',
        '../ogc/OpenSearch/OpenSearchService',
        './RenderableLayer'
    ],
    function (GeoJSONParser,
              OpenSearchService,
              RenderableLayer) {
        'use strict';

        /**
         * Constructs a Open search layer.
         * @alias OpenSearchLayer
         * @constructor
         * @augments RenderableLayer
         * @classdesc Provides a layer for working with open search requests.
         * @param {String} displayName This layer's display name.
         */
        var OpenSearchLayer = function (displayName) {
            RenderableLayer.call(this, displayName);

            this._shapeConfigurationCallback = null;
            this._searchService = new OpenSearchService();
            this._currentTimeInterval = [];
        };

        OpenSearchLayer.prototype = Object.create(RenderableLayer.prototype);

        Object.defineProperties(OpenSearchLayer.prototype, {
            /**
             * URL for the description document.
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
             * A callback function for geoJSON data.
             * @memberof OpenSearchLayer.prototype
             * @type {Function}
             */
            shapeConfigurationCallback: {
                get: function () {
                    return this._shapeConfigurationCallback;
                },
                set: function (value) {
                    if (typeof value !== 'function') {
                        throw '';
                    }
                    this._shapeConfigurationCallback = value;
                }
            },

            /**
             * A list with start and wnd time for filtering renderables withing the specified interval.
             * @memberof OpenSearchLayer.prototype
             * @type {[Date, Date]}
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
             * The serch servie of this layer.
             * @memberof v.prototype
             * @type {OpenSearchService}
             */
            searchService: {
                get: function () {
                    return this._searchService;
                },
                set: function (value) {
                    this._searchService = value
                }
            },

            /**
             * The parsed description document.
             * @memberof OpenSearchLayer.prototype
             * @type {DescriptionDocument}
             */
            descriptionDocument: {
                get: function () {
                    return this.searchService.descriptionDocument;
                }
            }
        });

        /**
         * Fetches and parses an open search description document.
         * @param {OpenSearchRequest|null} options See OpenSearchRequest for possible options.
         * @return {Promise} A promise which when resolved return this layer, or an error when rejected
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
                })
                .catch(function (err) {
                    return Promise.reject(err);
                });
        };

        /**
         * Performs a search query.
         * @param {Array|null} searchParams A list of objects, each object must have a name and value property.
         * @param {Function|null} shapeConfigurationCallback A callback function for geoJSON data.
         * @param {OpenSearchRequest|null} options See OpenSearchRequest for possible options.
         * @return {Promise} A promise which when resolved returns a geoJSON collection, or an error when rejected.
         * @example openSearchService
         *                      .search([
         *                          {name: 'count', value: 50}, {name: 'lat', value: 50}, {name: 'lon', value: 20}
         *                      ])
         *                      .then(result => console.log(result))
         *                      .catch(err => console.error(err));
         */
        OpenSearchLayer.prototype.search = function (searchParams, shapeConfigurationCallback, options) {
            var self = this;

            if (!options || options.replaceShapes !== false) {
                this.removeAllRenderables();
            }

            return this._searchService.search(searchParams, options)
                .then(function (geoJSONCollection) {
                    self.loadFromGeoJSON(geoJSONCollection, shapeConfigurationCallback);
                    self.filterByDate();
                    return geoJSONCollection;
                })
                .catch(function (err) {
                    return Promise.reject(err);
                });
        };

        OpenSearchLayer.prototype.loadFromGeoJSON = function (geoJSONCollection, shapeConfigurationCallback) {
            var shapeCb = shapeConfigurationCallback || this._shapeConfigurationCallback || null;
            var polygonGeoJSON = new GeoJSONParser(JSON.stringify(geoJSONCollection));
            polygonGeoJSON.load(null, shapeCb, this);
        };

        /**
         * Returns the Urls of the description document.
         * @return {[OpenSearchUrl]} A list of OpenSearchUrl.
         */
        OpenSearchLayer.prototype.getUrls = function () {
            if (!this._searchService.descriptionDocument) {
                return [];
            }
            return this._searchService.descriptionDocument.urls;
        };

        /**
         * Returns a list of search parameters for each url in the description document.
         * @return {[[OpenSearchParameter], [OpenSearchParameter]]} A list of OpenSearchParameter.
         */
        OpenSearchLayer.prototype.getSearchParams = function () {
            return this.getUrls().map(function (url) {
                return url.parameters;
            });
        };

        /**
         * @param {{
         *  mineType: String, a valid mimeType
         *  rel: 'results', an OpenSearch Url relation with the value: results,
         *  parser: Object, an object with a parse method, the parse function will be called with the server response
         *                  and must return a geoJSON object
         * }} options
         *
         * @example
         * openSearchLayer.registerParser({
         *  mimeType: 'application/atom+xml',
         *  rel: 'results',
         *  parser: {
         *      parse: function(response) {
         *          // parse the response and return a geoJSON Object
         *      }
         *  }
         * });
         * */
        OpenSearchLayer.prototype.registerParser = function (options) {
            this._searchService.registerParser(options);
        };

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
         * Shows all the renderables in this layer.
         */
        OpenSearchLayer.prototype.showAll = function () {
            for (var i = this.renderables.length; i <= 0; i--) {
                this.renderables[i].enabled = true;
            }
        };

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

        OpenSearchLayer.prototype.timeIntersection = function (startTime, endTime) {
            var startInterval = this._currentTimeInterval[0].getTime();
            var endInterval = this._currentTimeInterval[1].getTime();
            return (
                (startTime >= startInterval && startTime <= endInterval) ||
                (endTime >= startInterval && endTime <= endInterval)
            );
        };

        OpenSearchLayer.prototype.timeInclusion = function (startTime, endTime) {
            var startInterval = this._currentTimeInterval[0].getTime();
            var endInterval = this._currentTimeInterval[1].getTime();
            return (startTime <= startInterval && endTime >= endInterval);
        };

        OpenSearchLayer.prototype.isValidDate = function (value) {
            if (Object.prototype.toString.call(value) === "[object Date]") {
                return !isNaN(value.getTime());
            }
            return false;
        };

        return OpenSearchLayer;

    });