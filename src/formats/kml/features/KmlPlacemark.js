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
    '../KmlTimeSpan',
    '../KmlTimeStamp',
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
             KmlTimeSpan,
             KmlTimeStamp,
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
     * @param options {Object}
     * @param options.objectNode {Node} Node representing Placemark.
     * @constructor
     * @throws {ArgumentError} If the node is null.
     * @see https://developers.google.com/kml/documentation/kmlreference#placemark
     * @augments KmlFeature
     */
    var KmlPlacemark = function (options) {
        KmlFeature.call(this, options);

        var self = this;
        this._style = this.getStyle();
        this._style.then(function (styles) {
            if (!self.kmlGeometry) {
                // TODO: Show Placemarks without geometry.
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
     * @inheritDoc
     */
    KmlPlacemark.prototype.getAppliedStyle = function() {
        return this._style;
    };

    /**
     * First call the predecessor and then take care of moving the feature to different layer.
     * @inheritDoc
     */
    KmlPlacemark.prototype.beforeStyleResolution = function(options) {
        KmlFeature.prototype.beforeStyleResolution.call(this, options);

        // Add to the layer.
        // TODO Solve movement of the hierarchy into another layer
        if(this._layer == null) {
            this._layer = options.layer;
            this._layer.addRenderable(this);
        }

        return true;
    };

    /**
     * After style was resolved update the geometry for this placemark.
     * @inheritDoc
     */
    KmlPlacemark.prototype.afterStyleResolution = function(options) {
        this.position = this.kmlGeometry.kmlCenter;

        this.kmlGeometry.update(options);
    };

    /**
     * Prepare attributes for displaying the Placemark.
     * @param style {KmlStyle} Style altering the defaults.
     * @returns {PlacemarkAttributes} Attributes representing the current Placemark.
     */
    KmlPlacemark.prototype.prepareAttributes = function (style) {
        var options = style && style.generate() || {normal: {}, highlight:{}};
        var placemarkAttributes = new PlacemarkAttributes(KmlStyle.placemarkAttributes(options));

        placemarkAttributes.imageOffset = new Offset(
            WorldWind.OFFSET_FRACTION, 0.3,
            WorldWind.OFFSET_FRACTION, 0.0);
        placemarkAttributes.imageColor = Color.WHITE;
        placemarkAttributes.labelAttributes = new TextAttributes(KmlStyle.textAttributes({
            _offset: new Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 1.0),
            _color: Color.YELLOW
        }));
        placemarkAttributes.drawLeaderLine = true;
        placemarkAttributes.leaderLineAttributes = new ShapeAttributes(KmlStyle.shapeAttributes({
            outlineColor: Color.RED
        }));

        return placemarkAttributes;
    };

    /**
     * It takes properties from the KML definition and move them into the internal objects.
     */
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