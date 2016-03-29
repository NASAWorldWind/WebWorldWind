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
     * @constructor
     */
    var TreeKeyValueCache = function() {
        this.map = {};
    };

    TreeKeyValueCache.prototype.add = function(level, key, value){
        //console.log("Add to cache " + level + " key: " + value);
        //console.log(value);
        if(!this.map[level]) {
            this.map[level] = {};
        }
        this.map[level][key] = value;
    };

    TreeKeyValueCache.prototype.value = function(level, key) {
        //console.log("Retrieve from Cache: " + level + " key: " + key);
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
        return this.map[level][key];
    };

    TreeKeyValueCache.prototype.level = function(level) {
        return this.map[level];
    };

    TreeKeyValueCache.prototype.remove = function(level, key) {
        delete this.map[level][key];
    };

    var applicationLevelCache = new TreeKeyValueCache();
    TreeKeyValueCache.applicationLevelCache = function() {
        return applicationLevelCache;
    };

    return TreeKeyValueCache;
});