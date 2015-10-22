/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports TimeSeriesPlayer
 * @version $Id: TimeSeriesPlayer.js 3410 2015-08-17 04:23:05Z tgaskins $
 */
define(function () {
    "use strict";

    /**
     * Constructs a TimeSeriesPlayer. A time sequence and layer must be specified after construction.
     * @alias TimeSeriesPlayer
     * @constructor
     * @classdesc Provides a control for time-series layers.
     * @param {WorldWindow} worldWindow The World Window to associate this player.
     */
    var TimeSeriesPlayer = function (worldWindow) {
        var self = this;

        this.createPlayer();

        // Intentionally not documented.
        this.slider = $("#timeSeriesSlider");
        this.sliderThumb = $(this.slider.children('.ui-slider-handle'));
        this.timeDisplay = $("#timeSeriesDisplay");// $('<span style="position: absolute; width: 50px">Sat Aug 14, 2015</span>');

        /**
         * The World Window associated with this player, as specified to the constructor.
         * @type {WorldWindow}
         * @readonly
         */
        this.wwd = worldWindow;

        /**
         * The time in milliseconds to display each frame of the time sequence.
         * @type {Number}
         * @default 1000 milliseconds
         */
        this.frameTime = 1000;

        /**
         * The time sequence this player controls.
         * @type {PeriodicTimeSequence}
         * @default null
         */
        this.timeSequence = null;

        /**
         * The layer this player controls.
         * @type {Layer}
         * @default null
         */
        this.layer = null;

        //this.timeSequence = new WorldWind.PeriodicTimeSequence("2000-01-01/2001-12-01/P1M");

        $("#timeSeriesBackward").on("click", function (event) {
            self.onStepBackwardButton(event);
        });

        $("#timeSeriesForward").on("click", function (event) {
            self.onStepForwardButton(event);
        });

        $("#timeSeriesPlay").on("click", function (event) {
            self.onPlayButton(event);
        });

        $("#timeSeriesRepeat").on("click", function (event) {
            self.onRepeatButton(event);
        });

        this.slider.on("slide", function (event, ui) {
            self.onSlide(event, ui);
        });

        this.slider.on("slidechange", function (event, ui) {
            self.onSliderChange(event, ui);
        });
    };

    Object.defineProperties(TimeSeriesPlayer.prototype, {
        timeSequence: {
            get: function () {
                return this._timeSequence;
            },
            set: function (value) {
                this._timeSequence = value;
                if (this._timeSequence) {
                    this.updateTimeSlider(this._timeSequence.scaleForCurrentTime);
                    this.updateTimeDisplay(this._timeSequence.currentTime.toUTCString());
                    this.wwd.redraw();
                } else {
                    this.updateTimeSlider(0);
                    this.updateTimeDisplay("");
                }
            }
        },

        layer: {
            get: function () {
                return this._layer;
            },
            set: function (value) {
                this._layer = value;
                this.wwd.redraw();
            }
        }
    });

    TimeSeriesPlayer.prototype.createPlayer = function () {
        var topButtonGroup = $('<div class="btn-group btn-group-vertical"></div>'),
            backwardButton = $('<button id="timeSeriesBackward" type="button" class="btn btn-sm btn-primary"><span class="glyphicon glyphicon-step-backward"></span></button>'),
            playButton = $('<button id="timeSeriesPlay" type="button" class="btn btn-sm btn-primary"><span class="glyphicon glyphicon-play"></span></button>'),
            forwardButton = $('<button id="timeSeriesForward" type="button" class="btn btn-sm btn-primary"><span class="glyphicon glyphicon-step-forward"></span></button>'),
            bottomButtonGroup = $('<div class="btn-group btn-group-vertical"></div>'),
            repeatButton = $('<button id="timeSeriesRepeat" type="button" class="btn btn-sm btn-primary"><span class="glyphicon glyphicon-repeat"></span></button>'),
            sliderDiv = $('<div id="timeSeriesSlider" style="margin-top: 10px; margin-left: 10px; margin-bottom: 10px; background: #337ab7;"></div>'),
            displaySpan = $('<span id="timeSeriesDisplay" style="position: absolute; width: 300px; color: yellow; text-shadow: 0px 0px 2px black"></span>');

        sliderDiv.slider({orientation: "vertical"});

        topButtonGroup.append(forwardButton);
        topButtonGroup.append(playButton);
        topButtonGroup.append(backwardButton);

        bottomButtonGroup.append(repeatButton);

        var playerDiv = $("#timeSeriesPlayer");
        playerDiv.append(topButtonGroup);
        playerDiv.append(sliderDiv);
        playerDiv.append(displaySpan);
        playerDiv.append(bottomButtonGroup);

        this.playButton = playButton;
        this.repeatButton = repeatButton;
    };

    TimeSeriesPlayer.prototype.onStepBackwardButton = function (event) {
        if (!this.isPlaying) {
            if (this.timeSequence) {
                var previousTime = this.timeSequence.previous() || this.timeSequence.previous();
                this.updateTimeSlider(this.timeSequence.scaleForCurrentTime);
            }
        }
    };

    TimeSeriesPlayer.prototype.onStepForwardButton = function (event) {
        if (!this.isPlaying) {
            if (this.timeSequence) {
                var nextTime = this.timeSequence.next() || this.timeSequence.next();
                this.updateTimeSlider(this.timeSequence.scaleForCurrentTime);
            }
        }
    };

    TimeSeriesPlayer.prototype.onPlayButton = function (event) {
        if (!this.timeSequence) {
            return;
        }

        this.isPlaying = !this.isPlaying;

        var self = this;
        var playFunction = function () {
            if (self.timeSequence && self.isPlaying) {
                var nextTime = self.timeSequence.next();
                if (nextTime) {
                    //self.updateTimeDisplay(nextTime.toUTCString());
                    self.updateTimeSlider(self.timeSequence.scaleForCurrentTime);
                    window.setTimeout(playFunction, self.frameTime);
                } else if (self.isRepeating) {
                    self.timeSequence.reset();
                    window.setTimeout(playFunction, self.frameTime);
                } else {
                    self.isPlaying = false;
                    self.updatePlayButton();
                }
            }
        };

        if (this.isPlaying) {
            window.setTimeout(playFunction, this.frameTime);
        }

        this.updatePlayButton();
    };

    TimeSeriesPlayer.prototype.onRepeatButton = function (event) {
        this.isRepeating = !this.isRepeating;

        this.repeatButton.find('span').removeClass(this.isRepeating ? "glyphicon-repeat" : "glyphicon-refresh");
        this.repeatButton.find('span').addClass(this.isRepeating ? "glyphicon-refresh" : "glyphicon-repeat");
    };

    TimeSeriesPlayer.prototype.onSlide = function (event, ui) {
        if (!this.isPlaying && this.timeSequence) {
            this.timeSequence.currentTime = this.timeSequence.getTimeForScale(ui.value / 100);
            this.updateTimeDisplay(this.timeSequence.currentTime.toUTCString());
        }
    };

    TimeSeriesPlayer.prototype.onSliderChange = function (event, ui) {
        if (this.timeSequence) {
            this.updateTimeDisplay(this.timeSequence.currentTime.toUTCString());
            if (this.layer && this.timeSequence && this.timeSequence.currentTime) {
                this.layer.time = this.timeSequence.currentTime;
                this.wwd.redraw();
            }
        }
    };

    TimeSeriesPlayer.prototype.updatePlayButton = function () {
        this.playButton.find('span').removeClass(this.isPlaying ? "glyphicon-play" : "glyphicon-stop");
        this.playButton.find('span').addClass(this.isPlaying ? "glyphicon-stop" : "glyphicon-play");
    };

    TimeSeriesPlayer.prototype.updateTimeDisplay = function (timeString) {
        timeString = timeString.replace("00:00:00 GMT", "GMT");
        this.timeDisplay.text(timeString);
        this.timeDisplay.css('top', this.sliderThumb.offset().top - this.slider.offset().top + this.slider.height());
        this.timeDisplay.css('left', this.sliderThumb.offset().left - this.slider.offset().left + 40);
    };

    TimeSeriesPlayer.prototype.updateTimeSlider = function (scaleValue) {
        this.slider.slider("value", scaleValue * 100);
    };

    return TimeSeriesPlayer;
});