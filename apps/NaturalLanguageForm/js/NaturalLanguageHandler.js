/**
 * Created by Matthew on 6/30/2015.
 * Primary Author: Inzamam Rahaman
 * Modified by Matthew Evers
 */


// THIS IS ALL FOR MATT. NOTES ON HOW I WANTED TO DO THE SEARCH.
    // self.nearNames = ['Elgin','Near Me'];
    // self.places = ['Starbucks'];
    //I am at _here/name__ near _location__ looking for __key/name__ within __miles__ of _location__
    //OR I am looking for __key/name__ within __miles__ of _location__
    //build bounding box based on location and miles
    //search for key/name using OSM data retriever
    //search for here/name using osm data retriever or use myLoc
    //if more than one turns up, clarify
    //get each location
    //route it

define(['OverpassAPIWrapper','RouteAPIWrapper','OSMDataRetriever','OpenStreetMapConfig','OverpassQueryProxy','OSMBuildingDataRetriever'],
    function(OverpassAPIWrapper, RouteAPIWrapper, OSMDataRetriever, OpenStreetMapConfig, OverpassQueryProxy,OSMBuildingDataRetriever){
        'use strict';

        function NaturalLanguageHandler (wwd){
            var self = this;
            this._config = new OpenStreetMapConfig();
            this._wwd = wwd;
            this._osmDataRetriever = new OverpassQueryProxy();
            this._osmBuildingDataRetriever = new OSMBuildingDataRetriever();

        }


        function specsFromNavigatorSpecifications(latitude, longitude, navigatorSpecifications) {
            return {
                startPosition : [latitude, longitude],
                overpassAPIKey : navigatorSpecifications.overpassKey,
                overpassAPIValue : navigatorSpecifications.overpassValue
            };
        }


        function grabNavigatorData(navigatorSpecifications, callback) {
            return function(navigatorGeolocation) {
                var coords = navigatorGeolocation.coords;
                var latitude = coords.latitude;
                var longitude = coords.longitude;
                var specsForCallback = specsFromNavigatorSpecifications(latitude, longitude, navigatorSpecifications);
                callback(specsForCallback);
            }
        }

        function getSomeDefaultLocationInfo(navigatorSpecifications, callback) {
            return function(navigatorGeolocation) {
                var config = new OpenStreetMapConfig();
                var defaultLocation = config.startPosition;
                var latitude = defaultLocation.latitude;
                var longitude = defaultLocation.longitude;
                var specsForCallback = specsFromNavigatorSpecifications(latitude, longitude, navigatorSpecifications);
                callback(specsForCallback);
            }
        }

        function getUserDefinedLocationInfo(navigatorSpecifications, callback) {
            return function() {
                var latitude = navigatorSpecifications.latitude;
                var longitude = navigatorSpecifications.longitude;
                var specsForCallback = specsFromNavigatorSpecifications(latitude, longitude, navigatorSpecifications);
                callback(specsForCallback);
            }
        }

        NaturalLanguageHandler.prototype.processSpecifications = function(callback, dataRetriever) {
            var self = this;
            return function(callbackSpecs) {
                //console.log('using helper wrapper callback');
                var boundingBox = self.buildBoundingBox(callbackSpecs.startPosition);
                dataRetriever.retrieveOSMData(boundingBox, callbackSpecs, callback);
            };
        };

        NaturalLanguageHandler.prototype.receiveInput = function (inputSpecifications, callback) {
            var modifiedSpecifications = inputSpecifications;
            if(inputSpecifications === undefined || inputSpecifications === null) {
                modifiedSpecifications = this._config.defaultInputSpecification;
            }

            //console.log(modifiedSpecifications);
            var alteredCallback = this.processSpecifications(callback, this._osmDataRetriever);
            var successNavigatorCallback = grabNavigatorData(modifiedSpecifications, alteredCallback);
            var failureNavigatorCallback = getSomeDefaultLocationInfo(modifiedSpecifications, alteredCallback);
            var userDefinedNavigatorCallback = getUserDefinedLocationInfo(modifiedSpecifications, alteredCallback);
            if(modifiedSpecifications.useCurrentLocationForNavigation === true && navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(successNavigatorCallback, failureNavigatorCallback);
            } else {
                userDefinedNavigatorCallback();
            }
        };

        /* Builds the bounding box based around a center.
        *
        *   @param BBCenter: The center of where the bounding box needs to be.
        **/

        NaturalLanguageHandler.prototype.buildBoundingBox = function (boundingBoxCenter){
            var width = this._config.boundingBoxWidth / 100.0;
            var height = this._config.boundingBoxHeight / 100.0;

            var lat1 = boundingBoxCenter[0] - width;
            var long1 = boundingBoxCenter[1] - height;

            var lat2 = boundingBoxCenter[0] + width;
            var long2 = boundingBoxCenter[1] + height;
            //console.log([lat1, long1, lat2, long2])
            return [lat1, long1, lat2, long2];
        };

        return NaturalLanguageHandler

    });

