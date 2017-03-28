
define(['http://worldwindserver.net/webworldwind/worldwind.min.js','./Cylinder'],
    function(ww, Cylinder) {
    'use strict';

        function GetColorFromSpectrum (fraction,spectrumArrayColors,wwS){
            //array looks like [[r,g,b],[r,g,b],...
            var divisions = spectrumArrayColors.length-1;
            for (var i = 0; i < divisions; i++){
                if (fraction >= i/divisions && fraction <= (i+1)/divisions){
                    var r = spectrumArrayColors[i][0]+fraction*(spectrumArrayColors[i+1][0]-spectrumArrayColors[i][0]),
                        g = spectrumArrayColors[i][1]+fraction*(spectrumArrayColors[i+1][1]-spectrumArrayColors[i][1]),
                        b = spectrumArrayColors[i][2]+fraction*(spectrumArrayColors[i+1][2]-spectrumArrayColors[i][2]);
                    if (!wwS){
                        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                        //return "rgb("+ Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")";
                    }else{
                        return new WorldWind.Color(r/255,g/255,b/255,1)
                    }

                }
            }

        }

        var EarthquakeViewLayer = function (wwd, name, columns) {
            var self = this;
            this._columns = columns;
            this._placemarks = true;
            this._wwd = wwd;
            this._baseLayer = new WorldWind.RenderableLayer(name);
            this._baseLayer._enabled = true;
            this._displayName = name;
            this._enabled = true;
            //this.renderables = []
        };

        EarthquakeViewLayer.prototype.render = function (dc) {
            var self = this;
            console.log("Rendering earthquake layer");
            self._baseLayer.render(dc)
        };

        EarthquakeViewLayer.prototype.addRenderable = function (renderable) {
            var self = this;
            //self.renderables.push(renderable)
            self._baseLayer.addRenderable(renderable)
        };

        EarthquakeViewLayer.prototype.removeAllRenderables = function(){
            var self = this;
            self._baseLayer.removeAllRenderables();
        };

        EarthquakeViewLayer.prototype.filterByMinimumMagnitude = function (earthquakeSet, minimum) {
            var self = this;
            if (!earthquakeSet){
                return
            }
            return earthquakeSet.filter(function(earthquake) {
                return earthquake.magnitude >= (minimum || 2.5);
            })
        };

        EarthquakeViewLayer.prototype.filterByMinimumX = function (earthquakeSet, X, minimum) {
            var self = this;
            return earthquakeSet.filter(function(earthquake) {
                return earthquake[X] >= (minimum || 0);
            })
        };

        EarthquakeViewLayer.prototype.drawEarthquakesV2 = function(earthquakes) {
            var self = this;
            earthquakes.forEach(function(earthquake) {
               earthquake.addToRenderableLayer(self._baseLayer);
            });
            self._wwd.redraw();
        };

        EarthquakeViewLayer.prototype.drawEarthquakes = function(array) {
            var self = this;
            var colorSpect = [[255,0,0],[0,255,0]];
            if (self._placemarks){
                var placemark, highlightAttributes,
                    placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

                //adds all the earthquakes as renderables to the layer
                array.forEach(function(earthquake){
                    var canvas = document.createElement("canvas"),
                        ctx2d = canvas.getContext("2d");
                    var size = earthquake.magnitude*5,
                        c = size / 2  - 0.5,
                        innerRadius = 0,
                        outerRadius = size/2.2;
                    canvas.width = size;
                    canvas.height = size;
                    ctx2d.fillStyle =
                        GetColorFromSpectrum(
                            earthquake.age/array[array.length-1].age,
                            colorSpect);
                    ctx2d.arc(c, c, outerRadius, 0, 2 * Math.PI, false);
                    ctx2d.fill();


                    // Create the placemark.
                    placemark = new WorldWind.Placemark(new WorldWind.Position(earthquake.lat, earthquake.long, 1e2));
                    placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                    placemark.data = earthquake;
                    placemark.indexInRenderables = self._baseLayer.renderables.length-1
                    earthquake.indexInRenderables = self._baseLayer.renderables.length-1

                    // Create the placemark attributes for the placemark.
                    placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                    placemarkAttributes.imageScale = 1;
                    placemarkAttributes.imageColor = new WorldWind.Color(1,1,1,.55);

                    // Wrap the canvas created above in an ImageSource object to specify it as the placemark image source.
                    placemarkAttributes.imageSource = new WorldWind.ImageSource(canvas);
                    placemark.attributes = placemarkAttributes;
                    // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
                    // the default highlight attributes so that all properties are identical except the image scale. You could
                    // instead vary the color, image, or other property to control the highlight representation.
                    highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                    highlightAttributes.imageScale = 1.2;
                    highlightAttributes.imageSource = new WorldWind.ImageSource(canvas);
                    placemark.highlightAttributes = highlightAttributes;
                    // Add the placemark to the layer.
                    self.addRenderable(placemark);
                });
            }
            if (self._columns){
                //grid should be size of gridsquare
                var format = false;

                var column,
                    MapTo,
                    grid = 0;

                array.forEach(function (earthquake) {
                        if (!format) {
                            MapTo = new WorldWind.Location(earthquake.lat, earthquake.long)
                        } else {
                            MapTo = new WorldWind.Location(
                                Math.round(earthquake.lat / grid) * grid,
                                Math.round(earthquake.long / grid) * grid
                            )
                        }
                        var color = GetColorFromSpectrum(
                            earthquake.age/array[array.length-1].age,
                            colorSpect, true);
                        //color = new WorldWind.Color(1,0,0,1)
                        column = (new Cylinder(
                            color,
                            MapTo, .12,
                            earthquake.magnitude * 5e5));
                        column.data = earthquake;
                        column.column = true
                        console.log(column);
                        self.addRenderable(column);
                    }
                );
            }

            self._wwd.redraw()
        };

        EarthquakeViewLayer.prototype.startAnimation = function(renderable) {
            var self = this,
                INDEX = 0;
            if (renderable.animationKey || renderable.column){
                return
            }
            renderable.animationKey = window.setInterval(function () {
                //changes alpha of the placemark
                renderable.attributes.imageColor = new WorldWind.Color(1,1,1,1 - INDEX/20);
                renderable.highlightAttributes.imageColor = new WorldWind.Color(1,1,1,1 - INDEX/20);
                renderable.attributes.imageScale = 2* (.5+INDEX/20);
                renderable.highlightAttributes.imageScale = 2.8* (.5+INDEX/20);
                INDEX++;
                //animation resets after 20
                if (INDEX > 20){
                    INDEX = 0;
                }
                self._wwd.redraw();
            },50)
        };

        EarthquakeViewLayer.prototype.stopAnimation = function(renderable){
            if (renderable.animationKey){
                renderable.attributes.imageColor = new WorldWind.Color(1,1,1,1);
                renderable.highlightAttributes.imageColor = new WorldWind.Color(1,1,1,1);
                renderable.attributes.imageScale = 1;
                renderable.highlightAttributes.imageScale = 1.2;
                clearInterval(renderable.animationKey);
            }
            renderable.animationKey = false;
        };

        EarthquakeViewLayer.prototype.stopAllAnimations = function(){
            var self = this;
            self._baseLayer.renderables.forEach(function(renderable){
                self.stopAnimation(renderable)
            })
        };

        Object.defineProperties(EarthquakeViewLayer.prototype, {
            enabled : {
                get: function() {
                    return this._enabled;
                },

                set: function(value) {
                    this._enabled = value;
                }
            },

            displayName: {
                get: function() {
                    return this._displayName;
                }
            },

            currentTiles: {
                get: function() {
                    var tiles = this._baseLayer.currentTiles;
                    return tiles;
                }
            }


        });


        return EarthquakeViewLayer;

});
