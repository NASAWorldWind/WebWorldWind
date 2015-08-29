/**
 * Created by Matthew on 6/30/2015.
 */
define(['OpenStreetMapConfig'],function(OpenStreetMapConfig){

    'use strict';

    function RouteAPIWrapper(){
        this._config = new OpenStreetMapConfig();
    }
    /*
        Assembles the API call for specified points.
        @param locArray: Array containing the start point and end point of the route [start lat, start lon, end lat, end lon]
        @return: Returns API call
     */
    RouteAPIWrapper.prototype.assembleCall = function (locArray) {
        var self = this;
        console.log(locArray);

        var from = [locArray[0], locArray[1]];
        var to = [locArray[2], locArray[3]];
        console.log(to);

        var call = self._config.OSRMAPIBody + "viaroute?" + "loc="
            + from + "&" + "loc="
            + to + '&' + 'instructions=true';

        return call;
    }

    RouteAPIWrapper.prototype.assembleQuery = function() {
    }

    RouteAPIWrapper.prototype.getRouteData = function (locArray, callback) {
        var arr = locArray;

        if (!locArray){
            arr = [42.036241, -88.345090, 42.025845, -88.341743]
        }

        var url = this.assembleCall(arr);
        $.get(url, function(data) {
            var toSend = data;
            console.log('to send ', toSend);
            callback(toSend);
        });

    }

    return RouteAPIWrapper

})