/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlFeature'
], function (
    KmlFeature
) {
    "use strict";
    /**
     * Constructs an KmlContainer. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlContainer
     * @classdesc Contains the data associated with Container node.
     * @param node Node representing container in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#container
     */
    var KmlContainer = function(node) {
        KmlFeature.call(this, node);
    };

    KmlContainer.prototype.getTagNames = function() {
        return ['Folder', 'Document'];
    };

    return KmlContainer;
});