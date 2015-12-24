/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/extend',
    './../KmlObject'
], function (extend,
             KmlObject) {
    "use strict";
    /**
     * Constructs an KmlStyleSelector. Application usually don't call this constructor. It is called by {@link KmlFile}
     * as Objects from KmlFile are read.
     * @alias KmlStyleSelector
     * @constructor
     * @classdesc Contains the data associated with Kml style selector
     * @param styleSelectorNode {Node} Node representing the Kml style selector.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#styleselector
     * @augments KmlObject
     */
    var KmlStyleSelector = function (styleSelectorNode) {
        KmlObject.call(this, styleSelectorNode);

        extend(this, KmlStyleSelector.prototype);
    };

    /**
     * @inheritDoc
     */
    KmlStyleSelector.prototype.getTagNames = function () {
        return ['Style', 'StyleMap'];
    };

    return KmlStyleSelector;
});