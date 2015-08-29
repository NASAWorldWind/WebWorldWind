/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports PickedObject
 * @version $Id: PickedObject.js 2940 2015-03-30 17:58:36Z tgaskins $
 */
define([],
    function () {
        "use strict";

        /**
         * Constructs a picked object.
         * @alias PickedObject
         * @constructor
         * @classdesc Represents a picked object.
         * @param {Color} color The pick color identifying the object.
         * @param {Object} userObject An object to associate with this picked object, usually the picked shape.
         * @param {Position} position The picked object's geographic position. May be null if unknown.
         * @param {Layer} parentLayer The layer containing the picked object.
         * @param {Boolean} isTerrain true if the picked object is terrain, otherwise false.
         */
        var PickedObject = function (color, userObject, position, parentLayer, isTerrain) {

            /**
             * This picked object's pick color.
             * @type {Color}
             * @readonly
             */
            this.color = color;

            /**
             * The picked shape.
             * @type {Object}
             * @readonly
             */
            this.userObject = userObject;

            /**
             * This picked object's geographic position.
             * @type {Position}
             * @readonly
             */
            this.position = position;

            /**
             * The layer containing this picked object.
             * @type {Layer}
             * @readonly
             */
            this.parentLayer = parentLayer;

            /**
             * Indicates whether this picked object is terrain.
             * @type {Boolean}
             * @readonly
             */
            this.isTerrain = isTerrain;

            /**
             * Indicates whether this picked object is the top object.
             * @type {boolean}
             */
            this.isOnTop = false;
        };

        return PickedObject;
    });