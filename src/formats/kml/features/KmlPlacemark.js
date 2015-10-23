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
], function (
    extend,
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
     * @param pStyle Promise of the style to be delivered.
     * @constructor
     * @throws {ArgumentError} If the node is null.
     * @see https://developers.google.com/kml/documentation/kmlreference#placemark
     */
    var KmlPlacemark = function (placemarkNode, pStyle) {
        var self = this;
        KmlFeature.call(this, placemarkNode);

        pStyle.then(function(style){
            Placemark.call(self, self.geometry.kmlCenter, self.prepareAttributes(style));
            self.moveValidProperties();
        });
        this._style = pStyle;
        this._layer = null;

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

        extend(this, KmlPlacemark.prototype);
    };

    KmlPlacemark.prototype = Object.create(Placemark.prototype);

    /**
     * It renders placemark with associated geometry.
     * @param layer Layer into which the placemark may be rendered.
     */
    KmlPlacemark.prototype.update = function(layer) {
        if(!this.geometry) {
            // For now don't display Placemarks without geometries.
            return;
        }
        // Work correctly with styles.
        var self = this;
        this._style.then(function(style){
            var placemarkAttributes = self.prepareAttributes(style);

            var placemark = new Placemark(self.geometry.kmlCenter, true, placemarkAttributes);
            placemark.label = self.description;
            placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

            if(this._layer != null) {
                this._layer.removeRenderable(self);
            }
            this._layer = layer;
            this._layer.addRenderable(self);

            self.geometry.update(layer, self.getStyle());
        });
    };

    KmlPlacemark.prototype.prepareAttributes = function(style) {
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

        return placemarkAttributes;
    };

    KmlPlacemark.prototype.moveValidProperties = function() {
        // To be finished later.
    };

    KmlPlacemark.prototype.getTagNames = function() {
        return ['Placemark'];
    };

    KmlElements.addKey(KmlPlacemark.prototype.getTagNames()[0], KmlPlacemark);

    return KmlPlacemark;
});