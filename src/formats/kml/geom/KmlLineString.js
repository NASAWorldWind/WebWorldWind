/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
        '../../../util/Color',
        '../../../util/extend',
        './KmlGeometry',
        '../styles/KmlStyle',
        '../../../geom/Location',
        '../../../geom/Position',
        '../../../shapes/ShapeAttributes',
        '../../../shapes/Path',
        '../KmlElements',
        '../../../util/WWUtil'
    ],
    function (Color,
              extend,
              KmlGeometry,
              KmlStyle,
              Location,
              Position,
              ShapeAttributes,
              Path,
              KmlElements,
              WWUtil
    ) {
        "use strict";

        /**
         * Constructs an KmlLineString object.  Applications shouldn't use this constructor. It is used by
         * {@link KmlFile}. KmlLineString represents one line string.
         * @param options {Object}
         * @param options.objectNode {Node} Node representing LineString.
         * @param options.style {Promise} Promise of style to be applied to current geometry
         * @constructor
         * @alias KmlLineString
         * @classdesc Class representing LineString element of KmlFile
         * @see https://developers.google.com/kml/documentation/kmlreference#linestring
         * @augments KmlGeometry
         */
        var KmlLineString = function (options) {
            KmlGeometry.call(this, options);

            var self = this;
            options.style.then(function(styles){
                self.createPath(styles);
            });
            this._style = options.style;
            this._layer = null;

            Object.defineProperties(this, {
                /**
                 * Whether current shape should be extruded.
                 * @memberof KmlLineString.prototype
                 * @readonly
                 * @type {Boolean}
                 */
                kmlExtrude: {
                    get: function () {
                        return this.retrieve({name: 'extrude', transformer: Boolean}) || false;
                    }
                },

                /**
                 * Whether tessellation should be used for current node.
                 * @memberof KmlLineString.prototype
                 * @readonly
                 * @type {Boolean}
                 */
                kmlTessellate: {
                    get: function () {
                        return this.retrieve({name: 'tessellate', transformer: Boolean}) || false;
                    }
                },

                /**
                 * It represents different modes to count absolute altitude. Possible choices are explained in:
                 * https://developers.google.com/kml/documentation/kmlreference#point
                 * @memberof KmlLineString.prototype
                 * @readonly
                 * @type {String}
                 */
                kmlAltitudeMode: {
                    get: function () {
                        return this.retrieve({name: 'altitudeMode'}) || WorldWind.ABSOLUTE;
                    }
                },

                /**
                 * Positions representing points used by the LineString.
                 * @memberof KmlLineString.prototype
                 * @readonly
                 * @type {Position[]}
                 */
                kmlPositions: {
                    get: function() {
                        var positions = [];
                        var coordinates = this.retrieve({name: 'coordinates'}).trim().replace(/\s+/g, ' ').split(' ');
                        coordinates.forEach(function(pCoordinates){
                            pCoordinates = pCoordinates.split(',');
                            positions.push(new Position(Number(pCoordinates[1]), Number(pCoordinates[0]), Number(pCoordinates[2] || 0)));
                        });
                        return positions;
                    }
                },

                /**
                 * Returns average of the positions, which are part of the LineString. It averages also the altitudes.
                 * @memberof KmlLineString.prototype
                 * @readonly
                 * @type {Position}
                 */
                kmlCenter: {
                    get: function () {
                        // TODO choose better approximation than just plain average.
                        var positions = this.kmlPositions;
                        var midLatitude = 0;
                        var midLongitude = 0;
                        var midAltitude = 0;
                        positions.forEach(function (position) {
                            midLatitude += position.latitude;
                            midLongitude += position.longitude;
                            midAltitude += position.altitude;
                        });
                        return new Position(
                            midLatitude / this.kmlPositions.length,
                            midLongitude / this.kmlPositions.length,
                            midAltitude / this.kmlPositions.length
                        );
                    }
                }
            });

            extend(this, KmlLineString.prototype);
        };

        KmlLineString.prototype = Object.create(Path.prototype);

        /**
         * It creates Path representing this LineString unless already initialized.
         * @param styles {Object}
         * @param styles.normal {KmlStyle} Style applied when item not highlighted
         * @param styles.highlight {KmlStyle} Style applied when item is highlighted
         */
        KmlLineString.prototype.createPath = function(styles) {
            if(!this.initialized) {
                Path.call(this, this.prepareLocations(), this.prepareAttributes(styles.normal));
                this.moveValidProperties();
                this.initialized = true;
            }
        };

        /**
         * @inheritDoc
         */
        KmlLineString.prototype.styleResolutionStarted = function(styles) {
            this.createPath(styles);
        };

        /**
         * @inheritDoc
         */
        KmlLineString.prototype.prepareAttributes = function(style){
            var shapeOptions = style && style.generate() || {};

            shapeOptions._applyLighting = true;
            shapeOptions._drawOutline = true;
            shapeOptions._drawInterior = true;
            shapeOptions._drawVerticals = this.kmlExtrude || false;
            shapeOptions._outlineStippleFactor = 0;
            shapeOptions._outlineStipplePattern = 61680;
            shapeOptions._enableLighting = true;

            return new ShapeAttributes(KmlStyle.shapeAttributes(shapeOptions));
        };

        /**
         * Prepare locations representing current Line String.
         * @returns {Position[]} Positions representing this LineString.
         */
        KmlLineString.prototype.prepareLocations = function() {
            return this.kmlPositions;
        };

        /**
         * Moves KML properties from current object into the internal shape representation.
         */
        KmlLineString.prototype.moveValidProperties = function() {
            this.extrude = this.kmlExtrude || false;
            this.altitudeMode = this.kmlAltitudeMode || WorldWind.ABSOLUTE;
            //noinspection JSUnusedGlobalSymbols
            this.tesselate = this.kmlTesselate || false;
        };

        /**
         * Two line strings are equal when the properties and positions are equal.
         * @param toCompare {KmlLineString} LineString to compare to.
         * @returns {Boolean} True if the LineStrings are equal.
         */
        KmlLineString.prototype.equals = function (toCompare) {
            if (!toCompare) {
                return false;
            }
            var positionsEquals = WWUtil.arrayEquals(toCompare.kmlPositions, this.kmlPositions);
            return positionsEquals && toCompare.kmlExtrude == this.kmlExtrude && toCompare.kmlTessellate == this.kmlTessellate &&
                toCompare.kmlAltitudeMode == this.kmlAltitudeMode;
        };

        /**
         * @inheritDoc
         */
        KmlLineString.prototype.getTagNames = function () {
            return ['LineString'];
        };

        KmlElements.addKey(KmlLineString.prototype.getTagNames()[0], KmlLineString);

        return KmlLineString;
    });