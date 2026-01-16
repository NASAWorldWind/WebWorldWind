/* 
 * Copyright (c) 2016, 2018 Bruce Schubert.
 * The MIT License
 * http://www.opensource.org/licenses/mit-license
 */

/**
 * The KeyboardControls module provides keyboard controls for the globe.
 * Note: the canvas must be focusable; this can be accomplished by establishing the "tabindex" 
 * on the canvas element.
 * 
 * @returns {KeyboardControls}
 * 
 * @@author Bruce Schubert
 */
define([
    '../geom/Location'],
    function (
        Location) {
        "use strict";
        /**
         * Creates a KeyboardController that dispatches keystrokes from the 
         * WorldWindow to the Navigator. Note: the WorldWindow's canvas must be focusable; 
         * this can be accomplished by establishing the "tabindex" on the canvas element.
         * @param {WorldWindow} wwd The keyboard event generator.
         * @returns {KeyboardControls}
         */
        var KeyboardControls = function (wwd) {
            this.wwd = wwd;
            this.enabled = true;
            
            // The tabindex must be set for the keyboard controls to work
            var tabIndex = this.wwd.canvas.tabIndex;
            if (typeof tabIndex === 'undefined' || tabIndex < 0) {
                this.wwd.canvas.tabIndex = 0;
            }

            var self = this;
            this.wwd.addEventListener('keydown', function (event) {
                  self.handleKeyDown(event);
            });
            this.wwd.addEventListener('keyup', function (event) {
                  self.handleKeyUp(event);
            });
            // Ensure keyboard controls are operational by setting the focus to the canvas
            this.wwd.addEventListener("click", function (event) {
                if (self.enabled) {
                  self.wwd.canvas.focus();
                }
            });
            
            /**
             * The incremental amount to increase or decrease the eye distance (for zoom) each cycle.
             * @type {Number}
             */
            this.zoomIncrement = 0.01;

            /**
             * The scale factor governing the pan speed. Increased values cause faster panning.
             * @type {Number}
             */
            this.panIncrement = 0.0000000005;

        };

        /**
         * Controls the globe with the keyboard.
         * @param {KeyboardEvent} event
         */
        KeyboardControls.prototype.handleKeyDown = function (event) {
          
            if (!this.enabled) {
                return;
            }
            
            // TODO: find a way to make this code portable for different keyboard layouts
            if (event.keyCode === 187 || event.keyCode === 61) {        // + key || +/= key
                this.handleZoom("zoomIn");
                event.preventDefault();
            }
            else if (event.keyCode === 189 || event.keyCode === 173) {  // - key || _/- key
                this.handleZoom("zoomOut");
                event.preventDefault();
            }
            else if (event.keyCode === 37) {    // Left arrow
                this.handlePan("panLeft");
                event.preventDefault();
            }
            else if (event.keyCode === 38) {    // Up arrow
                this.handlePan("panUp");
                event.preventDefault();
            }
            else if (event.keyCode === 39) {    // Right arrow
                this.handlePan("panRight");
                event.preventDefault();
            }
            else if (event.keyCode === 40) {    // Down arrow
                this.handlePan("panDown");
                event.preventDefault();
            }
            else if (event.keyCode === 78) {    // N key
                this.resetHeading();
                event.preventDefault();
            }
            else if (event.keyCode === 82) {    // R key
                this.resetHeadingAndTilt();
                event.preventDefault();
            }
        };

        /**
         * Reset the view to North up.
         */
        KeyboardControls.prototype.resetHeading = function () {
            this.wwd.navigator.heading = Number(0);
            this.wwd.redraw();
        };

        /**
         * Reset the view to North up and nadir.
         */
        KeyboardControls.prototype.resetHeadingAndTilt = function () {
            this.wwd.navigator.heading = 0;
            this.wwd.navigator.tilt = 0;
            this.wwd.redraw(); // calls applyLimits which may change the location

//            // Tilting the view will change the location due to a deficiency in
//            // the early release of WW.  So we set the location to the center of the
//            // current crosshairs position (viewpoint) to resolve this issue
//            var viewpoint = this.getViewpoint(),
//                    lat = viewpoint.target.latitude,
//                    lon = viewpoint.target.longitude;
//            this.lookAt(lat, lon);   
        };

        /**
         * 
         * @param {KeyupEvent} event
         */
        KeyboardControls.prototype.handleKeyUp = function (event) {
            if (this.activeOperation) {
                this.activeOperation = null;
                event.preventDefault();
            }
        };

        /**
         * 
         * @param {type} operation
         */
        KeyboardControls.prototype.handleZoom = function (operation) {
            this.activeOperation = this.handleZoom;

            // This function is called by the timer to perform the operation.
            var self = this, // capture 'this' for use in the function
                setRange = function () {
                    if (self.activeOperation) {
                        if (operation === "zoomIn") {
                            self.wwd.navigator.range *= (1 - self.zoomIncrement);
                        } else if (operation === "zoomOut") {
                            self.wwd.navigator.range *= (1 + self.zoomIncrement);
                        }
                        self.wwd.redraw();
                        setTimeout(setRange, 50);
                    }
                };
            setTimeout(setRange, 50);
        };

        /**
         * 
         * @param {String} operation
         */
        KeyboardControls.prototype.handlePan = function (operation) {
            this.activeOperation = this.handlePan;

            // This function is called by the timer to perform the operation.
            var self = this, // capture 'this' for use in the function
                setLookAtLocation = function () {
                    if (self.activeOperation) {
                        var heading = self.wwd.navigator.heading,
                            distance = self.panIncrement * self.wwd.navigator.range;

                        switch (operation) {
                            case 'panUp' :
                                break;
                            case 'panDown' :
                                heading -= 180;
                                break;
                            case 'panLeft' :
                                heading -= 90;
                                break;
                            case 'panRight' :
                                heading += 90;
                                break;
                        }
                        // Update the navigator's lookAtLocation
                        Location.greatCircleLocation(
                            self.wwd.navigator.lookAtLocation,
                            heading,
                            distance,
                            self.wwd.navigator.lookAtLocation);
                        self.wwd.redraw();
                        setTimeout(setLookAtLocation, 50);
                    }
                };
            setTimeout(setLookAtLocation, 50);
        };

        return KeyboardControls;
    }
);

