/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../util/extend',
    './KmlElements',
    './KmlObject'
], function (extend,
             KmlElements,
             KmlObject) {
    "use strict";

    /**
     * Constructs an KmlLod. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlLod
     * @classdesc Contains the data associated with Lod node.
     * @param node Node representing lod in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#lod
     */
    var KmlLod = function (node) {
        KmlObject.call(this, node);

        Object.defineProperties(this, {
            /**
             * Defines a square in screen space, with sides of the specified value in pixels. For example, 128 defines a
             * square of 128 x 128 pixels. The region's bounding box must be larger than this square (and smaller than the
             * maxLodPixels square) in order for the Region to be active.
             *
             * More details are available in the Working with Regions chapter of the Developer's Guide, as well as the
             *  Google Earth Outreach documentation's Avoiding Overload with Regions tutorial.
             * @memberof KmlLod.prototype
             * @readonly
             * @type {Number}
             */
            minLodPixels: {
                get: function () {
                    return this.retrieve({name: 'minLodPixels', transformer: Number});
                }
            },

            /**
             * Measurement in screen pixels that represents the maximum limit of the visibility range for a given Region. A
             * value of ?1, the default, indicates "active to infinite size."
             * @memberof KmlLod.prototype
             * @readonly
             * @type {Number}
             */
            maxLodPixels: {
                get: function () {
                    return this.retrieve({name: 'maxLodPixels', transformer: Number});
                }
            },

            /**
             * Distance over which the geometry fades, from fully opaque to fully transparent. This ramp value, expressed
             * in screen pixels, is applied at the minimum end of the LOD (visibility) limits.
             * @memberof KmlLod.prototype
             * @readonly
             * @type {Number}
             */
            minFadeExtent: {
                get: function () {
                    return this.retrieve({name: 'minFadeExtent', transformer: Number});
                }
            },

            /**
             * Distance over which the geometry fades, from fully transparent to fully opaque. This ramp value, expressed
             * in screen pixels, is applied at the maximum end of the LOD (visibility) limits.
             * @memberof KmlLod.prototype
             * @readonly
             * @type {Number}
             */
            maxFadeExtent: {
                get: function () {
                    return this.retrieve({name: 'maxFadeExtent', transformer: Number});
                }
            }
        });

        extend(this, KmlLod.prototype);
    };

    KmlLod.prototype.getTagNames = function() {
        return ['Lod'];
    };

    KmlElements.addKey(KmlLod.prototype.getTagNames()[0], KmlLod);

    return KmlLod;
});