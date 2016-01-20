/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports KmlGeometry
 */
define([
    '../../../util/extend',
    './../KmlObject'
], function (extend,
             KmlObject) {
    "use strict";
    /**
     * Constructs an KmlGeometry. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read.
     * @alias KmlGeometry
     * @constructor
     * @classdesc Contains the data associated with Kml geometry
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Geometry
     * @throws {ArgumentError} If either the node is null or the content of the Kml point contains invalid elements.
     * @see https://developers.google.com/kml/documentation/kmlreference#geometry
     * @augments KmlObject
     */
    var KmlGeometry = function (options) {
        KmlObject.call(this, options);

        extend(this, KmlGeometry.prototype);
    };

    /**
     * It returns actually applied style valid for current geometry.
     * @returns {KmlStyleSelector}
     */
    KmlGeometry.prototype.getAppliedStyle = function() {
        return this._style;
    };

    /**
     * Added prepareLocations hook.
     * @inheritDoc
     */
    KmlGeometry.prototype.beforeStyleResolution = function(options) {
        if(options.style) {
            this._style = options.style;
        }

        this.locations = this.prepareLocations();

        if(!this._layer && options.layer) {
            options.layer.addRenderable(this);
            this._layer = options.layer;
        }

        return true;
    };

    /**
     * @inheritDoc
     */
    KmlGeometry.prototype.getTagNames = function () {
        return ['Point', 'LinearRing', 'LineString', 'MultiGeometry', 'Polygon'];
    };

    return KmlGeometry;
});