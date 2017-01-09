define(['http://worldwindserver.net/webworldwind/worldwind.min.js'], function(ww) {

    'use strict';


    function Route(polylineCoordsArray, otherData) {

        this._otherData = otherData;

        this._polylineCoordsArray = polylineCoordsArray.map(function(arr) {
            var longitude = arr[1];
            var latitude = arr[0];
            return new WorldWind.Position(latitude, longitude);
        });

        this._renderable = new WorldWind.SurfacePolyline(this._polylineCoordsArray);
        this._enabled = true;

    }

    /*
        Provides an interface to the render function of the render funciton of the renderable masked
        under this object
        @param dc: the DrawContext object to supply to the render function of the renderable
     */
    Route.prototype.render = function(dc) {
        this._renderable.render(dc);
    }

    Object.defineProperties(Route.prototype, {

        enabled : {
            get: function() {
                return this._enabled;
            },

            set: function(value) {
                this._renderable.enabled = value;
                this._enabled = value;
            }
        }

    });

    return Route

})