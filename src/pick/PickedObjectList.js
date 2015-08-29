/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports PickedObjectList
 * @version $Id: PickedObjectList.js 2940 2015-03-30 17:58:36Z tgaskins $
 */
define([],
    function () {
        "use strict";

        /**
         * Constructs a picked-object list.
         * @alias PickedObjectList
         * @constructor
         * @classdesc Holds a collection of picked objects.
         */
        var PickedObjectList = function () {
            /**
             * The picked objects.
             * @type {Array}
             */
            this.objects = [];
        };

        /**
         * Indicates whether this list contains picked objects that are not terrain.
         * @returns {Boolean} true if this list contains objects that are not terrain,
         * otherwise false.
         */
        PickedObjectList.prototype.hasNonTerrainObjects = function () {
            return this.objects.length > 1 || (this.objects.length === 1 && this.terrainObject() == null);
        };

        /**
         * Returns the terrain object within this list, if this list contains a terrain object.
         * @returns {PickedObject} The terrain object, or null if this list does not contain a terrain object.
         */
        PickedObjectList.prototype.terrainObject = function () {
            for (var i = 0, len = this.objects.length; i < len; i++) {
                if (this.objects[i].isTerrain) {
                    return this.objects[i];
                }
            }

            return null;
        };

        /**
         * Adds a picked object to this list.
         * @param {PickedObject} pickedObject The picked object to add. If null, this list remains unchanged.
         */
        PickedObjectList.prototype.add = function (pickedObject) {
            if (pickedObject) {
                this.objects.push(pickedObject);
            }
        };

        /**
         * Removes all items from this list.
         */
        PickedObjectList.prototype.clear = function () {
            this.objects = [];
        };

        /**
         * Returns the top-most picked object in this list.
         * @returns {PickedObject} The top-most picked object in this list, or null if this list is empty.
         */
        PickedObjectList.prototype.topPickedObject = function () {
            var size = this.objects.length;

            if (size > 1) {
                for (var i = 0; i < size; i++) {
                    if (this.objects[[i].isOnTop]) {
                        return this.objects[i];
                    }
                }
            }

            if (size > 0) {
                return this.objects[0];
            }

            return null;
        };

        return PickedObjectList;
    });