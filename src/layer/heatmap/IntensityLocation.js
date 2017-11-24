define(['../../geom/Location'], function(Location){
    "use strict";

    /**
     * It represents Position with added intensity vector.
     * @constructor
     * @augments Location
     * @inheritDoc
     * @intensity {Number} Number representing the intensity of the source for this position;
     */
    var IntensityLocation = function(latitude, longitude, intensity) {
        Location.call(this, latitude, longitude);

        /**
         * Arbitrary number representing the intensity of the source for this position.
         * @type {Number} Arbitrary number
         */
        this.intensity = intensity;
    };

    IntensityLocation.prototype = Object.create(Location.prototype);

    IntensityLocation.prototype.isInSector = function(sector) {
        return this.latitude >= sector.minLatitude && this.latitude <= sector.maxLatitude &&
            this.longitude >= sector.minLongitude && this.longitude <= sector.maxLongitude;
    };

    IntensityLocation.prototype.latitudeInSector = function(sector, height) {
        // Percentage of the available space.
        var sizeOfArea = sector.maxLatitude - sector.minLatitude;
        var locationInArea = this.latitude - sector.minLatitude;
        return height - ((locationInArea / sizeOfArea) * height);
    };

    IntensityLocation.prototype.longitudeInSector = function(sector, width) {
        var sizeOfArea = sector.maxLongitude - sector.minLongitude;
        var locationInArea = this.longitude - sector.minLongitude;
        return (locationInArea / sizeOfArea) * width;
    };

    return IntensityLocation;
});