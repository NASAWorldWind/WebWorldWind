/**
 * Created by Matthew on 8/4/2015.
 */

define(['./EarthquakeViewLayer',
        './USGSDataRetriever',
        './MinimumMagnitudeSlider',
        './CommandsPanel',
        './TectonicPlatesLayer',
        './PlateBoundaryDataProvider',
        './TourManager',
        './Tour'],
    function(
        EarthquakeViewLayer,
        USGSDataRetriever,
        MinimumMagnitudeSlider,
        CommandsPanel,
        TectonicPlatesLayer,
        PlateBoundaryDataProvider,
        TourManager,
        Tour){

        function sortWithIndeces(toSortI, property) {
            var toSort = toSortI.slice();
            for (var i = 0; i < toSort.length; i++) {
                toSort[i] = [toSort[i], i];
            }
            if (property){toSort.sort(function (left, right) {
                return left[0][property] < right[0][property] ? -1 : 1;
            });
            } else {
                toSort.sort(function (left, right) {
                    return left[0] < right[0] ? -1 : 1;
                });
            }

            toSort.sortIndices = [];
            for (var j = 0; j < toSort.length; j++) {
                toSort.sortIndices.push(toSort[j][1]);
                toSort[j] = toSort[j][0];
            }
            return toSort;
        }

        var EarthquakeApp = function(wwd, name){
            var self = this;
            self.wwd = wwd;
            self.applicationName = 'QuakeScape'
            self._displayName = name;
            self.sortedData = {};
            self.sortingMaps = {};
            self._focusedEarthquakeAgeIndex = 0; //age units, i.e the youngest earthquake
            self.goToAnimator = new WorldWind.GoToAnimator(self.wwd);

            var plateData = new PlateBoundaryDataProvider();
            var plateRecords = plateData.records;
            var tectnonicPlatesLayer = new TectonicPlatesLayer(plateRecords);

            this.wwd.addLayer(tectnonicPlatesLayer);

            console.log('Calling USGS');



            self.createEarthquakeLayer();


            // Retrieve data from USGS then populate the layer.
            self.retrieveUSGSData(
                function (usgsData) {
                    self.populateEarthquakeLayer(self, usgsData)
                }
            );

            // Initiate the highlight controller.
            self.initHighlightAndSelectController(
                self.earthquakeLayer._baseLayer,
                function(renderable){self.highlightSelectionHandler(self, renderable)},
                'mousemove'
            );




            // Initiate a magnitude control slider.
            var MagSlider = new MinimumMagnitudeSlider('MinMagSlider', 'minMag', function(slider){
                self.magnitudeSliderHandler(self, slider)
            });

            // Initiate the commands panel
            self.createCommandsPanel('cpanel', '#Panels')

        };

        EarthquakeApp.prototype.magnitudeSliderHandler = function (self, slider) {
            self.populateEarthquakeLayer(self, self.latestData, slider.value)
        };

        EarthquakeApp.prototype.createEarthquakeLayer = function(){
            var self = this;
            console.log(self);
            self.earthquakeLayer = new EarthquakeViewLayer(self.wwd, self._displayName, true);
            self.wwd.addLayer(self.earthquakeLayer._baseLayer);
            // It should be this, I don't know why it isn't working.
            //self.wwd.addLayer(self.earthquakeLayer)
            //console.log(self.wwd.layers)

        };

        EarthquakeApp.prototype.populateEarthquakeLayer = function(self, USGSData, minimum) {
            //var self = this;
            //console.log(self)
            self._focusedEarthquakeAgeIndex = 0;
            if (!self.earthquakeLayer){
                self.createEarthquakeLayer()
            }

            self.latestData = USGSData;
            self.sortedData['age'] = self.latestData;
            self.earthquakeLayer.removeAllRenderables();

            self.earthquakeLayer.drawEarthquakesV2(
                self.earthquakeLayer.filterByMinimumMagnitude(USGSData,(minimum || 5))
            );

            self.updateRenderedEarthquakeList(self.earthquakeLayer.filterByMinimumMagnitude(USGSData,(minimum || 5)))
        };

        EarthquakeApp.prototype.updateRenderedEarthquakeList = function(list){
            var self = this;
            self.renderedEarthquakes = list;
            self.sortDataByX(list, 'magnitude')
        };

        EarthquakeApp.prototype.retrieveUSGSData = function(callback) {
            var USGSCaller = new USGSDataRetriever();
            USGSCaller.retrieveRecords(callback)
        };

        /*
         * Creates a mouse listener that highlights placemarks on a layer if the mouse is over that placemark.
         *
         * @param renderableLayer: Layer to add the listener to. The highlight controller will only highlight placemarks
         *                           on this layer.
         */
        EarthquakeApp.prototype.initHighlightController = function (renderableLayer) {
            var self = this;
            console.log(renderableLayer);
            var ListenerForHighlightOnLayer = function(o) {
                var worldWindow = self.wwd,
                    highlightedItems = [];
                // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
                // the mouse or tap location.
                var x = o.clientX,
                    y = o.clientY;
                var redrawRequired = renderableLayer.renderables.length > 0; // must redraw if we de-highlight previous shapes
                // De-highlight any previously highlighted shapes.

                renderableLayer.renderables.forEach(function (renderable) {
                    renderable.unHighlight()//ed = false
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
            self.wwd.addEventListener('mousemove', ListenerForHighlightOnLayer);
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
        EarthquakeApp.prototype.initHighlightAndSelectController = function (renderableLayer, callback, event) {
            var self = this;

            //Create a highlight controller for the layer.
            self.initHighlightController(renderableLayer);

            var ListenerForClickOnPlacemark = function (o) {
                // Calls the callback for each highlighted placemark. There should only be one so this shouldn't be
                //  an issue.
                renderableLayer.renderables.forEach(function(renderable){
                    if (renderable.isHighlighted()){
                        renderable.clickedEvent = o;
                        callback(renderable);
                        renderable.clickedEvent = false;
                    }
                });

            };
            self.wwd.addEventListener((event || 'mousedown'), ListenerForClickOnPlacemark);
        };

        EarthquakeApp.prototype.highlightSelectionHandler = function(self, earthquake){
            console.log('highlight handler called')
            console.log(earthquake)
            self.setFocusedEarthquake(earthquake._indexInRenderables)
        };

        EarthquakeApp.prototype.setFocusedEarthquake = function(ageArrayIndex, renderable){
            var self = this;
            var displayDiv = $('#eData');
            //console.log(ageArrayIndex);
            //console.log(self.earthquakeLayer._baseLayer.renderables);
            //console.log(self.earthquakeLayer._baseLayer.renderables[ageArrayIndex]);
            renderable = (renderable || self.earthquakeLayer._baseLayer.renderables[ageArrayIndex]);
            if (!renderable){
                return
            }
            self._focusedEarthquakeAgeIndex = ageArrayIndex;

            displayDiv.empty();
            var info = renderable.info;
            console.log('info to display ', info);
            displayDiv.append(info);

            if (!renderable.animationKey){
                self.earthquakeLayer.stopAllAnimations();
            }

            if (renderable){
                self.earthquakeLayer.startAnimation(renderable)
            }

        };

        EarthquakeApp.prototype.goToFocusedEarthquake = function () {
            var self = this;
            var goToAnimator = self.goToAnimator;
            var pos = new WorldWind.Position(
                self.earthquakeLayer._baseLayer.renderables[ self._focusedEarthquakeAgeIndex].data.lat,
                self.earthquakeLayer._baseLayer.renderables[ self._focusedEarthquakeAgeIndex].data.long,
                1e7);
            console.log('going to ', pos);
            goToAnimator.goTo(pos);
        };

        EarthquakeApp.prototype.createCommandsPanel = function(id, parentNode){
            var self = this;
            self.commandsPanel = new CommandsPanel(id, parentNode);

            self.populateCommandsPanel();
        };

        EarthquakeApp.prototype.populateCommandsPanel = function(){
            var self = this;


            var greaterMagnitudeButton = function () {
                console.log(self.sortingMaps['age']['magnitude'][self._focusedEarthquakeAgeIndex]);
                var nextLargestEarthquake = self.sortingMaps['magnitude']['age'][
                    Math.min(
                        self.sortingMaps['age']['magnitude'][self._focusedEarthquakeAgeIndex] + 1,
                        self.sortingMaps['age']['magnitude'].length-1
                    )
                ];
                self.setFocusedEarthquake(nextLargestEarthquake)
                self.goToFocusedEarthquake()
            };

            self.commandsPanel.addButton('Next Largest Magnitude', greaterMagnitudeButton)

            var lesserMagnitudeButton = function () {
                console.log(self.sortingMaps['age']['magnitude'][self._focusedEarthquakeAgeIndex]);
                var Earthquake = self.sortingMaps['magnitude']['age'][
                    Math.max(
                        self.sortingMaps['age']['magnitude'][self._focusedEarthquakeAgeIndex] - 1,
                        0
                    )
                ];
                self.setFocusedEarthquake(Earthquake)
                self.goToFocusedEarthquake()
            };

            self.commandsPanel.addButton('Next Smaller Magnitude', lesserMagnitudeButton);

            var olderEarthquakeButton = function () {
                console.log(self.sortingMaps['age']['magnitude'][self._focusedEarthquakeAgeIndex]);
                var Earthquake = Math.min(
                    self._focusedEarthquakeAgeIndex+1,
                    self.earthquakeLayer._baseLayer.renderables.length-1
                );
                self.setFocusedEarthquake(Earthquake)
                self.goToFocusedEarthquake()
            };

            self.commandsPanel.addButton('Older Earthquake', olderEarthquakeButton);

            var youngerEarthquakeButton = function () {
                console.log(self.sortingMaps['age']['magnitude'][self._focusedEarthquakeAgeIndex]);
                var Earthquake = Math.max(self._focusedEarthquakeAgeIndex-1,0);
                self.setFocusedEarthquake(Earthquake)
                self.goToFocusedEarthquake()
            };

            self.commandsPanel.addButton('Younger Earthquake', youngerEarthquakeButton);

            var youngestEarthquakeButton = function () {
                console.log(self.sortingMaps['age']['magnitude'][self._focusedEarthquakeAgeIndex]);
                var Earthquake = 0;
                self.setFocusedEarthquake(Earthquake)
                self.goToFocusedEarthquake()
            };

            self.commandsPanel.addButton('Youngest Earthquake', youngestEarthquakeButton);

            /////// For the tour button ///////

            //////////////////////////////////

            var startTourButton = function(event) {
                var quakesInTour = self.renderedEarthquakes;

                function getQuakePosition(quake) {
                    return new WorldWind.Position(quake.lat, quake.long, 100000);
                }

                var magnitudeTour = new Tour('Magnitude Tour',quakesInTour, getQuakePosition, function(q1, q2) {
                    return Math.ceil(-q1.magnitude + q2.magnitude);
                });
                magnitudeTour.addStopCallback(function(quake){
                    console.log(quake);
                    console.log(quake.indexInRenderables);
                    self.setFocusedEarthquake(quake.indexInRenderables)});
                var magnitudeTourManager = new TourManager(magnitudeTour, self.goToAnimator);

                if (!magnitudeTourManager.tourRun && !self.touring) {
                    magnitudeTourManager.startTour();
                    console.log('running');
                    $(event.target).attr('class','btn btn-danger');
                    $(event.target).text("Stop Touring");
                    magnitudeTourManager.addCallback(function(t){
                        $(event.target).attr('class','btn btn-primary');
                        $(event.target).text("Start Tour");
                    });
                    self.touring = magnitudeTourManager;
                }else{
                    self.touring.stopTour();
                    self.touring = false;
                    console.log('stopped');
                    $(event.target).attr('class','btn btn-primary');
                    $(event.target).text("Start Tour");
                }
            }

            self.commandsPanel.addButton('Tour', startTourButton)
        };

        // The input data should always be age
        EarthquakeApp.prototype.sortDataByX = function(data, property){
            var self = this;

            // Create a 1-1 map from age to property
            var sortedBy = sortWithIndeces(data, property);
            var sortedByMap = sortedBy.sortIndices;

            // Create the inverse map
            var reverseSortedBy = sortWithIndeces(sortedByMap);
            var reverseSortedByMap = reverseSortedBy.sortIndices;

            if (!self.sortingMaps['age']){
                self.sortingMaps['age'] = {}
            }

            self.sortingMaps['age'][property] = reverseSortedByMap;

            if (!self.sortingMaps[property]){
                self.sortingMaps[property] = {}
            }
            self.sortedData[property] = sortedBy;
            // Takes units magnitude (aka 1 as in the smallest earthquake) and returns units of age
            self.sortingMaps[property]['age'] = sortedByMap;

            //console.log(self.latestData[self.sortingMaps['magnitude']['age'](1)])
        };
        //EarthquakeApp.prototype.populateEarthquakeLayer = function(USGSData) {
        //    var self = this;
        //    if (!self.earthquakeLayer){
        //        self.createEarthquakeLayer()
        //    }
        //
        //    self.earthquakeLayer.drawEarthquakes(USGSData)
        //};

        return EarthquakeApp
    }
);
