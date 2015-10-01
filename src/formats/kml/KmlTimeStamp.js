/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports KmlTimeStamp
 */
define([
    './KmlElements',
    './KmlTimePrimitive'
], function(
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
    };

    KmlTimeStamp.prototype = Object.create(KmlTimePrimitive.prototype);

    Object.defineProperties(KmlTimeStamp.prototype, {
        /**
         * Array of the tag names representing Kml timeStamp.
         * @memberof KmlTimeStamp.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['TimeStamp'];
            }
        },

        /**
         * This property specifies when exactly the event happen.
         * @memberof KmlTimeStamp.prototype
         * @type {DateTime}
         * @readonly
         */
        when: {
            get: function () {
                return this.retrieve({name: 'when'});
            }
        }
    });

    KmlElements.addKey(KmlTimeStamp.prototype.tagName[0], KmlTimeStamp);

    return KmlTimeStamp;
});