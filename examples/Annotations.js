/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
requirejs(['../src/WorldWind',
        './AnnotationController'],
    function (ww,
              AnnotationController) {
        "use strict";

        // Tell WorldWind to log only warnings.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Create  and add imagery and WorldWindow UI layers
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

        // Set default annotation attributes
        var annotationAttributes = new WorldWind.AnnotationAttributes(null);
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

        // Set a location for the annotation to point to and create it.
        var location = new WorldWind.Position(40.964231, -103.627767, 1e2);
        var annotation = new WorldWind.Annotation(location, annotationAttributes);
        // Text can be assigned to the annotation after creating it.
        annotation.label = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";

        // Create and add the annotation layer to the WorldWindow's layer list
        var annotationsLayer = new WorldWind.RenderableLayer("Annotations");
        annotationsLayer.addRenderable(annotation);
        wwd.addLayer(annotationsLayer);

        // Create UI controller to modify annotation properties interactively
        // and load the annotation to it so the UI elements can modify it.
        var annotationController = new AnnotationController(wwd);
        annotationController.load(annotation);
    });