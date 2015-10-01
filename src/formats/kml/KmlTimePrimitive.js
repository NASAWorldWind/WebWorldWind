/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports KmlTimePrimitive
 */
define([
    './KmlObject'
], function(
    KmlObject
){
    "use strict";
    /**
     * Constructs an KmlTimePrimitive. Applications usually don't call this constructor. It is called by {@link KmlFile}
     * as objects from KmlFile are read.
     * @alias KmlTimePrimitive
     * @classdesc It is ancestor for all TimePrimitives - TimeSpan and TimeStamp
     * @param timePrimitiveNode Node representing Kml TimePrimitive.
     * @constructor
     * @see https://developers.google.com/kml/documentation/kmlreference#timeprimitive
     */
    var KmlTimePrimitive = function(timePrimitiveNode) {
        KmlObject.call(this,timePrimitiveNode);
    };

    KmlTimePrimitive.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlTimePrimitive.prototype, {
        /**
         * Tag names for descendant of the TimePrimitive.
         * @memberof KmlTimePrimitive.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['TimeSpan','TimeStamp'];
            }
        }
    });

    return KmlTimePrimitive;
});