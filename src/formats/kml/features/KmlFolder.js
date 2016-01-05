/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/extend',
    './KmlContainer',
    './../KmlElements'
], function (
    extend,
    KmlContainer,
    KmlElements
) {
    "use strict";
    /**
     * Constructs an KmlFolder. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlFolder
     * @classdesc Contains the data associated with Folder node.
     * @param node {Node} Node representing folder in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#folder
     */
    var KmlFolder = function (node) {
        KmlContainer.call(this, node);

        Object.defineProperties(this, {
            /**
             * Specifies any amount of features, which are part of this document.
             * @memberof KmlFolder.prototype
             * @readonly
             * @type {KmlObject[]}
             * @see {KmlFeature}
             */
            kmlShapes: {
                get: function(){
                    return this.parse();
                }
            }
        });

        extend(this, KmlFolder.prototype);
    };

    KmlFolder.prototype.update = function(layer, style) {
        this.kmlShapes.forEach(function(shape) {
            shape.update(layer, style);
        });
    };

    /**
     * Returns tag name of this Node.
     * @returns {String[]}
     */
    KmlFolder.prototype.getTagNames = function () {
        return ['Folder'];
    };

    KmlElements.addKey(KmlFolder.prototype.getTagNames()[0], KmlFolder);

    return KmlFolder;
});