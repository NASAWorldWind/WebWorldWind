/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlElements',
    '../KmlObject',
    '../styles/KmlStyleSelector',
    './NodeTransformers',
    '../../../util/Promise',
    '../util/StyleResolver'
], function (
    KmlElements,
    KmlObject,
    KmlStyleSelector,
    NodeTransformers,
    Promise,
    StyleResolver
) {
    "use strict";

    /**
     * Constructs a Pair. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * @alias Pair
     * @constructor
     * @classdesc Contains the data associated with Kml Pair
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Kml Pair.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#pair
     * @augments KmlObject
     */
    var Pair = function (options) {
        KmlObject.call(this, options);
    };

    Pair.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(Pair.prototype, {
        /**
         * Identifies the key
         * @memberof Pair.prototype
         * @readonly
         * @type {String}
         */
        kmlKey: {
            get: function() {
                return this._factory.specific(this, {name: 'key', transformer: NodeTransformers.string});
            }
        },

        /**
         * References the style using Url. If part of the same document start with the prefix #
         * @memberof Pair.prototype
         * @readonly
         * @type {String}
         */
        kmlStyleUrl: {
            get: function() {
                return this._factory.specific(this, {name: 'styleUrl', transformer: NodeTransformers.string});
            }
        },

        /**
         * Definition of styles applied to this Pair.
         * @memberof Pair.prototype
         * @readonly
         * @type {KmlStyle}
         */
        kmlStyleSelector: {
            get: function() {
                return this._factory.any(this, {
                    name: KmlStyleSelector.prototype.getTagNames()
                });
            }
        }
    });

    /**
     * @inheritDoc
     */
    Pair.prototype.getTagNames = function () {
        return ['Pair'];
    };

    /**
     * @inheritDoc
     */
    Pair.prototype.getStyle = function(styleResolver) {
        var self = this;
        return new Promise(function (resolve, reject) {
            window.setTimeout(function(){
                styleResolver.handleRemoteStyle(self.kmlStyleUrl, self.kmlStyleSelector, resolve, reject);
            },0);
        });
    };

    KmlElements.addKey(Pair.prototype.getTagNames()[0], Pair);

    return Pair;
});