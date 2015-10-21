/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @export KmlPlacemark
 */
define([
    './../KmlElements',
    './KmlFeature',
    '../geom/KmlGeometry',
    '../styles/KmlIconStyle',
    '../styles/KmlLabelStyle',
    '../../../shapes/PlacemarkAttributes',
    '../../../shapes/Placemark',
    '../../../util/Color',
    '../../../util/Offset'
], function (
    KmlElements,
    KmlFeature,
    KmlGeometry,
    KmlIconStyle,
    KmlLabelStyle,
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
     * @see https://developers.google.com/kml/documentation/kmlreference#placemark
     */
    var KmlPlacemark = function (placemarkNode) {
        KmlFeature.call(this, placemarkNode);

        Object.defineProperties(this, {
            /**
             * It contains geometry associated with this placemark. The geometry is cached.
             * @memberof KmlPlacemark.prototype
             * @type {KmlGeometry}
             * @readonly
             */
            geometry: {
                get: function(){
                    return this.createChildElement({
                        name: KmlGeometry.prototype.getTagNames()
                    });
                }
            }
        });

        // TODO use extend instead.
        for (var key in KmlPlacemark.prototype) {
            if (KmlPlacemark.prototype.hasOwnProperty(key)) {
                this[key] = KmlPlacemark.prototype[key];
            }
        }
    };

    /**
     * It renders placemark with associated geometry.
     * @param layer Layer into which the placemark may be rendered.
     */
    KmlPlacemark.prototype.update = function(layer, style) {
        // Work correctly with styles.
        var placemarkAttributes = new PlacemarkAttributes(null);
        KmlIconStyle.update(style && style.IconStyle, placemarkAttributes);
        KmlLabelStyle.update(style && style.LabelStyle, placemarkAttributes);

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

        var placemark = new Placemark(this.geometry.kmlCenter, true, placemarkAttributes);
        placemark.label = this.description;
        placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

        layer.addRenderable(placemark);

        this.geometry.update(layer, this.StyleSelector);
    };

    KmlPlacemark.prototype.getTagNames = function() {
        return ['Placemark'];
    };

    KmlElements.addKey(KmlPlacemark.prototype.getTagNames()[0], KmlPlacemark);

    return KmlPlacemark;
});