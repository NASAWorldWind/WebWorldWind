/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlContainer',
    '../KmlElements',
    './KmlFeature',
    '../util/Schema'
], function (
    KmlContainer,
    KmlElements,
    KmlFeature,
    Schema
) {
    "use strict";
    /**
     * Constructs an KmlDocument. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlDocument
     * @classdesc Contains the data associated with Document node.
     * @param node Node representing document in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#document
     */
    var KmlDocument = function(node) {
        KmlContainer.call(this, node);
    };

    KmlDocument.prototype = Object.create(KmlContainer.prototype);

    Object.defineProperties(KmlDocument.prototype, {
        /**
         * Array of the tag names representing Kml document.
         * @memberof KmlDocument.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['Document'];
            }
        },

        /**
         * Specifies any amount of features, which are part of this document.
         * @memberof KmlDocument.prototype
         * @readonly
         * @type {Array}
         * @see {KmlFeature}
         */
        shapes: {
            get: function(){
                var allElements = this.parse();
                return allElements.filter(function(element){
                    return element instanceof KmlFeature;
                });
            }
        },

        /**
         * Specifies a custom KML schema that is used to add custom data to KML Features. The "id" attribute is required
         * and must be unique within the KML file. <Schema> is always a child of <Document>.
         * This is array of all Schemas in current document
         * @memberof KmlDocument.prototype
         * @readonly
         * @type {Array}
         * @see {Schema}
         */
        schemas: {
            get: function(){
                var allElements = this.parse();
                return allElements.filter(function(element){
                    return element instanceof Schema;
                });
            }
        }
    });

    KmlDocument.prototype.update = function(layer, style) {
        this.shapes.forEach(function(shape) {
            shape.update(layer, style);
        });
    };

    KmlElements.addKey(KmlDocument.prototype.tagName[0], KmlDocument);

    return KmlDocument;
});