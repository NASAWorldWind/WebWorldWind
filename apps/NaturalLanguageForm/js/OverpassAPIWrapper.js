
/*
 * Author: Inzamam Rahaman
 * Modified by Matt Evers
 */
define(['jquery','OpenStreetMapConfig', 'osmtogeojson'],function($, OpenStreetMapConfig, osmtogeojson) {

    'use strict';

    function OverpassAPIWrapper() {
        this._config = new OpenStreetMapConfig();
    }


    /*
        Assembles a query for the Overpass API using a boundingBox and a list of amenities
        to consider. If the amenities list is undefined, null, or false, then a query is
        constructed to get all nodes with an amenity tag.
        @param boundingBox: the bounding box to consider [lower latitude, lower longitude, upper latitude, upper longitude]
        @param amenities: the amenities to consider
        @return a Overpass query to to access nodes with amenities in a specified bounding box
     */

    OverpassAPIWrapper.prototype.assembleXQuery = function(boundingBox, query, val) {
        var amenityString = '';
        if(!query) {
            amenityString = '["amenity"~"."]';
        } else {
            if (!val){
                amenityString = '[' + query + '~"."]';
            } else {
                amenityString = '[' + query + '=' + val +']';
            }

        }
        var queryString = "node" + amenityString;
        queryString += "(" + boundingBox.join(' , ') + ");";
        queryString += "out body;";
        return queryString;
    };


    /*
        Assembles an API to retrieve the nodes with specified amenities in a specified bounding box
        (NB: if amenities is null, false, or undefined, then we retrieve all nodes in the bounding box)
        @param boundingBox : the bounding box to consider [lower latitude, lower longitude, upper latitude, upper longitude]
        @param amenities: the amenities to consider
        @return : a url that can be used to retrieve amenities in a specified bounding box using
                  the Overpass Open Street Map API
     */
    OverpassAPIWrapper.prototype.assembleXAPICall = function(boundingBox, query,val) {
        console.log('Building API call.')
        var queryA = this.assembleXQuery(boundingBox, query,val);
        return this._config.overPassAPIBody + queryA;
    }

    /*
        Given a bounxing box and a callback to handle the data, uses a GET request to
        access Open Street Map data that contains amenities.
        @param boundingBox: the bounding box to consider [lower latitude, lower longitude, upper latitude, upper longitude]
        @param callback : the callback to use to handle the data retrived from the GET request
     */

    OverpassAPIWrapper.prototype.getAllXInBox = function(boundingBox, query, callback,val ) {
        console.log('Searching Bounding Box.')
        var url = this.assembleXAPICall(boundingBox, query, val);
        console.log(url)
        $.get(url, function(data) {
            var toSend = osmtogeojson(data);
            toSend.boundingBox = boundingBox
            callback(toSend);
        });
    }



    return OverpassAPIWrapper;


});