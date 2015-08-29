define(['jquery','OpenStreetMapConfig'], function($, OpenStreetMapConfig) {

    'use strict';

    function MapQuestGeocoder() {
        this._config = new OpenStreetMapConfig();
    }


    /*

        Refer to documentation on
        http://www.mapquestapi.com/geocoding/

     */


    MapQuestGeocoder.prototype.processAddress = function(address) {
        // format address without spaces
        var addressComponents = address.split(',');
        var stripedComponents = addressComponents.map(function(component) {
            return $.trim(component);
        });
        var addressValueForCall = stripedComponents.join(',');

        return addressValueForCall;
    }

    MapQuestGeocoder.prototype.assembleAPICall = function(address) {

        var addressValueForCall = this.processAddress(address);
        // construct api url

        var url = this._config.mapQuestAPIBase + this._config.mapQuestAPIKey;
        url += '&inFormat=kvp&outFormat=json&location=';
        url += addressValueForCall;

        return url;

    }

    MapQuestGeocoder.prototype.processResponseForLatLong = function(resp) {
        var results = resp['results'];
        var result = results[0];
        var locations = result['locations'];
        var firstLoccation = locations[0];
        var latLng = firstLoccation['latLng'];
        var lat = latLng['lat'];
        var long = latLng['lng'];
        var res = {
            latitude : lat,
            longitude : long
        };
        return res;
    }

    MapQuestGeocoder.prototype.getLatitudeAndLong = function(address, callback) {
        var self = this;
        var url = this.assembleAPICall(address);
        console.log('Searching for address ', this.processAddress(address));
        $.get(url, function(resp) {
            console.log(resp);
            var processedResponse = self.processResponseForLatLong(resp);
            callback(processedResponse);
        });
    }

    return MapQuestGeocoder;

})
