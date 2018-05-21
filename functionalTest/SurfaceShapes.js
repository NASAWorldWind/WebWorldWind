requirejs([
    '../src/WorldWind',
    './Util'
    ],
    function (WorldWind, Util) {
        "use strict";

        // Define shape counts for testing
        var dynamicShapeCount = 100; // of each type of shape (circle, ellipse, etc.)
        var staticShapeCount = 1000; // of each type of shape (circle, ellipse, etc.)

        // Initialize Globe
        var wwd = Util.initializeLowResourceWorldWindow("globe");
        var testLayer = new WorldWind.RenderableLayer("Test Layer");
        wwd.addLayer(testLayer);
        var util = new Util(wwd);

        util.setStatusMessage("Globe loaded, ready for testing...");

        // Navigation Moves for Testing
        var moveZero = {
            latitude: {
                goal: wwd.navigator.lookAtLocation.latitude,
                step: Number.MAX_VALUE
            },
            longitude: {
                goal: wwd.navigator.lookAtLocation.longitude,
                step: Number.MAX_VALUE
            },
            tilt: {
                goal: 0,
                step: Number.MAX_VALUE
            },
            heading: {
                goal: 0,
                step: Number.MAX_VALUE
            },
            range: {
                goal: wwd.navigator.range,
                step: Number.MAX_VALUE
            }
        };

        var moveOne = {
            range: {
                goal: 8e5,
                step: 5e4
            },
            tilt: {
                goal: 75,
                step: 0.75
            },
            onComplete: function () {
                util.setStatusMessage("First move complete...");
            }
        };

        var moveTwo = {
            heading: {
                goal: 90,
                step: 0.75
            },
            onComplete: function () {
                util.setStatusMessage("Second move complete");
            }
        };

        var moveThree = {
            latitude: {
                goal: wwd.navigator.lookAtLocation.latitude,
                step: 1
            },
            longitude: {
                goal: -70,
                step: 0.5
            },
            onComplete: function () {
                util.stopMetricCapture();
                util.setStatusMessage("Move Complete");

                // output metrics
                var stats = util.frameStats.map(function (frameStat) {
                    return frameStat.frameTime;
                });
                stats.shift();
                stats.pop();
                util.setOutputMessage(Util.generateResultsSummary(stats, "Frame Time"));
                stats = util.frameStats.map(function (frameStat) {
                    return frameStat.layerRenderingTime;
                });
                stats.shift();
                stats.pop();
                util.appendOutputMessage(Util.generateResultsSummary(stats, "Layer Rendering Time"));
            }
        };

        // Utility functions
        var generateShapeAttributes = function () {
            var sa = new WorldWind.ShapeAttributes();
            var r = Math.random();

            sa.drawInterior = false;
            sa.drawOutline = false;

            if (r < 0.3333) {
                sa.drawInterior = true;
                sa.interiorColor = new WorldWind.Color(Math.random(), Math.random(), Math.random(), Math.random());
            } else if (r < 0.6666) {
                sa.drawOutline = true;
                sa.outlineColor = new WorldWind.Color(Math.random(), Math.random(), Math.random(), Math.random());
            } else {
                sa.drawInterior = true;
                sa.interiorColor = new WorldWind.Color(Math.random(), Math.random(), Math.random(), Math.random());
                sa.drawOutline = true;
                sa.outlineColor = new WorldWind.Color(Math.random(), Math.random(), Math.random(), Math.random());
            }

            return sa;
        };

        var generateLocation = function () {
            var lat = 180 * Math.random() - 90;
            var lon = 360 * Math.random() - 180;

            return new WorldWind.Location(lat, lon);
        };

        var generateShapes = function (count) {
            var sa, shape, sector, radius, topLocation, lat, lon, locations, minorAxis, majorAxis, heading, i, j;

            // Surface Circles
            for (i = 0; i < count; i++) {
                sa = generateShapeAttributes();
                radius = Math.random() * 1000000;
                shape = new WorldWind.SurfaceCircle(generateLocation(), radius, sa);
                testLayer.addRenderable(shape);
            }

            // Surface Ellipse
            for (i = 0; i < count; i++) {
                sa = generateShapeAttributes();
                majorAxis = Math.random() * 1000000;
                minorAxis = Math.random() * 500000;
                heading = Math.random() * 360;
                shape = new WorldWind.SurfaceEllipse(generateLocation(), majorAxis, minorAxis, heading, sa);
                testLayer.addRenderable(shape);
            }

            // Surface Polygon
            for (i = 0; i < count; i++) {
                sa = generateShapeAttributes();
                topLocation = generateLocation();
                locations = [];
                locations.push(topLocation);
                for (j = 0; j < 2; j++) {
                    lat = Math.min(90, Math.max(-90, topLocation.latitude - Math.random() * 8));
                    lon = Math.min(180, Math.max(-180, topLocation.longitude - Math.random() * 8));
                    locations.push(new WorldWind.Location(lat, lon));
                }
                shape = new WorldWind.SurfacePolygon(locations, sa);
                testLayer.addRenderable(shape);
            }

            // Surface Polyline
            for (i = 0; i < count; i++) {
                sa = generateShapeAttributes();
                topLocation = generateLocation();
                locations = [];
                locations.push(topLocation);
                for (j = 0; j < 2; j++) {
                    lat = Math.min(90, Math.max(-90, topLocation.latitude - Math.random() * 8));
                    lon = Math.min(180, Math.max(-180, topLocation.longitude - Math.random() * 8));
                    locations.push(new WorldWind.Location(lat, lon));
                }
                shape = new WorldWind.SurfacePolyline(locations, sa);
                testLayer.addRenderable(shape);
            }

            // Surface Rectangle
            for (i = 0; i < count; i++) {
                sa = generateShapeAttributes();
                majorAxis = 1000000 * Math.random();
                minorAxis = 500000 * Math.random();
                heading = 360 * Math.random();
                shape = new WorldWind.SurfaceRectangle(generateLocation(), majorAxis, minorAxis, heading, sa);
                testLayer.addRenderable(shape);
            }

            // Surface Sector
            for (i = 0; i < count; i++) {
                sa = generateShapeAttributes();
                topLocation = generateLocation();
                majorAxis = 8 * Math.random();
                minorAxis = 4 * Math.random();
                sector = new WorldWind.Sector(topLocation.latitude, topLocation.latitude + majorAxis,
                    topLocation.longitude, topLocation.longitude + minorAxis);
                shape = new WorldWind.SurfaceSector(sector, sa);
            }

            wwd.redraw();
        };

        // Click Event Callbacks
        var onMoveClick = function () {
            if (!util.isMoving()) {
                util.startMetricCapture();
                util.move([moveZero, moveOne, moveTwo, moveThree]);
            }
        };

        var onStaticShapesClick = function () {
            generateShapes(1000);
            wwd.redraw();
            onMoveClick();
        };

        var onDynamicShapesClick = function () {
            generateShapes(100);

            var onRedrawMoveShapes = function (worldwindow, stage) {
                if (stage === WorldWind.AFTER_REDRAW) {
                    var idx = worldwindow.layers.indexOf(testLayer);

                    if (idx >= 0) {
                        var count = worldwindow.layers[idx].renderables.length;

                        for (var i = 0; i < count; i++) {
                            var shape = worldwindow.layers[idx].renderables[i];

                            if (shape instanceof WorldWind.SurfaceCircle || shape instanceof WorldWind.SurfaceEllipse
                                || shape instanceof WorldWind.SurfaceRectangle) {
                                var center = shape.center;
                                center.latitude += Math.random() * 0.5 - 0.25;
                                center.longitude += Math.random() * 0.5 - 0.25;
                                shape.center = center;
                            } else if (shape instanceof WorldWind.SurfacePolygon
                                || shape instanceof WorldWind.SurfacePolyline) {
                                var boundaries = shape.boundaries;
                                boundaries[0].latitude += Math.random() * 0.5 - 0.25;
                                boundaries[0].longitude += Math.random() * 0.5 - 0.25;
                                shape.boundaries = boundaries;
                            } else if (shape instanceof WorldWind.SurfaceSector) {
                                var sector = shape.sector;
                                sector.minLongitude += Math.random() * 0.5 - 0.25;
                                sector.minLatitude += Math.random() * 0.5 - 0.25;
                                shape.sector = sector;
                            }

                        }
                    }
                }
            };

            wwd.redrawCallbacks.push(onRedrawMoveShapes);
            wwd.redraw();
            onMoveClick();
        };

        // Click Event Assignments
        var navigateButton = document.getElementById("navigate-button");
        var staticShapesButton = document.getElementById("static-button");
        var dynamicShapesButton = document.getElementById("dynamic-button");

        navigateButton.addEventListener("click", onMoveClick);
        staticShapesButton.addEventListener("click", onStaticShapesClick);
        dynamicShapesButton.addEventListener("click", onDynamicShapesClick);
    });
