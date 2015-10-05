/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlElements',
    '../KmlObject',
    '../styles/KmlStyle'
], function (
    KmlElements,
    KmlObject,
    KmlStyle
) {
    "use strict";

    /**
     * Constructs a Pair. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * @alias Pair
     * @constructor
     * @classdesc Contains the data associated with Kml Pair
     * @param node Node representing the Kml Pair.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#pair
     */
    var Pair = function(node) {
        KmlObject.call(this, node);
    };

    Pair.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(Pair.prototype, {
        /**
         * Array of the tag names representing Pair.
         * @memberof Pair.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['Pair'];
            }
        },

        /**
         * Identifies the key
         * @memberof Pair.prototype
         * @readonly
         * @type {Array}
         */
        key: {
            get: function() {
                return this.retrieve({name: 'key'});
            }
        },

        /**
         * References the style using Url. If part of the same document start with the prefix #
         * @memberof Pair.prototype
         * @readonly
         * @type {Array}
         */
        styleUrl: {
            get: function() {
                return this.retrieve({name: 'styleUrl'});
            }
        },

        /**
         * Definition of styles applied to this Pair.
         * @memberof Pair.prototype
         * @readonly
         * @type {Array}
         */
        Style: {
            get: function() {
                return this.createChildElement({
                    name: KmlStyle.prototype.tagName
                });
            }
        }
    });

    KmlElements.addKey(Pair.prototype.tagName[0], Pair);

    return Pair;
});