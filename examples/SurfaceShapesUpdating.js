/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * Illustrates how to update SurfaceShapes.
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
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
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
        attributes.outlineWidth = 2;
        attributes.outlineColor = WorldWind.Color.BLUE;
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
        // Set up coordinates of 4 different sectors to update SurfaceSector
        var rotatingSectors = [];
        rotatingSectors.push(new WorldWind.Sector(33, 37, -95, -90));
        rotatingSectors.push(new WorldWind.Sector(33, 37, -97, -92));
        rotatingSectors.push(new WorldWind.Sector(31, 35, -97, -92));
        rotatingSectors.push(new WorldWind.Sector(31, 35, -95, -90));

        var sector = new WorldWind.SurfaceSector(rotatingSectors[0], attributes);
        sector.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(sector);

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

            // Shift polygon and polyline left and right
            polygon.boundaries = shiftBoundaries(polygon);
            polyline.boundaries = shiftBoundaries(polyline);

            // TODO: SurfaceSector's state is not updating. Class needs refactoring.
            // sector.sector = moveSector();

            wwd.redraw();
        }, 1000);

        function shiftBoundaries(shape){

            // Assuming the shape has two appended properties: shiftCounter and shiftDirection.
            shape.shiftCounter += 1;

            switch(shape.shiftDirection) {
                case shape.shiftDirection = "east":
                    shape.boundaries = shiftBoundariesEastward(shape.boundaries);
                    break;
                case shape.shiftDirection = "west":
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

        function moveSector(){
            for (var i = 0; i < rotatingSectors.length; i++) {
                return rotatingSectors[i];
            }
        }

    }
);