/*
    Authors: Inzamam Rahaman, Matt Evers
 */


define(['http://worldwindserver.net/webworldwind/worldwind.min.js', 'Route','polyline'], function(ww, Route, polyline) {

   'use strict';


    function RouteLayer() {

        this._displayName = 'Routes Layer';
        this._renderableLayer = new WorldWind.RenderableLayer('Routes Layer');
        this._enabled = true;

    }


    RouteLayer.prototype.addViaRoutes = function(start, stop) {
        var longitudeStart = start.longitude;
        var latitudeStart = start.latitude;
        var longitudeStop = stop.longitude;
        var latitudeStop = stop.latitude;

    }


    /*
        Adds a route that is described by the polyline contained in the array
        @param arr : the polyline contained in 1D array
     */
    RouteLayer.prototype.addRoutesByPolyline = function(arr) {
        var route = new Route(arr, {});
        this._renderableLayer.addRenderable(route);
    }

    /*
        Given a json object (as described on https://github.com/Project-OSRM/osrm-backend/wiki/Server-api),
        creates a new Route object and adds it to the renderable layer
        @param geojsonDoc: the json doc that contains the route information
     */
    RouteLayer.prototype.addRoute = function(geojsonDoc) {
        var arrOfRoutes = polyline.decode(geojsonDoc["route_geometry"]);
        arrOfRoutes.forEach(function(entry){
            entry[0] = entry[0]/10
            entry[1] = entry[1]/10
        })
        var route = new Route(arrOfRoutes, geojsonDoc);
        //console.log(arrOfRoutes)
        this._renderableLayer.addRenderable(route);
    }

    /*
        Provides an interface to the renderable layer that is masked by this object
        @param dc: the DrawContext that is supplied to render the renderable layer
     */
    RouteLayer.prototype.render = function(dc) {
        this._renderableLayer.render(dc);
    }

    RouteLayer.prototype.removeAllRenderables = function() {
        this._renderableLayer.removeAllRenderables();
    }


    Object.defineProperties(RouteLayer.prototype, {

        enabled : {
            get: function() {
                return this._enabled;
            },

            set: function(value) {
                this._enabled = value;
                this._renderableLayer.enabled = value;
            }
        },

        displayName: {
            get: function() {
                return this._displayName;
            },

            set: function(value) {
                this._displayName = value;
            }
        }

    });

return RouteLayer

});