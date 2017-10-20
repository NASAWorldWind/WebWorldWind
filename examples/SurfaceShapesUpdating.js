/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * Illustrates how to display SurfaceShapes.
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

        // Create placemark layer
        var placemarkLayer = new WorldWind.RenderableLayer("Placemark");

        // Set up attributes for the placemark
        var pinLibrary = WorldWind.configuration.baseUrl + "images/pushpins/",
            placemarkAttributes = new WorldWind.PlacemarkAttributes(null),
            latitude = 47.684444,
            longitude = -121.129722;

        placemarkAttributes.imageScale = 1;
        placemarkAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.3,
            WorldWind.OFFSET_FRACTION, 0.0);
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
        placemarkAttributes.drawLeaderLine = true;
        placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;
        placemarkAttributes.imageSource = pinLibrary + "plain-red.png";

        // Define placemark position. This position will update every second.
        var placemarkPosition = new WorldWind.Position(latitude, longitude, 1e2);

        var placemark = new WorldWind.Placemark(placemarkPosition);
        placemark.attributes = placemarkAttributes;
        placemark.label = "Placemark ";
        placemarkLayer.addRenderable(placemark);

        wwd.addLayer(placemarkLayer);

        // Create a layer to hold surface shapes
        var shapesLayer = new WorldWind.RenderableLayer("Surface Shapes");
        wwd.addLayer(shapesLayer);

        // Set attributes for the shape
        var attributes = new WorldWind.ShapeAttributes(null);
        attributes.outlineColor = WorldWind.Color.BLUE;
        attributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5);

        // Create a surface ellipse with a minor radius of 200 km, a major radius of 300 km and heading of 0 deg.
        // Heading should change every second
        var ellipse = new WorldWind.SurfaceEllipse(new WorldWind.Location(35, -110), 900e3, 600e3, 0, attributes);

        // Add ellipse to the shapes layer
        shapesLayer.addRenderable(ellipse);

        // Create a surface rectangle with a width of 200 km, a height of 300 km and a heading of -45 degrees.
        var rectangle = new WorldWind.SurfaceRectangle(new WorldWind.Location(35, -100), 200e3, 300e3, -45, attributes);

        shapesLayer.addRenderable(rectangle);

        // Create a surface sector
        var sector = new WorldWind.SurfaceSector(new WorldWind.Sector(33, 37, -95, -90), attributes);
        shapesLayer.addRenderable(sector);

        // Create a simple surface polygon, a triangle.
        var boundary = [];
        boundary.push(new WorldWind.Location(40, -100));
        boundary.push(new WorldWind.Location(45, -110));
        boundary.push(new WorldWind.Location(40, -120));
        var triangle = new WorldWind.SurfacePolygon(boundary, attributes);
        shapesLayer.addRenderable(triangle);

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        console.log(boundary);
        console.log(triangle._boundaries);

        // Update SurfaceShape heading an placemark position with a timer
        window.setInterval(function() {
            // Update placemark position
            placemarkPosition.latitude += 5;
            placemarkPosition.longitude += 5;

            // Update ellipse heading angle
            ellipse.heading += 10;
            //ellipse.isPrepared = false;
            //ellipse._boundaries = null;

            // Update the rectangle heading angle
            rectangle.heading -= 45;
            //rectangle.isPrepared = false;
            //rectangle._boundaries = null;

            // Update sector max lat and long
            sector.maxLatitude += 20;
            sector.maxLongitude += 20;
            sector.isPrepared = false;
            sector._boundaries = null;

            // Update triangle polygon latitude
            increaseBoundariesLatitude(triangle);
            triangle.isPrepared = false;
            sector._boundaries = null;

            wwd.redraw();
        }, 1000);

        function increaseBoundariesLatitude(shape){
            for(var i = 0; i < shape._boundaries.length; i++){
                shape._boundaries[i].latitude += 2;
            }
        }

    }
);