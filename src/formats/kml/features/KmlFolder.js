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

    /**
     * Instead of standard update processing for the element only pass the processing on descendants.
     * @inheritDoc
     */
    KmlFolder.prototype.beforeStyleResolution = function(options) {
        this.kmlShapes.forEach(function(shape) {
            shape.update(options);
        });

        return false;
    };

    /**
     * @inheritDoc
     */
    KmlFolder.prototype.getTagNames = function () {
        return ['Folder'];
    };

    KmlElements.addKey(KmlFolder.prototype.getTagNames()[0], KmlFolder);

    return KmlFolder;
});