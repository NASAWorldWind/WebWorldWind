/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WKTType
 */
define([], function () {
    /**
     *
     * @constructor
     */
    var WKTType = function () {};

    /**
     *
     * @type {{LINE_STRING: string, MULTI_LINE_STRING: string, POLYGON: string, MULTI_POLYGON: string, POINT: string, MULTI_POINT: string, TRIANGLE: string, GEOMETRY_COLLECTION: string}}
     */
    WKTType.SupportedGeometries = {
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
     *
     * @type {{LEFT_PARENTHESIS: number, COMMA: number, RIGHT_PARENTHESIS: number, NUMBER: number, TEXT: number}}
     */
    WKTType.TokenType = {
        LEFT_PARENTHESIS: 0,
        COMMA: 1,
        RIGHT_PARENTHESIS: 2,
        NUMBER: 3,
        TEXT: 4
    };

    return WKTType;
});