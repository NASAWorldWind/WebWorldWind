define([
    '../pshapes/SurfaceShape'
], function (SurfaceShape) {

    var SurfacePolygon = function (locations, attributes) {
        SurfaceShape.call(this, attributes);

        this.locations = locations;
    };

    SurfacePolygon.prototype = Object.create(SurfaceShape.prototype);

    SurfacePolygon.prototype.computeBoundaries = function () {
        this._boundaries = this.locations;
    };

    return SurfacePolygon;
});