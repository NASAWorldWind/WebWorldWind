/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
requirejs(['../src/WorldWind',
        '../src/formats/kml/KmlFile',
        './LayerManager',
        '../src/util/Date'],
    function (WorldWind,
              KmlFile,
              LayerManager,
              DateWW) {
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        function getDateFormat(dateTime) {
            var date = new Date(dateTime);
            var year = date.getFullYear().toString();
            var month = (date.getMonth() + 1).toString();
            return month + "/" + year;
        }

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialLayer(null), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
            {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        // Create a layer manager for controlling layer visibility.
        new LayerManager(wwd);

        // Now set up to handle highlighting.
        new WorldWind.HighlightController(wwd);

        var renderableLayer = new WorldWind.RenderableLayer("Surface Shapes");
        wwd.addLayer(renderableLayer);

        var TimeControl = function () {
            var initialized = false;
            var min = new DateWW();
            var max = new DateWW("January 1, 1000");

            this.compareAgainstOne = function (date) {
                if(!date) {
                    return;
                }

                if (min.isAfter(date)) {
                    min = date;
                }
                if (max.isBefore(date)) {
                    max = date;
                }
            };

            this.getMin = function () {
                return min.getTime();
            };

            this.getMax = function () {
                return max.getTime();
            };

            this.hook = function (node, options) {
                if (options.isTimeSpan) {
                    var begin = node.kmlBegin;
                    var end = node.kmlEnd;
                    this.compareAgainstOne(begin);
                    this.compareAgainstOne(end);
                } else if (options.isTimeStamp) {
                    var when = node.kmlWhen;
                    this.compareAgainstOne(when);
                }

                if (!initialized) {
                    $("#time-slider").slider({
                        range: true,
                        min: this.getMin(),
                        max: this.getMax(),
                        values: [this.getMin(), this.getMax()],
                        slide: function (event, ui) {
                            kmlFile.update(
                                {
                                    layer: renderableLayer,
                                    timeInterval: [ui.values[0], ui.values[1]]
                                }
                            );
                            $("#range").val("Time interval: " + getDateFormat(ui.values[0]) + " - " +
                                getDateFormat(ui.values[1]));
                            wwd.redraw();
                        }
                    });

                    $("#range").val("Time interval: " + getDateFormat(this.getMin()) + " - " +
                        getDateFormat(this.getMax()));
                    initialized = true;
                } else {
                    $("#time-slider").slider("option", "min", this.getMin());
                    $("#time-slider").slider("option", "max", this.getMax());
                    $("#time-slider").slider("option", "values", [this.getMin(), this.getMax()]);
                    $("#range").val("Time interval: " + getDateFormat(this.getMin()) + " - " +
                        getDateFormat(this.getMax()));
                }
            };
        };
        var timeControl = new TimeControl();

        var kmlFile;
        var kmlFileOptions = {
            url: 'whale_shark.kml',
            controls: [timeControl]
        };
        var kmlFilePromise = new KmlFile(kmlFileOptions);
        kmlFilePromise.then(function (pKmlFile) {
            kmlFile = pKmlFile;
            kmlFile.update({layer: renderableLayer, controls: [timeControl]});
        });
    });