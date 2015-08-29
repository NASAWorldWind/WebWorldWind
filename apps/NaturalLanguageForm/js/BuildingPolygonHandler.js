/**
 * Created by Matthew on 8/13/2015.
 */
/*
* This modules calls the polygon api, calls the building info api.
*
*
 */
define(['OSMBuildingDataRetriever',
        'BuildingFactory',
        'lodash',
        'OpenStreetMapConfig'],
    function (OSMBuildingDataRetriever,
              BuildingFactory,
              _,
              OpenStreetMapConfig) {

        /*
         Given a WorldWind Location or WorldWind Position, uses the maximum bounding
         box distances from the config object to define a bounding box for usage in
         the OpenStreetMap API and the RTree.
         @param center : the object containing the longitude and latitude points of the bounding rect's
         center point
         @return : returns an array, [top, left, bottom, right], that represents the bounding rectangle
         */
        function getBoundingRectLocs (center, grid) {
            var jQueryDoc = $(window.document),
                jQH = jQueryDoc.height(),
                jQW = jQueryDoc.width(),
                R = jQH/jQW,
                size = (grid ||.002);

            center.latitude = Math.round(center.latitude/(2*size))*(2*size);
            center.longitude = Math.round(center.longitude/(2*size/R))*(2*size/R);

            return [
                center.latitude + size,
                center.longitude - size/R,
                center.latitude - size,
                center.longitude + size/R
            ];

        }

        /*
        * Arranges the ordering of a bounding box array in an appropriate manner to be used with rbush
        *
        * @param bbox: any bounding box array
        *
        * @return: Returns bounding box in the form [minlat, minlong, maxlat, maxlon]
         */
        function bboxToNode (bbox) {
            return [
                Math.min(bbox[0],bbox[2]),
                Math.min(bbox[1],bbox[3]),
                Math.max(bbox[0],bbox[2]),
                Math.max(bbox[1],bbox[3])
            ]
        }

        var BuildingPolygonHandler = function ( layer ) {
            var self = this;

            self._OSMBuildingData = new OSMBuildingDataRetriever();
            self._buildingFactory = new BuildingFactory();
            self._config = new OpenStreetMapConfig();
            self._tempBuildingIDTracker = [];
            self._layer = layer;
            self._boxesOwned = {};

            /*
             * Manages building and bounding box calls. Acts as an access point by the layer. The layer calls this
             *  function with draw context as an arg.
             *
             *  @param drawContext: Drawcontext of layer
             */
            self.buildingHandler = function (drawContext) {

                //console.log(drawContext)
                var callCompleteCallback = function () {self.isInCall = false;};
                var eyeAltitude = drawContext.eyePosition.altitude;
                var box = getBoundingRectLocs(
                    {
                        latitude: drawContext.eyePosition.latitude,
                        longitude: drawContext.eyePosition.longitude
                    }

                );

                if (!self.isInCall && eyeAltitude <= self._config._maxBuildingDrawHeight) {
                    self.isInCall = true;
                    self.getBuildingArrayAndType(
                        box,
                        self.buildingRenderableHandler,
                        callCompleteCallback
                    );

                }


            };

            /*
            *   Behaves as callback function for the api caller to add renderables to the layer.
            *
            *   @param building: a renderable building abstraction from the building module.
             */
            self.buildingRenderableHandler = function (building) {
                if (building) {
                    self._layer.addRenderable(building, function(renderable){return renderable.bbox})
                }

            };

        };

        /*
        * If a bounding box has not been called for yet, it calls the api with that bounding box then calls the second
        *   api for the building details. Bounding boxes are stored in a key object for checking if a box has been
        *   called for already. Upon return from the last of the buildings, the call is opened up again for another
        *   call.
        *
        *   @param box: bounding box in the form given by the getboudingrecslocs function.
        *   @param buildingRetreivedCallback: Function to call when a single building date has been returned. This is
        *                                       called with the building as an argument.
        *   @param CompletionCallback: Callback function to call when the last few of the buildings are retrieved or if
        *                               the call has already been made.
         */
        BuildingPolygonHandler.prototype.getBuildingArrayAndType = function (
            box,
            buildingRetreivedCallback,
            CompletionCallback) {
            var self = this;
            //console.log('called')
            var box = [box[0], box[3], box[2], box[1]];
            //console.log(box)
            var boxKey = (box.map(function(entry){return entry.toFixed(5)})).join(',');
            //console.log(boxKey)
            if (!self._boxesOwned[boxKey]) {
                self._boxesOwned[boxKey] = true;
                self._OSMBuildingData.requestOSMBuildingData(box, function (buildingIdArray) {
                    var numberOfBuildingsFullyRetreived = 0;
                    buildingIdArray.forEach(function (buildingData) {
                        var building = self.buildingFromDatum(buildingData);
                        if (self._tempBuildingIDTracker.indexOf(building.id) === -1) {
                            self._tempBuildingIDTracker.push(building.id);
                            self._OSMBuildingData.requestBuildingInfoById(building.id, function (data) {
                                var features = data['features'];
                                if (features) {
                                    var first = features[0];
                                }
                                if (first) {
                                    var properties = first['properties'];
                                }
                                if (properties) {
                                    var tags = properties['tags'];
                                }
                                if (tags) {
                                    var buildingType = tags['building'];
                                }
                                if (buildingType) {
                                    building.buildingType = buildingType;
                                }

                                if (building.buildingType) {
                                    building.bbox = bboxToNode(box);
                                    buildingRetreivedCallback(building)
                                }
                                numberOfBuildingsFullyRetreived++;
                                //console.log(numberOfBuildingsFullyRetreived, 'of', buildingIdArray.length)
                                if (numberOfBuildingsFullyRetreived >= buildingIdArray.length - 5) {
                                    CompletionCallback()
                                }

                            });
                        } else {
                            numberOfBuildingsFullyRetreived++;
                            //console.log(numberOfBuildingsFullyRetreived, 'of', buildingIdArray.length)
                            if (numberOfBuildingsFullyRetreived >= buildingIdArray.length - 5) {
                                CompletionCallback()
                            }

                        }

                    });
                })
            } else {
                //console.log('This is an old box');
                CompletionCallback()
            }
        };

        /*
        * Puts building data from the api into a form that we can work with.
        *
        * @param buildingData: Building data as returned by the api
        *
        * @return: building renderable abstraction as given by the building module.
         */
        BuildingPolygonHandler.prototype.buildingFromDatum = function(buildingData) {
            var self = this;
            var id = buildingData['id'];
            var geometry = buildingData['geometry'];
            var coordinates = geometry['coordinates'];
            var points = coordinates[0];
            var polygon = _.map(points, function(point) {
                return new WorldWind.Position(point[1], point[0], 100);
            });

            return self._buildingFactory.createBuilding(id, polygon, undefined);
        };

        return BuildingPolygonHandler
    }
);