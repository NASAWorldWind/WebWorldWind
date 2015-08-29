/**
 * Created by Matthew on 6/30/2015.
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

define(['OverpassAPIWrapper','RouteAPIWrapper','OSMDataRetriever','OpenStreetMapConfig','OverpassQueryProxy'],
    function(OverpassAPIWrapper, RouteAPIWrapper, OSMDataRetriever, OpenStreetMapConfig, OverpassQueryProxy){
        'use strict';

        function NaturalLanguageHandler (wwd){
            var self = this;
            this._config = new OpenStreetMapConfig();
            this._wwd = wwd;
            this._osmDataRetriever = new OverpassQueryProxy();

        }

        /* Call receiveInput with the output of the natural language search as a parameter.
        * 1 - translateAndSend(RawInputFromNaturalLanguageSearch, CallbackS1) -- Change 'near me' string to user's location.
        * 2 - callbackS1(translatedInput) -- Change BB center to Bounding Box array... I don't know why I didn't just
        *                                       put this in translateAndSend...
        * 3 - clarityCallback(RawInputFromOverpassAPI) -- return data containing exactly one feature to the routing funcs
        *
        * @param someInput: Array containing the words corrosponding to the selection in the
        *                   natural language search sentence. Looks like
        *                   [Location of Center of BB, Key search for API, value of Key for API, ...]
        **/


        function specsFromNavigatorSpecifications(latitude, longitude, navigatorSpecifications) {
            var specsForCallback = {
                startPosition : [latitude, longitude],
                overpassAPIKey : navigatorSpecifications.overpassKey,
                overpassAPIValue : navigatorSpecifications.overpassValue
            };
            return specsForCallback;
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
            var helper = function(callbackSpecs) {
                console.log('using helper wrapper callback');
                var boundingBox = self.buildBoundingBox(callbackSpecs.startPosition);
                dataRetriever.retrieveOSMData(boundingBox, callbackSpecs, callback);
            };
            return helper;
        }

        NaturalLanguageHandler.prototype.receiveInput = function (inputSpecifications, callback) {
            var modifiedSpecifications = inputSpecifications;

            if(inputSpecifications === undefined || inputSpecifications === null) {
                modifiedSpecifications = this._config.defaultInputSpecification;
            }

            console.log(modifiedSpecifications);
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
            var width = this._config.boundingBoxWidth / 2.0;
            var height = this._config.boundingBoxHeight / 2.0;

            var lat1 = boundingBoxCenter[0] - width;
            var long1 = boundingBoxCenter[1] - height;

            var lat2 = boundingBoxCenter[0] + width;
            var long2 = boundingBoxCenter[1] + height;

            return [lat1, long1, lat2, long2];
        };


        return NaturalLanguageHandler

    });


/*
 //// Default NHS input...
 //if (!someInput){
 //    someInput = ['Near Me','name','Walmart'];
 //}

 /* This 'modifies' the callback so that if the API returns more than one feature, it asks the user
 *  to choose one. This is called once all the input strings are turned into usable numbers.
 *
 *  @param data: This is the data that is returned from calling Overpass API
 **/

//var clarityCallback = function (data) {
//    if (data.features.length > 1) {
//
//        // FUNCTION HERE: Add a function that tells the canvas to prompt the user for clarification.
//        //                prompt is used A.T.M.
//        // WhichLocation asks the user to choose the feature to select for directions.
//        var whichLocation = prompt("Type the number of the location of...(Temp) " + (data.features.length-1).toString(), 0);
//
//        // If the user chose a number, return data.features equal to an array containing that element.
//        if (whichLocation != null){
//            data.features = [data.features[whichLocation]];
//            callback(data)
//        }
//
//        // FUNCTION HERE: Add a function that tells the canvas to hide.
//    } else {
//        callback(data);
//
//        // FUNCTION HERE: Add a function that tells the canvas to hide.
//    }
//};
//
///* This takes the strings from the input and turns them into arrays/numbers.
// *
// *   @param input: input should be the array of strings corrosponding to selected words in the NHL.
// *   @param callbackS1: this should be the call back function that turns the bounding box center into
// *                       a bounding box array. That callback should then call the API.
// **/
//
//var TranslateAndSend = function (input, callbackS1) {
//
//    // This is matts house. This is in case the navigator fails to retrieve user's location.
//    var defaultLocation = [42.026005, -88.342021];//[42.038, -88.323];
//
//    // infoToPass[0] is the array [lat, long] of the start location.
//    // infoToPass[1] is the key for the Overpass API
//    // infoToPass[2] is the value of the key for the Overpass API, this may be blank to return all values
//    //              of the key in the bounding box.
//    var infoToPass = [];
//    infoToPass[1] = input[1];
//    infoToPass[2] = input[2];
//
//    // If the user inputs 'Near Me' as the start location, it tries to use the users current position.
//    if (input[0] === 'Near Me'){
//        if (navigator.geolocation) {
//            var returnUsersLocation = function(inputFromGCP){
//                console.log('return users location');
//                var coords = inputFromGCP.coords;
//                var latitude = coords.latitude;
//                var longitude = coords.longitude;
//                infoToPass[0] = [latitude, longitude];
//                console.log(infoToPass);
//                callbackS1(infoToPass);
//            };
//            var returnDefaultLocation = function(inputFromGCP){
//                console.log('Error finding users location.')
//                infoToPass[0] = defaultLocation;
//                callbackS1(infoToPass);
//            };
//
//            // Sets the location to get directions from as the user's location.
//            // If it fails to get the user's location, it goes to the default location... Matt's house.
//            navigator.geolocation.getCurrentPosition(returnUsersLocation, returnDefaultLocation);
//        }
//    } else {
//
//        //Currently this is here so that it returns the default location if nothing else.
//        // FUNCTION HERE: Put a function here to determine the 'location' of the string and set it
//        //                  to infoToPass[0]
//        infoToPass[0] = defaultLocation;
//        callbackS1(infoToPass)
//    }
//};
//
///* Builds the bounding box based around a center.
// *
// *   @param translatedArrayData: The input array from the NHL after it has been
// *                               processed by translateAndSend.
// **/
//
//var areaFetcherWrapper = function(translatedArrayData){
//
//    // Create an open street map API caller if not done already.
//    if (!OSMDR){OSMDR = new ODR()}
//
//    // Build the bounding box around the center.
//    var boundingBox = self.buildBB(translatedArrayData[0]);
//
//    // Call the API with the translated data and bounding box and return the data from the API
//    //      to the callback.
//    OSMDR.requestOSMData(boundingBox, translatedArrayData[1], clarityCallback, translatedArrayData[2])
//}
//
//// Calls the API after someInput is translated and the bounding box is determined.
//// Translate(someInput) -> areaFetcherWrapper(translatedSomeInput)
//TranslateAndSend(someInput, areaFetcherWrapper)
//
// */