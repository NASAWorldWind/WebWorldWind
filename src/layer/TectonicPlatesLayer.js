/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports TectonicPlatesLayer
 */
define([
    '../error/ArgumentError',
    '../util/Color',
    '../geom/Location',
    '../util/Logger',
    '../layer/RenderableLayer',
    '../shapes/ShapeAttributes',
    '../shapes/SurfacePolygon'
], function (ArgumentError,
             Color,
             Location,
             Logger,
             RenderableLayer,
             ShapeAttributes,
             SurfacePolygon) {
    "use strict";

    /**
     * Constructs a layer showing the Earth's tectonic plates.
     * @alias TectonicPlatesLayer
     * @constructor
     * @classdesc Provides a layer showing the Earth's tectonic plates. The plates are drawn as
     * [SurfacePolygons]{@link SurfacePolygon}.
     * @param {ShapeAttributes} shapeAttributes The attributes to use when drawing the plates.
     * May be null or undefined, in which case the shapes are drawn using default attributes.
     * The default attributes draw only the outlines of the plates, in a solid color.
     * @augments RenderableLayer
     */
    var TectonicPlatesLayer = function (shapeAttributes) {
        RenderableLayer.call(this, "Tectonic Plates");

        if (shapeAttributes) {
            this._attributes = shapeAttributes;
        } else {
            this._attributes = new ShapeAttributes(null);
            this._attributes.drawInterior = false;
            this._attributes.drawOutline = true;
            this._attributes.outlineColor = Color.RED;
        }

        this.loadPlateData();
    };

    TectonicPlatesLayer.prototype = Object.create(RenderableLayer.prototype);

    Object.defineProperties(SurfacePolygon.prototype, {
        /**
         * The attributes to use when drawing the plates.
         * @type {ShapeAttributes}
         * @memberof TectonicPlatesLayer.prototype
         */
        attributes: {
            get: function () {
                return this._attributes;
            },
            set: function (value) {
                if (value) {
                    this.renderables.map(function (shape, index, shapes){
                        shape.attributes = value;
                    });
                }
            }
        }
    });

    TectonicPlatesLayer.prototype.loadPlateData = function () {
        var url = "http://worldwindserver.net/webworldwind/data/TectonicPlates.json";

        var xhr = new XMLHttpRequest();

        xhr.open("GET", url, true);
        xhr.onreadystatechange = (function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    this.parse(xhr.responseText);
                }
                else {
                    Logger.log(Logger.LEVEL_WARNING,
                        "Tectonic plate data retrieval failed (" + xhr.statusText + "): " + url);
                }
            }
        }).bind(this);

        xhr.onerror = function () {
            Logger.log(Logger.LEVEL_WARNING, "Tectonic plate data retrieval failed: " + url);
        };

        xhr.ontimeout = function () {
            Logger.log(Logger.LEVEL_WARNING, "Tectonic plate data retrieval timed out: " + url);
        };

        xhr.send(null);
    };

    TectonicPlatesLayer.prototype.parse = function (jsonText) {
        var plateData = JSON.parse(jsonText);

        var self = this;
        plateData.features.map(function(feature, featureIndex, features) {
            var locations = [];
            feature.geometry.coordinates.map(function(coordinate, geometryIndex, coordinates) {
                locations.push(new Location(coordinate[1], coordinate[0]));
            });

            var polygon = new SurfacePolygon(locations, self._attributes);

            self.addRenderable(polygon);
        });
    };

    return TectonicPlatesLayer;
});