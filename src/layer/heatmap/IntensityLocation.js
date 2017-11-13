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
        Location.call(latitude, longitude);

        /**
         * Arbitrary number representing the intensity of the source for this position.
         * @type {Number} Arbitrary number
         */
        this.intensity = intensity;
    };

    IntensityLocation.prototype = Object.create(Location.prototype);

    return IntensityLocation;
});