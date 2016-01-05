/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/extend',
    './KmlFeature'
], function (extend,
             KmlFeature) {
    "use strict";
    /**
     * Constructs an KmlContainer. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlContainer
     * @classdesc Contains the data associated with Container options.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the container.
     * @constructor
     * @throws {ArgumentError} If the options is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#container
     * @augments KmlFeature
     */
    var KmlContainer = function (options) {
        KmlFeature.call(this, options);

        extend(this, KmlContainer.prototype);
    };

    /**
     * @inheritDoc
     */
    KmlContainer.prototype.getTagNames = function () {
        return ['Folder', 'Document'];
    };

    return KmlContainer;
});