/*
    A set implementation
    NB: keys must be either non-negative integers or strings
 */


define(['http://worldwindserver.net/webworldwind/worldwind.min.js'], function(ww) {


    function Set() {
        this._container = {};
    }

    /*
        Retrieves all keys stored in the set
        @return : the elements stored in the set
     */
    Set.prototype.getKeys = function() {
        var keys = [];
        var self = this;
        for(var key in self._container) {
            if(self.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        return keys;
    }

    /*
        Adds a specified key to the set
        @param key: the key to add to the set
     */
    Set.prototype.add = function(key) {
        this._container[key] = true;
    }

    /*
        Given an iterable of keys, inserts them all
        into the set
        @param keys: an iterable with the keys to be inserted into the set
     */
    Set.prototype.addMany = function(keys) {
        var self = this;
        keys.forEach(function(key) {
            self.add(key);
        });
    }

    /*
        Given a key, remove the key from the set
        @param key: the key to remove from the set
     */
    Set.prototype.remove = function(key) {
        this._container[key] = false;
    }

    /*
        Given an iterable of keys, removes them from the set
        @param keys: an iterable of keys to be removed from the set
     */
    Set.prototype.removeMany = function(keys) {
        var self = this;
        keys.forEach(function(key) {
            self.remove(key);
        });
    }

    /*
        Determines if a key is in the set
        @param key: the key to check if it is inserted
        @return: true if the key is in the set, false otherwise
     */
    Set.prototype.contains = function(key) {
        return this._container[key] === true;
    }


    /*
        Computes the intersection of two sets
        @param that: another set
        @return : a set containing all of the elements that exists in both sets
     */
    Set.prototype.intersect = function(that) {
        var res = new Set();
        var self = this;
        this.getKeys().forEach(function(key) {
           if(that.contains(key)) {
               res.add(key);
           }
        });
        return res;
    }

    /*
        Computes the union of two sets
        @param that: another set
        @return: a set containing the elements that exist in at least one of the two sets
     */
    Set.prototype.union = function(that) {
        var res = new Set();
        var self = this;
        res.addMany(self.getKeys());
        res.addMany(that.getKeys());
        return res;
    }

    /*
        Computes the set difference between two sets
        @param that: another set
        @return: the elements that exists in this set but not in the set represented by that
     */
    Set.prototype.setDifference = function(that) {
        var res = new Set();
        var keys = this.getKeys();
        keys.forEach(function(key) {
           if(that.contains(key) === false) {
               res.add(key);
           }
        });
        return res;
    }



    /*
        Filters out the elements of a set based on some predicate
        @param pred: the predicate to filter on
        @return: the new set with only the elements that map to true on the predicate provided
     */
    Set.prototype.filter = function(pred) {
        var res = new Set();
        var keys = this.getKeys();
        res.addMany(keys.filter(pred));
        return res;
    }

    /*
        Transforms every element of the Set using
     */
    Set.prototype.map = function(mapFunc) {
        var res = new Set();
        var keys = this.getKeys();
        res.addMany(keys.map(mapFunc));
        return res;
    }

    /*
        Goes through each element of the set
     */
    Set.prototype.forEach = function(eachFunc) {
        var keys = this.getKeys();
        keys.forEach(eachFunc);
    }

    return Set;

});