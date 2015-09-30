/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @export KmlPlacemark
 */
define([
    './KmlElements',
    './KmlFeature',
    './KmlGeometry',
    '../../shapes/PlacemarkAttributes',
    '../../shapes/Placemark',
    '../../util/Color',
    '../../util/Offset'
], function (
    KmlElements,
    KmlFeature,
    KmlGeometry,
    PlacemarkAttributes,
    Placemark,
    Color,
    Offset
) {
    "use strict";
    /**
     * Constructs an KmlPlacemark. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from Kml file are read
     * @alias KmlPlacemark
     * @classdesc Contains the data associated with KmlPlacemark.
     * @param placemarkNode Node representing Kml Placemark
     * @constructor
     * @throws {ArgumentError} If the node is null.
     */
    var KmlPlacemark = function (placemarkNode) {
        KmlFeature.call(this, placemarkNode);
    };

    KmlPlacemark.prototype = Object.create(KmlFeature.prototype);

    Object.defineProperties(KmlPlacemark.prototype, {
        /**
         * It contains geometry associated with this placemark. The geometry is cached.
         * @memberof KmlPlacemark.prototype
         * @type {KmlGeometry}
         * @readonly
         */
        geometry: {
            get: function(){
                return this.createChildElement({
                    name: KmlGeometry.prototype.tagName
                });
            }
        },

        /**
         * Array of the tag names representing Kml placemark.
         * @memberof KmlPlacemark.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['Placemark'];
            }
        }
    });

    /**
     * It renders placemark with associated geometry.
     * @param layer Layer into which the placemark may be rendered.
     */
    KmlPlacemark.prototype.render = function(layer, style) {
        // Work correctly with styles.
        var placemarkAttributes = new PlacemarkAttributes(null);
        KmlIconStyle.render(style && style.IconStyle, placemarkAttributes);
        KmlLabelStyle.render(style && style.LabelStyle, placemarkAttributes);

        placemarkAttributes.imageScale = 1;
        placemarkAttributes.imageOffset = new Offset(
            WorldWind.OFFSET_FRACTION, 0.3,
            WorldWind.OFFSET_FRACTION, 0.0);
        placemarkAttributes.imageColor = Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.labelAttributes.color = Color.YELLOW;
        placemarkAttributes.drawLeaderLine = true;
        placemarkAttributes.leaderLineAttributes.outlineColor = Color.RED;

        var placemark = new Placemark(this.geometry.center, true, placemarkAttributes);
        placemark.label = this.description;
        placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

        layer.addRenderable(placemark);

        this.geometry.render(layer, this.style);
    };

    KmlElements.addKey(KmlPlacemark.prototype.tagName[0], KmlPlacemark);

    return KmlPlacemark;
});