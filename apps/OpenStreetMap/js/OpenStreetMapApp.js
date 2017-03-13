
/*
    This module acts as the application entry point
 */

define(['http://worldwindserver.net/webworldwind/worldwind.min.js',
        'OpenStreetMapLayer',
        'OpenStreetMapConfig',
        'jquery',
        'OSMDataRetriever','RouteLayer', 'Route','RouteAPIWrapper','NaturalLanguageHandler', 'polyline',
        'MapQuestGeocoder'],
    function(ww,
             OpenStreetMapLayer,
             OpenStreetMapConfig,
             $,
             OSMDataRetriever, RouteLayer, Route, RouteAPIWrapper, NaturalLanguageHandler, polyline, MapQuestGeocoder) {


        'use strict';

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var OpenStreetMapApp = function() {
            var self = this;

            this._config = new OpenStreetMapConfig();



            /*
             Changes the size of the canvas that renders the world wind globe
             */
            $(this._config.canvasIDString).
                attr('width',
                this._config.canvasWidth);
            $(this._config.canvasIDString).
                attr('height',
                this._config.canvasHeight);

            this._wwd = new WorldWind.WorldWindow(this._config.canvasName);

            this._layers = [new OpenStreetMapLayer(this._wwd),
                new WorldWind.CompassLayer(this._wwd), new WorldWind.ViewControlsLayer(this._wwd)];

            this._layers.forEach(function (layer) {
                self._wwd.addLayer(layer);
            });

            var self = this;

            this._animator = new WorldWind.GoToAnimator(self._wwd);

            //this._animator.goTo(self._config.startPosition);

            var naturalLanguageHandler = new NaturalLanguageHandler(self._wwd);

            var routeLayer = new RouteLayer();

            this._wwd.addLayer(routeLayer);

            var routeFinder = new RouteAPIWrapper();

            var renderableLayer = new WorldWind.RenderableLayer('Pins');

            this._wwd.addLayer(renderableLayer);



            function processUserInput(specs, data) {
                console.log(specs);
                console.log(data);

                var fromLatitude = specs.startPosition[0];
                var fromLongitude = specs.startPosition[1];




                var toPoint = data[0];

                var toLocation = toPoint.location;
                var toLatitude = toLocation.latitude;
                var toLongitude = toLocation.longitude;


                var locationArray = [fromLatitude, fromLongitude, toLatitude, toLongitude];
                routeFinder.getRouteData(locationArray, function(routeData) {
                    console.log('routeInformation : ', routeData);
                    routeLayer.addRoute(routeData);
                });
            }


            var address = 'Piazza Leonardo da Vinci, 32, 20133 Milano, Italy';

            var amenityType = 'cafe';



            function callGeocoder(amenityType, address) {

                var geocoder = new MapQuestGeocoder();
                geocoder.getLatitudeAndLong(address, function(location) {
                    console.log('Como, Italy is at');
                    var worldWindLoc = new WorldWind.Position(location.latitude, location.longitude, 1e3);
                    var animator = new WorldWind.GoToAnimator(self._wwd);
                    animator.goTo(worldWindLoc);

                    var specs = {
                        longitude : location.longitude,
                        latitude : location.latitude,
                        useCurrentLocationForNavigation : false,
                        overpassKey : 'amenity',
                        overpassValue : amenityType
                    };

                    naturalLanguageHandler.receiveInput(specs, processUserInput);

                });

            }

            callGeocoder('cafe', address);


        }

        return OpenStreetMapApp;


});


///*
//
// naturalLanguageHandler.receiveInput(['Near Me', 'name', 'Wallmart'], function(data) {
//
// // Something to go to and draw directions.
// // Matt's House
// var defaultLoc = [42.0362415,-88.3450904];
//
// // Create a layer to draw routes on.
// var routeLayer = new RouteLayer();
//
// // initData initialized. This is so that the BoundingBox can be added
// //          as a property of the data for use later.
// var initData = data;
//
// // If there is ONE place returned, this draws a route to it.
// // The NLH should filter this data.features to one entry.
// // Check if data is returned.
// if (data.features) {
//
// // If data is returned, check if any features in data.features.
// if (data.features.length != 0) {
//
// // This array contains the start point and end point of the route.
// // Currently the array ALWAYS starts at Matt's house.
// // The destination changes based on the data returned.
// var routeArray = [
// defaultLoc[0],
// defaultLoc[1],
// data.features[0].geometry.coordinates[1],
// data.features[0].geometry.coordinates[0]];
//
// /* Creates a callback function that goes to the position of the route drawn. This gets
// *        called when the route polyline is returned from the routing API.
// *
// * @param data: Data is the return from the Routing API. See that for structure.
// **/
//
//var callback = function (data) {
//    var goToRoute = new WorldWind.GoToAnimator(self._wwd);
//    goToRoute.goTo(new WorldWind.Position(
//        data['via_points'][0][0],
//        data['via_points'][0][1],
//        1e4
//    ));
//
//    routeLayer.addRoute(data);
//}
//
//}
//
//routeFinder.getRouteData(callback, routeArray)
//}
//
//// Polyline for the bounding box to be drawn.
//var drawBox = [
//    [initData.boundingBox[0], initData.boundingBox[1]],
//    [initData.boundingBox[0], initData.boundingBox[3]],
//    [initData.boundingBox[2], initData.boundingBox[3]],
//    [initData.boundingBox[2], initData.boundingBox[1]],
//    [initData.boundingBox[0], initData.boundingBox[1]]
//];
//// Either way, if a feature is returned or not, draw the bounding box.
//routeLayer.addRoutesByPolyline(drawBox);
//self._wwd.addLayer(routeLayer);
//})
//
// */