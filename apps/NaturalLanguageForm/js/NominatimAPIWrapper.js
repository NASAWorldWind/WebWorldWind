/*
    Author: Inzamam Rahaman
 */

define(['jquery','OpenStreetMapConfig'], function($, OpenStreetMapConfig) {

    'use strict';


    function NominatimAPIWrapper() {
        this._config = new OpenStreetMapConfig();
    }

    NominatimAPIWrapper.prototype.processAddress = function(address) {
        // format address without spaces
        var addressComponents = address.split(',');
        var stripedComponents = addressComponents.map(function(component) {
            return $.trim(component);
        });
        var addressValueForCall = stripedComponents.join(',');

        return addressValueForCall;
    }

    NominatimAPIWrapper.prototype.assebleAPICall = function(address) {
        var url = this._config.baseNominatimAPIAddress;
        var nominatimQueryConfig = '?format=json&addressdetails=1&limit=1&polygon_svg=1';
        var processedAddress = this.processAddress(address);
        var urlEncodedAddress = encodeURI(processedAddress);
        url += urlEncodedAddress;
        url += nominatimQueryConfig;
        return url;
    }

    NominatimAPIWrapper.prototype.processNominatimResponse = function(response) {
        var addressUnit = response[0];
        var latitude = addressUnit['lat'];
        var longitude = addressUnit['long'];
        var ans = {
            'longitude' : longitude,
            'latitude' : latitude
        };
        return ans;
    }


    NominatimAPIWrapper.prototype.geocode = function(address, callback) {
        var url = this.assebleAPICall(address);
        $.get(url, function(nominatimResponse) {
            var data = this.processNominatimResponse(nominatimResponse);
            callback(data);
        });
    }




});
