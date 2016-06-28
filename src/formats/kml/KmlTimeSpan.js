/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports KmlTimeSpan
 */
define([
    './KmlElements',
    './KmlTimePrimitive',
    './util/NodeTransformers'
], function(
    KmlElements,
    KmlTimePrimitive,
    NodeTransformers
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

        KmlTimePrimitive.call(this, options);
    };

    KmlTimeSpan.prototype = Object.create(KmlTimePrimitive.prototype);

    Object.defineProperties(KmlTimeSpan.prototype, {
        /**
         * Time from which is the event valid.
         * @memberof KmlTimeSpan.prototype
         * @type {Date}
         * @readonly
         */
        kmlBegin: {
            get: function() {
                return this._factory.specific(this, {name: 'begin', transformer: NodeTransformers.date});
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
                return this._factory.specific(this, {name: 'end', transformer: NodeTransformers.date});
            }
        }
    });

    /**
     * @inheritDoc
     */
    KmlTimeSpan.prototype.getTagNames = function () {
        return ['TimeSpan'];
    };

    KmlElements.addKey(KmlTimeSpan.prototype.getTagNames()[0], KmlTimeSpan);

    return KmlTimeSpan;
});