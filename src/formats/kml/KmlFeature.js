/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlObject',
    './KmlAbstractView',
    './KmlStyle',
    './KmlTimePrimitive'
], function(
    KmlObject,
    KmlAbstractView,
    KmlStyle,
    KmlTimePrimitive
){
    "use strict";
    /**
     * Constructs an KmlFeature. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read
     * @alias KmlFeature
     * @classdesc Contains the data associated with KmlFeature.
     * @param featureNode Node representing Kml Feature
     * @constructor
     * @throws {ArgumentError} If the node is null.
     */
    var KmlFeature = function(featureNode) {
        KmlObject.call(this, featureNode);
    };

    KmlFeature.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlFeature.prototype, {
        tagName: {
            get: function() {
                return ['NetworkLink', 'Placemark', 'PhotoOverlay', 'ScreenOverlay', 'GroundOverlay', 'Folder',
                    'Document'];
            }
        },

        /**
         * Name of this feature. Every feature should have name.
         * @memberof KmlFeature.prototype
         * @type {String}
         * @readonly
         */
        name: {
            get: function(){
                return this.retrieve({name: 'name'});
            }
        },

        /**
         * Visibility of current feature. It is possible for some features to be invisible.
         * @memberof KmlFeature.prototype
         * @type {Boolean}
         * @readonly
         */
        visibility: {
            get: function(){
                return this.retrieve({name: 'visibility', transformer: Boolean});
            }
        },

        /**
         * It is applied only to Document, Folder and NetworkLink and represents whether they should be rendered
         * collapsed or expanded.
         * @memberof KmlFeature.prototype
         * @type {Boolean}
         * @readonly
         */
        open: {
            get: function() {
                return this.retrieve({name: 'open', transformer: Boolean});
            }
        },

        /**
         * It represents unstructured address associated with the Feature.
         * @memberof KmlFeature.prototype
         * @type {String}
         * @readonly
         */
        address: {
            get: function() {
                return this.retrieve({name: 'address'});
            }
        },

        /**
         * It represents phone number associated with current feature. Quite probably irrelevant information.
         * @memberof KmlFeature.prototype
         * @type {String}
         * @readonly
         */
        phoneNumber: {
            get: function() {
                return this.retrieve({name: 'phoneNumber'});
            }
        },

        /**
         * It represents description of this feature. It can be displayed as a part of the feature.
         * @memberof KmlFeature.prototype
         * @type {String}
         * @readonly
         */
        description: {
            get: function() {
                return this.retrieve({name: 'description'});
            }
        },

        /**
         * It represents one of the AbstractViews associated with current Feature. Specific implementation of
         * AbstractView will be returned.
         * @memberof KmlFeature.prototype
         * @type {KmlAbstractView}
         * @readonly
         */
        abstractView: {
            get: function() {
                return this.createChildElement({
                    name: KmlAbstractView.prototype.tagName
                });
            }
        },

        /**
         * It represents one of the TimePrimitives associated with current Feature. Specific implementation of
         * TimePrimitive will be returned.
         * @memberof KmlFeature.prototype
         * @type {KmlTimePrimitive}
         * @readonly
         */
        timePrimitive: {
            get: function() {
                return this.createChildElement({
                    name: KmlTimePrimitive.prototype.tagName
                });
            }
        },

        /**
         * One style element per Feature, with possible children of different substyles.
         */
        style: {
            get: function() {
                return this.createChildElement({
                    name: KmlStyle.prototype.tagName
                });
            }
        }
    });

    KmlFeature.prototype.resolveStyle = function() {

    };

    return KmlFeature;
});