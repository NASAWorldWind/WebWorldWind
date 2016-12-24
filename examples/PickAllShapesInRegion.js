/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: PickAllShapesInRegion.js 3320 2015-07-15 20:53:05Z dcollins $
 */

requirejs(['../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        var images = [
            "plain-black.png",
            "plain-blue.png",
            "plain-brown.png",
            "plain-gray.png",
            "plain-green.png",
            "plain-orange.png",
            "plain-purple.png",
            "plain-red.png",
            "plain-teal.png",
            "plain-white.png",
            "plain-yellow.png",
            "castshadow-black.png",
            "castshadow-blue.png",
            "castshadow-brown.png",
            "castshadow-gray.png",
            "castshadow-green.png",
            "castshadow-orange.png",
            "castshadow-purple.png",
            "castshadow-red.png",
            "castshadow-teal.png",
            "castshadow-white.png"
        ];

        var pinLibrary = WorldWind.WWUtil.currentUrlSansFilePart() + "/../images/pushpins/", // location of the image files
            placemark,
            placemarkAttributes = new WorldWind.PlacemarkAttributes(null),
            highlightAttributes,
            placemarkLayer = new WorldWind.RenderableLayer(),
            latitude = 47, longitude = -122,
            latDelta = 2, lonDelta = 2;

        placemarkAttributes.imageScale = 1;
        placemarkAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 0.0);
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;

        for (var j = 0; j < 10; j++) {
            latitude -= j > 0 ? latDelta : 0;
            for (var i = 0, len = images.length; i < len; i++) {
                placemark = new WorldWind.Placemark(
                    new WorldWind.Position(latitude, longitude + i * lonDelta, 1e2), true, null);
                placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                placemarkAttributes.imageSource = pinLibrary + images[i];
                highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                highlightAttributes.imageScale = 1.2;
                placemark.attributes = placemarkAttributes;
                placemark.highlightAttributes = highlightAttributes;
                placemarkLayer.addRenderable(placemark);
            }
        }

        placemarkLayer.displayName = "Placemarks";
        wwd.addLayer(placemarkLayer);

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        // Now set up to handle picking.

        var highlightedItems = [];

        var handlePick = function (o) {
            // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
            // the mouse or tap location.
            var x = o.clientX,
                y = o.clientY;

            var redrawRequired = highlightedItems.length > 0;

            // De-highlight any highlighted placemarks.
            for (var h = 0; h < highlightedItems.length; h++) {
                highlightedItems[h].highlighted = false;
            }
            highlightedItems = [];

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            var rectRadius = 50,
                pickPoint = wwd.canvasCoordinates(x, y),
                pickRectangle = new WorldWind.Rectangle(pickPoint[0] - rectRadius, pickPoint[1] + rectRadius,
                    2 * rectRadius, 2 * rectRadius);

            var pickList = wwd.pickShapesInRegion(pickRectangle);
            if (pickList.objects.length > 0) {
                redrawRequired = true;
            }

            // Highlight the items picked.
            if (pickList.objects.length > 0) {
                for (var p = 0; p < pickList.objects.length; p++) {
                    if (pickList.objects[p].isOnTop) {
                        pickList.objects[p].userObject.highlighted = true;
                        highlightedItems.push(pickList.objects[p].userObject);
                    }
                }
            }

            // Update the window if we changed anything.
            if (redrawRequired) {
                wwd.redraw();
            }
        };

        // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
        wwd.addEventListener("mousemove", handlePick);

        // Listen for taps on mobile devices and highlight the placemarks that the user taps.
        var tapRecognizer = new WorldWind.TapRecognizer(wwd, handlePick);
    });