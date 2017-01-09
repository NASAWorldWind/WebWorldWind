define(['http://worldwindserver.net/webworldwind/worldwind.min.js',
        'OpenStreetMapConfig',
        'rbush',
        'OSMDataRetriever',
        'Set',
        'OverpassAPIWrapper',
        '../js/polyline'],
    function(ww,
             OpenStreetMapConfig,
             rbush,
             OSMDataRetriever,
             Set,
             OverpassAPIWrapper,
             polyline) {

        'use strict';

        /*
            From the draw context, extracts the current altitude of the eyePosition
         */
        function getEyeAltitude(drawContext) {
            return drawContext.eyePosition.altitude;
        }

        /*
         From the draw context, extracts the current location of the eyePosition
         */
        function getEyeLocation(drawContext) {
            return [drawContext.eyePosition.latitude,drawContext.eyePosition.longitude];
        }

        /*
            Abstracts off of the OpenStreetMap Layer and a Renderable Layer
            to facilitate the display of information to the user
            @param wwd: the WorldWind WorldWindow object to which the layers
                        are to be applied
         */
        function OpenStreetMapLayer(wwd) {

            this._config = new OpenStreetMapConfig();
            this._wwd = wwd;
            this._baseLayer = new WorldWind.OpenStreetMapImageLayer(null);
            this._drawLayer = new WorldWind.RenderableLayer('Building Layer');
            this._enabled =  true;
            this._displayName = 'Open Street Maps';
            this._tree = new rbush(this._config.rTreeSize);
            this._visibleNodes = [];
            this._dataRetriever = new OSMDataRetriever();
            this._set = new Set();
            this._overpassWrapper = new OverpassAPIWrapper();

        }


        /*
            Given a WorldWind Location or WorldWind Position, uses the maximum bounding
            box distances from the config object to define a bounding box for usage in
            the OpenStreetMap API and the RTree.
            Based on Java implementation given at http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates
            @param center : the object containing the longitude and latitude points of the bounding rect's
                            center point
            @return : returns an array, [left, top, right, bottom], that represents the bounding rectangle
         */

        OpenStreetMapLayer.prototype.getBoundingRectLocs = function(center) {
            //creates a grid of .125 degrees by rounding the center point to the nearest .125 degrees.
            center.latitude = Math.round(center.latitude/.125)*.125;
            center.longitude = Math.round(center.latitude/.125)*.125;

            return [
                center.longitude - .0625,
                center.latitude - .0625,
                center.longitude + .0625,
                center.latitude + .0625
            ];

        }

        /*
            Uses a center point and the default configuration for the drawable bounding rectangle's
            size to get all of the nodes from the RTree to draw said nodes
            @param center: the center point of the bounding rectangle
            @return: the RTree nodes that need to be considered to be drawn
         */
        OpenStreetMapLayer.prototype.getAllNodesToDraw = function(center) {
            var boundingRectangle = this.getBoundingRectLocs(center);
            var rTreeNodesToBeConsidered = this._tree.search(boundingRectangle);
            return rTreeNodesToBeConsidered;
        }


        /*
            Scans through an iterable of rTreeNodes, plucks out the renderable (stored as the
            last element of the array), and sets the enabled property of the renderable
            @param nodes : the RTree nodes to be considered
                           NB: stored as [left, top, right, bottom, renderable]
            @param enabled : the value to set the enabled property field to
         */
        OpenStreetMapLayer.prototype.setEnabledPropertyOnNodes = function(nodes, enabled) {
            nodes.forEach(function(node) {
                console.log('node is ', node);
                var renderableObject = node[node.length - 1];
                renderableObject.enabled = enabled;
            })
        }


        /*
            Retrieves nodes within a configured bounding rectangle, enable their
            constituent renderables, and returns the nodes;
            @param center: the center point of the bounding rectangle
            @return: the RTree nodes to be considered
         */
        OpenStreetMapLayer.prototype.enableNodesToBeDrawn = function(center) {
            var rTreeNodesToBeConsidered = this.getAllNodesToDraw(center);
            this.setEnabledPropertyOnNodes(rTreeNodesToBeConsidered, true);
            return rTreeNodesToBeConsidered;
        }

        /*
            Iterates, through the renderables currently being drawn,
            disables them, and clears the the visible nodes array
         */
        OpenStreetMapLayer.prototype.resetVisibleNodes = function() {
            this.setEnabledPropertyOnNodes(this._visibleNodes, false);
            this._visibleNodes = [];
        }


        /*
            Takes a renderable and a function to extract its bounding rectangle to yield
            an RTree node.
            @param renderable : the renderable to be drawn
            @param extractBoundingRectFun : the function to extract a bounding box for a
                                            renderable
            @return : an array to be inserted into an RTree as a node
         */
        OpenStreetMapLayer.prototype.createRTreeNode = function(renderable, extractBoundingRectFun) {
            renderable.enabled = false;
            var boundingRect = extractBoundingRectFun(renderable);
            boundingRect.push(renderable);
            return boundingRect;
        }


        /*
            Accepts a renderable and a function to extract a boundingRectangle from the renderable to insert
            and manage said renderable in the layer
            @param renderable : the renderable to be added
            @param extractBoundingRectFun : the function to be used to extract the bouding rectangle from
                                            the renderable
         */
        OpenStreetMapLayer.prototype.addRenderable = function(renderable, extractBoundingRectFun) {
            var node = this.createRTreeNode(renderable, extractBoundingRectFun);
            this._drawLayer.addRenderable(renderable);
            this._tree.insert(node);
        }


        /*
            Accepts an iterable of renderables and loads them appropriately
            @param renderable : the renderable to be added
            @param extractBoundingRectFun : the function to be used to extract the bouding rectangle from
                                            the renderable

         */
        OpenStreetMapLayer.prototype.addRenderables = function(renderables, extractBouundingRectFun) {
            var self = this;
            var nodes = renderables.map(function(renderable) {
                return self.addRenderable(renderable, extractBouundingRectFun);
            });
            this._drawLayer.addRenderables(renderables);
            this._tree.load(nodes);
        }


        /*
            Transform a bounding rectangle into a string to be used to examine if
            the bounding rectangle has been examined already
            @param boundingRect: the bounding rectangle to be considered
            @return a string representation of the bounding rectangle
         */
        OpenStreetMapLayer.prototype.createBoundingRectKey = function(boundingRect) {
            return boundingRect.join(' ');
        }



        /*
            Abstracts over the render functions of both the open street map layer
            and the renderable layer
            @param dc :  the DrawContext object to be passed to the two
                         constituent layers' render functions
         */
        OpenStreetMapLayer.prototype.render = function(dc) {
            var self = this;
            if(this._enabled) {
                this._baseLayer.render(dc);
                var currEyeAltitude = getEyeAltitude(dc);
                /*
                if(currEyeAltitude <= this._config.drawHeight) {
                    var center = dc.eyePosition;
                    var boundingRect = this.getBoundingRectLocs(center);
                    //console.log('center ' ,center);
                    //console.log('going to box ', boundingRect);
                    var key = this.createBoundingRectKey(boundingRect);
                    if(this._set.contains(key)) {
                        console.log('we have this key')
                        self.resetVisibleNodes();
                        self._visibleNodes = self._visibleNodes.concat(self.enableNodesToBeDrawn(center));
                        self._drawLayer.render(dc);
                    } else {
                        this._overpassWrapper.getAllAmenitiesInBox(boundingRect, function(data) {

                            console.log('data from overpass ', data);
                        })
                        //this._dataRetriever.requestOSMData(boundingRect, function(data){
                        //    self._set.add(key);
                        //    console.log(data, ' is ');
                        //    self.resetVisibleNodes();
                        //    self._visibleNodes = self._visibleNodes.concat(self.enableNodesToBeDrawn(center));
                        //    self._drawLayer.render(dc);
                        //});
                    }
                } else {
                    this.resetVisibleNodes();
                    this._visibleNodes = [];
                }
                */
            }

        }





        Object.defineProperties(OpenStreetMapLayer.prototype, {
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
            }
        });



        return OpenStreetMapLayer;




});
