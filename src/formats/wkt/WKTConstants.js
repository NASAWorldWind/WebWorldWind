/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports WKTConstants
 */
define([],
    function() {
        "use strict";

        /**
         * Provides WKT string constants.
         * @alias WKTConstants
         * @constructor
         * @classdesc Contains some WKT string constants.
         */
        var WKTConstants = function () {};

        WKTConstants.FIELD_TYPE = "type";
        WKTConstants.FIELD_CRS = "crs";
        WKTConstants.FIELD_NAME = "name";
        WKTConstants.FIELD_BBOX = "bbox";
        WKTConstants.FIELD_COORDINATES = "coordinates";
        WKTConstants.FIELD_GEOMETRIES = "geometries";
        WKTConstants.FIELD_GEOMETRY = "geometry";
        WKTConstants.FIELD_PROPERTIES = "properties";
        WKTConstants.FIELD_FEATURES = "features";
        WKTConstants.FIELD_ID = "id";

        WKTConstants.TYPE_POINT = "Point";
        WKTConstants.TYPE_MULTI_POINT = "MultiPoint";
        WKTConstants.TYPE_LINE_STRING = "LineString";
        WKTConstants.TYPE_MULTI_LINE_STRING = "MultiLineString";
        WKTConstants.TYPE_POLYGON = "Polygon";
        WKTConstants.TYPE_MULTI_POLYGON = "MultiPolygon";
        WKTConstants.TYPE_GEOMETRY_COLLECTION = "GeometryCollection";
        WKTConstants.TYPE_FEATURE = "Feature";
        WKTConstants.TYPE_FEATURE_COLLECTION = "FeatureCollection";

        WKTConstants.FIELD_CRS_NAME = "name";
        WKTConstants.FIELD_CRS_LINK = "link";

        // Default Named CRS string
        // OGC CRS URNs such as "urn:ogc:def:crs:OGC:1.3:CRS84" shall be preferred over legacy identifiers
        // such as "EPSG:4326"
        WKTConstants.WGS84_CRS = "urn:ogc:def:crs:OGC:1.3:CRS84";
        WKTConstants.EPSG4326_CRS = "EPSG:4326";

        return WKTConstants;
    }
);


