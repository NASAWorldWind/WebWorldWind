/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
requirejs(['../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        // Tell World Wind to log only warnings.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the World Window.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        var annotationsLayer = new WorldWind.RenderableLayer("Annotations");

        var locations = [
            new WorldWind.Position(45.759506, 21.227948, 1e2),
            new WorldWind.Position(45.754002, 21.214530, 1e2),
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
            annotationAttributes;

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
            annotationAttributes.opacity = 1;
            annotationAttributes.scale = 1;

            annotationAttributes.setInsets(10, 10, 10, 10);

            annotation = new WorldWind.Annotation(locations[z], annotationAttributes);
            annotation.label = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";
            annotations.push(annotation);
            annotationsLayer.addRenderable(annotation);
        }

        // Add the annotations layer to the World Window's layer list.
        wwd.addLayer(annotationsLayer);

        var highlightedItems = [];

        var currentSelection = null;

        //Annotations controller
        //TODO: create controller in separate file
        $("#annotationText").on('input', function (e) {
            currentSelection.text = this.value;
            wwd.redraw();
        });

        function changeColor(r, g, b) {
            $("#bgColor").html("RGB(" + r + "," + g + "," + b + ")");
            currentSelection.attributes.backgroundColor = WorldWind.Color.colorFromBytes(r, g, b, 255);
            wwd.redraw();
        }

        function changeTextColor(r, g, b) {
            $("#textColor").html("RGB(" + r + "," + g + "," + b + ")");
            currentSelection.attributes.textColor = WorldWind.Color.colorFromBytes(r, g, b, 255);
            wwd.redraw();
        }

        $("#bgR").slider({
            value: 0,
            min: 0,
            max: 256,
            animate: true,
            slide: function (event, ui) {
                changeColor($("#bgR").slider('value'), $("#bgG").slider('value'), $("#bgB").slider('value'));
            }
        });

        $("#bgG").slider({
            value: 0,
            min: 0,
            max: 256,
            animate: true,
            slide: function (event, ui) {
                changeColor($("#bgR").slider('value'), $("#bgG").slider('value'), $("#bgB").slider('value'));
            }
        });

        $("#bgB").slider({
            value: 0,
            min: 0,
            max: 256,
            animate: true,
            slide: function (event, ui) {
                changeColor($("#bgR").slider('value'), $("#bgG").slider('value'), $("#bgB").slider('value'));
            }
        });

        $("#textR").slider({
            value: 0,
            min: 0,
            max: 256,
            animate: true,
            slide: function (event, ui) {
                changeTextColor($("#textR").slider('value'), $("#textG").slider('value'), $("#textB").slider('value'));
            }
        });

        $("#textG").slider({
            value: 0,
            min: 0,
            max: 256,
            animate: true,
            slide: function (event, ui) {
                changeTextColor($("#textR").slider('value'), $("#textG").slider('value'), $("#textB").slider('value'));
            }
        });

        $("#textB").slider({
            value: 0,
            min: 0,
            max: 256,
            animate: true,
            slide: function (event, ui) {
                changeTextColor($("#textR").slider('value'), $("#textG").slider('value'), $("#textB").slider('value'));
            }
        });

        $("#opacitySlider").slider({
            value: 0,
            min: 0,
            max: 1,
            step: 0.1,
            animate: true,
            slide: function (event, ui) {
                $("#opacity").html(ui.value);
                currentSelection.attributes.opacity = ui.value;
            }
        });

        $("#scaleSlider").slider({
            value: 1,
            min: 1,
            max: 2,
            step: 0.1,
            animate: true,
            slide: function (event, ui) {
                $("#scale").html(ui.value);
                currentSelection.attributes.scale = ui.value;
            }
        });

        $("#cornerSlider").slider({
            value: 1,
            min: 0,
            max: 20,
            step: 1,
            animate: true,
            slide: function (event, ui) {
                $("#cornerRadius").html(ui.value);
                currentSelection.attributes.cornerRadius = ui.value;
            }
        });

        var spinnerLeft = $("#spinnerLeft").spinner({
            min: 0,
            max: 100,
            spin: function (event, ui) {
                currentSelection.attributes.insetLeft = ui.value;
                wwd.redraw();
            }
        });

        var spinnerRight = $("#spinnerRight").spinner({
            min: 0,
            max: 100,
            spin: function (event, ui) {
                currentSelection.attributes.insetRight = ui.value;
                wwd.redraw();
            }
        });

        var spinnerTop = $("#spinnerTop").spinner({
            min: 0,
            max: 100,
            spin: function (event, ui) {
                currentSelection.attributes.insetTop = ui.value;
                wwd.redraw();
            }
        });

        var spinnerBottom = $("#spinnerBottom").spinner({
            min: 0,
            max: 100,
            spin: function (event, ui) {
                currentSelection.attributes.insetBottom = ui.value;
                wwd.redraw();
            }
        });

        function loadUi(annotation) {

            spinnerBottom.val(annotation.attributes.insetBottom);
            spinnerTop.val(annotation.attributes.insetTop);
            spinnerLeft.val(annotation.attributes.insetLeft);
            spinnerRight.val(annotation.attributes.insetRight);

            $("#annotationText").val(annotation.text);

            $("#opacity").html(annotation.attributes.opacity);

            $("#cornerRadius").html(annotation.attributes.cornerRadius);

            $("#opacitySlider").slider('value', annotation.attributes.opacity);

            $("#scaleSlider").slider('value', annotation.attributes.scale);

            $("#cornerSlider").slider('value', annotation.attributes.cornerRadius);

            var bgRed = annotation.attributes.backgroundColor.red * 255,
                bgGreen = annotation.attributes.backgroundColor.green * 255,
                bgBlue = annotation.attributes.backgroundColor.blue * 255,
                textRed = annotation.attributes.textColor.red * 255,
                textGreen = annotation.attributes.textColor.green * 255,
                textBlue = annotation.attributes.textColor.blue * 255;

            $("#bgR").slider('value', bgRed);
            $("#bgG").slider('value', bgGreen);
            $("#bgB").slider('value', bgBlue);
            $("#bgColor").html("RGB(" + bgRed + "," + bgGreen + "," + bgBlue + ")");

            $("#textR").slider('value', textRed);
            $("#textG").slider('value', textGreen);
            $("#textB").slider('value', textBlue);
            $("#textColor").html("RGB(" + textRed + "," + textGreen + "," + textBlue + ")");
        }

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

                    currentSelection = pickList.objects[p].userObject;

                    loadUi(pickList.objects[p].userObject);

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