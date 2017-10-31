/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports OpenSearchService
 */

define([
        '../error/ArgumentError',
        '../formats/geojson/GeoJSONParser',
        '../util/Logger',
        '../ogc/OpenSearch/OpenSearchService',
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
         * For working with OpenSearch this layer exposes two methods:
         *  - discover used to get the description document
         *  - search used for querying the search engine
         *
         * By default this service can handle Atom for EO and geoJSON responses.
         * Other types of response formats can by added with the registerParser method.
         *
         * Renderables can by filtered by time by setting the currentTimeInterval.
         *
         * @alias OpenSearchLayer
         * @constructor
         * @augments RenderableLayer
         * @classdesc Provides a layer for working with open search requests.
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
             * Url for the description document.
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
             * An function called prior to creating a shape for the indicated GeoJSON geometry.
             * This function can be used to assign attributes to newly created shapes.
             * The callback function's first argument is the current geometry object.
             * The second argument to the callback function is the object containing the properties read from
             * the corresponding GeoJSON properties member, if any.
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
             * A list with start and end time for filtering renderables withing the specified interval.
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
             * The search service of this layer.
             * @memberof OpenSearchLayer.prototype
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
             * @type {OpenSearchDescriptionDocument}
             */
            descriptionDocument: {
                get: function () {
                    return this.searchService.descriptionDocument;
                }
            }
        });

        /**
         * Fetches and parses an open search description document.
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
         * @param {Array|null} searchParams A list of objects, each object must have a name and value property.
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
         * Loads a geoJSON object in this layer.
         * @param {Object} geoJSONCollection A geoJSON collection
         * @param {Function} shapeConfigurationCallback An optional function called prior to creating a shape for
         * the indicated GeoJSON geometry.
         * This function can be used to assign attributes to newly created shapes.
         * The callback function's first argument is the current geometry object.
         * The second argument to the callback function is the object containing the properties read from
         * the corresponding GeoJSON properties member, if any.
         */
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
         * Registers a parser to be used for the specified mime type and relation
         *
         * @param {String} type Mime type for the registered parser
         * @param {String} rel Open search Url relation for the registered parser
         * @param {Object} parser An object with a parse method.
         * The parse method will be called with the response of the server and must return a geoJSON object
         */
        OpenSearchLayer.prototype.registerParser = function (type, rel, parser) {
            this._searchService.registerParser(type, rel, parser);
        };

        /**
         * Removes a parser for the specified mime type and relation.
         *
         * @param {String} type Mime type for the registered parser
         * @param {String} rel Open search Url relation for the registered parser
         */
        OpenSearchLayer.prototype.removeParser = function (type, rel) {
            this._searchService.removeParser(type, rel);
        };

        /**
         * Filters the renderables of this layer by the interval specified by currentTimeInterval.
         * This method is called automatically when currentTimeInterval is set
         * or when renderables are added to this layer as a result of a search.
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
         * Shows all the renderables in this layer.
         */
        OpenSearchLayer.prototype.showAll = function () {
            for (var i = this.renderables.length - 1; i >= 0; i--) {
                this.renderables[i].enabled = true;
            }
        };

        /**
         * Internal. Applications should not call this method.
         * Checks if a renderable is within the time limits specified by currentTimeInterval.
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
         * Checks if the provided interval intersects the currentTimeInterval.
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
         * Checks if the provided interval fully included the currentTimeInterval.
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
         * Checks if the provided value is a valid javascript Date object.
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