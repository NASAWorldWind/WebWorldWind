define(['jquery','OpenStreetMapConfig', 'OSMDataHelper'], function($, OpenStreetMapConfig, OSMDataHelper) {
    'use strict';


    function OverpassQueryProxy() {
        this._config = new OpenStreetMapConfig()
        this._helper = new OSMDataHelper();
    }

    OverpassQueryProxy.prototype.getBoundingBoxString = function(boundingBox) {
        var joinedCoords = boundingBox.join(',');
        var boundingBoxPortion = '(' + joinedCoords + ');';
        return boundingBoxPortion;
    }


    OverpassQueryProxy.prototype.constuctAPICall = function(boundingBox, callbackSpecifications) {
        var baseURI = this._config.overPassAPIBody;
        var node = 'node';
        console.log(callbackSpecifications);
        var keyPart = '"' + callbackSpecifications. overpassAPIKey + '"';
        var valPart = '"' + callbackSpecifications.overpassAPIValue + '"'
        var specs = '[' + keyPart + '~' + valPart + ']';
        console.log('specs ', specs);
        var boundingBoxPorition = this.getBoundingBoxString(boundingBox);
        var endString = 'out ' + this._config.nodeLimit + ' body;'
        var query = [node, specs, boundingBoxPorition, endString].join(' ');
        query = baseURI + query;
        var encodedQuery = encodeURI(query);
        console.log(encodedQuery);
        return encodedQuery;
    }



    OverpassQueryProxy.prototype.retrieveOSMData = function(boundingBox, callbackSpecifications, callback) {
        var self = this;
        var queryURI = this.constuctAPICall(boundingBox, callbackSpecifications);
        console.log('query uri ', queryURI);
        $.get(queryURI, function(data) {
            console.log(data);
            var dataAsGeoJSON = self._helper.processOSMData(data);
            callback(callbackSpecifications, dataAsGeoJSON);
        });
    }

    return OverpassQueryProxy;


})