/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
/**
 * @exports WktType
 */
define([], function () {
    /**
     * Enumerations used throughout the implementation of the WKT
     * @constructor
     * @alias WktType
     */
    var WktType = function () {};

    /**
     * Names of supported geometries.
     * @type {{LINE_STRING: string, MULTI_LINE_STRING: string, POLYGON: string, MULTI_POLYGON: string, POINT: string, MULTI_POINT: string, TRIANGLE: string, GEOMETRY_COLLECTION: string}}
     */
    WktType.SupportedGeometries = {
        LINE_STRING: 'LINESTRING',
        MULTI_LINE_STRING: 'MULTILINESTRING',
        POLYGON: 'POLYGON',
        MULTI_POLYGON: 'MULTIPOLYGON',
        POINT: 'POINT',
        MULTI_POINT: 'MULTIPOINT',
        TRIANGLE: 'TRIANGLE',
        GEOMETRY_COLLECTION: 'GEOMETRYCOLLECTION'
    };

    /**
     * Types of tokens from parsing the text.
     * @type {{LEFT_PARENTHESIS: number, COMMA: number, RIGHT_PARENTHESIS: number, NUMBER: number, TEXT: number}}
     */
    WktType.TokenType = {
        LEFT_PARENTHESIS: 0,
        COMMA: 1,
        RIGHT_PARENTHESIS: 2,
        NUMBER: 3,
        TEXT: 4
    };

    return WktType;
});