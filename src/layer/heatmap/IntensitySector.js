define([
    '../../geom/Sector'
], function (Sector) {
    "use strict";

    var IntensitySector = function (minLatitude, maxLatitude, minLongitude, maxLongitude, intensity) {
        Sector.call(this, minLatitude, maxLatitude, minLongitude, maxLongitude);

        this.intensity = intensity;
    };

    IntensitySector.prototype = Object.create(Sector.prototype);

    IntensitySector.prototype.isInSector = function(sector){
        return this.maxLatitude >= sector.minLatitude && this.maxLatitude <= sector.maxLatitude &&
            this.minLongitude >= sector.minLongitude && this.minLongitude <= sector.maxLongitude;
    };

    IntensitySector.prototype.longitudeInSector = function(sector, width) {
        var sizeOfArea = sector.maxLongitude - sector.minLongitude;
        var locationInArea = this.minLongitude - sector.minLongitude;
        return (locationInArea / sizeOfArea) * width;
    };

    IntensitySector.prototype.latitudeInSector = function(sector, height) {
        var sizeOfArea = sector.maxLatitude - sector.minLatitude;
        var locationInArea = this.maxLatitude - sector.minLatitude;
        return height - ((locationInArea / sizeOfArea) * height);
    };

    IntensitySector.prototype.widthInSector = function(sector, width) {
        var sectorSizeGeographical = sector.maxLongitude - sector.minLongitude;
        var rectangleSizeGeographical = this.maxLongitude - this.minLongitude;
        return (rectangleSizeGeographical / sectorSizeGeographical) * width;
    };

    IntensitySector.prototype.heightInSector = function(sector, height) {
        var sectorSizeGeographical = sector.maxLatitude - sector.minLatitude;
        var rectangleSizeGeographical = this.maxLatitude - this.minLatitude;
        return (rectangleSizeGeographical / sectorSizeGeographical) * height;
    };

    return IntensitySector;
});