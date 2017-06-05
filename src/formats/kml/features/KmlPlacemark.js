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
    '../styles/KmlStyle',
    '../KmlTimeSpan',
    '../KmlTimeStamp',
    '../../../shapes/PlacemarkAttributes',
    '../../../shapes/Placemark',
    '../../../util/Color',
    '../../../shapes/ShapeAttributes',
    '../../../shapes/TextAttributes',
    '../../../util/Offset',
    '../../../util/WWUtil'
], function (KmlElements,
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
             Offset,
             WWUtil) {
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
    };

    KmlPlacemark.prototype = Object.create(KmlFeature.prototype);

    Object.defineProperties(KmlPlacemark.prototype, {
        /**
         * It contains geometry associated with this placemark. The geometry is cached.
         * @memberof KmlPlacemark.prototype
         * @type {KmlGeometry}
         * @readonly
         */
        kmlGeometry: {
            get: function () {
                return this._factory.any(this, {
                    name: KmlGeometry.prototype.getTagNames()
                });
            }
        }
    });

    KmlPlacemark.prototype.render = function(dc, kmlOptions) {
        KmlFeature.prototype.render.call(this, dc, kmlOptions);

        kmlOptions = WWUtil.clone(kmlOptions);

        if(kmlOptions.lastStyle && !this._renderable) {
            // TODO: render placemarks without geometry.
            if (this.kmlGeometry) {
                this._renderable = new Placemark(
                    this.kmlGeometry.kmlCenter,
                    false,
                    this.prepareAttributes(kmlOptions.lastStyle.normal)
                );
                if(kmlOptions.lastStyle.highlight) {
                    this._renderable.highlightAttributes = this.prepareAttributes(kmlOptions.lastStyle.highlight);
                }
                this.moveValidProperties();
                dc.redrawRequested = true;
            }
        }
        
        if(this._renderable) {
            if (this.kmlGeometry) {
                this.kmlGeometry.render(dc, kmlOptions);
                this._renderable.render(dc);
            }
        }
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
        this._renderable.label = this.kmlName || '';
        this._renderable.altitudeMode = this.kmlAltitudeMode || WorldWind.RELATIVE_TO_GROUND;
        this._renderable.enableLeaderLinePicking = true;
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