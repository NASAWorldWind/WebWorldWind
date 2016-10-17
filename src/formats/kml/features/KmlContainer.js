/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlFeature'
], function (KmlFeature) {
    "use strict";
    /**
     * Constructs an KmlContainer. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlContainer
     * @classdesc Contains the data associated with Container options.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the container.
     * @constructor
     * @throws {ArgumentError} If the options is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#container
     * @augments KmlFeature
     */
    var KmlContainer = function (options) {
        KmlFeature.call(this, options);
    };

    KmlContainer.prototype = Object.create(KmlFeature.prototype);

    Object.defineProperties(KmlContainer.prototype, {
        /**
         * Specifies any amount of features, which are part of this document.
         * @memberof KmlDocument.prototype
         * @readonly
         * @type {Node[]}
         * @see {KmlFeature}
         */
        kmlShapes: {
            get: function(){
                var allElements = this._factory.all(this);
                return allElements.filter(function (element) {
                    // For now display only features.
                    return element.isFeature;
                });
            }
        }
    });

	/**
     * @inheritDoc
     */
    KmlContainer.prototype.render = function(dc, kmlOptions) {
        KmlFeature.prototype.render.call(this, dc, kmlOptions);

        var self = this;
        this.kmlShapes.forEach(function(shape) {
            shape.render(dc, {
                lastStyle: kmlOptions.lastStyle,
                lastVisibility: self.enabled,
                currentTimeInterval: kmlOptions.currentTimeInterval,
                regionInvisible: kmlOptions.regionInvisible,
                fileCache: kmlOptions.fileCache,
                styleResolver: kmlOptions.styleResolver,
                listener: kmlOptions.listener,
                activeEvents: kmlOptions.activeEvents
            });
        });
    };


    /**
     * @inheritDoc
     */
    KmlContainer.prototype.getTagNames = function () {
        return ['Folder', 'Document'];
    };

    return KmlContainer;
});