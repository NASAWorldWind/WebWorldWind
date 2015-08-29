/*
    Authors: Matt Evers, Inzamam Rahaman
 */

define(['RBushCache','lodash'], function(RBushCache, _) {

    var baseURL = 'http://data.osmbuildings.org/0.2/anonymous';

    //var buildingCache

    var cachedURLData = {
        keys: {},
        URL: [],
        maxCacheSize: 100
    };
    var cachedBuildingData = {
        //keys contains building IDs as Keys and its index in buildings as entries.
        keys: {},
        buildings: [],
        maxCacheSize: 100
    };

    /*
     *
     * Takes a bounding box of the form [lat, long, lat, long] and bounds the side lengths
     *
     * @param BBox: see above
     * @param maxSideLength: The max difference between lat-lat or long-long
     *
     * @return: an array bounded by above
     */
    function boundBoundingBox (BBox, maxSideLength) {

        var latAve = (BBox[0]+BBox[2])/2;
        var longAve = (BBox[1]+BBox[3])/2;
        //console.log(longAve)
        if (Math.abs(BBox[0]-BBox[2]) > maxSideLength) {
            if (BBox[2] > BBox[0]) {
                BBox[2] = latAve + maxSideLength/2;
                BBox[0] = latAve - maxSideLength/2;
            }
            else
            {
                BBox[2] = latAve - maxSideLength/2;
                BBox[0] = latAve + maxSideLength/2;
            }
        }

        if (Math.abs(BBox[1]-BBox[3]) > maxSideLength) {
            if (BBox[1] < BBox[3]) {
                BBox[3] = longAve + maxSideLength/2;
                BBox[1] = longAve - maxSideLength/2;
            }
            else
            {
                BBox[3] = longAve - maxSideLength/2;
                BBox[1] = longAve + maxSideLength/2;
            }
        }
        return BBox
    }


    function OSMBuildingDataRetriever() {

        function arrayToString(arr) {
            return arr.join(',');
        }


        this._cache = new RBushCache();

        //this.buildingDataCache = new buckets.Dictionary(arrayToString);
        //this.tree = new rbush(1000);
        //this.applyKey();
    };

    OSMBuildingDataRetriever.prototype.applyKey = function (options) {
        options = options || {};
        baseURL += (options.key || 'anonymous');
    };

    OSMBuildingDataRetriever.prototype.buildBBoxAPICall = function (bbox) {
        //console.log('Building API call for building data in a BBox...')
        //bbox.forEach(function (entry, index) {
        //    bbox[index] = entry.toFixed(5)
        //});
        //console.log(bbox)
        var box = bbox.map(function(point) {
           return point.toFixed(5);
        });
        var url = baseURL + '/bbox.json?bbox=' + box.join(',');
        return url;
        //return encodeURI(url);
    };

    OSMBuildingDataRetriever.prototype.buildGetFeatureAPICall = function (idOfFeature) {
        //console.log('Building API call to get feature JSON of ' + idOfFeature);
        return baseURL + '/feature/' + idOfFeature + '.json';
    };

    OSMBuildingDataRetriever.prototype.callAPI = function (url, callback) {
        var self = this;
        console.log(url);
        $.get(url, function(returnedData){
            callback(returnedData['features']);
        });
    };

    // Bounding Box should be [Low Lat, high long, high lat, low long]
    OSMBuildingDataRetriever.prototype.requestOSMBuildingData = function (boundingBoxCoords, callback) {
        var self = this;
        var box = boundingBoxCoords;

        if(this._cache.collides(box) === false) {
            var url = this.buildBBoxAPICall(box);
            this.callAPI(url, function(data) {
                self._cache.cacheData(box, data);
                callback(data);
            });
        } else {
            var data = this._cache.get(box);
            callback(data);
        }
    };


    OSMBuildingDataRetriever.prototype.requestBuildingInfoById = function(id, callback) {
        var url = this.buildGetFeatureAPICall(id);
        $.get(url, function(data) {
            callback(data);
        });
    }


    /*
    * Takes a bounding box of the form [low lat, low long, high lat, high long] and returns a corrosponding array of
    *   the form [high lat, high long, low lat, low long]
    *
    * @param boundingBoxCoords: bounding box of the form [low lat, low long, high lat, high long]
    *
    * @return: a corrosponding array of the form [high lat, high long, low lat, low long]
    */
    OSMBuildingDataRetriever.prototype.fixBoundingBoxForOSMB = function (boundingBoxCoords) {
        return [boundingBoxCoords[2],boundingBoxCoords[3],boundingBoxCoords[0],boundingBoxCoords[1]]
    };

    return OSMBuildingDataRetriever;
});