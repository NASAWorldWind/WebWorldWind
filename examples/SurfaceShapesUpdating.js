/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * Illustrates how to update SurfaceShapes.
 *
 * @version $Id: SurfaceShapes.js 3320 2015-07-15 20:53:05Z dcollins $
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
         * Added imagery layers.
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

        // Set attributes for the shapes
        var attributes = new WorldWind.ShapeAttributes(null);
        attributes.outlineWidth = 2;
        attributes.outlineColor = WorldWind.Color.BLUE;
        attributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5);

        // Create different types of SurfaceShapes and add them to the Surface Shapes layer

        // Surface circle
        var circle = new WorldWind.SurfaceCircle(new WorldWind.Location(35, -120), 200e3, attributes);
        shapesLayer.addRenderable(circle);

        // Surface ellipse
        var ellipse = new WorldWind.SurfaceEllipse(new WorldWind.Location(35, -110), 300e3, 200e3, 45, attributes);
        shapesLayer.addRenderable(ellipse);

        // Surface rectangle
        var rectangle = new WorldWind.SurfaceRectangle(new WorldWind.Location(35, -100), 200e3, 300e3, -45, attributes);
        shapesLayer.addRenderable(rectangle);

        // Surface Sector
        var sector = new WorldWind.SurfaceSector(new WorldWind.Sector(33, 37, -95, -90), attributes);
        shapesLayer.addRenderable(sector);

        // Surface polygon
        var polygonBoundary = [];
        polygonBoundary = [];
        polygonBoundary.push(new WorldWind.Location(40, -105));
        polygonBoundary.push(new WorldWind.Location(45, -110));
        polygonBoundary.push(new WorldWind.Location(40, -115));
        polygonBoundary.tick = true;

        var polygon = new WorldWind.SurfacePolygon(polygonBoundary, attributes);
        shapesLayer.addRenderable(polygon);

        // Surface polyline
        var polylineBoundary = [];
        polylineBoundary.push(new WorldWind.Location(40, -90));
        polylineBoundary.push(new WorldWind.Location(45, -95));
        polylineBoundary.push(new WorldWind.Location(40, -100));
        polylineBoundary.tick = true;

        var polyline = new WorldWind.SurfacePolyline(polylineBoundary, attributes);
        shapesLayer.addRenderable(polyline);

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);


        // Update SurfaceShapes according to a timer
        window.setInterval(function() {
            // Rotate ellipse 10 degrees clockwise
            ellipse.heading += 10;

            // Rotate rectangle 30 degrees counterclockwise
            rectangle.heading -= 30;

            // Update circle radius size
            circle.radius == 200e3 ? circle.radius += 100e3 : circle.radius = 200e3;

            // Enable and disable polygon
            polygon.enabled ? polygon.enabled = false : polygon.enabled = true;

            // Enable and disable sector
            sector.enabled ? sector.enabled = false : sector.enabled = true;

            // Increase and decrease polyline polygon size (probably not the correct way to do it)
            // polyline.boundaries[0].longitude === -90 ? polyline.boundaries[0].longitude = -92.5 : polyline.boundaries[0].longitude = -90;
            // polyline.boundaries[1].latitude === 45 ? polyline.boundaries[1].latitude = 42.5 : polyline.boundaries[1].latitude = 45;
            // polyline.boundaries[2].longitude === -100 ? polyline.boundaries[2].longitude = -97.5 : polyline.boundaries[2].longitude = -100;

            wwd.redraw();
        }, 1000);

        function increaseBoundariesLatitude(shape){
            for(var i = 0; i < shape._boundaries.length; i++){
                if(shape._boundaries[i].latitude < 90){
                    shape._boundaries[i].latitude += 2;
                }
            }
        }

    }
);