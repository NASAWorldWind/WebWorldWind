define(['http://worldwindserver.net/webworldwind/worldwind.min.js'], function(ww) {

    'use strict';

    function SurfacePolylineShapeFactory(attributes) {

        this._attributes = attributes;

    }


    SurfacePolylineShapeFactory.prototype.createSurfacePolylineShape = function(locations) {
        var _locations = locations;
        //_locations.push(_locations[_locations.length - 1]);
        return new WorldWind.SurfacePolyline(_locations, this._attributes);
    }

    Object.defineProperties(SurfacePolylineShapeFactory.prototype, {
       attributes : {
           get: function() {
               return this._attributes;
           },

           set: function(value) {
               this._attributes = value;
           }

       }
    });

    return SurfacePolylineShapeFactory;


});
