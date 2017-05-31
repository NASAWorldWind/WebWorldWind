/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
requirejs(['../src/WorldWind',
        './AnnotationController'],
    function (ww,
              AnnotationController) {
        "use strict";

        // Tell World Wind to log only warnings.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the World Window.
        var wwd = new WorldWind.WorldWindow("canvasOne");

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

        var annotationsLayer = new WorldWind.RenderableLayer("Annotations");

        // Create UI controller to modify annotation properties interactively
        var annotationController = new AnnotationController(wwd);

        var annotation,
            annotationAttributes,
            location = new WorldWind.Position(40.964231, -103.627767, 1e2);

        // Set default annotation attributes
        annotationAttributes = new WorldWind.AnnotationAttributes(null);
        annotationAttributes.cornerRadius = 14;
        annotationAttributes.backgroundColor = WorldWind.Color.BLUE;
        annotationAttributes.drawLeader = true;
        annotationAttributes.leaderGapWidth = 40;
        annotationAttributes.leaderGapHeight = 30;
        annotationAttributes.opacity = 1;
        annotationAttributes.scale = 1;
        annotationAttributes.width = 200;
        annotationAttributes.height = 100;
        annotationAttributes.textAttributes.color = WorldWind.Color.WHITE;
        annotationAttributes.insets = new WorldWind.Insets(10, 10, 10, 10);

        annotation = new WorldWind.Annotation(location, annotationAttributes);
        annotation.label = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";
        annotationsLayer.addRenderable(annotation);

        // Add the annotations layer to the World Window's layer list.
        wwd.addLayer(annotationsLayer);

        // Load the annotation to the controller so the UI elements can modify it.
        annotationController.load(annotation);

    });