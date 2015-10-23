/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/extend',
    './KmlStyleSelector',
    './../KmlElements',
    './KmlPolyStyle',
    './KmlIconStyle',
    './KmlLabelStyle',
    './KmlLineStyle',
    './KmlListStyle',
    './KmlBalloonStyle',
    '../../../util/Promise'
], function (
    extend,
    KmlStyleSelector,
    KmlElements,
    KmlPolyStyle,
    KmlIconStyle,
    KmlLabelStyle,
    KmlLineStyle,
    KmlListStyle,
    KmlBalloonStyle,
    Promise
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
     * @see https://developers.google.com/kml/documentation/kmlreference#style
     */
    var KmlStyle = function(styleNode) {
        KmlStyleSelector.call(this, styleNode);

        Object.defineProperties(this, {
            /**
             * Style used for icons in current node and all children nodes.
             * @memberof KmlStyle.prototype
             * @readonly
             * @type {KmlIconStyle|null}
             */
            kmlIconStyle: {
                get: function() {
                    return this.createChildElement({
                        name: KmlIconStyle.prototype.getTagNames()
                    });
                }
            },

            /**
             * Style used for labels in current node and all children nodes.
             * @memberof KmlStyle.prototype
             * @readonly
             * @type {KmlLabelStyle|null}
             */
            kmlLabelStyle: {
                get: function() {
                    return this.createChildElement({
                        name: KmlLabelStyle.prototype.getTagNames()
                    });
                }
            },

            /**
             * Style used for line in current node and all children nodes.
             * @memberof KmlStyle.prototype
             * @readonly
             * @type {KmlLineStyle|null}
             */
            kmlLineStyle: {
                get: function() {
                    return this.createChildElement({
                        name: KmlLineStyle.prototype.getTagNames()
                    });
                }
            },

            /**
             * Style used for polygon in current node and all children nodes.
             * @memberof KmlStyle.prototype
             * @readonly
             * @type {KmlPolyStyle|null}
             */
            kmlPolyStyle: {
                get: function() {
                    return this.createChildElement({
                        name: KmlPolyStyle.prototype.getTagNames()
                    });
                }
            },

            /**
             * Style used for balloons in current node and all children nodes.
             * @memberof KmlStyle.prototype
             * @readonly
             * @type {KmlBalloonStyle|null}
             */
            kmlBalloonStyle: {
                get: function() {
                    return this.createChildElement({
                        name: KmlBalloonStyle.prototype.getTagNames()
                    });
                }
            },

            /**
             * Style used for lists in current node and all children nodes.
             * @memberof KmlStyle.prototype
             * @readonly
             * @type {KmlBalloonStyle|null}
             */
            kmlListStyle: {
                get: function() {
                    return this.createChildElement({
                        name: KmlListStyle.prototype.getTagNames()
                    });
                }
            }
        });

        extend(this, KmlStyle.prototype);
    };

    KmlStyle.update = function(style) {
        var options = {};

        if(style.kmlIconStyle) {
            KmlIconStyle.update(style.kmlPolyStyle, options);
        }
        if(style.kmlListStyle) {
            KmlListStyle.update(style.kmlPolyStyle, options);
        }
        if(style.kmlBalloonStyle) {
            KmlBalloonStyle.update(style.kmlPolyStyle, options);
        }
        if(style.kmlLabelStyle) {
            KmlLabelStyle.update(style.kmlPolyStyle, options);
        }
        if(style.kmlPolyStyle) {
            KmlPolyStyle.update(style.kmlPolyStyle, options);
        }
        if(style.kmlLineStyle) {
            KmlLineStyle.update(style.kmlLineStyle, options);
        }

        return options;
    };

    KmlStyle.prototype.getStyle = function() {
        var self = this;
        return new Promise(function(resolve, reject){
            window.setTimeout(function(){
                resolve(self);
            }, 0);
        });
    };

    KmlStyle.prototype.getTagNames = function() {
        return ['Style'];
    };

    KmlElements.addKey(KmlStyle.prototype.getTagNames()[0], KmlStyle);

    return KmlStyle;
});