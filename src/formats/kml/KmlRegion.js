/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../geom/BoundingBox',
    '../../util/Color',
    './KmlElements',
    './KmlLatLonAltBox',
    './KmlLod',
    './KmlObject',
    './styles/KmlStyle',
    './util/NodeTransformers',
    '../../shapes/Polygon',
    '../../geom/Position',
    '../../shapes/ShapeAttributes'
], function (BoundingBox,
             Color,
             KmlElements,
             KmlLatLonAltBox,
             KmlLod,
             KmlObject,
             KmlStyle,
             NodeTransformers,
             Polygon,
             Position,
             ShapeAttributes) {
    "use strict";

    /**
     * Constructs an KmlRegion. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlRegion
     * @classdesc Contains the data associated with Region node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing region in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#region
     */
    var KmlRegion = function (options) {
        KmlObject.call(this, options);
    };

    KmlRegion.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlRegion.prototype, {
        /**
         * A bounding box that describes an area of interest defined by geographic coordinates and altitudes.
         * Default values and required fields are as follows:
         * @memberof KmlRegion.prototype
         * @readonly
         * @type {KmlLatLonBox}
         */
        kmlLatLonAltBox: {
            get: function () {
                return this._factory.specific(this, {name: KmlLatLonAltBox.prototype.getTagNames(), transformer: NodeTransformers.kmlObject});
            }
        },

        /**
         * Lod is an abbreviation for Level of Detail. &lt;Lod&gt; describes the size of the projected region on the
         * screen that is required in order for the region to be considered "active." Also specifies the size of
         * the pixel ramp used for fading in (from transparent to opaque) and fading out (from opaque to
         * transparent). See diagram below for a visual representation of these parameters.
         * @memberof KmlRegion.prototype
         * @readonly
         * @type {KmlLod}
         */
        kmlLod: {
            get: function () {
                return this._factory.specific(this, {name: KmlLod.prototype.getTagNames(), transformer: NodeTransformers.kmlObject});
            }
        }
    });

	/**
	 * It tests whether the region intersects the visible area.
     * @param dc {DrawContext} Frustum to test for intersection.
     */
    KmlRegion.prototype.intersectsVisible = function(dc) {
        // Use BoundingBox and frustum in NavigatorState.
        // BoundingBox.prototype.intersectsFrustum(dc.navigatorState.frustumInModelCoordinates)
        // dc.navigatorState.frustumInModelCoordinates

        // Create a Polygon and see whether it intersects the current frustum.
        var box = this.kmlLatLonAltBox;
        if(!this._polygonRepresentationMin) {
            var minPositions = [
                new Position(box.kmlSouth, box.kmlEast, 10000),
                new Position(box.kmlNorth, box.kmlEast, 10000),
                new Position(box.kmlNorth, box.kmlWest, 10000),
                new Position(box.kmlSouth, box.kmlWest, 10000)
            ];
            var shapeAttributes = new ShapeAttributes(null);

            shapeAttributes.outlineColor = Color.RED; //new Color(0, 0, 0, 0);
            shapeAttributes.outlineWidth = 0;
            shapeAttributes.drawInterior = false;

            this._polygonRepresentationMin = new Polygon(minPositions, shapeAttributes);
        }

        this._polygonRepresentationMin.render(dc);
        return this._polygonRepresentationMin.intersectsFrustum(dc) &&
                (!box.kmlMinAltitude || dc.eyePosition.altitude > box.kmlMinAltitude) &&
                (!box.kmlMaxAltitude || dc.eyePosition.altitude < box.kmlMaxAltitude);
    };

    /**
     * @inheritDoc
     */
    KmlRegion.prototype.getTagNames = function () {
        return ['Region'];
    };

    KmlElements.addKey(KmlRegion.prototype.getTagNames()[0], KmlRegion);

    return KmlRegion;
});