define([], function(){
    "use strict";

    /**
     * Enumeration of different approaches towards the interval and color scales in case of heatmap.
     * @exports IntervalType
     * @type {{CONTINUOUS: number, QUANTILES: number}}
     */
    var IntervalType = {
        CONTINUOUS: 0,
        QUANTILES: 1
    };

    return IntervalType;
});