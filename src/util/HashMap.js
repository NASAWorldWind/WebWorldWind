/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports HashMap
 */
define([], function () {
    'use strict';

    /**
     * Constructs a hash map.
     * @alias HashMap
     * @constructor
     */
    var HashMap = function () {
        this._entries = Object.create(null);
    };

    /**
     * Returns the stored value for this key or undefined
     * @param{String | Number} key
     * @returns the value for the specified key or undefined
     */
    HashMap.prototype.get = function (key) {
        return this._entries[key];
    };

    /**
     * Stores a value for a specified key
     * @param{String | Number} key
     * @param value a value to store for the specified key
     */
    HashMap.prototype.set = function (key, value) {
        this._entries[key] = value;
    };

    /**
     * Removes the value and key for a specified key
     * @param{String | Number} key
     */
    HashMap.prototype.remove = function (key) {
        delete this._entries[key];
    };

    /**
     * Indicates if the has map contains a key
     * @param{String | Number} key
     * @returns {Boolean}
     */
    HashMap.prototype.contains = function (key) {
        return key in this._entries;
    };

    /**
     * Internal. Applications should call this function
     * Creates a new HashMap with the same values as the original but increased indexes.
     * The keys are used as indexes and are assumed to be natural numbers.
     * Used by the PolygonSplitter.
     * @param{HashMap} hashMap the hash map to re-index
     * @param{Number} fromIndex the index from with to start reindexing
     * @param{Number} amount the amount by which to increase the index
     * @returns {HashMap} a new has map with re-indexed keys
     */
    HashMap.reIndex = function (hashMap, fromIndex, amount) {
        var newHashMap = new HashMap();
        for (var key in hashMap._entries) {
            var index = parseInt(key);
            if (index >= fromIndex) {
                index += amount;
            }
            var entry = hashMap.get(key);
            entry.index = index;
            newHashMap.set(index, entry);
        }
        return newHashMap;
    };

    return HashMap;
});