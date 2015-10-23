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
    var KmlPlacemark = function (placemarkNode) {
        KmlFeature.call(this, placemarkNode);

        var self = this;
        this._style = this.getStyle();
        this._style.then(function(style){
            Placemark.call(self, self.kmlGeometry.kmlCenter, true, self.prepareAttributes(style));
            self.moveValidProperties();
        });
        this._layer = null;

        Object.defineProperties(this, {
            /**
             * It contains geometry associated with this placemark. The geometry is cached.
             * @memberof KmlPlacemark.prototype
             * @type {KmlGeometry}
             * @readonly
             */
            kmlGeometry: {
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
        var self = this;
        if(!self.kmlGeometry) {
            // For now don't display Placemarks without geometries.
            return;
        }
        // Work correctly with styles.
        this._style.then(function(style){
            self.attributes = self.prepareAttributes(style);
            self.position = self.kmlGeometry.kmlCenter;
            self.moveValidProperties();

            if(self._layer != null) {
                self._layer.removeRenderable(self);
            }
            self._layer = layer;
            self._layer.addRenderable(self);

            self.kmlGeometry.update(layer, self.getStyle());
        });
    };

    KmlPlacemark.prototype.prepareAttributes = function(style) {
        var placemarkAttributes = new PlacemarkAttributes(null);
        KmlIconStyle.update(style && style.kmlIconStyle, placemarkAttributes);
        KmlLabelStyle.update(style && style.kmlLabelStyle, placemarkAttributes);

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
        this.label = this.kmlName || '';
        this.altitudeMode = this.kmlAltitudeMode || WorldWind.RELATIVE_TO_GROUND;

        // Visualize the icons if present.
    };

    KmlPlacemark.prototype.getTagNames = function() {
        return ['Placemark'];
    };

    KmlElements.addKey(KmlPlacemark.prototype.getTagNames()[0], KmlPlacemark);

    return KmlPlacemark;
});