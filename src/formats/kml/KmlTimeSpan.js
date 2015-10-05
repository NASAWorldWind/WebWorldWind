/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports KmlTimeSpan
 */
define([
    './KmlTimePrimitive',
    './KmlElements'
], function(
    KmlTimePrimitive,
    KmlElements
){
    "use strict";
    /**
     * Constructs an KmlTimeSpan. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from KmlFile are read.
     * @alias KmlTimeSpan
     * @classdesc Contains the data associated with Kml TimeSpan
     * @param timeSpanNode Node representing the Kml TimeSpan
     * @constructor
     * @throws {ArgumentError} If the content of the node contains invalid elements.
     * @see https://developers.google.com/kml/documentation/kmlreference#timespan
     */
    var KmlTimeSpan = function(timeSpanNode) {
        KmlTimePrimitive.call(this, timeSpanNode);
    };

    KmlTimeSpan.prototype = Object.create(KmlTimePrimitive.prototype);

    Object.defineProperties(KmlTimeSpan.prototype, {
        /**
         * Array of the tag names representing Kml timeSpan.
         * @memberof KmlTimeSpan.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['TimeSpan'];
            }
        },

        /**
         * Time from which is the event valid.
         * @memberof KmlTimeSpan.prototype
         * @type {DateTime}
         * @readonly
         */
        begin: {
            get: function() {
                return this.retrieve({name: 'begin'});
            }
        },

        /**
         * Time to which is the event valid.
         * @memberof KmlTimeSpan.prototype
         * @type {DateTime}
         * @readonly
         */
        end: {
            get: function() {
                return this.retrieve({name: 'end'});
            }
        }
    });

    KmlElements.addKey(KmlTimeSpan.prototype.tagName[0], KmlTimeSpan);

    return KmlTimeSpan;
});