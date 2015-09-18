/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlLineString',
    './KmlElements'
], function (
    KmlLineString,
    KmlElements
) {
    "use strict";
    /**
     * Constructs an KmlLinearRing element. Applications don't usually call this constructor. It is called by objects in
     * the hierarchy of KmlObject.
     * @param linearRingNode Node of the object to be retrieved.
     * @constructor
     */
    var KmlLinearRing = function(linearRingNode) {
        KmlLineString.call(this, linearRingNode);
    };

    KmlLinearRing.prototype = Object.create(KmlLineString.prototype);

    KmlElements.addKey("LinearRing", KmlLinearRing);

    return KmlLinearRing;
});