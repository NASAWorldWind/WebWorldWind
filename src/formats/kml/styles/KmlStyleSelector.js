/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlObject'
], function (
    KmlObject
) {
    "use strict";
    /**
     * Constructs an KmlStyleSelector. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read.
     * @alias KmlStyleSelector
     * @constructor
     * @classdesc Contains the data associated with Kml style selector
     * @param styleSelectorNode Node representing the Kml style selector.
     * @throws {ArgumentError} If either the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#styleselector
     */
    var KmlStyleSelector = function(styleSelectorNode){
        KmlObject.call(this, styleSelectorNode);
    };

    KmlStyleSelector.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlStyleSelector.prototype, {
        /**
         * Tag names for descendant of the StyleSelector.
         * @memberof KmlStyleSelector.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['Style','StyleMap'];
            }
        }
    });

    return KmlStyleSelector;
});