define([
    './geom/WKTGeometryCollection',
    './geom/WKTLineString',
    './geom/WKTMultiLineString',
    './geom/WKTMultiPoint',
    './geom/WKTMultiPolygon',
    './geom/WKTPoint',
    './geom/WKTPolygon',
    './geom/WKTTriangle'
], function (WKTGeometryCollection,
             WKTLineString,
             WKTMultiLineString,
             WKTMultiPoint,
             WKTMultiPolygon,
             WKTPoint,
             WKTPolygon,
             WKTTriangle) {
    //noinspection UnnecessaryLocalVariableJS
    /**
     * Map representing the available elements. Basically this is a way to overcome circular dependencies issues. They
     * might happen when there are inter dependencies among objects. It shouldn't happen in case of WKT.
     */
    var WKTElements = {
        'GEOMETRYCOLLECTION': WKTGeometryCollection,
        'LINESTRING': WKTLineString,
        'MULTILINESTRING': WKTMultiLineString,
        'MULTIPOINT': WKTMultiPoint,
        'MULTIPOLYGON': WKTMultiPolygon,
        'POINT': WKTPoint,
        'POLYGON': WKTPolygon,
        'TRIANGLE': WKTTriangle
    };

    return WKTElements;
});