define(function() {

    var baseURL = 'http://data.osmbuildings.org/0.2/';
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

    function OSMBuildingDataRetriever() {
        this.applyKey();
    };

    OSMBuildingDataRetriever.prototype.applyKey = function (options) {
        options = options || {};
        baseURL += (options.key || 'anonymous');
    };

    OSMBuildingDataRetriever.prototype.buildBBoxAPICall = function (bbox) {
        console.log('Building API call for building data in a BBox...')
        bbox.forEach(function (entry, index) {
            bbox[index] = entry.toFixed(5)
        });
        return baseURL + '/bbox.json?bbox=' + bbox.join(',');
    };

    OSMBuildingDataRetriever.prototype.buildGetFeatureAPICall = function (idOfFeature) {
        //console.log('Building API call to get feature JSON of ' + idOfFeature);
        return baseURL + '/feature/' + idOfFeature + '.json';
    };

    OSMBuildingDataRetriever.prototype.restrictBuildingCache = function () {
        while (cachedBuildingData.buildings.length + 1 > cachedBuildingData.maxCacheSize) {
            var item = cachedBuildingData.buildings.shift();
            console.log(item.id + ' removed.')
            delete cachedBuildingData.keys[item.id];

        }
        cachedBuildingData.buildings.forEach(function (building, index) {
            console.log(building)
            cachedBuildingData.keys[building.id] = index;
        });
    };

    OSMBuildingDataRetriever.prototype.updateBuildingCacheFromData = function (data, callback) {
        var self = this;
        //console.log(data)
        console.log('Caching data...');
        if (data.features) {
            data.features.forEach(function (building, index) {
                if (!cachedBuildingData['keys'][building.id]) {
                    //console.log(building.id + ' is a new building.')

                    //console.log('Fetching building '+ building.id + '.' )
                    $.get(self.buildGetFeatureAPICall(building.id), function (info) {
                        if (building['properties']) {
                            building['properties'].tags = info.features[0].properties.tags
                        } else {
                            building['properties'] = {
                                tags: info.features[0].properties.tags
                            }
                        }
                        //console.log('Building '+ building.id + ' fetched.' )
                        cachedBuildingData['keys'][building.id] = cachedBuildingData.buildings.length;
                        cachedBuildingData.buildings.push(building);

                        if (index === data.features.length - 1) {
                            self.restrictBuildingCache();
                            console.log('Data Cached!');
                            callback(cachedBuildingData)
                        }
                    });

                } else {
                    //console.log('We already know about this building.')
                    if (index === data.features.length - 1) {
                        self.restrictBuildingCache();
                        console.log('Data Cached!')
                        callback(cachedBuildingData)
                    }
                }

            });
        };
    };

    OSMBuildingDataRetriever.prototype.callAPI = function (url, callback) {
        var self = this;
        if (cachedURLData.keys[url]){
            self.updateBuildingCacheFromData(cachedURLData.URL[cachedURLData.keys[url]],callback)
        } else {
            $.get(url, function(returnedData){
                cachedURLData.keys[url] = cachedURLData.URL.length;
                cachedURLData.URL.push(returnedData);
                self.updateBuildingCacheFromData(returnedData,callback);
            });
        }
    };

    OSMBuildingDataRetriever.prototype.requestOSMBuildingData = function (boundingBoxCoords, callback) {
        console.log('Fetching OSM Building Data...');
        var self = this;
        var url = this.buildBBoxAPICall(boundingBoxCoords);
        self.callAPI(url, callback);
    };

    return OSMBuildingDataRetriever;
});