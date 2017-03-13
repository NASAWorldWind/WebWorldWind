/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
requirejs(['../src/WorldWind',
        './LayerManager',
        './AnnotationController'],
    function (ww,
              LayerManager,
              AnnotationController) {
        "use strict";

        // Tell World Wind to log only warnings.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the World Window.
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

        var annotationsLayer = new WorldWind.RenderableLayer("Annotations");

        var annotationController = new AnnotationController(wwd);

        var layerManger = new LayerManager(wwd);

        var locations = [
            new WorldWind.Position(45.759506, 21.227948, 1e2),
            new WorldWind.Position(39.238384, 58.331522, 1e2),
            new WorldWind.Position(62.905780, 93.247174, 1e2),
            new WorldWind.Position(54.560028, -102.221517, 1e2),
            new WorldWind.Position(40.964231, -103.627767, 1e2),
            new WorldWind.Position(72.913535, -41.752785, 1e2),
            new WorldWind.Position(-22.061476, 133.611391, 1e2),
            new WorldWind.Position(-11.820326, -66.076097, 1e2),
            new WorldWind.Position(7.061353, 10.212961, 1e2)
        ];

        var annotations = [],
            annotation,
            annotationAttributes,
            insets;

        var backgroundColors = [
            WorldWind.Color.RED,
            WorldWind.Color.GREEN,
            WorldWind.Color.MAGENTA,
            WorldWind.Color.BLUE,
            WorldWind.Color.DARK_GRAY,
            WorldWind.Color.BLACK,
            WorldWind.Color.BLACK,
            WorldWind.Color.RED,
            WorldWind.Color.BLACK,
            WorldWind.Color.BLACK,
            WorldWind.Color.BLACK];

        for (var z = 0; z < locations.length; z++) {
            annotationAttributes = new WorldWind.AnnotationAttributes(null);
            annotationAttributes.cornerRadius = 14;
            annotationAttributes.backgroundColor = backgroundColors[z];
            annotationAttributes.textColor = new WorldWind.Color(1, 1, 1, 1);
            annotationAttributes.drawLeader = true;
            annotationAttributes.leaderGapWidth = 40;
            annotationAttributes.leaderGapHeight = 30;
            annotationAttributes.opacity = 1;
            annotationAttributes.scale = 1;
            annotationAttributes.width = 200;
            annotationAttributes.height = 100;
            annotationAttributes.textAttributes.color = WorldWind.Color.WHITE;
            annotationAttributes.insets = new WorldWind.Insets(10, 10, 10, 10);

            annotation = new WorldWind.Annotation(locations[z], annotationAttributes);
            annotation.label = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";
            annotations.push(annotation);
            annotationsLayer.addRenderable(annotation);
        }

        // Add the annotations layer to the World Window's layer list.
        wwd.addLayer(annotationsLayer);

        var highlightedItems = [];

        // The common pick-handling function.
        var handlePick = function (o) {
            // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
            // the mouse or tap location.
            var x = o.clientX,
                y = o.clientY;

            var redrawRequired = highlightedItems.length > 0; // must redraw if we de-highlight previously picked items

            for (var h = 0; h < highlightedItems.length; h++) {
                highlightedItems[h].highlighted = false;
            }

            highlightedItems = [];

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
            if (pickList.objects.length > 0) {
                redrawRequired = true;
            }

            // Highlight the items picked by simply setting their highlight flag to true.
            if (pickList.objects.length > 0) {

                for (var p = 0; p < pickList.objects.length; p++) {

                    if (!(pickList.objects[p].userObject instanceof WorldWind.Annotation)) continue;

                    pickList.objects[p].userObject.highlighted = true;

                    annotationController.load(pickList.objects[p].userObject);

                    // Keep track of highlighted items in order to de-highlight them later.
                    highlightedItems.push(pickList.objects[p].userObject);
                }
            }

            // Update the window if we changed anything.
            if (redrawRequired) {
                wwd.redraw();
            }
        };

        new WorldWind.ClickRecognizer(wwd, handlePick);
        new WorldWind.TapRecognizer(wwd, handlePick);
    });