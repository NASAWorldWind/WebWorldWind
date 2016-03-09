/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlObject'
], function (KmlObject) {
    "use strict";
    /**
     * Constructs an KmlStyleSelector. Application usually don't call this constructor. It is called by {@link KmlFile}
     * as Objects from KmlFile are read.
     * @alias KmlStyleSelector
     * @constructor
     * @classdesc Contains the data associated with Kml style selector
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the Kml style selector.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#styleselector
     * @augments KmlObject
     */
    var KmlStyleSelector = function (options) {
        KmlObject.call(this, options);
    };

    KmlStyleSelector.prototype = Object.create(KmlObject.prototype);

    /**
     * @inheritDoc
     */
    KmlStyleSelector.prototype.getTagNames = function () {
        return ['Style', 'StyleMap'];
    };

    return KmlStyleSelector;
});