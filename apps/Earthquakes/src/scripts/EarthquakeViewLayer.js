
define(['http://worldwindserver.net/webworldwind/worldwind.min.js'
,'Cylinder'], function(ww, Cylinder) {
    'use strict';
    var EarthquakeViewLayer = function (worldWindow,name) {
        var wwd = worldWindow;
        var eLayer = new WorldWind.RenderableLayer(name); //creates the layer on which the earthquakes will be mapped

        //manages most of what goes on in the layer. See methods of Manage for more details.
        eLayer.Manage = {

            //determines whether to draw columns or placemarks
            setDisplayType: function (arg) {
                eLayer.Manage.Draw.display = arg
            },

            //adds things to the layer
            Draw: {
                //returns color based on the array and the fraction.
                GetColorSpectrum: function (fraction,spectrumArrayColors,wwS){
                    var format = (wwS === undefined) ? true : false;
                    //array looks like [[r,g,b],[r,g,b],...
                    var divisions = spectrumArrayColors.length-1;
                    for (var i = 0; i < divisions; i++){
                        if (fraction >= i/divisions && fraction <= (i+1)/divisions){
                            var r = spectrumArrayColors[i][0]+fraction*(spectrumArrayColors[i+1][0]-spectrumArrayColors[i][0]),
                                g = spectrumArrayColors[i][1]+fraction*(spectrumArrayColors[i+1][1]-spectrumArrayColors[i][1]),
                                b = spectrumArrayColors[i][2]+fraction*(spectrumArrayColors[i+1][2]-spectrumArrayColors[i][2]);

                            if (format){
                                return "rgb("+ Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")";
                            }else{
                                return new WorldWind.Color(r/255,g/255,b/255,1)
                            }

                        }
                    }

                },
                //draws all the earthquakes in eLayer.Manage.ParsedData onto the layer
                Placemarks: function () {
                    eLayer.Manage.Animations.canAnimate = true;
                    eLayer.Layer.clearLayer();
                    var placemark, highlightAttributes,
                        placemarkAttributes = new WorldWind.PlacemarkAttributes(null),
                        Array = eLayer.Manage.ParsedData;
                    var colorSpect = [[255,0,0],[0,255,0]];


                    //adds all the earthquakes as renderables to the layer
                    for (var i = 0; i < Array.length; i++){
                        // Create the custom image for the placemark for each earthquake.
                        var canvas = document.createElement("canvas"),
                            ctx2d = canvas.getContext("2d"),
                            size = Array[i].magnitude*5 , c = size / 2  - 0.5, innerRadius = 0, outerRadius = Array[i].magnitude*2.2;
                        canvas.width = size;
                        canvas.height = size;

                        ctx2d.fillStyle = eLayer.Manage.Draw.GetColorSpectrum(Array[i].age/eLayer.Manage.Data[eLayer.Manage.Data.length-1].age,colorSpect)
                        ctx2d.arc(c, c, outerRadius, 0, 2 * Math.PI, false);
                        ctx2d.fill();

                        // Create the placemark.
                        placemark = new WorldWind.Placemark(new WorldWind.Position(Array[i].lat, Array[i].long, 1e2));
                        placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

                        // Create the placemark attributes for the placemark.
                        placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                        placemarkAttributes.imageScale = 1;
                        placemarkAttributes.imageColor = new WorldWind.Color(1,1,1,.55)

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
                        eLayer.addRenderable(placemark);
                    }
                    wwd.redraw();
                },

                Columns: function (grid) {
                    //grid should be size of gridsquare
                    var format = (grid === undefined) ? true : false;

                    eLayer.Layer.clearLayer();

                    var earthRadiusInfo = {
                        earthRadiusInKm : 6317,
                        earthRadiusInM : 6317 * 1000,
                    }

                    var EarthToCartesian = function (longitude, latitude) {
                        var R  = earthRadiusInfo.earthRadiusInKm;
                        var x = R * Math.cos(latitude) * Math.cos(longitude);
                        var y = R * Math.cos(latitude) * Math.sin(longitude);
                        var z = R * Math.sin(latitude);
                        return {
                            x : x,
                            y : y,
                            z : z
                        };
                    };

                    var CartesianToEarth = function (x, y, z) {
                        var R = earthRadiusInfo.earthRadiusInKm;
                        var lat = Math.asin(z /  R);
                        var long = Math.atan2(x, y);
                        return new WorldWind.Location(lat, long);
                    };

                    var ThreeDimensionalCyclinder = function (color, center, radius, height) {


                        //var coordinates = EarthToCartesian(center.longitude, center.latitude);
                        //
                        //function getXCoordinate(angle) {
                        //    return center.longitude + radius * Math.sin(angle);
                        //}
                        //
                        //function getYCoordinate(angle) {
                        //    return center.latitude + radius * Math.cos(angle);
                        //}
                        //
                        //var numPoints = 3;
                        //
                        //var angles = [];
                        //
                        //var fullCircle = 2 * Math.PI;
                        //
                        //var step = fullCircle / numPoints;
                        //
                        //var start = 0;
                        //
                        //for(var idx = 0; idx < numPoints; idx++) {
                        //    angles.push(start);
                        //    start += step;
                        //}
                        //
                        //var locations = angles.map(function(angle) {
                        //    var x = getXCoordinate(angle);
                        //    var y = getYCoordinate(angle);
                        //    return [x, y];
                        //});
                        //
                        //
                        //var positions = locations.map(function(location) {
                        //    var loc = CartesianToEarth(location[0], location[1], coordinates.z)
                        //    var lat = location[1];
                        //    var long = location[0];
                        //    return new WorldWind.Position(lat, long, height);
                        //});
                        //
                        //var boundaries = [positions, []];
                        //
                        //for(var idx = 0; idx < positions.length; idx += 1) {
                        //    boundaries[1].push(new WorldWind.Position(center.latitude, center.longitude, height));
                        //}
                        //
                        //
                        //
                        //var cylinderAttribute = new WorldWind.ShapeAttributes(null);
                        //cylinderAttribute.interiorColor = color;
                        //cylinderAttribute.outlineColor = color;
                        //cylinderAttribute.drawInterior = true;
                        //cylinderAttribute.drawVerticals = true;
                        //
                        //var cylinder = new WorldWind.Polygon(boundaries);
                        //cylinder.attributes = cylinderAttribute;
                        //cylinder.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                        //cylinder.extrude = true;
                        //
                        //cylinder.eyeDistanceScalingThreshold = 1e6;
                        //
                        //cylinder.enabled = true;
                        //
                        //var cylinderRender = cylinder.render;
                        //
                        //function flatten(arr) {
                        //    var ans = [].concat.apply([], arr);
                        //    return ans;
                        //}
                        //
                        //
                        //
                        //cylinder.render = function(dc) {
                        //    //var cylinderBoundaries = flatten(cylinder._boundaries);
                        //    //var someBoundary = flatten(cylinderBoundaries[0]);
                        //    //var currHeight = someBoundary;
                        //    ////console.log(currHeight);
                        //    //var eyeDistance = Math.abs(dc.eyePosition.altitude - currHeight.altitude);
                        //    ////console.log(eyeDistance);
                        //    //var visibilityScale = Math.max(0.0, Math.min(1, this.eyeDistanceScalingThreshold /
                        //    //    eyeDistance));
                        //    //
                        //    //if(Math.floor(visibilityScale) < 1) {
                        //    //    cylinderBoundaries.forEach(function(boundary) {
                        //    //       boundary.altitude = visibilityScale * boundary.altitude;
                        //    //    });
                        //    //}
                        //
                        //    cylinderRender(dc);
                        //}
                        //
                        //
                        //return cylinder;

                        return new Cylinder(color, center, radius, height);


                    }

                    var colorSpect = [[255,0,0],[0,255,0]];

                    eLayer.Manage.Animations.canAnimate = false
                    var Array = eLayer.Manage.ParsedData,
                        column,
                        MapTo;
                    for (var i = 0; i < Array.length; i++){
                        if (format){
                            MapTo = new WorldWind.Location(Array[i].lat, Array[i].long)
                        } else {
                            MapTo = new WorldWind.Location(Math.round(Array[i].lat/grid)*grid, Math.round(Array[i].long/grid)*grid)
                        }

                        column = ThreeDimensionalCyclinder(
                            eLayer.Manage.Draw.GetColorSpectrum(Array[i].age/eLayer.Manage.Data[eLayer.Manage.Data.length-1].age,colorSpect,true),
                            MapTo,.12,
                            Array[i].magnitude *5e5);
                        eLayer.addRenderable(column);
                    }
                    wwd.redraw();
                },
            },

            //adds the data to the layer (does not draw on the layer). Stores all data in eLayer.Manage.Data as array of earthquake objects
            createDataArray: function (JSONFile) {
                eLayer.Manage.Data = JSONFile;
                eLayer.Manage.parseDataArrayMag(2);//parse out most of the insignificant earthquakes.
            },

            //shows the array of all earthquake objects and returns it if needed
            showDataArray:function(){
                console.log(eLayer.Manage.Data);
                return eLayer.Manage.Data
            },

            //filters the data array to eLayer.Manage.ParsedData which contains earthquakes that meet or exceed the argument.
            parseDataArrayMag: function (val) {

                eLayer.Manage.ParsedData = eLayer.Manage.Data.filter(function(earthquake) {
                    return earthquake.magnitude >= val;
                });


                if (eLayer.Manage.Draw.display === 'columns'){
                    eLayer.Manage.Draw.Columns();
                } else if (eLayer.Manage.Draw.display === 'placemarks'){
                    eLayer.Manage.Draw.Placemarks();
                } else {
                    eLayer.Manage.Draw.Placemarks();
                }

            },

            //controls animated placemarks
            Animations: {

                //animates argument renderable.
                animate: function (renderable) {
                    if (!eLayer.Manage.Animations.canAnimate){
                        return
                    }

                    if (eLayer.Manage.ParsedData.length > 0 && eLayer.Manage.Animations.animating === true) {
                        eLayer.Manage.Animations.stopAnimation();

                    } else if (!eLayer.Manage.ParsedData.length > 0){
                        return
                    }

                    //saves the renderable memory location
                    eLayer.Manage.Animations.animated = renderable;

                    var INDEX = 0;

                    //grabs the interval key and begins animation
                    eLayer.Manage.Animations.animated.Key = window.setInterval(function () {
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
                        eLayer.Manage.Animations.animating = true;
                        wwd.redraw();
                    },50)
                },

                //self explanatory
                stopAnimation: function () {

                    //stops animation
                    clearTimeout(eLayer.Manage.Animations.animated.Key);

                    //restore original properties
                    eLayer.Manage.Animations.animated.attributes.imageScale = 1;
                    eLayer.Manage.Animations.animated.highlightAttributes.imageScale = 1.2;
                    eLayer.Manage.Animations.animated.attributes.imageColor = new WorldWind.Color(1,1,1,.55)
                    eLayer.Manage.Animations.animated.highlightAttributes.imageColor = new WorldWind.Color(1,1,1,.55);

                    eLayer.Manage.Animations.animating = false;
                }
            }
        };

        //contains various layer functions
        eLayer.Layer = {
            //clears the layer for the earthquake data to be refreshed or changed
            clearLayer: function () {
                eLayer.removeAllRenderables();
            }
        };
        return eLayer
    };

    return EarthquakeViewLayer;

});
