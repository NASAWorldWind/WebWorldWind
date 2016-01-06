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
    './KmlTimePrimitive',
    '../../util/WWUtil'
], function (extend,
             KmlElements,
             KmlTimePrimitive,
             WWUtil) {
    "use strict";

    /**
     * Constructs an KmlTimeStamp. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from KmlFile are read.
     * @alias KmlTimeStamp
     * @classdesc Contains the data associated with Kml TimeStamp
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Kml TimeStamp
     * @constructor
     * @throws {ArgumentError} If the content of the node contains invalid elements.
     * @see https://developers.google.com/kml/documentation/kmlreference#timestamp
     * @augments KmlTimePrimitive
     */
    var KmlTimeStamp = function (options) {
        //noinspection JSUndefinedPropertyAssignment
        options.isTimeStamp = true;
        Object.defineProperties(this, {
            /**
             * This property specifies when exactly the event happen.
             * @memberof KmlTimeStamp.prototype
             * @type {Date}
             * @readonly
             */
            kmlWhen: {
                get: function () {
                    return this.retrieve({name: 'when', transformer: WWUtil.date});
                }
            }
        });
        KmlTimePrimitive.call(this, options);

        extend(this, KmlTimeStamp.prototype);
    };

    /**
     * @inheritDoc
     */
    KmlTimeStamp.prototype.getTagNames = function () {
        return ['TimeStamp'];
    };

    KmlElements.addKey(KmlTimeStamp.prototype.getTagNames()[0], KmlTimeStamp);

    return KmlTimeStamp;
});