/*


    Provides a means of accessing Amenity data by means of the Overpass API.
    This code grabs all of the amenities in a specified bounding box

 */


define(['OverpassQueryProxy', 'RBushCache', 'lodash'], function(OverpassQueryProxy, RbushCache, _) {

    'use strict';

    function AnyAmenityRequestProxy() {
        var anyAmenitySpec = {
            overpassAPIKey : 'amenity',
            overpassAPIValue : '.'
        };

        this._proxy = new OverpassQueryProxy();
        this._defaultSpecs = anyAmenitySpec;
        this._cache = new RbushCache();
    }

    AnyAmenityRequestProxy.prototype.retrieveData = function(boundingBox, callback) {

        var arr = [];
        arr.push(boundingBox.west);
        arr.push(boundingBox.south);
        arr.push(boundingBox.east);
        arr.push(boundingBox.north);
        var self = this;
        if(this._cache.collides(arr) === true) {
            callback(this._cache.get(arr));
        } else {
            this._proxy.retrieveOSMData(arr, this._defaultSpecs, function(specs, data) {
                self._cache.cacheData(arr, data);
                callback(specs, data);
            });
        }
    }

    return AnyAmenityRequestProxy;

})