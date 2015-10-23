/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports KmlTimeStamp
 */
define([
    '../../util/extend',
    './KmlElements',
    './KmlTimePrimitive'
], function(
    extend,
    KmlElements,
    KmlTimePrimitive
){
    "use strict";

    /**
     * Constructs an KmlTimeStamp. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from KmlFile are read.
     * @alias KmlTimeStamp
     * @classdesc Contains the data associated with Kml TimeStamp
     * @param timeStampNode Node representing the Kml TimeStamp
     * @constructor
     * @throws {ArgumentError} If the content of the node contains invalid elements.
     * @see https://developers.google.com/kml/documentation/kmlreference#timestamp
     */
    var KmlTimeStamp = function(timeStampNode) {
        KmlTimePrimitive.call(this, timeStampNode);

        Object.defineProperties(this, {
            /**
             * This property specifies when exactly the event happen.
             * @memberof KmlTimeStamp.prototype
             * @type {DateTime}
             * @readonly
             */
            kmlWhen: {
                get: function () {
                    return this.retrieve({name: 'when'});
                }
            }
        });

        extend(this, KmlTimeStamp.prototype);
    };

    KmlTimeStamp.prototype.getTagNames = function() {
        return ['TimeStamp'];
    };

    KmlElements.addKey(KmlTimeStamp.prototype.getTagNames()[0], KmlTimeStamp);

    return KmlTimeStamp;
});