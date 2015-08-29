/**
 * Created by Matthew on 8/13/2015.
 */
/*
* This layer utilizes rbush to determine which renderables to draw.
*
 */
define(['rbush',
        'OpenStreetMapConfig',
        'BuildingPolygonHandler'],
    function (rbush,
              OpenStreetMapConfig,
              BuildingPolygonHandler) {

        /*
         Given a WorldWind Location or WorldWind Position, uses the maximum bounding
         box distances from the config object to define a bounding box for usage in
         the OpenStreetMap API and the RTree.
         Based on Java implementation given at http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates
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

        };

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

        /*
         Abstracts off of the OpenStreetMap Layer and a Renderable Layer
         to facilitate the display of information to the user
         @param wwd: the WorldWind WorldWindow object to which the layers
         are to be applied
         */
        var OpenStreetMapLayer = function ( wwd ) {
            var self = this;

            self._wwd = wwd;
            self._config = new OpenStreetMapConfig();
            self._buildingOverheadHandler = new BuildingPolygonHandler( self );
            self._tree = new rbush(self._config.rTreeSize);
            self._baseLayer = new WorldWind.OpenStreetMapImageLayer(null);
            self._drawLayer = new WorldWind.RenderableLayer('Building Layer');
            self._enabled =  true;
            self.renderCallback = [
                self._buildingOverheadHandler.buildingHandler
            ];

        };



        /*
         Abstracts over the render functions of both the open street map layer
         and the renderable layer
         @param dc :  the DrawContext object to be passed to the two
         constituent layers' render functions
         */
        OpenStreetMapLayer.prototype.render = function(dc) {
            var self = this;
            if(this._enabled) {
                self.renderCallback.forEach(function(callback){
                    //console.log(dc)
                    callback(dc)
                });
                if (dc.eyePosition.altitude <= this._config._maxBuildingDrawHeight){
                    self.enableOnlyVisibleRenderables(dc);
                } else {
                    self.setEnabledOnRenderables(false);
                }
                self._baseLayer.render(dc);
                self._drawLayer.render(dc)
            }

        };

        /*
        * Adds a callback to a list of callbacks that are called whenever a render is called. This callback is called
        *   with the drawcontext.
        *
        * @param callback: Callback function to be eventually called with the drawcontext.
         */
        OpenStreetMapLayer.prototype.addEyeAltitudeCallback = function (callback) {
            var self = this;

            self.renderCallback.push(callback)
        };

        /*
        * Adds the renderable to the drawlayer and extracts the bounding box from that renderable to be used to create
        *   a node.
        *
        * @param renderable: Renderable with bounding box info
        *
        * @param boundingBoxExtractingFunction: Function that returns the renderables bounding box in the form
        *                                           of an array given by the order of the point in the api call.
         */
        OpenStreetMapLayer.prototype.addRenderable = function (renderable, boundingBoxExtractingFunction) {
            var self = this;
            var boundingBoxExtractingFunction =
                (boundingBoxExtractingFunction || (function (renderable) {return renderable.bbox}) );

            var node = self.createNode(renderable, boundingBoxExtractingFunction);
            self._drawLayer.addRenderable(renderable);
            self._tree.insert(node)
        };

        /*
         Takes a renderable and a function to extract its bounding rectangle to yield
         an RTree node.
         @param renderable : the renderable to be drawn
         @param extractBoundingRectFun : the function to extract a bounding box for a
         renderable
         @return : an array to be inserted into an RTree as a node
         */
        OpenStreetMapLayer.prototype.createNode = function (renderable, boundingBoxExtractingFunction) {
            var boundingRect = boundingBoxExtractingFunction(renderable);
            boundingRect.push(renderable);
            return boundingRect;
        };

        /*
        * returns all the renderables in the bounding boxes surrounding the center.
        *
        * @param center: object with properties latitude and longitude
        *
        * @param return: Array of nodes with the renderable in the 4th entry of each node.
         */
        OpenStreetMapLayer.prototype.getAllRenderablesAroundCenter= function (center) {
            var self = this;
            var res = self._tree.search(bboxToNode(getBoundingRectLocs(center,0.003)));
            return res
        };

        /*
        * Looks at all nearby bounding boxes and enables the visibility of all the renderables in those boxes.
        *
        * @param drawContext: Drawcontext given by worldwind
        *
         */
        OpenStreetMapLayer.prototype.enableOnlyVisibleRenderables = function (drawContext) {
            var self = this;

            var centerOfView = {
                latitude: drawContext.eyePosition.latitude,
                longitude: drawContext.eyePosition.longitude
            };

            var visibleRenderables = self.getAllRenderablesAroundCenter(centerOfView);

            self.setEnabledOnRenderables();

            visibleRenderables.forEach(function (node) {
                node[4].setVisibility(true);
            })

        };

        /*
        * Sets the visibility of all the renderables in the draw layer to the chosen param.
        *
        * @param trueFalse: visibility to be set to. False is null.
         */
        OpenStreetMapLayer.prototype.setEnabledOnRenderables = function(trueFalse) {
            var self = this;

            self._drawLayer.renderables.forEach(function(renderable){
                //console.log('renderables',renderable)
                renderable.setVisibility(trueFalse || false);
            })
        };


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
            },

            currentTiles: {
                get: function() {
                    var tiles = this._baseLayer.currentTiles;
                    return tiles;
                }
            }


        });


        return OpenStreetMapLayer
    }
);