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
            {layer: new WorldWind.BMNGLayer(), enabled: true},
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

        // Set up attibutes for the placemark
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

        // Create a layer to hold a surface shape (in this case, an ellipse)
        var shapesLayer = new WorldWind.RenderableLayer("Ellipse");
        wwd.addLayer(shapesLayer);

        // Set attributes for the shape
        var attributes = new WorldWind.ShapeAttributes(null);
        attributes.outlineColor = WorldWind.Color.BLUE;
        attributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5);

        var highlightAttributes = new WorldWind.ShapeAttributes(attributes);
        highlightAttributes.interiorColor = new WorldWind.Color(1, 1, 1, 1);

        // Create a surface ellipse with a minor radius of 200 km, a major radius of 300 km.
        // This example tests changing the heading every second
        var currentHeading = 0;
        var shape = new WorldWind.SurfaceEllipse(new WorldWind.Location(35, -110), 900e3, 600e3, currentHeading, attributes);
        shape.highlightAttributes = highlightAttributes;
        shapesLayer.addRenderable(shape);

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        // Now set up to handle highlighting.
        var highlightController = new WorldWind.HighlightController(wwd);

        // Update SurfaceShape an placemark states
        var follow = false;
        window.setInterval(function() {
            // Update placemark position
            placemarkPosition.latitude += 10;
            placemarkPosition.longitude += 10;

            // Update ellipse heading angle (as of now, this fails)
            currentHeading += 10;
            wwd.redraw();
        }, 1000);
    }
);
