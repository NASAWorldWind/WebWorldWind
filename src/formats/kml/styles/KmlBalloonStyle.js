/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlSubStyle',
    '../KmlElements'
], function (
    KmlSubStyle,
    KmlElements
) {
    "use strict";
    /**
     * Constructs an KmlBalloonStyle. Applications usually don't call this constructor. It is called by {@link KmlFile}
     * as objects from KmlFile are read. This object is already concrete implementation.
     * @alias KmlBalloonStyle
     * @classdesc Contains the data associated with BalloonStyle node
     * @param balloonStyleNode Node representing BallonStyle in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined
     */
    var KmlBalloonStyle = function(balloonStyleNode){
        KmlSubStyle.call(this, balloonStyleNode);
    };

    KmlBalloonStyle.prototype = Object.create(KmlSubStyle.prototype);

    Object.defineProperties(KmlBalloonStyle.prototype, {
        /**
         * Array of the tag names representing Kml ballon style.
         * @memberof KmlBalloonStyle.prototype
         * @readonly
         * @type {Array}
         */
        tagName: {
            get: function() {
                return ['BalloonStyle']
            }
        },

        /**
         * Represents background color of the balloon. It expects hexadecimal notation without #.
         * @memberof KmlBalloonStyle.prototype
         * @readonly
         * @type {String}
         */
        bgColor: {
            get: function(){
                return this.retrieve({name: 'bgColor'});
            }
        },

        /**
         * Represents color of the text in the balloon. It expects hexadecimal notation without #.
         * @memberof KmlBalloonStyle.prototype
         * @readonly
         * @type {String}
         */
        textColor: {
            get: function() {
                return this.retrieve({name: 'textColor'});
            }
        },

        /**
         * Text which should be displayed in the balloon, otherwise feature name and description is displayed.
         * @memberof KmlBalloonStyle.prototype
         * @readonly
         * @type {String}
         */
        text: {
            get: function(){
                return this.retrieve({name: 'text'});
            }
        },

        /**
         * Either display or hide. When hide don't show the balloon at all.
         * @memberof KmlBalloonStyle.prototype
         * @readonly
         * @type {String}
         */
        displayMode: {
            get: function() {
                return this.retrieve({name: 'displayMode'});
            }
        }
    });

    KmlElements.addKey(KmlBalloonStyle.prototype.tagName[0], KmlBalloonStyle);

    return KmlBalloonStyle;
});