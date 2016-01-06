/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports KmlTimeSpan
 */
define([
    '../../util/extend',
    './KmlTimePrimitive',
    './KmlElements',
    '../../util/WWUtil'
], function(
    extend,
    KmlTimePrimitive,
    KmlElements,
    WWUtil
){
    "use strict";
    /**
     * Constructs an KmlTimeSpan. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from KmlFile are read.
     * @alias KmlTimeSpan
     * @classdesc Contains the data associated with Kml TimeSpan
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Kml TimeSpan
     * @constructor
     * @throws {ArgumentError} If the content of the node contains invalid elements.
     * @see https://developers.google.com/kml/documentation/kmlreference#timespan
     * @augments KmlTimePrimitive
     */
    var KmlTimeSpan = function (options) {
        //noinspection JSUndefinedPropertyAssignment
        options.isTimeSpan = true;
        Object.defineProperties(this, {
            /**
             * Time from which is the event valid.
             * @memberof KmlTimeSpan.prototype
             * @type {Date}
             * @readonly
             */
            kmlBegin: {
                get: function() {
                    return this.retrieve({name: 'begin', transformer: WWUtil.date});
                }
            },

            /**
             * Time to which is the event valid.
             * @memberof KmlTimeSpan.prototype
             * @type {Date}
             * @readonly
             */
            kmlEnd: {
                get: function() {
                    return this.retrieve({name: 'end', transformer: WWUtil.date});
                }
            }
        });

        KmlTimePrimitive.call(this, options);

        extend(this, KmlTimeSpan.prototype);
    };

    /**
     * @inheritDoc
     */
    KmlTimeSpan.prototype.getTagNames = function () {
        return ['TimeSpan'];
    };

    KmlElements.addKey(KmlTimeSpan.prototype.getTagNames()[0], KmlTimeSpan);

    return KmlTimeSpan;
});