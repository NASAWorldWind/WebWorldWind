/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define(function () {
    "use strict";

    /**
     * Constructs an annotation controller for a specified {@link WorldWindow}.
     * @alias AnnotationController
     * @constructor
     * @classdesc Provides an annotation controller to interactively update DOM elements corresponding to a
     * specific annotation
     * @param {WorldWindow} worldWindow The World Window to associate this annotation controller with. Used
     * mainly for redrawing the wwd globe after changing settings.
     */
    var AnnotationController = function (worldWindow) {

        var self = this;

        /**
         * The World Window associated with this annotation controller.
         * @type {WorldWindow}
         */
        this.worldWindow = worldWindow;

        // Store the loaded annotation so we may read/modify
        // it/s settings
        this.currentAnnotation = null;

        //Store DOM slider elements
        this.opacitySlider = $("#opacitySlider");
        this.scaleSlider = $("#scaleSlider");
        this.cornerSlider = $("#cornerSlider");
        this.backgroundR = $("#bgR");
        this.backgroundG = $("#bgG");
        this.backgroundB = $("#bgB");
        this.textR = $("#textR");
        this.textG = $("#textG");
        this.textB = $("#textB");

        // Store DOM spinner elements for the insets
        this.spinnerLeft = $("#spinnerLeft");
        this.spinnerRight = $("#spinnerRight");
        this.spinnerTop = $("#spinnerTop");
        this.spinnerBottom = $("#spinnerBottom");

        // Store DOM input elements
        this.text = $("#annotationText");

        // Store DOM label elements
        this.bgColorLabel = $("#bgColor");
        this.textColorLabel = $("#textColor");
        this.opacityLabel = $("#opacity");
        this.cornerRadiusLabel = $("#cornerRadius");

        // Create an event for the textbox so that we may update the
        // annotations text as this one's text changes
        this.text.on('input', function (e) {
            self.currentAnnotation.text = this.value;
            self.worldWindow.redraw();
        });

        this.opacitySlider.slider({
            value: 0,
            min: 0,
            max: 1,
            step: 0.1,
            animate: true,
            slide: function (event, ui) {
                $("#opacity").html(ui.value);
                self.currentAnnotation.attributes.opacity = ui.value;
            }
        });

        this.scaleSlider.slider({
            value: 1,
            min: 1,
            max: 2,
            step: 0.1,
            animate: true,
            slide: function (event, ui) {
                $("#scale").html(ui.value);
                self.currentAnnotation.attributes.scale = ui.value;
            }
        });

        this.cornerSlider.slider({
            value: 1,
            min: 0,
            max: 20,
            step: 1,
            animate: true,
            slide: function (event, ui) {
                $("#cornerRadius").html(ui.value);
                self.currentAnnotation.attributes.cornerRadius = ui.value;
            }
        });

        // Red value of the background color
        this.backgroundR.slider({
            value: 0,
            min: 0,
            max: 255,
            step: 1,
            animate: true,
            slide: function (event, ui) {
                self.changeBackgroundColor(
                    self.backgroundR.slider('value'),
                    self.backgroundG.slider('value'),
                    self.backgroundB.slider('value'));
            }
        });

        // Green value of the background color
        this.backgroundG.slider({
            value: 0,
            min: 0,
            max: 255,
            animate: true,
            slide: function (event, ui) {
                self.changeBackgroundColor(
                    self.backgroundR.slider('value'),
                    self.backgroundG.slider('value'),
                    self.backgroundB.slider('value'));
            }
        });

        // Blue value of the background color
        this.backgroundB.slider({
            value: 0,
            min: 0,
            max: 255,
            animate: true,
            slide: function (event, ui) {
                self.changeBackgroundColor(
                    self.backgroundR.slider('value'),
                    self.backgroundG.slider('value'),
                    self.backgroundB.slider('value'));
            }
        });

        // Red value of the text color
        this.textR.slider({
            value: 0,
            min: 0,
            max: 255,
            animate: true,
            slide: function (event, ui) {
                self.changeTextColor(
                    self.textR.slider('value'),
                    self.textG.slider('value'),
                    self.textB.slider('value'));
            }
        });

        // Green value of the text color
        this.textG.slider({
            value: 0,
            min: 0,
            max: 255,
            animate: true,
            slide: function (event, ui) {
                self.changeTextColor(
                    self.textR.slider('value'),
                    self.textG.slider('value'),
                    self.textB.slider('value'));
            }
        });

        // Blue value of the text color
        this.textB.slider({
            value: 0,
            min: 0,
            max: 255,
            animate: true,
            slide: function (event, ui) {
                self.changeTextColor(
                    self.textR.slider('value'),
                    self.textG.slider('value'),
                    self.textB.slider('value'));
            }
        });

        // Left inset spinner
        this.spinnerLeft.spinner({
            min: 0,
            max: 100,
            spin: function (event, ui) {
                var insets = self.currentAnnotation.attributes.insets.clone();
                insets.left = ui.value;
                self.currentAnnotation.attributes.insets = insets;
                self.worldWindow.redraw();
            }
        });

        // Right inset spinner
        this.spinnerRight.spinner({
            min: 0,
            max: 100,
            spin: function (event, ui) {
                var insets = self.currentAnnotation.attributes.insets.clone();
                insets.right = ui.value;
                self.currentAnnotation.attributes.insets = insets;
                self.worldWindow.redraw();
            }
        });

        // Top inset spinner
        this.spinnerTop.spinner({
            min: 0,
            max: 100,
            spin: function (event, ui) {
                var insets = self.currentAnnotation.attributes.insets.clone();
                insets.top = ui.value;
                self.currentAnnotation.attributes.insets = insets;
                self.worldWindow.redraw();
            }
        });

        // Bottom inset spinner
        this.spinnerBottom.spinner({
            min: 0,
            max: 100,
            spin: function (event, ui) {
                var insets = self.currentAnnotation.attributes.insets.clone();
                insets.bottom = ui.value;
                self.currentAnnotation.attributes.insets = insets;
                self.worldWindow.redraw();
            }
        });
    };

    // Internal
    AnnotationController.prototype.changeTextColor = function(r, g, b) {
        this.textColorLabel.html("RGB(" + r + "," + g + "," + b + ")");
        this.currentAnnotation.attributes.textAttributes.color = WorldWind.Color.colorFromBytes(r, g, b, 255);
        this.worldWindow.redraw();
    };

    // Internal
    AnnotationController.prototype.changeBackgroundColor = function(r, g, b) {
        this.bgColorLabel.html("RGB(" + r + "," + g + "," + b + ")");
        this.currentAnnotation.attributes.backgroundColor = WorldWind.Color.colorFromBytes(r, g, b, 255);
        this.worldWindow.redraw();
    };

    /**
     * Loads an annotations and adjusts ui controls based on it's settings
     * @param annotation
     */
    AnnotationController.prototype.load = function (annotation) {

        this.currentAnnotation = annotation;

        var bgRed = annotation.attributes.backgroundColor.red * 255,
            bgGreen = annotation.attributes.backgroundColor.green * 255,
            bgBlue = annotation.attributes.backgroundColor.blue * 255,
            textRed = annotation.attributes.textAttributes.color.red * 255,
            textGreen = annotation.attributes.textAttributes.color.green * 255,
            textBlue = annotation.attributes.textAttributes.color.blue * 255;

        // Load background RGB sliders and format label based on values
        this.backgroundR.slider('value', bgRed);
        this.backgroundG.slider('value', bgGreen);
        this.backgroundB.slider('value', bgBlue);
        this.bgColorLabel.html("RGB(" + bgRed + "," + bgGreen + "," + bgBlue + ")");

        // Load text RGB sliders and format label based on values
        this.textR.slider('value', textRed);
        this.textG.slider('value', textGreen);
        this.textB.slider('value', textBlue);
        this.textColorLabel.html("RGB(" + textRed + "," + textGreen + "," + textBlue + ")");

        // Load sliders settings and adjusts labels with their values
        this.opacitySlider.slider('value', annotation.attributes.opacity);
        this.scaleSlider.slider('value', annotation.attributes.scale);
        this.cornerSlider.slider('value', annotation.attributes.cornerRadius);
        this.opacityLabel.html(annotation.attributes.opacity);
        this.cornerRadiusLabel.html(annotation.attributes.cornerRadius);

        // Load insets values into the spinners
        this.spinnerBottom.val(annotation.attributes.insets.bottom);
        this.spinnerTop.val(annotation.attributes.insets.top);
        this.spinnerLeft.val(annotation.attributes.insets.left);
        this.spinnerRight.val(annotation.attributes.insets.right);

        //Load and display the text
        this.text.val(annotation.text);

    };

    return AnnotationController;
});