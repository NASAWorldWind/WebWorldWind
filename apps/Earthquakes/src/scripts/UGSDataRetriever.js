/*

    this module provides an object that facilitates the access, parsing, and handling of the
    data from UGSD servers

 */


define(function() {
    'use strict';

    function UGSDataRetriever() {
        var self = this;
        self.observers = [];
    }

    UGSDataRetriever.prototype.registerObserver = function(observer) {
        self.observers.push(observer);
    }

    UGSDataRetriever.prototype.notifyObservers = function(earthquakeData) {
        self.observers.forEach(function(observer) {
            observer.call(this, earthquakeData);
        });
    }

    UGSDataRetriever.prototype.assembleAPICall = function() {
        //return "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
        return "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=500";
    }

    UGSDataRetriever.prototype.parseDataFromUGDS = function(data) {
        var earthquakes = data['features'];


        var res = earthquakes.map(function(quake) {
            var geometry = quake['geometry'];
            var logistics = quake['properties'];
            var earthquake = {
                magnitude: Number(logistics['mag']),
                date: logistics['time'],
                depth: Number(geometry['coordinates'][2]),
                lat: Number(geometry['coordinates'][1]),
                long: Number(geometry['coordinates'][0])
            };
            earthquake.position = new WorldWind.Position(earthquake.lat, earthquake.long, 1e2);
            // How long ago the earthquake occurred in terms of days
            earthquake.age = Math.abs((new Date().getTime()) - new Date(earthquake.date).getTime()) /
                    (24 * 60 * 60 * 1000);

            var stampTest = Math.floor(earthquake.age);

            if (stampTest === 0) {
                var tempVal = Math.floor(Math.abs((new Date().getTime() - new Date(earthquake.date).getTime())
                    / (60 * 60 * 1000)))
                earthquake.stamp = tempVal  + ((tempVal === 1) ? " Hour" : " Hours") + ' Ago';
            } else {
                var day = ((stampTest === 1) ? ' Day' : ' Days') + " Ago";
                earthquake.stamp = stampTest + day;
            }

            earthquake.info = 'M' + earthquake.magnitude + ' - ';
            earthquake.info += logistics['place'] + "<br>" + earthquake.stamp + "<br>" + (Math.round(earthquake.depth) / 1000) +
                    " km deep";
            return earthquake


        });

        return res;


    }

    UGSDataRetriever.prototype.retrieveRecords = function(callback) {
        var uri = UGSDataRetriever.prototype.assembleAPICall();
        $.get(uri, function(data) {
            var earthquakes = UGSDataRetriever.prototype.parseDataFromUGDS(data);
            callback(earthquakes);
            //notifyObservers(earthquakes);
        });

    }




    return UGSDataRetriever;



})
