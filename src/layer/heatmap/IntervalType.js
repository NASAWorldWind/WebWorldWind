define([], function(){
    "use strict";

    /**
     * Enumeration of different approaches towards the interval and color scales in case of heatmap.
     * @export IntervalType
     * @type {{CONTINUOUS: number, EQUAL: number, QUANTILES: number}}
     */
    var IntervalType = {
        CONTINUOUS: 0,
        EQUAL: 1,
        QUANTILES: 2
    };

    return IntervalType;
});