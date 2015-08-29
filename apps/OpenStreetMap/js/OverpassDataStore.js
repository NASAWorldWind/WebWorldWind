define(['Set', 'rbush', 'OpenSteetMapConfig', 'jquery'], function(Set, rbush, OpenStreetMapConfig, $) {
    'use strict';


    function OverpassDataStore() {
        this._set = new Set();
        this._config = new OpenStreetMapConfig();
        this._rbush = new rbush(config.rTreeSize);
    }

    /*
        Generates the key to be used to refer to a particular
        bounding box
        @param boundingBox: the bounding Box to be considered
        @return : a pair containing both the key and the bounding box
     */
    OverpassDataStore.prototype.keyGen = function(boundingBox) {

        if($.isArray(boundingBox)) {
            return {
                key : boundingBox.join(','),
                arr : boundingBox
            }
        }

        return {
            key: boundingBox,
            arr : boundingBox.split(',')
        };

    }

    /*
        Checks to see if the Overpass data has been recoreded
        @param boundingBox : the bounding box to consider
        @return : true if we have obtained the data, false otherwise
     */

    OverpassDataStore.prototype.isDataRecorded = function(boundingBox) {
        var keyDataPair = this.keyGen(boundingBox);
        var key = keyDataPair['key'];
        return this._set.contains(key);
    }


    /*
        Lists a specified bounding box as being retrieved by the
        the api
        @param boundingBox : the bounding box to list as being retrieved by the api
     */

    OverpassDataStore.prototype.addBoundingBoxToCache = function(boundingBox) {
        var keyPair = this.keyGen(boundingBox);
        var key = keyPair['key'];
        this._set.add(key);
    }

    /*
        Adds a renderable to the data store, associating it to a
        bounding box
        @param boundingBox : a bounding box to consider
        @param renderabale : the renderable to insert
     */
    OverpassDataStore.prototype.addData = function(boundingBox, renderable) {
        if(this.isDataRecorded(boundingBox) === false) {
            var key = this.keyGen(boundingBox)['key'];
            var node = boundingBox.concat(renderable);
            this._rbush.insert(node);
            this._set.add(key);
        }
    }

    /*
        Retreives the renderables that are located within a bounding box
        @param boundingBox : the bounding box to consider
        @return : the renderables contained within bounding box
     */
    OverpassDataStore.prototype.retrieveRenderables = function(boundingBox) {
        var key = this.keyGen(boundingBox)['key'];
        var nodes = this._rbush.search(boundingBox);
        var renderables = nodes.map(function(node) {
            return node[node.length - 1];
        });
        return renderables;
    }




})