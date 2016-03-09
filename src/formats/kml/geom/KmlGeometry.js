/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports KmlGeometry
 */
define([
    './../KmlObject'
], function (KmlObject) {
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

        this._renderable = null;
    };

    KmlGeometry.prototype = Object.create(KmlObject.prototype);

    /**
     * It returns actually applied style valid for current geometry.
     * @returns {KmlStyleSelector}
     */
    KmlGeometry.prototype.getAppliedStyle = function() {
        return this._style;
    };

    /**
     * Hook to be overridden by the descendants.
     */
    KmlGeometry.prototype.prepareLocations = function() {return null;};

    /**
     * Added prepareLocations hook.
     * @inheritDoc
     */
    KmlGeometry.prototype.beforeStyleResolution = function(options) {
        if(options.style) {
            this._style = options.style;
        }

        // TODO: Prepare locations should be hook.
        this.locations = this.prepareLocations();

        return true;
    };

    /**
     * @inheritDoc
     */
    KmlGeometry.prototype.afterStyleResolution = function(options) {
        if(this._renderable) {
            this._renderable.render(options.dc);
        }
    };

    /**
     * @inheritDoc
     */
    KmlGeometry.prototype.getTagNames = KmlGeometry.getTagNames = function () {
        return ['Point', 'LinearRing', 'LineString', 'MultiGeometry', 'Polygon'];
    };

    return KmlGeometry;
});