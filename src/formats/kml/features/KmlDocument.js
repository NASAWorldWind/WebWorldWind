/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/extend',
    './KmlContainer',
    '../KmlElements',
    './KmlFeature',
    '../util/Schema'
], function (
    extend,
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
     * @classdesc Contains the data associated with Document options.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing the document.
     * @constructor
     * @throws {ArgumentError} If the options is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#document
     * @augments KmlContainer
     */
    var KmlDocument = function (options) {
        KmlContainer.call(this, options);

        Object.defineProperties(this, {
            /**
             * Specifies any amount of features, which are part of this document.
             * @memberof KmlDocument.prototype
             * @readonly
             * @type {Node[]}
             * @see {KmlFeature}
             */
            kmlShapes: {
                get: function(){
                    var allElements = this.parse();
                    return allElements.filter(function (element) {
                        return element.isFeature;
                    });
                }
            },

            /**
             * Specifies a custom KML schema that is used to add custom data to KML Features. The "id" attribute is
             * required and must be unique within the KML file. &lt;Schema&gt; is always a child of &lt;Document&gt;.
             * This is array of all Schemas in current document
             * @memberof KmlDocument.prototype
             * @readonly
             * @type {Schema[]}
             * @see {Schema}
             */
            kmlSchemas: {
                get: function(){
                    var allElements = this.parse();
                    return allElements.filter(function (element) {
                        return element instanceof Schema;
                    });
                }
            }
        });

        extend(this, KmlDocument.prototype);
    };

    /**
     * Instead of standard update lifecycle only call update on contained elements.
     * @inheritDoc
     */
    KmlDocument.prototype.beforeStyleResolution = function(options) {
        this.kmlShapes.forEach(function(shape) {
            shape.update(options);
        });

        return false;
    };

    /**
     * @inheritDoc
     */
    KmlDocument.prototype.getTagNames = function () {
        return ['Document'];
    };

    KmlElements.addKey(KmlDocument.prototype.getTagNames()[0], KmlDocument);

    return KmlDocument;
});