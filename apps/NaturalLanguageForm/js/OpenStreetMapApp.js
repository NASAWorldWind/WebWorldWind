
/*
* Author: Matthew Evers, Inzamam Rahaman
*
*/
/*


 */
/*
* This module acts as the application entry point for the citysmart application.
*
* This module is to behave as a SINGLETON application. All queries from the canvas will be handled by ONE instance.
* (See CanvasAppManager)
*
* This application creates 3 layers. A routelayer on which routing will be drawn; a renderable layer on which pins and
*   placemarks will be drawn; and a building layer on which building polygons will be drawn.
*
* This application creates a listener for all placemarks and pins and creates a hud to appear on click. It also creates
*   a HUD with the building color key.
 */
define(['http://worldwindserver.net/webworldwind/worldwind.min.js',
        'OpenStreetMapConfig',
        'jquery',
        'OSMDataRetriever',
        'RouteLayer',
        'Route',
        'RouteAPIWrapper',
        'NaturalLanguageHandler',
        'polyline',
        'MapQuestGeocoder',
        'nlform',
        'nlbuilder',
        'HUDMaker',
        'OSMBuildingDataRetriever',
        'BuildingColorMapping',
        'ApplicationHUDManager',
        'OpenStreetMapRBushLayer'],
    function(ww,
             OpenStreetMapConfig,
             $,
             OSMDataRetriever,
             RouteLayer,
             Route,
             RouteAPIWrapper,
             NaturalLanguageHandler,
             polyline,
             MapQuestGeocoder,
             NLForm,
             NLBuilder,
             HUDMaker,
             OSMBuildingDataRetriever,
             BuildingColorMapping,
             ApplicationHUDManager,
             OpenStreetMapRBushLayer) {


        'use strict';

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        if (!String.prototype.capitalizeFirstLetter) {
            String.prototype.capitalizeFirstLetter = function () {
                return this.charAt(0).toUpperCase() + this.slice(1);
            }
        }

        var OpenStreetMapApp = function(worldwindow, argumentarray) {
            var self = this;

            // This is a requirement if we dont want the app to be run anew for each query.
            this.singletonApplication = true;

            this.HUDManager = new ApplicationHUDManager()

            this._osmBuildingRetriever = new OSMBuildingDataRetriever();
            this._wwd = worldwindow;

            var openStreetMapLayer = new OpenStreetMapRBushLayer(this._wwd);
            this.openStreetMapLayer = openStreetMapLayer;

            this._wwd.addLayer(openStreetMapLayer);

            this._animator = new WorldWind.GoToAnimator(self._wwd);

            var naturalLanguageHandler = new NaturalLanguageHandler(self._wwd);
            this.naturalLanguageHandler = naturalLanguageHandler;

            var routeLayer = new RouteLayer();
            this.routeLayer = routeLayer;

            this._wwd.addLayer(routeLayer);

            this.renderableLayers = []

            var routeLayerRouteBuilder = new (this.RouteBuilder(routeLayer));
            this.routeLayerRouteBuilder = routeLayerRouteBuilder;

            self.newCall(worldwindow, argumentarray)
        };

        /*
        * This function is called by the canvas when the canvas is fully faded out.
         */
        OpenStreetMapApp.prototype.isFocussed = function () {
            if (!this.colorKey) {
                this.colorKey = this.buildColorKey();
            }
            this.HUDManager.unFadeAll()
        };

        /*
         * This function is called by the canvas when the canvas is returned.
         */
        OpenStreetMapApp.prototype.isNotFocussed = function () {
            this.HUDManager.fadeAll()
        };

        /*
        * If this application were to be called a second time by the canvas, it does not a create a new application.
        *   Populates the renderable layer with the amenities queried for inside the bounding box. Builds each placemark
        *   and assigns a HUD to display when each is clicked.
        *
        * @param address: The address to build the bounding box around that bounds the query area.
        * @param amenity: The amenity key to query the OSM Database for.
         */
        OpenStreetMapApp.prototype.newCall = function(ww, argumentarray) {
            var renderableLayer = new WorldWind.RenderableLayer(argumentarray[0].capitalizeFirstLetter());
            //console.log(argumentarray)
            var self = this,
                amenity = argumentarray[0],
                address = argumentarray[1];
            self._wwd.addLayer(renderableLayer);
            self.renderableLayers.push(renderableLayer);
            //First, geocode the address
            this.callGeocoder(address, amenity, function(returnedSpecs) {
                // Second, call the natural language handler with the specs.
                // This calls the callback with data corrosponding to all the amenities of the given
                // amenity type inside a bounding box around the address provided. (returned Specs is the geocoded address)
                self.naturalLanguageHandler.receiveInput(returnedSpecs, function(newSpecs, returnedData){
                    // Third, build the layer.
                    self.buildPlacemarkLayer(renderableLayer, returnedData);
                    // Fourth, add the selection controller to the layer if one does not already exist.
                    self.HighlightAndSelectController(renderableLayer, function (returnedRenderable) {
                        var pointOfRenderable = self.getPointFromRenderableSelection(returnedRenderable.amenity);
                        var hudID = returnedRenderable.amenity._amenity;

                        // Build an overlay when a placemark is clicked on.
                        var HudTest = new HUDMaker(
                            hudID,
                            [returnedRenderable.clickedEvent.x, returnedRenderable.clickedEvent.y]
                        );

                        console.log('hud called');
                        //Sixth, add this point to the route layer and see if it is enough to build a route.
                        if (self.routeLayerRouteBuilder.routeArray.length === 0) {
                            HudTest.assembleDisplay(
                                'Get directions',
                                'from Here',
                                function (o) {
                                    self.routeLayerRouteBuilder.processPoint(pointOfRenderable);
                                    HudTest.close()
                                })
                        } else {
                            HudTest.assembleDisplay(
                                'Get directions',
                                'to Here',
                                function (o) {
                                    self.routeLayerRouteBuilder.processPoint(pointOfRenderable);
                                    HudTest.close()
                                })
                        }

                        self.HUDManager.subscribeHUD(HudTest);

                    })

                })


            });



        };

        /*
        * Constructs a routeBuilder and returns it. This module waits for the selection of two points and then
        * draws a route between those two points.
        *
        * @param routeLayer: The desired layer for this routebuilder to be bound.
         */
        OpenStreetMapApp.prototype.RouteBuilder = function (routeLayer) {
            var self = this;
             var RouteBuilderMod = function  (){
                 var routeBuilder = this;
                 //This should eventually look like [fromLatitude, fromLongitude, toLatitude, toLongitude]
                 // This refers to RouteBuilder
                 routeBuilder.routeArray = [];
                 routeBuilder.routeLayer = routeLayer;

                 // A singleton routefinder.
                 if (!self.routeFinder) {
                 self.routeFinder = new RouteAPIWrapper();
                 }
             };

             /*
             * Concatenates a pointArray of the form [lat, lon] to the attribute routeBuilder.routeArray. Then if
             * the routeArray has 2 points (i.e. a start and stop) then it calls the function to draw the route on the
             * layer.
             *
             * @param pointArray: a pointArray of the form [lat, lon]
             */
            RouteBuilderMod.prototype.processPoint = function (pointArray) {
                var routeBuilder = this;

                routeBuilder.routeArray = routeBuilder.routeArray.concat(pointArray);

                if (routeBuilder.routeArray.length === 4) {
                    routeBuilder.drawRoute(routeBuilder.routeArray);
                    routeBuilder.routeArray = [];
                }
            };

            RouteBuilderMod.prototype.displayInstructions = function (text) {
                var jQueryDoc = $(window.document);
                var directionDisplay = new HUDMaker(
                    'Route Instructions',
                    [jQueryDoc.width() *.3, 0]
                );
                directionDisplay.assembleDisplay(text)
            };

            /*
            * Draws the desired route onto the layer this routebuilder is bound to.
            *
            * @param routeArray: an array of the form [fromLatitude, fromLongitude, toLatitude, toLongitude]
            */
            RouteBuilderMod.prototype.drawRoute = function (routeArray) {
                var routeBuilder = this;
                self.routeFinder.getRouteData(routeArray, function(routeData) {
                    //console.log('routeInformation : ', routeData);
                    routeBuilder.displayInstructions(routeBuilder.buildTextInstructions(routeData['route_instructions']));
                    routeBuilder.routeLayer.addRoute(routeData);
                });
            };

            /*
            * Constructs a string based on the corrosponding number. If the number contains a dash, for example, 11-2,
            *   it constructs the first number + 'then" + the second number.
            *
            * @param angle: integer, or string of integers separated by a dash corresponding to route instructions.
             */
            RouteBuilderMod.prototype.decodeRouteAngle = function (angle) {
                var routeBuilder = this;

                for (var i = 0; i < angle.length; i++){
                    var character = angle[i];
                    if (character === '-'){
                        return routeBuilder.decodeRouteAngle(angle.slice(0,i)) + ' then ' +
                            routeBuilder.decodeRouteAngle(angle.slice(i+1,angle.length))
                    }
                }

                if (angle == 1) {
                    return 'Go Straight';
                } else if (angle == 2) {
                    return 'Turn Slight Right';
                } else if (angle == 3) {
                    return 'Turn Right';
                } else if (angle == 4) {
                    return 'Turn Sharp Right';
                } else if (angle == 5) {
                    return 'U-Turn';
                } else if (angle == 6) {
                    return 'Turn Sharp Left';
                } else if (angle == 7) {
                    return 'Turn Left';
                } else if (angle == 8) {
                    return 'Turn Slight Left';
                } else if (angle == 9) {
                    return 'Reach Via Location';
                } else if (angle == 10) {
                    return 'Head On';
                } else if (angle == 11) {
                    return 'Enter Round About';
                } else if (angle == 12) {
                    return 'Leave Round About';
                } else if (angle == 13) {
                    return 'Stay on Round About';
                } else if (angle == 14) {
                    return 'Start at End of Street';
                } else if (angle == 15) {
                    return 'Arrive at Your Destination'
                }


            };

            /*
            * Builds the html text of instructions.
            *
            * @param arrayOfInstructions: An array containing strings of step by step instructions.
             */
            RouteBuilderMod.prototype.buildTextInstructions = function (arrayOfInstructions) {
                var routeBuilder = this;
                var instructions = '';
                arrayOfInstructions.forEach(function(instruction) {
                    var instructionst = routeBuilder.decodeRouteAngle(instruction[0]);
                    if (instruction[1]){
                        instructionst += ' onto ' + instruction[1];
                    }
                    if (instruction[5] && instruction[5] != '0m'){
                        instructionst += ' for ' + instruction[5];
                    }
                    instructionst += '<br>';
                    instructions += instructionst
                });
                console.log(instructions);
                return instructions
            };

            return RouteBuilderMod

        };

        /*
        * Creates a mouse listener that highlights placemarks on a layer if the mouse is over that placemark.
        *
        * @param renderableLayer: Layer to add the listener to. The highlight controller will only highlight placemarks
        *                           on this layer.
        */
        OpenStreetMapApp.prototype.HighlightController = function (renderableLayer) {
            var self = this;
            self.hasHighlightController = true;
            var ListenerForHighlightOnLayer = function(o) {
                var worldWindow = self._wwd,
                    highlightedItems = [];
                // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
                // the mouse or tap location.
                var x = o.clientX,
                    y = o.clientY;
                var redrawRequired = renderableLayer.renderables.length > 0; // must redraw if we de-highlight previous shapes
                // De-highlight any previously highlighted shapes.
                renderableLayer.renderables.forEach(function (renderable) {
                    renderable.highlighted = false
                });
                // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
                // relative to the upper left corner of the canvas rather than the upper left corner of the page.
                var pickList = worldWindow.pick(worldWindow.canvasCoordinates(x, y));
                if (pickList.objects.length > 0) {
                    redrawRequired = true;
                }
                // Highlight the items picked by simply setting their highlight flag to true.
                if (pickList.objects.length > 0) {
                    for (var p = 0; p < pickList.objects.length; p++) {
                        if (!pickList.objects[p].isTerrain) {
                            pickList.objects[p].userObject.highlighted = true;
                            // Keep track of highlighted items in order to de-highlight them later.
                            highlightedItems.push(pickList.objects[p].userObject);
                        }
                    }
                }
                // Update the window if we changed anything.
                if (redrawRequired) {
                    worldWindow.redraw(); // redraw to make the highlighting changes take effect on the screen
                }
            };
            self._wwd.addEventListener('mousemove', ListenerForHighlightOnLayer);
        };

        /*
         * Creates a mouse listener that highlights placemarks on a layer if the mouse is over that placemark.
         *
         * @param callback: What function to call when a placemark is clicked on. The callback is called with the
         *                      the renderable as a param (with the amenity info in renderable.amenity and clickevent
         *                      in renderable.clickedEvent).
         * @param renderableLayer: Layer to add the listener to. The highlight controller will only highlight placemarks
         *                           on this layer.
         */
        OpenStreetMapApp.prototype.HighlightAndSelectController = function (renderableLayer, callback, callbackWithMouse) {
            var self = this;
            self.hasSelectionController = true;
            //Create a highlight controller for the layer.
            self.HighlightController(renderableLayer);

            var ListenerForClickOnPlacemark = function (o) {
                // Calls the callback for each highlighted placemark. There should only be one so this shouldn't be
                //  an issue.
                renderableLayer.renderables.forEach(function(renderable){
                    if (renderable.highlighted){
                        renderable.clickedEvent = o;
                        callback(renderable);
                    }
                });

            };
            self._wwd.addEventListener('mousedown', ListenerForClickOnPlacemark);
        };

        /*
        *   Populates a layer with placemarks given in an array of ammenities.
        *
        * @param arrayofamenities: An array containing elements geographical location and a name.
        * @param renderableLayer: A worldwind layer to populate.
        */
        OpenStreetMapApp.prototype.buildPlacemarkLayer = function (renderableLayer, arrayofamenities) {
            var pinImgLocation = '../NaturalLanguageForm/img/pinclosed.gif' , // location of the image files
                placemark,
                placemarkAttributes = new WorldWind.PlacemarkAttributes(null),
                highlightAttributes,
                placemarkLayer = renderableLayer,
                latitude,
                longitude;

            // Set up the common placemark attributes.
            placemarkAttributes.imageScale = 1;
            placemarkAttributes.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.3,
                WorldWind.OFFSET_FRACTION, 0.0);
            placemarkAttributes.imageColor = WorldWind.Color.WHITE;
            placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 1.0);
            placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
            //placemarkAttributes.drawLeaderLine = true;
            placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;

            arrayofamenities.forEach(function(amenity){
                latitude = amenity['_location']['latitude'];
                longitude = amenity['_location']['longitude'];
                // Create the placemark and its label.
                placemark = new WorldWind.Placemark(new WorldWind.Position(latitude, longitude, 1e1, true, null));
                placemark.label = amenity['_amenity'];
                placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

                // Create the placemark attributes for this placemark. Note that the attributes differ only by their
                // image URL.
                placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                placemarkAttributes.imageScale = .1;
                placemarkAttributes.imageSource = pinImgLocation;
                placemark.attributes = placemarkAttributes;

                // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
                // the default highlight attributes so that all properties are identical except the image scale. You could
                // instead vary the color, image, or other property to control the highlight representation.
                highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                highlightAttributes.imageScale = .12;
                placemark.highlightAttributes = highlightAttributes;

                //So we can refer to this loc later
                placemark.amenity = amenity;

                // Add the placemark to the layer.
                placemarkLayer.addRenderable(placemark);
            });
        };

        /*
        * Extracts the lat and long information from a given renderable.
        *
        * @param selectedRenderable: A renderable with lat, long information.
        *
        * @return: an array of the form [latitude, longitude] corrosponding to the renderable.
         */
        OpenStreetMapApp.prototype.getPointFromRenderableSelection = function (selectedRenderable) {
            if (selectedRenderable) {
                var toLocation = selectedRenderable.location;
                var toLatitude = toLocation.latitude;
                var toLongitude = toLocation.longitude;
                return [toLatitude, toLongitude]
            }
        };

        /*
        *   Calls the callback function with the geocoded address as a parameter. This also creates a singleton
        *   of the mapquest geocoder.
        *
        *   @param callback: Callback function. This is called with geocoded 'specs' as the parameter.
        *   @param address: Name of location such as 'Mountain View'
        */
        OpenStreetMapApp.prototype.callGeocoder = function (address, amenityType, callback) {
            var self = this;

            // A singleton
            if (!self.Geocoder) {
                self.Geocoder = new MapQuestGeocoder();
            }

            self.Geocoder.getLatitudeAndLong(address, function(location) {
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

                callback(specs)

            });

        };

        /*
        * Builds and displays the color key for buildings.
        */
        OpenStreetMapApp.prototype.buildColorKey = function () {
            var self = this;
            var openStreetMapKey = (new BuildingColorMapping()).getColorKey();
            var jQueryDoc = $(window.document);
            var keyDisplay = new HUDMaker('Building Color Key', [jQueryDoc.width()-260,jQueryDoc.height()-320]);
            openStreetMapKey.forEach(function(pair){
                var colorBox = $('<div>');
                colorBox.css('background', pair[1]);
                colorBox.css('color', 'white');
                colorBox.append(pair[0].capitalizeFirstLetter());
                keyDisplay.addAnchor(colorBox)
            });
            self.HUDManager.subscribeHUD(keyDisplay);
            return keyDisplay
        };

        return OpenStreetMapApp;

});
