'use strict';
define(function(){
    var polyline = {};

// Based off of [the offical Google document](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
//
// Some parts from [this implementation](http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/PolylineEncoder.js)
// by [Mark McClure](http://facstaff.unca.edu/mcmcclur/)

    /*
    * Copyright (c), Development Seed
     All rights reserved.

     Redistribution and use in source and binary forms, with or without modification,
     are permitted provided that the following conditions are met:

     - Redistributions of source code must retain the above copyright notice, this
     list of conditions and the following disclaimer.
     - Redistributions in binary form must reproduce the above copyright notice, this
     list of conditions and the following disclaimer in the documentation and/or
     other materials provided with the distribution.
     - Neither the name "Development Seed" nor the names of its contributors may be
     used to endorse or promote products derived from this software without
     specific prior written permission.

     THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
     ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
     ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
     LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
     ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
     SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    * */

    function encode(coordinate, factor) {
        coordinate = Math.round(coordinate * factor);
        coordinate <<= 1;
        if (coordinate < 0) {
            coordinate = ~coordinate;
        }
        var output = '';
        while (coordinate >= 0x20) {
            output += String.fromCharCode((0x20 | (coordinate & 0x1f)) + 63);
            coordinate >>= 5;
        }
        output += String.fromCharCode(coordinate + 63);
        return output;
    }

// This is adapted from the implementation in Project-OSRM
// https://github.com/DennisOSRM/Project-OSRM-Web/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
    polyline.decode = function(str, precision) {
        var index = 0,
            lat = 0,
            lng = 0,
            coordinates = [],
            shift = 0,
            result = 0,
            byte = null,
            latitude_change,
            longitude_change,
            factor = Math.pow(10, precision || 5);

        // Coordinates have variable length when encoded, so just keep
        // track of whether we've hit the end of the string. In each
        // loop iteration, a single coordinate is decoded.
        while (index < str.length) {

            // Reset shift, result, and byte
            byte = null;
            shift = 0;
            result = 0;

            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            shift = result = 0;

            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            lat += latitude_change;
            lng += longitude_change;

            coordinates.push([lat / factor, lng / factor]);
        }

        return coordinates;
    };

    polyline.encode = function(coordinates, precision) {
        if (!coordinates.length) { return ''; }

        var factor = Math.pow(10, precision || 5),
            output = encode(coordinates[0][0], factor) + encode(coordinates[0][1], factor);

        for (var i = 1; i < coordinates.length; i++) {
            var a = coordinates[i], b = coordinates[i - 1];
            output += encode(a[0] - b[0], factor);
            output += encode(a[1] - b[1], factor);
        }

        return output;
    };

    polyline.fromGeoJSON = function(geojson, precision) {
        if (geojson && geojson.type === 'Feature') {
            geojson = geojson.geometry;
        }
        if (!geojson || geojson.type !== 'LineString') {
            throw new Error('Input must be a GeoJSON LineString');
        }
        var coords = geojson.coordinates;
        var flipped = [];
        for (var i = 0; i < coords.length; i++) {
            flipped.push(coords[i].slice().reverse());
        }
        return polyline.encode(flipped, precision);
    };

    return polyline
})
