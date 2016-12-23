define(['http://worldwindserver.net/webworldwind/worldwind.min.js',
'SurfacePolylineShapeFactory', 'TectonicPlateFactory'],
    function(ww, SurfacePolylineShapeFactory, TectonicPlateFactory) {

    'use strict';


    function TectonicPlatesLayer(plateBoundaries) {

        var self = this;
        this._enabled = true;
        this.displayName = 'Tectonic Plates Layer';
        this.layer = new WorldWind.RenderableLayer('Tectonic Plates Layer');
        var plateFactory = new TectonicPlateFactory();
        this._plateFactory = plateFactory;
        this.defaultData =
            [
                [
                    [10.6667, -61.5167],
                    [ -0.038826, -54.677200 ],
                    [ 0.443182, -54.451200 ]
                ]
            ];

        if(plateBoundaries) {
            this.defaultData = plateBoundaries;
        }

        this.defaultData = this.defaultData.map(function(boundary) {
            return boundary.map(function(point) {
                return new WorldWind.Location(point[1], point[0]);
            });
        });

        //console.log('default data ', this.defaultData);
        //console.log('not drawn ', plateBoundaries[plateBoundaries.length - 1]);

        //console.log('Draing plate', this.defaultData);
        var plates = this.defaultData.map(function(boundary) {
           return plateFactory.createPlate(boundary);
        });

        //console.log('plates to draw ', plates);
        //plates = plates.filter(function(plate) {
        //    if(plate._boundaries !== null) {
        //        if(plate._boundaries.latitude) {
        //            return true;
        //        }
        //    }
        //    return false;
        //});
        this.layer.addRenderables(plates);

        //var shapeAttributes = new WorldWind.ShapeAttributes(null);
        //shapeAttributes.interiorColor = WorldWind.Color.BLACK;
        //shapeAttributes.outlineColor = WorldWind.Color.RED;
        //shapeAttributes.enabled = true;
        //shapeAttributes.outlineWidth = 0.3;
        //
        //this.locations = this.platesDataArray.map(function(arr) {
        //    return new WorldWind.Location(arr[0], arr[1]);
        //});
        //
        //this._enabled = true;
        //
        //var polyLine = new WorldWind.SurfacePolyline(this.locations, shapeAttributes);
        //
        //this.layer.addRenderable(polyLine);

    }

    TectonicPlatesLayer.prototype.render = function(dc) {
        this.layer.render(dc);
    }

    Object.defineProperties(TectonicPlatesLayer.prototype, {

        enabled: {
            get: function() {
                return this._enabled;
            },
            set : function(value) {
                this._enabled = value;
                this.layer.enabled = value;
            }
        }

    });




    return TectonicPlatesLayer;


})