/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([], function () {
    "use strict";

    //noinspection UnnecessaryLocalVariableJS
    /**
     * Map representing the available Elements. This is solution to circular dependency when
     * parsing some of the elements may be dependent on elements, in which they may be present.
     * Like MultiGeometry present inside of some of the Geometries.
     * @exports KmlElements
     */
    var KmlElements =  {
        /**
         * Internal storage for all key-values pairs
         */
        keys: {},

        /**
         * Adds key representing name of the node and constructor to be used.
         * @param key {String} Name of the node, by which it is retrieved. Name is case sensitive.
         * @param value {KmlObject} Value represent constructor function to be instantiated
         */
        addKey: function (key, value) {
            this.keys[key] = value;
        },

        /**
         * Returns constructor function to be instantiated.
         * @param key {String} Name of the node.
         * @returns {*} Constructor function to be instantiated.
         */
        getKey: function (key) {
            return this.keys[key];
        }
    };

    return KmlElements;
});