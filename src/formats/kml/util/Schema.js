/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/extend',
    './../KmlElements',
    '../KmlObject'
], function (extend,
             KmlElements,
             KmlObject) {
    // TODO KmlSchema isn't actually descendant of the KmlObject. The relevant logic should be applied differently.
    "use strict";
    /**
     * Constructs an Schema. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * @alias Schema
     * @constructor
     * @classdesc Contains the data associated with Kml Schema
     * @param node {Node} Node representing the Kml Schema.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#itemicon
     */
    var Schema = function (node) {
        KmlObject.call(this, node);

        extend(this, Schema.prototype);
    };

    /**
     * Returns tag name of this Node.
     * @returns {String[]}
     */
    Schema.prototype.getTagNames = function () {
        return ['Schema'];
    };

    KmlElements.addKey(Schema.prototype.getTagNames()[0], Schema);

    return Schema;
});