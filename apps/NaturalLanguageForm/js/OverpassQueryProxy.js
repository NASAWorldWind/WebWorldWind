/*
    Author: Inzamam Rahaman
    Acts a means of abstracting away access to the OverpassQueryProxy
 */

define(['jquery','OpenStreetMapConfig', 'OSMDataHelper'], function($, OpenStreetMapConfig, OSMDataHelper) {
    'use strict';


    function OverpassQueryProxy() {
        this._config = new OpenStreetMapConfig()
        this._helper = new OSMDataHelper();
    }

    /*
        Given a bounding box, computes a string representation
        @param {boundingBox} : the bounding box for some Overpass API Query
        @return : the bounding box portion of an Overpass Query call
     */
    OverpassQueryProxy.prototype.getBoundingBoxString = function(boundingBox) {
        var joinedCoords = boundingBox.join(',');
        var boundingBoxPortion = '(' + joinedCoords + ');';
        return boundingBoxPortion;
    }


    /*
        Given a bounding box and a list of specifications for the request,
        constructs the appropriate API call for the Overpass Query
        @param {boundingBox} : the bounding box for the call
        @param {callbackSpecifications} : further specifications for the query
        @param return : an encoded url for the query
     */
    OverpassQueryProxy.prototype.constuctAPICall = function(boundingBox, callbackSpecifications) {
        var baseURI = this._config.overPassAPIBody;
        var node = 'node';
        //console.log(callbackSpecifications);
        var keyPart = '"' + callbackSpecifications. overpassAPIKey + '"';
        var valPart = '"' + callbackSpecifications.overpassAPIValue + '"'
        var specs = '[' + keyPart + '~' + valPart + ']';
        //console.log('specs ', specs);
        var boundingBoxPorition = this.getBoundingBoxString(boundingBox);
        var endString = 'out ' + this._config.nodeLimit + ' body;'
        var query = [node, specs, boundingBoxPorition, endString].join(' ');
        query = baseURI + query;
        var encodedQuery = encodeURI(query);
        //console.log(encodedQuery);
        return encodedQuery;
    }



    /*
        Retrieves the desired OSM data withing a specified bounding box
        @param {boundingBox} : the bounding box to consider
        @param {callbackSpecifications} : the specifications for the query
        @param {callback} : the callback to be performed on the geoJSON data retrived from the server
     */
    OverpassQueryProxy.prototype.retrieveOSMData = function(boundingBox, callbackSpecifications, callback) {
        var self = this;
        var queryURI = this.constuctAPICall(boundingBox, callbackSpecifications);
        //console.log('query uri ', queryURI);
        $.get(queryURI, function(data) {
            var dataAsGeoJSON = self._helper.processOSMData(data);
            callback(callbackSpecifications, dataAsGeoJSON);
        });
    }

    return OverpassQueryProxy;


})