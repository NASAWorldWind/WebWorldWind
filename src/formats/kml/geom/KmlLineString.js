/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
        '../../../util/Color',
        './KmlGeometry',
        '../../../geom/Location',
        '../../../geom/Position',
        '../../../shapes/ShapeAttributes',
        '../../../shapes/SurfacePolyline',
        '../KmlElements',
        '../../../util/WWUtil'
    ],
    function (Color,
              KmlGeometry,
              Location,
              Position,
              ShapeAttributes,
              SurfacePolyline,
              KmlElements,
              WWUtil
    ) {
        "use strict";

        /**
         * Constructs an KmlLineString object.  Applications shouldn't use this constructor. It is used by
         * {@link KmlFile}. KmlLineString represents one line string.
         * @param lineStringNode {Node} Node representing this line string.
         * @constructor
         * @alias KmlLineString
         * @classdesc Class representing LineString element of KmlFile
         * @see https://developers.google.com/kml/documentation/kmlreference#linestring
         */
        var KmlLineString = function (lineStringNode) {
            KmlGeometry.call(this, lineStringNode);

            Object.defineProperties(KmlLineString.prototype, {
                /**
                 * Whether current shape should be extruded.
                 * @memberof KmlLineString.prototype
                 * @readonly
                 * @type {Boolean}
                 */
                extrude: {
                    get: function() {
                        return this.retrieve({name: 'extrude', transformer: Boolean}) || false;
                    }
                },

                /**
                 * Whether tessellation should be used for current node.
                 * @memberof KmlLineString.prototype
                 * @readonly
                 * @type {Boolean}
                 */
                tessellate: {
                    get: function() {
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
                altitudeMode: {
                    get: function() {
                        return this.retrieve({name: 'altitudeMode'}) || WorldWind.ABSOLUTE;
                    }
                },

                /**
                 * Positions representing points used by the LineString.
                 * @memberof KmlLineString.prototype
                 * @readonly
                 * @type {Array}
                 */
                positions: {
                    get: function() {
                        var points = [];
                        var coordinates = this.retrieve({name: 'coordinates'}).split(' ');
                        coordinates.forEach(function(coordinates){
                            coordinates = coordinates.split(',');
                            points.push(new Position(Number(coordinates[1]), Number(coordinates[0]), Number(coordinates[2])));
                        });
                        return points;
                    }
                },

                /**
                 * Returns average of the positions, which are part of the LineString. It averages also the altitudes.
                 * @memberof KmlLineString.prototype
                 * @readonly
                 * @type {Position}
                 */
                kmlCenter: {
                    get: function() {
                        // TODO choose better approximation than just plain average.
                        var positions = this.positions;
                        var midLatitude = 0;
                        var midLongitude = 0;
                        var midAltitude = 0;
                        positions.forEach(function(position){
                            midLatitude += position.latitude;
                            midLongitude += position.longitude;
                            midAltitude += position.altitude;
                        });
                        return new Position(
                            midLatitude / this.positions.length,
                            midLongitude / this.positions.length,
                            midAltitude / this.positions.length
                        );
                    }
                }
            });
        };

        /**
         * Renders LineString as Path.
         * @param layer Layer into which will be the shape rendered.
         */
        KmlLineString.prototype.update = function(layer) {
            // TODO modify to update using path.
            var attributes = new ShapeAttributes(null);
            attributes.outlineColor = Color.WHITE;
            attributes.interiorColor = Color.WHITE;
            attributes.outlineWidth = 1;

            var locations = this.positions.map(function(position){return new Location(position.latitude, position.longitude)});
            this._shape = new SurfacePolyline(locations, attributes);
            layer.addRenderable(this._shape);
        };

        /**
         * Two line strings are equal when the properties and positions are equal.
         * @param toCompare LineString to compare to.
         * @returns {Boolean}
         */
        KmlLineString.prototype.equals = function(toCompare) {
            if(!toCompare) {
                return false;
            }
            var positionsEquals = WWUtil.arrayEquals(toCompare.positions, this.positions);
            return positionsEquals && toCompare.extrude == this.extrude && toCompare.tessellate == this.tessellate &&
                    toCompare.altitudeMode == this.altitudeMode;
        };

        KmlLineString.prototype.getTagNames = function() {
            return ['LineString'];
        };

        KmlElements.addKey(KmlLineString.prototype.getTagNames()[0], KmlLineString);

        return KmlLineString;
    });