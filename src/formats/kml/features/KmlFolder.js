/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlContainer',
    './../KmlElements'
], function (
    KmlContainer,
    KmlElements
) {
    "use strict";
    /**
     * Constructs an KmlFolder. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlFolder
     * @classdesc Contains the data associated with Folder options.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing this Folder
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#folder
     * @augments KmlContainer
     */
    var KmlFolder = function (options) {
        KmlContainer.call(this, options);
    };

    KmlFolder.prototype = Object.create(KmlContainer.prototype);

    /**
     * @inheritDoc
     */
    KmlFolder.prototype.getTagNames = function () {
        return ['Folder'];
    };

    KmlElements.addKey(KmlFolder.prototype.getTagNames()[0], KmlFolder);

    return KmlFolder;
});