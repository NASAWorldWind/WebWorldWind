/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * Illustrates how to move SurfaceShapes while updating their state.
 *
 */

requirejs(['../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        // Tell WorldWind to log only warnings.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        /**
         * Add imagery layers.
         */
        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true},
            {layer: new WorldWind.FrameStatisticsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Create a layer to hold surface shapes
        var shapesLayer = new WorldWind.RenderableLayer("Surface Shapes");
        wwd.addLayer(shapesLayer);

        // Create and set attributes that will be shared with all the shapes.
        var attributes = new WorldWind.ShapeAttributes(null);
        attributes.outlineWidth = 5;
        attributes.outlineColor = WorldWind.Color.WHITE;
        attributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5);

        // Create highlight attributes that all the shapes will use (except polyline, see below).
        var highlightAttributes = new WorldWind.ShapeAttributes(attributes);
        highlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 1);

        // Create different types of SurfaceShapes and add them to the Surface Shapes layer

        // Surface circle
        var circle = new WorldWind.SurfaceCircle(new WorldWind.Location(35, -120), 200e3, attributes);
        circle.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(circle);

        // Surface ellipse
        var ellipse = new WorldWind.SurfaceEllipse(new WorldWind.Location(35, -110), 300e3, 200e3, 45, attributes);
        ellipse.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(ellipse);

        // Surface rectangle
        var rectangle = new WorldWind.SurfaceRectangle(new WorldWind.Location(35, -100), 200e3, 300e3, -45, attributes);
        rectangle.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(rectangle);

        // Surface Sector
        var surfaceSector = new WorldWind.SurfaceSector(new WorldWind.Sector(33, 37, -95, -90), attributes);
        // Append counter to cycle an array of sectors and set it to this SurfaceSector
        surfaceSector.sectorCounter = 0;

        surfaceSector.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(surfaceSector);

        // Surface polygon
        var polygonBoundary = [];
        polygonBoundary.push(new WorldWind.Location(40, -105));
        polygonBoundary.push(new WorldWind.Location(45, -110));
        polygonBoundary.push(new WorldWind.Location(40, -115));

        var polygon = new WorldWind.SurfacePolygon(polygonBoundary, attributes);
        // Append properties to shift the polygon eastward and westward.
        polygon.shiftCounter = 0;
        polygon.shiftDirection = "west";

        polygon.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(polygon);

        // Surface polyline
        var polylineBoundary = [];
        polylineBoundary.push(new WorldWind.Location(40, -90));
        polylineBoundary.push(new WorldWind.Location(45, -95));
        polylineBoundary.push(new WorldWind.Location(40, -100));

        var polyline = new WorldWind.SurfacePolyline(polylineBoundary, attributes);
        // Append properties to shift the polyline eastward and westward.
        polyline.shiftCounter = 0;
        polyline.shiftDirection = "west";

        // Since polyline doesn't have an interior, we will set different highlight attributes for it.
        highlightAttributes = new WorldWind.ShapeAttributes(attributes);
        highlightAttributes.outlineColor = new WorldWind.Color(0, 1, 1, 0.5);

        polyline.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(polyline);

        // Create another SurfacePolyline that crosses a big portion of the western hemisphere
        // this one will have its pathTypes changed
        var bigPolylineBoundary = [];
        bigPolylineBoundary.push(new WorldWind.Location(-45, -135));
        bigPolylineBoundary.push(new WorldWind.Location(45, -32));
        var bigPolyline = new WorldWind.SurfacePolyline(bigPolylineBoundary, attributes);
        shapesLayer.addRenderable(bigPolyline);

        // Create another bigger SurfaceRectangle that will have its number of edges changed
        var bigRectangle = new WorldWind.SurfaceRectangle(new WorldWind.Location(0, 0), 200e4, 900e4, 45, attributes);
        bigRectangle.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(bigRectangle);

        // Create another surface ellipse near the pole to test its changing polar throttling
        var polarEllipse = new WorldWind.SurfaceEllipse(new WorldWind.Location(89, -110), 300e3, 200e3, 45, attributes);
        polarEllipse.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(polarEllipse);

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        // Create a highlight controller for highlighting.
        var highlightController = new WorldWind.HighlightController(wwd);

        // Update SurfaceShapes according to a timer
        window.setInterval(function() {
            // Rotate ellipse 10 degrees clockwise
            ellipse.heading += 10;

            // Rotate rectangle 30 degrees counterclockwise
            rectangle.heading -= 30;

            // Update circle radius size
            circle.radius === 200e3 ? circle.radius += 100e3 : circle.radius = 200e3;

            // Shift polygon and polyline eastward and westward
            polygon.boundaries = shiftBoundaries(polygon);
            polyline.boundaries = shiftBoundaries(polyline);

            // Cycle through different sectors
            surfaceSector.sector = changeSector(surfaceSector);

            // Flip number of edges for the bigger rectangle between 4 and 128
            bigRectangle.maximumNumEdgeIntervals = flipNumberOfEdgeIntervals(bigRectangle);

            // Cycle through the three different path types for the larger polyline:
            // Great circle, rhumb line (looks straight in Mercator), and linear (looks straight in equirectangular).
            bigPolyline.pathType = cycleThroughPathTypes(bigPolyline);

            polarEllipse.polarThrottle === 10 ? polarEllipse.polarThrottle = 0 : polarEllipse.polarThrottle = 10;
            console.log(polarEllipse.polarThrottle);

            wwd.redraw();
        }, 1000);

        function changePolarThrottling(shape){
            switch(shape.polarThrottle) {
                case (shape.polarThrottle <= 10 && shape.polarThrottle > 2): // Default edge interpolation polar throttling
                    return shape.polarThrottle -= 2;
                    break;
                case 2:
                    return shape.polarThrottle
                default:
                    console.log("Error. This should never appear");
            }
        }

        function flipNumberOfEdgeIntervals(shape){
            if (shape.maximumNumEdgeIntervals === 128){ // 128 is the default number of edges
                return 4;
            } else {
                return 128;
            }
        }

        function cycleThroughPathTypes(shape){
            if (shape.pathType === WorldWind.GREAT_CIRCLE){
                return WorldWind.RHUMB_LINE;
            }
            else if (shape.pathType === WorldWind.RHUMB_LINE){
                return WorldWind.LINEAR;
            }
            else {
                return WorldWind.GREAT_CIRCLE;
            }
        }

        function shiftBoundaries(shape){

            // Assuming the shape has two appended properties: shiftCounter and shiftDirection.
            shape.shiftCounter += 1;

            switch(shape.shiftDirection) {
                case "east":
                    shape.boundaries = shiftBoundariesEastward(shape.boundaries);
                    break;
                case "west":
                    shape.boundaries = shiftBoundariesWestward(shape.boundaries);
                    break;
                default:
                    console.log("Error. This should never appear");
            }

            // Shift the shape 5 degrees and then change shift direction
            if (shape.shiftCounter === 5){
                shape.shiftDirection === "east" ? shape.shiftDirection = "west" : shape.shiftDirection = "east";
                shape.shiftCounter = 0;
            }

            return shape.boundaries;
        }

        function shiftBoundariesWestward(boundaries){
            for (var i = 0; i < boundaries.length; i++) {
                boundaries[i].longitude -= 1;
            }
            return boundaries;
        }

        function shiftBoundariesEastward(boundaries){
            for (var i = 0; i < boundaries.length; i++) {
                boundaries[i].longitude += 1;
            }
            return boundaries;
        }

        // Set up coordinates of 4 different sectors to update SurfaceSector
        var rotatingSectors = [];
        rotatingSectors.push(new WorldWind.Sector(33, 37, -95, -90));
        rotatingSectors.push(new WorldWind.Sector(33, 37, -97, -92));
        rotatingSectors.push(new WorldWind.Sector(31, 35, -97, -92));
        rotatingSectors.push(new WorldWind.Sector(31, 35, -95, -90));

        // Cycle through the previous array and set it to the SurfaceSector
        function changeSector(surfaceSector){
            if (surfaceSector.sectorCounter < rotatingSectors.length - 1){
                surfaceSector.sectorCounter += 1;
            }
            else {
                surfaceSector.sectorCounter = 0;
            }
            return rotatingSectors[surfaceSector.sectorCounter];
        }

    }
);