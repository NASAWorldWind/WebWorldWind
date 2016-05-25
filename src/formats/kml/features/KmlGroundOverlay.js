/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlElements',
    './KmlFeature',
    '../KmlLatLonBox',
    '../KmlLatLonQuad',
    './KmlOverlay',
    '../util/NodeTransformers',
    '../../../geom/Sector',
    '../../../shapes/SurfaceImage'
], function (
    KmlElements,
    KmlFeature,
    KmlLatLonBox,
    KmlLatLonQuad,
    KmlOverlay,
    NodeTransformers,
    Sector,
    SurfaceImage
) {
    "use strict";

    /**
     * Constructs an KmlGroundOverlay. Applications usually don't call this constructor. It is called by {@link
     * KmlFile} as objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlGroundOverlay
     * @classdesc Contains the data associated with GroundOverlay node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing GroundOverlay
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#groundoverlay
     * @augments KmlOverlay
     */
    var KmlGroundOverlay = function (options) {
        this.isGroundOverlay = true;

        KmlOverlay.call(this, options);
    };

    KmlGroundOverlay.prototype = Object.create(KmlOverlay.prototype);

    Object.defineProperties(KmlGroundOverlay.prototype, {
        /**
         * Specifies the distance above the earth's surface, in meters, and is interpreted according to the altitude
         * mode.
         * @memberof KmlGroundOverlay.prototype
         * @readonly
         * @type {String}
         */
        kmlAltitude: {
            get: function() {
                return this._factory.specific(this, {name: 'altitude', transformer: NodeTransformers.string});
            }
        },

        /**
         * Specifies how the &lt;altitude&gt;is interpreted.
         * @memberof KmlGroundOverlay.prototype
         * @readonly
         * @type {String}
         */
        kmlAltitudeMode: {
            get: function() {
                return this._factory.specific(this, {name: 'altitudeMode', transformer: NodeTransformers.string});
            }
        },

        /**
         * Specifies where the top, bottom, right, and left sides of a bounding box for the ground overlay are
         * aligned.
         * @memberof KmlGroundOverlay.prototype
         * @readonly
         * @type {KmlLatLonBox}
         */
        kmlLatLonBox: {
            get: function() {
                return this._factory.any(this, {
                    name: KmlLatLonBox.prototype.getTagNames()
                });
            }
        },

        /**
         * Used for nonrectangular quadrilateral ground overlays.
         * @memberof KmlGroundOverlay.prototype
         * @readonly
         * @type {KmlLatLonQuad}
         */
        kmlLatLonQuad: {
            get: function() {
                return this._factory.any(this, {
                    name: KmlLatLonQuad.prototype.getTagNames()
                });
            }
        }
    });

	/**
     * @inheritDoc
     */
    KmlGroundOverlay.prototype.render = function(dc, kmlOptions) {
        KmlFeature.prototype.render.call(this, dc, kmlOptions);

        if(!this._renderable && this.enabled) {
            if(this.kmlIcon && this.kmlLatLonBox) {
                this._renderable = new SurfaceImage(
                    new Sector(
                        this.kmlLatLonBox.kmlSouth,
                        this.kmlLatLonBox.kmlNorth,
                        this.kmlLatLonBox.kmlWest,
                        this.kmlLatLonBox.kmlEast
                    ),
                    this.kmlIcon.kmlHref
                );
                dc.redrawRequested = true;
            }
        }
        
        if(this._renderable) {
            this._renderable.render(dc);
        }
    };

    /**
     * @inheritDoc
     */
    KmlGroundOverlay.prototype.getTagNames = function () {
        return ['GroundOverlay'];
    };

    KmlElements.addKey(KmlGroundOverlay.prototype.getTagNames()[0], KmlGroundOverlay);

    return KmlGroundOverlay;
});