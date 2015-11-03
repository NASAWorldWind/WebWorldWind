/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports KmlTimePrimitive
 */
define([
    '../../util/extend',
    './KmlObject'
], function(
    extend,
    KmlObject
){
    "use strict";
    /**
     * Constructs an KmlTimePrimitive. Applications usually don't call this constructor. It is called by {@link KmlFile}
     * as objects from KmlFile are read.
     * @alias KmlTimePrimitive
     * @classdesc It is ancestor for all TimePrimitives - TimeSpan and TimeStamp
     * @param timePrimitiveNode {Node} Node representing Kml TimePrimitive.
     * @constructor
     * @see https://developers.google.com/kml/documentation/kmlreference#timeprimitive
     */
    var KmlTimePrimitive = function(timePrimitiveNode) {
        KmlObject.call(this,timePrimitiveNode);

        extend(this, KmlTimePrimitive.prototype);
    };

    /**
     * Returns tag name of all descendants of this abstract node.
     * @returns {String[]}
     */
    KmlTimePrimitive.prototype.getTagNames = function() {
        return ['TimeSpan','TimeStamp'];
    };

    return KmlTimePrimitive;
});