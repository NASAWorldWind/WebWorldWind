/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @export KmlPlacemark
 */
define([
    '../../../util/extend',
    './../KmlElements',
    './KmlFeature',
    '../geom/KmlGeometry',
    '../styles/KmlIconStyle',
    '../styles/KmlLabelStyle',
    '../../../shapes/PlacemarkAttributes',
    '../../../shapes/Placemark',
    '../../../util/Color',
    '../../../util/Offset'
], function (extend,
             KmlElements,
             KmlFeature,
             KmlGeometry,
             KmlIconStyle,
             KmlLabelStyle,
             PlacemarkAttributes,
             Placemark,
             Color,
             Offset) {
    "use strict";
    /**
     * Constructs an KmlPlacemark. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from Kml file are read
     * @alias KmlPlacemark
     * @classdesc Contains the data associated with KmlPlacemark.
     * @param placemarkNode {Node} Node representing Kml Placemark
     * @param pStyle {Promise} Promise of a style to be delivered later.
     * @constructor
     * @throws {ArgumentError} If the node is null.
     * @see https://developers.google.com/kml/documentation/kmlreference#placemark
     */
    var KmlPlacemark = function (placemarkNode, pStyle) {
        KmlFeature.call(this, placemarkNode);

        pStyle.then(function (style) {

        });
        this._style = pStyle;

        Object.defineProperties(this, {
            /**
             * It contains geometry associated with this placemark. The geometry is cached.
             * @memberof KmlPlacemark.prototype
             * @type {KmlGeometry}
             * @readonly
             */
            geometry: {
                get: function () {
                    return this.createChildElement({
                        name: KmlGeometry.prototype.getTagNames()
                    });
                }
            }
        });

        extend(this, KmlPlacemark.prototype);
    };

    KmlPlacemark.prototype = Object.create(Placemark.prototype);

    /**
     * It renders placemark with associated geometry.
     * @param layer {Layer} Layer into which the placemark may be rendered.
     * @param style {Promise} Promise of style, which will be eventually delivered.
     */
    KmlPlacemark.prototype.update = function (layer, style) {
        if (!this.geometry) {
            // For now don't display Placemarks without geometries.
            return;
        }
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

        layer.addRenderable(this);

        this.geometry.update(layer, this.StyleSelector);
    };

    /**
     * Returns tag name of this Node.
     * @returns {String[]}
     */
    KmlPlacemark.prototype.getTagNames = function () {
        return ['Placemark'];
    };

    KmlElements.addKey(KmlPlacemark.prototype.getTagNames()[0], KmlPlacemark);

    return KmlPlacemark;
});