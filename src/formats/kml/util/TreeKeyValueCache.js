/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([], function () {
    "use strict";

    var startsWith = function(str, searchString){
        if(String.prototype.startsWith) {
            return str.startsWith(searchString);
        }

        var position = 0;
        return str.substr(position, searchString.length) === searchString;
    };

    /**
     * Cache working on a basic principle of storing the data as a pair of key, value. Currently the values are
     * never invalidated.
     * @alias TreeKeyValueCache
     * @constructor
     * @classdesc Represents internally used cache which stores data in a tree like structure.
     */
    var TreeKeyValueCache = function() {
        this.map = {};
    };

	/**
     * Adds new element to the cache. It accepts level, key and value in order
     * @param level {Object} Anything that can be used as a key in JavaScript object
     * @param key {Object} Anything that can be used as a key in JavaScript object
     * @param value {Object} The value to be stored in the cache on given level and value. Value must started with #
     */
    TreeKeyValueCache.prototype.add = function(level, key, value){
        if(!this.map[level]) {
            this.map[level] = {};
        }
        this.map[level][key] = value;
    };

	/**
     * It returns value for key stored at certain level. If there is no such level, it returns null. If there is such leave then the key starting with # gets treated a bit differently.
     * @param level {Object} Anything that can be used as a key in JavaScript object
     * @param key {Object} Anything that can be used as a key in JavaScript object
     * @returns {Object|null}
     */
    TreeKeyValueCache.prototype.value = function(level, key) {
        if(!this.map[level]){
            return null;
        }
        if(key.indexOf("#") == -1) {
            var currentLevel = this.level(level);
            for(var keyFromLevel in currentLevel) {
                if(!currentLevel.hasOwnProperty(keyFromLevel)){
                    continue;
                }

                if(startsWith(keyFromLevel, key)){
                    return currentLevel[keyFromLevel];
                }
            }
        }
        return this.map[level][key] || null;
    };

	/**
     * It returns the whole level of the data. If there is none then undefined is returned.
     * @param level {Object} Anything that can be used as a key in JavaScript object
     * @returns {Object|null}
     */
    TreeKeyValueCache.prototype.level = function(level) {
        return this.map[level];
    };

	/**
     * It removes the data from the map if such data exists.
     * @param level {Object} Anything that can be used as a key in JavaScript object
     * @param key {Object} Anything that can be used as a key in JavaScript object
     */
    TreeKeyValueCache.prototype.remove = function(level, key) {
        delete this.map[level][key];
    };

    var applicationLevelCache = new TreeKeyValueCache();
    TreeKeyValueCache.applicationLevelCache = function() {
        return applicationLevelCache;
    };

    return TreeKeyValueCache;
});