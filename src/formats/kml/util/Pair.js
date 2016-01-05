/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/extend',
    './../KmlElements',
    '../KmlObject',
    '../styles/KmlStyleSelector',
    '../../../util/Promise',
    '../util/StyleResolver'
], function (
    extend,
    KmlElements,
    KmlObject,
    KmlStyleSelector,
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

        Object.defineProperties(this, {
            /**
             * Identifies the key
             * @memberof Pair.prototype
             * @readonly
             * @type {String}
             */
            kmlKey: {
                get: function() {
                    return this.retrieve({name: 'key'});
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
                    return this.retrieve({name: 'styleUrl'});
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
                    return this.createChildElement({
                        name: KmlStyleSelector.prototype.getTagNames()
                    });
                }
            }
        });

        extend(this, Pair.prototype);
    };

    /**
     * @inheritDoc
     */
    Pair.prototype.getTagNames = function () {
        return ['Pair'];
    };

    /**
     * @inheritDoc
     */
    Pair.prototype.getStyle = function() {
        var self = this;
        return new Promise(function (resolve, reject) {
            window.setTimeout(function(){
                StyleResolver.handleRemoteStyle(self.kmlStyleUrl, self.kmlStyleSelector, resolve, reject);
            },0);
        });
    };

    KmlElements.addKey(Pair.prototype.getTagNames()[0], Pair);

    return Pair;
});