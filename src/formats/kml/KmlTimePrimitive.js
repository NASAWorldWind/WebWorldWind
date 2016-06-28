/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports KmlTimePrimitive
 */
define([
    './KmlObject'
], function (KmlObject) {
    "use strict";
    /**
     * Constructs an KmlTimePrimitive. Applications usually don't call this constructor. It is called by {@link KmlFile}
     * as objects from KmlFile are read.
     * @alias KmlTimePrimitive
     * @classdesc It is ancestor for all TimePrimitives - TimeSpan and TimeStamp
     * @param options {Object}
     * @param options.objectNode {Node} Node representing Kml TimePrimitive.
     * @constructor
     * @see https://developers.google.com/kml/documentation/kmlreference#timeprimitive
     * @augments KmlObject
     */
    var KmlTimePrimitive = function (options) {
        KmlObject.call(this, options);
    };

    KmlTimePrimitive.prototype = Object.create(KmlObject.prototype);

    /**
     * It returns range applicable to current time.
     * @returns {{from: Date, to: Date}}
     */
    KmlTimePrimitive.prototype.timeRange = function() {
        var from, to;
        if(this.kmlBegin) {
            to = from = this.kmlBegin.valueOf();
        }
        if(this.kmlEnd) {
            to = this.kmlEnd.valueOf();
            if(!from) {
                from = to;
            }
        }

        if(this.kmlWhen) {
            to = from = this.kmlWhen.valueOf();
        }

        return {
            from: from,
            to: to
        };
    };

    /**
     * @inheritDoc
     */
    KmlTimePrimitive.prototype.getTagNames = function () {
        return ['TimeSpan', 'TimeStamp'];
    };

    return KmlTimePrimitive;
});