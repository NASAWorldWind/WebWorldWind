/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/extend',
    './../KmlObject'
], function (
    extend,
    KmlObject
) {
    "use strict";

    /**
     * Constructs an KmlSubStyle. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read.
     * @alias KmlSubStyle
     * @constructor
     * @classdesc Contains the data associated with Kml sub style
     * @param subStyleNode {Node} Node representing the Kml sub style.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#substyle
     */
    var KmlSubStyle = function(subStyleNode) {
        KmlObject.call(this, subStyleNode);

        extend(this, KmlSubStyle.prototype);
    };

    /**
     * Returns tag name of all descendants of this abstract node.
     * @returns {String[]}
     */
    KmlSubStyle.prototype.getTagNames = function(){
        return ['LineStyle','PolyStyle','IconStyle','LabelStyle', 'BalloonStyle', 'ListStyle'];
    };

    return KmlSubStyle;
});