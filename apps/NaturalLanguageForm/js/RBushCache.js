/*
    Uses an RTree in conjuction with a Dictionary to cache data that is
    associated with a bounding box
 */


define(['rbush', 'lodash', 'buckets'], function(rbush, _, buckets) {


    'use strict';

    function RBushCache(rBushMinSize) {

        function arrToString(arr) {
            return arr.join(',');
        }

        var size = rBushMinSize || 1000;

        this._tree = new rbush(size);

        this._cache = new buckets.Dictionary(arrToString);

    }

    /*
        Tests if an entry is in the cache
        @param {box} : the bounding box th test
     */
    RBushCache.prototype.collides = function(box) {
        return this._tree.collides(box);
    }

    /*
        Sets a bounding box as being cached
        @param {box} : the bounding box to consider
     */
    RBushCache.prototype.setAsCached = function(box) {
        this._tree.insert(box);
    }

    /*
        Caches data by associating it with a bounding box
        @param {box} : the bounding box to consider
        @param {data} : the data to be inserted into the cache
     */
    RBushCache.prototype.cacheData = function(box, data) {
        this._cache.set(box, data);
        this.setAsCached(box);
    }

    /*
        Retrieves the data associated with a bounding box from the cache
        @param {box} the bounding box to consider
        @return : the data that has been cached and associated with the boungind bxox
     */
    RBushCache.prototype.get = function(box) {
        this._cache.get(box);
    }




    return RBushCache;





});
