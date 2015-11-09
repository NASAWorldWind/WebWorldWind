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
    '../styles/KmlStyle',
    '../../../shapes/PlacemarkAttributes',
    '../../../shapes/Placemark',
    '../../../util/Color',
    '../../../shapes/ShapeAttributes',
    '../../../shapes/TextAttributes',
    '../../../util/Offset'
], function (extend,
             KmlElements,
             KmlFeature,
             KmlGeometry,
             KmlStyle,
             PlacemarkAttributes,
             Placemark,
             Color,
             ShapeAttributes,
             TextAttributes,
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
    var KmlPlacemark = function (placemarkNode) {
        KmlFeature.call(this, placemarkNode);

        var self = this;
        this._style = this.getStyle();
        this._style.then(function (styles) {
            if (!self.kmlGeometry) {
                // For now don't display Placemarks without geometries.
                return;
            }
            Placemark.call(self, self.kmlGeometry.kmlCenter, false, self.prepareAttributes(styles.normal));
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
     */
    KmlPlacemark.prototype.update = function (layer) {
        var self = this;
        if (!self.kmlGeometry) {
            // For now don't display Placemarks without geometries.
            return;
        }
        // Work correctly with styles.
        this._style.then(function (styles) {
            var normal = styles.normal;
            var highlight = styles.highlight;

            self.attributes = self.prepareAttributes(normal);
            self.highlightAttributes = highlight ? self.prepareAttributes(highlight): null;
            self.position = self.kmlGeometry.kmlCenter;
            self.moveValidProperties();

            if (self._layer != null) {
                self._layer.removeRenderable(self);
            }
            self._layer = layer;
            self._layer.addRenderable(self);

            self.kmlGeometry.update(layer, self.getStyle());
        });
    };

    KmlPlacemark.prototype.prepareAttributes = function (style) {
        var options = style && style.generate() || {normal: {}, highlight:{}};
        var placemarkAttributes = new PlacemarkAttributes(options);

        placemarkAttributes.imageOffset = new Offset(
            WorldWind.OFFSET_FRACTION, 0.3,
            WorldWind.OFFSET_FRACTION, 0.0);
        placemarkAttributes.imageColor = Color.WHITE;
        placemarkAttributes.labelAttributes = new TextAttributes({
            _offset: new Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 1.0),
            _color: Color.YELLOW
        });
        placemarkAttributes.drawLeaderLine = true;
        placemarkAttributes.leaderLineAttributes = new ShapeAttributes({
            outlineColor: Color.RED
        });

        return placemarkAttributes;
    };

    KmlPlacemark.prototype.moveValidProperties = function () {
        this.label = this.kmlName || '';
        this.altitudeMode = this.kmlAltitudeMode || WorldWind.RELATIVE_TO_GROUND;
        this.enableLeaderLinePicking = true;
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