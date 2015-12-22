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
         * @param lineStringNode {Node} Node representing this line string.
         * @param pStyle {Promise} Promise of style.
         * @constructor
         * @alias KmlLineString
         * @classdesc Class representing LineString element of KmlFile
         * @see https://developers.google.com/kml/documentation/kmlreference#linestring
         */
        var KmlLineString = function (lineStringNode, pStyle) {
            KmlGeometry.call(this, lineStringNode);

            var self = this;
            pStyle.then(function(styles){
                Path.call(self, self.prepareLocations(), self.prepareAttributes(styles.normal));
                self.moveValidProperties();
            });
            this._style = pStyle;
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
         * Renders LineString as Path.
         * @param layer {Layer} Layer into which will be the shape rendered.
         * @param pStyle {Promise} Promise of the style to be delivered.
         */
        KmlLineString.prototype.update = function(layer, pStyle) {
            var self = this;
            if(pStyle) {
                this._style = pStyle;
            }
            this._style.then(function(styles){
                var normal = styles.normal;
                var highlight = styles.highlight;

                var normalAttributes = self.prepareAttributes(normal);
                self.attributes = normalAttributes;
                self.highlightAttributes = highlight ? self.prepareAttributes(highlight): normalAttributes;

                self.locations = self.prepareLocations();
                self.moveValidProperties();

                if (self._layer != null) {
                    self._layer.removeRenderable(self);
                }
                layer.addRenderable(self);
                self._layer = layer;
            });
        };

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

        KmlLineString.prototype.prepareLocations = function() {
            return this.kmlPositions;
        };

        KmlLineString.prototype.moveValidProperties = function() {
            this.extrude = this.kmlExtrude || false;
            this.altitudeMode = this.kmlAltitudeMode || WorldWind.ABSOLUTE;
            //noinspection JSUnusedGlobalSymbols
            this.tesselate = this.kmlTesselate || false;
        };

        /**
         * Two line strings are equal when the properties and positions are equal.
         * @param toCompare LineString to compare to.
         * @returns {Boolean}
         */
        KmlLineString.prototype.equals = function (toCompare) {
            if (!toCompare) {
                return false;
            }
            var positionsEquals = WWUtil.arrayEquals(toCompare.positions, this.kmlPositions);
            return positionsEquals && toCompare.extrude == this.kmlExtrude && toCompare.tessellate == this.kmlTessellate &&
                toCompare.altitudeMode == this.kmlAltitudeMode;
        };

        /**
         * Returns tag name of this Node.
         * @returns {String[]}
         */
        KmlLineString.prototype.getTagNames = function () {
            return ['LineString'];
        };

        KmlElements.addKey(KmlLineString.prototype.getTagNames()[0], KmlLineString);

        return KmlLineString;
    });