/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlStyleSelector',
    './../KmlElements',
    './KmlPolyStyle',
    './KmlIconStyle',
    './KmlLabelStyle',
    './KmlLineStyle',
    './KmlBalloonStyle'
], function (
    KmlStyleSelector,
    KmlElements,
    KmlPolyStyle,
    KmlIconStyle,
    KmlLabelStyle,
    KmlLineStyle,
    KmlBalloonStyle
) {
    "use strict";

    /**
     * Constructs an KmlStyle. Application usually don't call this constructor. It is called by {@link KmlFile} as
     * Objects from KmlFile are read. It is concrete implementation.
     * Style can contain any amount of different styles. At most one from each of these styles.
     * Possible children styles: IconStyle, LabelStyle, LineStyle, PolyStyle, BalloonStyle
     * @alias KmlStyle
     * @constructor
     * @classdesc Contains the data associated with Kml style
     * @param styleNode Node representing the Kml style.
     * @throws {ArgumentError} If either the node is null or undefined.
     */
    var KmlStyle = function(styleNode) {
        KmlStyleSelector.call(this, styleNode);
    };

    KmlStyle.prototype = Object.create(KmlStyleSelector.prototype);

    Object.defineProperties(KmlStyle.prototype, {
        /**
         * Style used for icons in current node and all children nodes.
         * @memberof KmlStyle.prototype
         * @readonly
         * @type {KmlIconStyle|null}
         */
        IconStyle: {
            get: function() {
                return this.createChildElement({
                    name: KmlIconStyle.prototype.tagName
                });
            }
        },

        /**
         * Style used for labels in current node and all children nodes.
         * @memberof KmlStyle.prototype
         * @readonly
         * @type {KmlLabelStyle|null}
         */
        LabelStyle: {
            get: function() {
                return this.createChildElement({
                    name: KmlLabelStyle.prototype.tagName
                });
            }
        },

        /**
         * Style used for line in current node and all children nodes.
         * @memberof KmlStyle.prototype
         * @readonly
         * @type {KmlLineStyle|null}
         */
        LineStyle: {
            get: function() {
                return this.createChildElement({
                    name: KmlLineStyle.prototype.tagName
                });
            }
        },

        /**
         * Style used for polygon in current node and all children nodes.
         * @memberof KmlStyle.prototype
         * @readonly
         * @type {KmlPolyStyle|null}
         */
        PolyStyle: {
            get: function() {
                return this.createChildElement({
                    name: KmlPolyStyle.prototype.tagName
                });
            }
        },

        /**
         * Style used for balloons in current node and all children nodes.
         * @memberof KmlStyle.prototype
         * @readonly
         * @type {KmlBalloonStyle|null}
         */
        BalloonStyle: {
            get: function() {
                return this.createChildElement({
                    name: KmlBalloonStyle.prototype.tagName
                });
            }
        },

        /**
         * Array of the tag names representing Kml poly style.
         * @memberof KmlStyle.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['Style'];
            }
        }
    });

    KmlElements.addKey(KmlStyle.prototype.tagName[0], KmlStyle);

    return KmlStyle;
});