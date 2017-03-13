/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * Illustrates how to display SurfaceShapes.
 *
 * @version $Id: SurfaceShapes.js 3189 2015-06-15 19:27:19Z tgaskins $
 */

requirejs(['../src/WorldWind',
        './LayerManager',
        './CoordinateController'],
    function (ww,
              LayerManager,
              CoordinateController) {
        "use strict";

        // Tell World Wind to log only warnings.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the World Window.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        /**
         * Added imagery layers.
         */
        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        var shapesLayer = new WorldWind.RenderableLayer("Surface Shapes"),
            shapeAttributes = new WorldWind.ShapeAttributes(null),
            highlightShapeAttributes;

        // Set up some shape attributes to customize for the next shape.
        shapeAttributes.interiorColor = WorldWind.Color.RED;
        shapeAttributes.outlineColor = WorldWind.Color.BLUE;

        // Create a polygon that contains the north pole.
        var shapeBoundariesVancouverLondonTokyo = [
            new WorldWind.Location(49.195599, -123.193309), // Vancouver
            new WorldWind.Location(51.510483, -0.115675), // London
            new WorldWind.Location(35.549284, 139.779834) // Tokyo
        ];
        var surfacePolygonVancouverLondonTokyo = new WorldWind.SurfacePolygon(shapeBoundariesVancouverLondonTokyo,
            new WorldWind.ShapeAttributes(shapeAttributes));

        highlightShapeAttributes = new WorldWind.ShapeAttributes(shapeAttributes);
        highlightShapeAttributes.interiorColor = WorldWind.Color.WHITE;
        surfacePolygonVancouverLondonTokyo.highlightAttributes = highlightShapeAttributes;

        shapesLayer.addRenderable(surfacePolygonVancouverLondonTokyo);

        // Set up some shape attributes to customize for the next shape.
        shapeAttributes.interiorColor = WorldWind.Color.GREEN;
        shapeAttributes.outlineColor = WorldWind.Color.RED;
        shapeAttributes.outlineStipplePattern = 0x663c; // A ".._" pattern.
        shapeAttributes.outlineStippleFactor = 1;

        // Create a polygon that straddles the ante-meridian.
        var shapeBoundariesManilaLaSydney = [
            new WorldWind.Location(14.597656, 120.980476), // Manila
            new WorldWind.Location(34.054070, -118.217412), // LA
            new WorldWind.Location(-33.869823, 151.204867) // Sydney
        ];
        var surfacePolygonManilaLaSydney = new WorldWind.SurfacePolygon(shapeBoundariesManilaLaSydney,
            new WorldWind.ShapeAttributes(shapeAttributes));

        highlightShapeAttributes = new WorldWind.ShapeAttributes(shapeAttributes);
        highlightShapeAttributes.interiorColor = WorldWind.Color.WHITE;
        surfacePolygonManilaLaSydney.highlightAttributes = highlightShapeAttributes;

        shapesLayer.addRenderable(surfacePolygonManilaLaSydney);

        // Set up some shape attributes to customize for the next shape.
        shapeAttributes.interiorColor = WorldWind.Color.GREEN;
        shapeAttributes.outlineColor = WorldWind.Color.RED;
        shapeAttributes.outlineWidth = 1;
        shapeAttributes.outlineStipplePattern = 0xffff;
        shapeAttributes.outlineStippleFactor = 1;

        // Create a 10 km circle centered on Miami.
        var surfaceCircleMiami = new WorldWind.SurfaceCircle(new WorldWind.Location(25.769185, -80.194173), 10000,
            new WorldWind.ShapeAttributes(shapeAttributes));

        highlightShapeAttributes = new WorldWind.ShapeAttributes(shapeAttributes);
        highlightShapeAttributes.interiorColor = WorldWind.Color.WHITE;
        surfaceCircleMiami.highlightAttributes = highlightShapeAttributes;

        shapesLayer.addRenderable(surfaceCircleMiami);

        // Create a sector that corresponds to the state of Colorado.
        var surfaceSectorColorado = new WorldWind.SurfaceSector(new WorldWind.Sector(37, 41, -109, -102),
            new WorldWind.ShapeAttributes(shapeAttributes));

        highlightShapeAttributes = new WorldWind.ShapeAttributes(shapeAttributes);
        highlightShapeAttributes.interiorColor = WorldWind.Color.WHITE;
        surfaceSectorColorado.highlightAttributes = highlightShapeAttributes;

        shapesLayer.addRenderable(surfaceSectorColorado);

        // Set up some shape attributes to customize for the next shape.
        shapeAttributes.interiorColor = WorldWind.Color.BLUE;
        shapeAttributes.outlineColor = WorldWind.Color.BLACK;
        shapeAttributes.outlineWidth = 1;
        shapeAttributes.outlineStipplePattern = 0xffff;
        shapeAttributes.outlineStippleFactor = 1;

        // Create a 1000x2000 rectangle near the south pole.
        var surfaceRectangleAntarctica = new WorldWind.SurfaceRectangle(new WorldWind.Location(-88, 45), 1000000, 2000000,
            new WorldWind.ShapeAttributes(shapeAttributes));

        highlightShapeAttributes = new WorldWind.ShapeAttributes(shapeAttributes);
        highlightShapeAttributes.interiorColor = WorldWind.Color.WHITE;
        surfaceRectangleAntarctica.highlightAttributes = new WorldWind.ShapeAttributes(highlightShapeAttributes);

        shapesLayer.addRenderable(surfaceRectangleAntarctica);

        //
        // A more elaborate example with overlapping shapes: the Seattle Center.
        //

        // Set up some shape attributes to outline the Seattle Center.
        shapeAttributes.outlineColor = WorldWind.Color.WHITE;
        shapeAttributes.drawInterior = false;
        shapeAttributes.outlineWidth = 2;
        shapeAttributes.outlineStipplePattern = 0x3333;
        shapeAttributes.outlineStippleFactor = 1;

        var shapeBoundarySeattleCenter = [
            new WorldWind.Location(47.624551, -122.354006),
            new WorldWind.Location(47.624551, -122.348942),
            new WorldWind.Location(47.623350, -122.348942),
            new WorldWind.Location(47.623350, -122.347655),
            new WorldWind.Location(47.620718, -122.347655),
            new WorldWind.Location(47.618592, -122.350380),
            new WorldWind.Location(47.618621, -122.352890),
            new WorldWind.Location(47.620921, -122.352805),
            new WorldWind.Location(47.620935, -122.354092),
            new WorldWind.Location(47.619764, -122.354178),
            new WorldWind.Location(47.619793, -122.355444),
            new WorldWind.Location(47.623293, -122.355444),
            new WorldWind.Location(47.623264, -122.354092)
        ];
        var surfacePolygonSeattleCenter = new WorldWind.SurfacePolygon(shapeBoundarySeattleCenter, new WorldWind.ShapeAttributes(shapeAttributes));
        shapeAttributes.outlineColor = WorldWind.Color.YELLOW;
        surfacePolygonSeattleCenter.highlightAttributes = new WorldWind.ShapeAttributes(shapeAttributes);
        shapesLayer.addRenderable(surfacePolygonSeattleCenter);

        // Shape attributes for the Key Arena.
        shapeAttributes.outlineColor = WorldWind.Color.RED;
        shapeAttributes.drawInterior = false;
        shapeAttributes.outlineWidth = 1;
        shapeAttributes.outlineStipplePattern = 0xffff;
        shapeAttributes.outlineStippleFactor = 0;

        // Create a rectangle around Key Arena.
        var surfaceRectangleKeyArena = new WorldWind.SurfaceRectangle(new WorldWind.Location(47.622105, -122.354009), 125, 125,
            new WorldWind.ShapeAttributes(shapeAttributes));
        shapeAttributes.outlineColor = WorldWind.Color.YELLOW;
        surfaceRectangleKeyArena.highlightAttributes = new WorldWind.ShapeAttributes(shapeAttributes);
        shapesLayer.addRenderable(surfaceRectangleKeyArena);

        // Shape attributes for the Space Needle.
        shapeAttributes.outlineColor = WorldWind.Color.GREEN;
        shapeAttributes.drawInterior = false;
        shapeAttributes.outlineWidth = 1;
        shapeAttributes.outlineStipplePattern = 0xffff;
        shapeAttributes.outlineStippleFactor = 0;

        // Create a 30m circle around the Space Needle in Seattle.
        var surfaceCircleSpaceNeedle = new WorldWind.SurfaceCircle(new WorldWind.Location(47.620504, -122.349277), 30,
            new WorldWind.ShapeAttributes(shapeAttributes));
        shapeAttributes.outlineColor = WorldWind.Color.YELLOW;
        surfaceCircleSpaceNeedle.highlightAttributes = new WorldWind.ShapeAttributes(shapeAttributes);
        shapesLayer.addRenderable(surfaceCircleSpaceNeedle);

        // Set up some shape attributes to customize for the next shape.
        shapeAttributes.lineWidth = 8;
        shapeAttributes.outlineColor = WorldWind.Color.WHITE;

        var shapePolyline = [
            new WorldWind.Location(-45, -90),
            new WorldWind.Location(45, 90)
        ];
        var surfacePolylineSpanTheGlobe = new WorldWind.SurfacePolyline(shapePolyline, new WorldWind.ShapeAttributes(shapeAttributes));
        shapesLayer.addRenderable(surfacePolylineSpanTheGlobe);

        // Add the shapes layer to the World Window's layer list.
        wwd.addLayer(shapesLayer);

        // Add a polygon for China.
        shapeAttributes.interiorColor = WorldWind.Color.RED;
        shapeAttributes.outlineColor = WorldWind.Color.WHITE;
        shapeAttributes.drawInterior = true;
        var shapePolygonChina = new WorldWind.SurfacePolygon(china(), new WorldWind.ShapeAttributes(shapeAttributes));
        shapeAttributes.interiorColor = WorldWind.Color.YELLOW;
        shapePolygonChina.highlightAttributes = new WorldWind.ShapeAttributes(shapeAttributes);
        shapesLayer.addRenderable(shapePolygonChina);

        var shapesCirclePerfLayer = new WorldWind.RenderableLayer("SurfaceCircle Perf Test");
        perfTestBullseyes(shapesCirclePerfLayer);
        wwd.addLayer(shapesCirclePerfLayer);

        var shapesRectanglePerfLayer = new WorldWind.RenderableLayer("SurfaceRectangle Perf Test");
        perfTestSpiral(shapesRectanglePerfLayer);
        wwd.addLayer(shapesRectanglePerfLayer);

        var shapesPolygonPerfLayer = new WorldWind.RenderableLayer("SurfacePolygon Perf Test");
        perfTestSponge(shapesPolygonPerfLayer);
        wwd.addLayer(shapesPolygonPerfLayer);

        // Draw the World Window for the first time.
        wwd.redraw();

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

        // Create a coordinate controller to update the coordinate overlay elements.
        var coordinateController = new CoordinateController(wwd);

        /*
         * Configure various testing modes.
         */

        // Set "isTransient" to true if simple motion over a shape is to highlight it.
        // Set "isTransient" to false if the user must click on the shape to highlight it.
        var isTransient = false;

        var isDeepPicking = false;

        // Enable region picking if the following is true.
        var isRegionPicking = true;

        // Record location of mouse on mouseDown event.
        var firstX = -1,
            firstY = -1;

        var highlightedItems = [];

        var handlePick = function (o) {
            // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
            // the mouse or tap location.
            var x = o.clientX,
                y = o.clientY;

            if (!isTransient) {
                // If the user didn't click (i.e., push a mouse button without moving the mouse), return.
                if (x != firstX || y != firstY) {
                    return;
                }
            }

            for (var item in highlightedItems) {
                if (highlightedItems.hasOwnProperty(item)) {
                    highlightedItems[item].highlighted = false;
                }
            }
            highlightedItems = [];

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            var pickPoint = wwd.canvasCoordinates(x, y);

            var pickList;

            if (isRegionPicking){
                wwd.deepPicking = false;

                // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
                // relative to the upper left corner of the canvas rather than the upper left corner of the page.
                var rectRadius = 2,
                    pickRectangle = new WorldWind.Rectangle(pickPoint[0] - rectRadius, pickPoint[1] + rectRadius,
                        2 * rectRadius, 2 * rectRadius);

                pickList = wwd.pickShapesInRegion(pickRectangle);
            } else {
                wwd.deepPicking = isDeepPicking;

                pickList = wwd.pick(pickPoint);
            }

            // Highlight the items picked.
            if (pickList.objects.length > 0) {
                for (var p = 0; p < pickList.objects.length; p++) {
                    var pickedObject = pickList.objects[p].userObject;
                    if (!(pickedObject instanceof WorldWind.SurfaceShape)) continue;

                    var shape = pickedObject;

                    if (highlightedItems.indexOf(shape) < 0) {
                        highlightedItems.push(shape);
                        shape.highlighted = true;
                    }
                }

                // Update the window.
                wwd.redraw();
            }
        };

        var handleMouseDown = function(o) {
            firstX = o.clientX;
            firstY = o.clientY;
        };

        if (isTransient) {
            wwd.addEventListener("mousemove", handlePick);
        } else {
            wwd.addEventListener("mouseup", handlePick);
            wwd.addEventListener("mousedown", handleMouseDown);
        }

        // Listen for taps on mobile devices and highlight the placemarks that the user taps.
        var tapRecognizer = new WorldWind.TapRecognizer(wwd);
        tapRecognizer.addGestureListener(handlePick);
    },

    perfTestBullseyes = function(layer) {
        var center = new WorldWind.Location(39.883635, -98.545936);

        var shapeAttributesRed = new WorldWind.ShapeAttributes(null);
        shapeAttributesRed.interiorColor = WorldWind.Color.RED;

        var shapeAttributesWhite = new WorldWind.ShapeAttributes(null);
        shapeAttributesWhite.interiorColor = WorldWind.Color.WHITE;

        var shapeAttributesYellow = new WorldWind.ShapeAttributes(null);
        shapeAttributesYellow.interiorColor = WorldWind.Color.YELLOW;

        var isRed = true,
            numCircles = 0;

        for (var radius = 1000000; radius > 10; radius *= 0.75) {
            var shapeCircle;
            if (isRed) {
                shapeCircle = new WorldWind.SurfaceCircle(center, radius, shapeAttributesRed);
                shapeCircle.highlightAttributes = shapeAttributesYellow;
            }
            else {
                shapeCircle = new WorldWind.SurfaceCircle(center, radius, shapeAttributesWhite);
                shapeCircle.highlightAttributes = shapeAttributesYellow;
            }
            layer.addRenderable(shapeCircle);

            isRed = !isRed;
            numCircles += 1;
        }

        // For debugging only.
        // console.log("Number of shapeCircles generated: " + numCircles.toString());
    },

    perfTestSpiral = function(layer) {
        var center = new WorldWind.Location(20.395127, -170.264684);

        var shapeAttributesRed = new WorldWind.ShapeAttributes(null);
        shapeAttributesRed.interiorColor = WorldWind.Color.RED;
        shapeAttributesRed.outlineColor = WorldWind.Color.BLACK;
        shapeAttributesRed.outlineWidth = 1;

        var shapeAttributesWhite = new WorldWind.ShapeAttributes(null);
        shapeAttributesWhite.interiorColor = WorldWind.Color.WHITE;
        shapeAttributesWhite.outlineColor = WorldWind.Color.BLACK;
        shapeAttributesWhite.outlineWidth = 1;

        var shapeAttributesYellow = new WorldWind.ShapeAttributes(null);
        shapeAttributesYellow.interiorColor = WorldWind.Color.YELLOW;

        var isRed = true,
            heading = 0;

        var numRectangles = 0;

        for (var radius = 5000000; radius > 10; radius *= 0.85) {
            var shapeRectangle;
            if (isRed) {
                shapeRectangle = new WorldWind.SurfaceRectangle(center, radius, radius, shapeAttributesRed);
                shapeRectangle.highlightAttributes = shapeAttributesYellow;
                shapeRectangle.heading = heading;
            }
            else {
                shapeRectangle = new WorldWind.SurfaceRectangle(center, radius, radius, shapeAttributesWhite);
                shapeRectangle.highlightAttributes = shapeAttributesYellow;
                shapeRectangle.heading = heading;
            }
            layer.addRenderable(shapeRectangle);

            isRed = !isRed;
            heading += 10;
            numRectangles += 1;
        }

        // For debugging only.
        // console.log("Number of ShapeEllipse generated: " + numRectangles.toString());
    },

    perfTestSponge = function(layer) {
        var shapeAttributesRed = new WorldWind.ShapeAttributes(null);
        shapeAttributesRed.interiorColor = WorldWind.Color.RED;
        shapeAttributesRed.outlineColor = WorldWind.Color.BLACK;
        shapeAttributesRed.outlineWidth = 1;

        var shapeAttributesWhite = new WorldWind.ShapeAttributes(null);
        shapeAttributesWhite.interiorColor = WorldWind.Color.WHITE;
        shapeAttributesWhite.outlineColor = WorldWind.Color.BLACK;
        shapeAttributesWhite.outlineWidth = 1;

        var shapeAttributesYellow = new WorldWind.ShapeAttributes(null);
        shapeAttributesYellow.interiorColor = WorldWind.Color.YELLOW;

        perfTestSpongeStep(layer, 6,
            new WorldWind.Location(28.047267, -75.841301),
            new WorldWind.Location(24.701435, -56.791009),
            new WorldWind.Location(38.440259, -62.855462),
            shapeAttributesRed, shapeAttributesWhite, shapeAttributesYellow);
    },

    perfTestSpongeStep = function(layer, depth, location0, location1, location2, shapeAttributeEven, shapeAttributeOdd, shapeAttributeHighlight) {
        var shapeBoundary = [
            location0,
            location1,
            location2
        ];

        var shapePolygon = new WorldWind.SurfacePolygon(shapeBoundary, shapeAttributeEven);
        shapePolygon.highlightAttributes = shapeAttributeHighlight;

        layer.addRenderable(shapePolygon);

        if (depth < 0) {
            return;
        }

        var location01 = new WorldWind.Location(0, 0),
            location12 = new WorldWind.Location(0, 0),
            location20 = new WorldWind.Location(0, 0);

        WorldWind.Location.interpolateGreatCircle(0.5, location0, location1, location01);
        WorldWind.Location.interpolateGreatCircle(0.5, location1, location2, location12);
        WorldWind.Location.interpolateGreatCircle(0.5, location2, location0, location20);

        perfTestSpongeStep(layer, depth - 1, location0, location01, location20, shapeAttributeOdd, shapeAttributeEven, shapeAttributeHighlight);
        perfTestSpongeStep(layer, depth - 1, location1, location12, location01, shapeAttributeOdd, shapeAttributeEven, shapeAttributeHighlight);
        perfTestSpongeStep(layer, depth - 1, location2, location20, location12, shapeAttributeOdd, shapeAttributeEven, shapeAttributeHighlight);
    },

    china = function() {
        return [
            new WorldWind.Location(27.3208271811, 88.9169272233),
            new WorldWind.Location(27.5424270997, 88.7646362564),
            new WorldWind.Location(28.0080542276, 88.8357543581),
            new WorldWind.Location(28.1168002015, 88.6243542099),
            new WorldWind.Location(27.8660542262, 88.14279124),
            new WorldWind.Location(27.823054057, 87.1927452601),
            new WorldWind.Location(28.1116641065, 86.695263212),
            new WorldWind.Location(27.9088820635, 86.4513722924),
            new WorldWind.Location(28.158054085, 86.1976913099),
            new WorldWind.Location(27.8862450575, 86.0054002246),
            new WorldWind.Location(28.2791640367, 85.7213722263),
            new WorldWind.Location(28.3066642229, 85.1109542585),
            new WorldWind.Location(28.5910360469, 85.1951823274),
            new WorldWind.Location(28.5444361855, 84.8466451903),
            new WorldWind.Location(28.7340180721, 84.4862273761),
            new WorldWind.Location(29.2609732388, 84.1165093374),
            new WorldWind.Location(29.189027005, 83.5479091875),
            new WorldWind.Location(29.6316642488, 83.1910823483),
            new WorldWind.Location(30.0692359733, 82.1752543539),
            new WorldWind.Location(30.3344452578, 82.1112271747),
            new WorldWind.Location(30.3850000364, 81.4262273675),
            new WorldWind.Location(30.0119449944, 81.2322092748),
            new WorldWind.Location(30.2043540969, 81.0253633499),
            new WorldWind.Location(30.5755180139, 80.2070002544),
            new WorldWind.Location(30.7337452123, 80.2542272498),
            new WorldWind.Location(30.9658270361, 79.8630362838),
            new WorldWind.Location(30.9570820288, 79.5542912264),
            new WorldWind.Location(31.4372909861, 79.0808183018),
            new WorldWind.Location(31.3089541575, 78.7682452292),
            new WorldWind.Location(31.9684731466, 78.7707542681),
            new WorldWind.Location(32.243045017, 78.4759360782),
            new WorldWind.Location(32.5561002166, 78.4059542272),
            new WorldWind.Location(32.6390180264, 78.746227143),
            new WorldWind.Location(32.350827072, 78.9711003624),
            new WorldWind.Location(32.7566640728, 79.5287363123),
            new WorldWind.Location(33.0994359691, 79.3751181549),
            new WorldWind.Location(33.4286271706, 78.9362361713),
            new WorldWind.Location(33.5204091783, 78.8138632345),
            new WorldWind.Location(34.0683271496, 78.7358091078),
            new WorldWind.Location(34.3500181057, 78.9853541241),
            new WorldWind.Location(34.61180003, 78.3370722497),
            new WorldWind.Location(35.2806911603, 78.0230452522),
            new WorldWind.Location(35.4990269982, 78.0718001009),
            new WorldWind.Location(35.5013269924, 77.8239272743),
            new WorldWind.Location(35.6125001979, 76.8952631942),
            new WorldWind.Location(35.9066540382, 76.5530361216),
            new WorldWind.Location(35.8145731318, 76.1806092194),
            new WorldWind.Location(36.0708179709, 75.9288723355),
            new WorldWind.Location(36.2375090475, 76.0416543634),
            new WorldWind.Location(36.6634272442, 75.8598362985),
            new WorldWind.Location(36.7316911403, 75.4517911692),
            new WorldWind.Location(36.9115540424, 75.3990182037),
            new WorldWind.Location(36.9971911092, 75.1478631916),
            new WorldWind.Location(37.0278180806, 74.5654272018),
            new WorldWind.Location(37.1700001369, 74.3908911667),
            new WorldWind.Location(37.2373271038, 74.9157361055),
            new WorldWind.Location(37.4065820369, 75.1874822687),
            new WorldWind.Location(37.6524271134, 74.9036002831),
            new WorldWind.Location(38.4725641549, 74.8544271775),
            new WorldWind.Location(38.6743821114, 74.3547091728),
            new WorldWind.Location(38.6127092411, 73.8140093613),
            new WorldWind.Location(38.8865270755, 73.7081821337),
            new WorldWind.Location(38.9725641267, 73.852345169),
            new WorldWind.Location(39.2356911789, 73.6200452481),
            new WorldWind.Location(39.4548271532, 73.6556822507),
            new WorldWind.Location(39.5996542029, 73.9547091619),
            new WorldWind.Location(39.768954063, 73.8429002729),
            new WorldWind.Location(40.042018029, 73.9909632401),
            new WorldWind.Location(40.3279182093, 74.8808911928),
            new WorldWind.Location(40.5172270134, 74.858800184),
            new WorldWind.Location(40.4504271006, 75.233936285),
            new WorldWind.Location(40.6445270006, 75.5828363584),
            new WorldWind.Location(40.2980000116, 75.7037360919),
            new WorldWind.Location(40.3532360832, 76.3344002116),
            new WorldWind.Location(41.0125822374, 76.870672199),
            new WorldWind.Location(41.0407911973, 78.080827243),
            new WorldWind.Location(41.3928641564, 78.3955361921),
            new WorldWind.Location(42.0395360348, 80.2451362376),
            new WorldWind.Location(42.1962181131, 80.2340271983),
            new WorldWind.Location(42.6324540975, 80.158036361),
            new WorldWind.Location(42.8156540029, 80.2579541792),
            new WorldWind.Location(42.8854541342, 80.5722540915),
            new WorldWind.Location(43.0290540732, 80.3840453283),
            new WorldWind.Location(43.1683001165, 80.8152634025),
            new WorldWind.Location(44.1137821501, 80.3688722395),
            new WorldWind.Location(44.6358000405, 80.3849913099),
            new WorldWind.Location(44.7340820465, 80.5158913245),
            new WorldWind.Location(44.9028181398, 79.8710542447),
            new WorldWind.Location(45.349700147, 81.6792823895),
            new WorldWind.Location(45.1574821519, 81.9480271608),
            new WorldWind.Location(45.1330271111, 82.5663722297),
            new WorldWind.Location(45.435809115, 82.6462363445),
            new WorldWind.Location(45.5831001089, 82.3217913118),
            new WorldWind.Location(47.2006181629, 83.0344272597),
            new WorldWind.Location(46.9733182149, 83.9302632806),
            new WorldWind.Location(46.9936091262, 84.6780361667),
            new WorldWind.Location(46.8277000812, 84.8031722818),
            new WorldWind.Location(47.0591091734, 85.522563373),
            new WorldWind.Location(47.2622182783, 85.7013822253),
            new WorldWind.Location(47.9372181397, 85.5370722798),
            new WorldWind.Location(48.3933271136, 85.7659632807),
            new WorldWind.Location(48.5427732625, 86.5979092504),
            new WorldWind.Location(49.1102001135, 86.876018284),
            new WorldWind.Location(49.0926182334, 87.3482092803),
            new WorldWind.Location(49.1729542493, 87.8407000726),
            new WorldWind.Location(48.9830451332, 87.8929092713),
            new WorldWind.Location(48.8810361978, 87.7611001555),
            new WorldWind.Location(48.7349912576, 88.0594182929),
            new WorldWind.Location(48.5654092626, 87.9919362608),
            new WorldWind.Location(48.4058272135, 88.5167912578),
            new WorldWind.Location(48.2119361905, 88.611782361),
            new WorldWind.Location(47.9937361395, 89.0851362625),
            new WorldWind.Location(47.8879090795, 90.070963246),
            new WorldWind.Location(46.9522090623, 90.9136001656),
            new WorldWind.Location(46.5773542579, 91.0702631331),
            new WorldWind.Location(46.2969361777, 90.9215093294),
            new WorldWind.Location(46.0173541084, 91.0265092632),
            new WorldWind.Location(45.5797181786, 90.681927211),
            new WorldWind.Location(45.2530541209, 90.8969453239),
            new WorldWind.Location(45.0772820905, 91.5608822466),
            new WorldWind.Location(44.9572182003, 93.5547003126),
            new WorldWind.Location(44.3549911959, 94.7173452205),
            new WorldWind.Location(44.2941642273, 95.410609249),
            new WorldWind.Location(44.0193640339, 95.3410914202),
            new WorldWind.Location(43.9931181157, 95.5333912227),
            new WorldWind.Location(43.283882203, 95.8790091105),
            new WorldWind.Location(42.7349912604, 96.3820632802),
            new WorldWind.Location(42.7958271138, 97.1654002462),
            new WorldWind.Location(42.5719451383, 99.5101271926),
            new WorldWind.Location(42.6770729799, 100.842482171),
            new WorldWind.Location(42.5097182242, 101.814700296),
            new WorldWind.Location(42.2333271455, 102.077209267),
            new WorldWind.Location(41.8872182459, 103.416382253),
            new WorldWind.Location(41.87720908, 104.526654348),
            new WorldWind.Location(41.6706821703, 104.523736272),
            new WorldWind.Location(41.5866540936, 105.006509253),
            new WorldWind.Location(42.466245148, 107.475818271),
            new WorldWind.Location(42.4299912374, 109.310672202),
            new WorldWind.Location(42.6457642245, 110.10637214),
            new WorldWind.Location(43.3169360707, 110.989700182),
            new WorldWind.Location(43.6922180168, 111.958327165),
            new WorldWind.Location(44.3752732224, 111.42137222),
            new WorldWind.Location(45.0494360669, 111.873027218),
            new WorldWind.Location(45.0805542178, 112.427200436),
            new WorldWind.Location(44.8460999801, 112.853045207),
            new WorldWind.Location(44.7452730607, 113.638045311),
            new WorldWind.Location(45.3894360679, 114.545254233),
            new WorldWind.Location(45.4586000127, 115.701927203),
            new WorldWind.Location(45.721927057, 116.210400273),
            new WorldWind.Location(46.2958270843, 116.585536374),
            new WorldWind.Location(46.4188821404, 117.37552723),
            new WorldWind.Location(46.5706911478, 117.424982135),
            new WorldWind.Location(46.5364542584, 117.845545134),
            new WorldWind.Location(46.7363820957, 118.314709425),
            new WorldWind.Location(46.5989452024, 119.706791163),
            new WorldWind.Location(46.7151272655, 119.931509318),
            new WorldWind.Location(46.9022180505, 119.922491228),
            new WorldWind.Location(47.664982138, 119.124972249),
            new WorldWind.Location(47.9947542054, 118.539336217),
            new WorldWind.Location(48.0112452647, 117.804554275),
            new WorldWind.Location(47.6574179733, 117.382672299),
            new WorldWind.Location(47.8880452016, 116.874691247),
            new WorldWind.Location(47.8781822162, 116.262363379),
            new WorldWind.Location(47.6918640751, 115.923118252),
            new WorldWind.Location(47.9174911629, 115.594409345),
            new WorldWind.Location(48.1435271199, 115.549072301),
            new WorldWind.Location(48.2524911909, 115.835818216),
            new WorldWind.Location(48.5205451258, 115.811100318),
            new WorldWind.Location(49.8304640962, 116.711382101),
            new WorldWind.Location(49.520573065, 117.874709296),
            new WorldWind.Location(49.92263603, 118.574572229),
            new WorldWind.Location(50.0963090643, 119.321027312),
            new WorldWind.Location(50.3302731283, 119.35999126),
            new WorldWind.Location(50.3902731383, 119.138600386),
            new WorldWind.Location(51.6208270524, 120.064145224),
            new WorldWind.Location(52.1150000928, 120.77665427),
            new WorldWind.Location(52.3442270404, 120.625909262),
            new WorldWind.Location(52.54266424, 120.712172457),
            new WorldWind.Location(52.5880450374, 120.081927264),
            new WorldWind.Location(52.7681910803, 120.031436188),
            new WorldWind.Location(53.263745123, 120.830691394),
            new WorldWind.Location(53.5436091594, 123.614709361),
            new WorldWind.Location(53.1883271049, 124.493309172),
            new WorldWind.Location(53.0502731359, 125.620045168),
            new WorldWind.Location(52.8752001562, 125.657345308),
            new WorldWind.Location(52.7572179955, 126.096791226),
            new WorldWind.Location(52.5760999872, 125.994282226),
            new WorldWind.Location(52.1269362582, 126.554982264),
            new WorldWind.Location(51.9943642216, 126.441227265),
            new WorldWind.Location(51.3813822296, 126.913882284),
            new WorldWind.Location(51.2655540504, 126.817618305),
            new WorldWind.Location(51.3192270646, 126.968872263),
            new WorldWind.Location(51.0582539939, 126.933100311),
            new WorldWind.Location(50.7413820108, 127.29192724),
            new WorldWind.Location(50.3147179923, 127.334018308),
            new WorldWind.Location(50.2085640381, 127.586063311),
            new WorldWind.Location(49.8058821534, 127.515009247),
            new WorldWind.Location(49.5866541458, 127.838045282),
            new WorldWind.Location(49.5844362942, 128.711909149),
            new WorldWind.Location(49.346754018, 129.111782258),
            new WorldWind.Location(49.4158001132, 129.490200377),
            new WorldWind.Location(48.8646452185, 130.224609325),
            new WorldWind.Location(48.8604091723, 130.674000203),
            new WorldWind.Location(48.605754045, 130.523591309),
            new WorldWind.Location(48.3268001155, 130.823991343),
            new WorldWind.Location(48.1083910199, 130.659836295),
            new WorldWind.Location(47.6872092689, 130.992172219),
            new WorldWind.Location(47.7102730814, 132.521091377),
            new WorldWind.Location(48.098882086, 133.082736391),
            new WorldWind.Location(48.068882081, 133.484272302),
            new WorldWind.Location(48.3911181468, 134.415345341),
            new WorldWind.Location(48.2671269997, 134.740754293),
            new WorldWind.Location(47.9920731699, 134.557600153),
            new WorldWind.Location(47.7002731356, 134.760818222),
            new WorldWind.Location(47.3233270465, 134.182463381),
            new WorldWind.Location(46.6401642172, 133.997745345),
            new WorldWind.Location(46.4788819828, 133.847182392),
            new WorldWind.Location(46.2536272191, 133.901609274),
            new WorldWind.Location(45.8234640913, 133.476054349),
            new WorldWind.Location(45.6245730954, 133.470245355),
            new WorldWind.Location(45.4508271386, 133.149136152),
            new WorldWind.Location(45.0569361939, 133.025272242),
            new WorldWind.Location(45.3458181524, 131.868436161),
            new WorldWind.Location(44.973873042, 131.469118437),
            new WorldWind.Location(44.8364909663, 130.952991348),
            new WorldWind.Location(44.0519361097, 131.298036249),
            new WorldWind.Location(43.5362452151, 131.191227333),
            new WorldWind.Location(43.3895821933, 131.310391174),
            new WorldWind.Location(42.9164452154, 131.128491302),
            new WorldWind.Location(42.7448540783, 130.43273634),
            new WorldWind.Location(42.4218639764, 130.604372236),
            new WorldWind.Location(42.7141541843, 130.246782308),
            new WorldWind.Location(42.8879452358, 130.251418171),
            new WorldWind.Location(43.0045732162, 129.904591278),
            new WorldWind.Location(42.4358181688, 129.695527166),
            new WorldWind.Location(42.4462362039, 129.349272254),
            new WorldWind.Location(42.027354112, 128.926927262),
            new WorldWind.Location(42.0012451541, 128.056636265),
            new WorldWind.Location(41.5828359691, 128.300245385),
            new WorldWind.Location(41.3812361097, 128.152909296),
            new WorldWind.Location(41.4724910633, 127.270827308),
            new WorldWind.Location(41.7922180903, 126.904709296),
            new WorldWind.Location(41.611754038, 126.566082251),
            new WorldWind.Location(40.8969361131, 126.011791184),
            new WorldWind.Location(40.4703730127, 124.885127272),
            new WorldWind.Location(40.093618031, 124.373600339),
            new WorldWind.Location(39.8277730629, 124.128027339),
            new WorldWind.Location(39.8143001593, 123.242200316),
            new WorldWind.Location(39.6738819907, 123.216663172),
            new WorldWind.Location(38.9963821429, 121.648036424),
            new WorldWind.Location(38.8611002369, 121.698182333),
            new WorldWind.Location(38.7190821306, 121.187336179),
            new WorldWind.Location(38.9122090593, 121.088672293),
            new WorldWind.Location(39.0901271923, 121.679427322),
            new WorldWind.Location(39.218600143, 121.599427253),
            new WorldWind.Location(39.3516640297, 121.751100306),
            new WorldWind.Location(39.5284640168, 121.228345311),
            new WorldWind.Location(39.6232180797, 121.533009387),
            new WorldWind.Location(39.8113820835, 121.468318361),
            new WorldWind.Location(40.0030542491, 121.880954426),
            new WorldWind.Location(40.5056180775, 122.298663219),
            new WorldWind.Location(40.7387451246, 122.052127307),
            new WorldWind.Location(40.9219361453, 121.177463303),
            new WorldWind.Location(40.1961002086, 120.446782291),
            new WorldWind.Location(39.8724180968, 119.526445296),
            new WorldWind.Location(39.1569361575, 118.971518377),
            new WorldWind.Location(39.0408271846, 118.32728228),
            new WorldWind.Location(39.1984641293, 117.889000273),
            new WorldWind.Location(38.6755542367, 117.536372432),
            new WorldWind.Location(38.3866541734, 117.67220922),
            new WorldWind.Location(38.1672181269, 118.028054203),
            new WorldWind.Location(38.1529090447, 118.837763151),
            new WorldWind.Location(37.878327116, 119.035536336),
            new WorldWind.Location(37.3005450941, 118.956645193),
            new WorldWind.Location(37.1436090441, 119.232754304),
            new WorldWind.Location(37.1513820859, 119.767209263),
            new WorldWind.Location(37.3522820563, 119.852909194),
            new WorldWind.Location(37.8349910001, 120.737072409),
            new WorldWind.Location(37.4245731216, 121.579991128),
            new WorldWind.Location(37.5525641129, 122.128172291),
            new WorldWind.Location(37.418327095, 122.181372231),
            new WorldWind.Location(37.3962451386, 122.55858235),
            new WorldWind.Location(37.2099910353, 122.597209345),
            new WorldWind.Location(37.0258270433, 122.400545253),
            new WorldWind.Location(37.0197820147, 122.539154271),
            new WorldWind.Location(36.8936092259, 122.504709343),
            new WorldWind.Location(36.8429731428, 122.192336263),
            new WorldWind.Location(37.000273135, 121.956645359),
            new WorldWind.Location(36.7588910867, 121.594436332),
            new WorldWind.Location(36.6166540451, 120.776382361),
            new WorldWind.Location(36.5263819535, 120.959991136),
            new WorldWind.Location(36.375827214, 120.87526317),
            new WorldWind.Location(36.4227730804, 120.706236225),
            new WorldWind.Location(36.1407451718, 120.69562725),
            new WorldWind.Location(36.0419002372, 120.343591172),
            new WorldWind.Location(36.2634451705, 120.30780933),
            new WorldWind.Location(36.1999820934, 120.088854237),
            new WorldWind.Location(35.9594362237, 120.237763273),
            new WorldWind.Location(35.5789271551, 119.64745433),
            new WorldWind.Location(34.8849912333, 119.176091298),
            new WorldWind.Location(34.3114539749, 120.24873619),
            new WorldWind.Location(32.9749911934, 120.885818333),
            new WorldWind.Location(32.6388820719, 120.837491297),
            new WorldWind.Location(32.4295732086, 121.33484527),
            new WorldWind.Location(32.113327186, 121.441227379),
            new WorldWind.Location(32.0216640337, 121.706645206),
            new WorldWind.Location(31.6783270295, 121.827472352),
            new WorldWind.Location(31.866391121, 120.944427115),
            new WorldWind.Location(32.093609094, 120.601927295),
            new WorldWind.Location(31.9455540057, 120.099009415),
            new WorldWind.Location(32.3063820303, 119.826663276),
            new WorldWind.Location(32.2627731673, 119.631654274),
            new WorldWind.Location(31.9038820329, 120.136372252),
            new WorldWind.Location(31.9883270254, 120.702618428),
            new WorldWind.Location(31.8194362022, 120.719636374),
            new WorldWind.Location(31.3088909579, 121.668054253),
            new WorldWind.Location(30.9798539834, 121.882763241),
            new WorldWind.Location(30.8530542282, 121.846927252),
            new WorldWind.Location(30.5688820612, 120.991509271),
            new WorldWind.Location(30.3355541836, 120.814418265),
            new WorldWind.Location(30.3929819552, 120.458591219),
            new WorldWind.Location(30.1969361125, 120.149991168),
            new WorldWind.Location(30.3102730225, 120.508191131),
            new WorldWind.Location(30.0646450373, 120.791582272),
            new WorldWind.Location(30.3045820455, 121.280809319),
            new WorldWind.Location(29.9630541912, 121.677754294),
            new WorldWind.Location(29.8821089785, 122.119563238),
            new WorldWind.Location(29.5116640611, 121.448318134),
            new WorldWind.Location(29.589164144, 121.974354309),
            new WorldWind.Location(29.1952730317, 121.93359127),
            new WorldWind.Location(29.1838820252, 121.811918222),
            new WorldWind.Location(29.3723539801, 121.796918303),
            new WorldWind.Location(29.1972910587, 121.744354215),
            new WorldWind.Location(29.2911091983, 121.561100162),
            new WorldWind.Location(29.1634000065, 121.413518316),
            new WorldWind.Location(29.0219451641, 121.69136332),
            new WorldWind.Location(28.9359000663, 121.490818239),
            new WorldWind.Location(28.727982096, 121.611300219),
            new WorldWind.Location(28.8421451263, 121.1463822),
            new WorldWind.Location(28.6699270227, 121.484427373),
            new WorldWind.Location(28.3472182175, 121.641663328),
            new WorldWind.Location(28.1388821578, 121.34192714),
            new WorldWind.Location(28.3827730774, 121.165118268),
            new WorldWind.Location(27.9822181845, 120.935254296),
            new WorldWind.Location(28.079436024, 120.590818256),
            new WorldWind.Location(27.8722910327, 120.839991284),
            new WorldWind.Location(27.5931910906, 120.58116331),
            new WorldWind.Location(27.450827147, 120.66554527),
            new WorldWind.Location(27.2077730766, 120.507491242),
            new WorldWind.Location(27.2827731729, 120.189563307),
            new WorldWind.Location(27.1476362739, 120.421100307),
            new WorldWind.Location(26.8980542097, 120.033182306),
            new WorldWind.Location(26.6446449685, 120.127963191),
            new WorldWind.Location(26.5177731289, 119.86026314),
            new WorldWind.Location(26.7882271379, 120.073309327),
            new WorldWind.Location(26.6488820205, 119.866782249),
            new WorldWind.Location(26.7961091444, 119.787900158),
            new WorldWind.Location(26.756245148, 119.550263312),
            new WorldWind.Location(26.4422181505, 119.820400318),
            new WorldWind.Location(26.473882131, 119.577472143),
            new WorldWind.Location(26.3386091098, 119.6580452),
            new WorldWind.Location(26.3677731038, 119.94886321),
            new WorldWind.Location(25.9969362486, 119.425263319),
            new WorldWind.Location(26.1404180028, 119.097491341),
            new WorldWind.Location(25.9378730001, 119.354009263),
            new WorldWind.Location(25.9906912278, 119.705827412),
            new WorldWind.Location(25.6799640179, 119.580745277),
            new WorldWind.Location(25.6822180794, 119.452209294),
            new WorldWind.Location(25.3533271176, 119.64540026),
            new WorldWind.Location(25.606491272, 119.314945235),
            new WorldWind.Location(25.4209642149, 119.10526321),
            new WorldWind.Location(25.2531910347, 119.352554332),
            new WorldWind.Location(25.1720822073, 119.272627353),
            new WorldWind.Location(25.2426001647, 118.874872351),
            new WorldWind.Location(24.9719359376, 118.986645198),
            new WorldWind.Location(24.8829181139, 118.572909259),
            new WorldWind.Location(24.756736105, 118.76311828),
            new WorldWind.Location(24.5286090307, 118.595263292),
            new WorldWind.Location(24.5363822401, 118.239700276),
            new WorldWind.Location(24.6819361685, 118.168800272),
            new WorldWind.Location(24.4402361107, 118.019882183),
            new WorldWind.Location(24.4601821905, 117.794727331),
            new WorldWind.Location(24.2587451077, 118.123727258),
            new WorldWind.Location(23.6243731693, 117.195682265),
            new WorldWind.Location(23.6591912599, 116.917936336),
            new WorldWind.Location(23.3550000905, 116.760327219),
            new WorldWind.Location(23.4202361079, 116.532200312),
            new WorldWind.Location(23.2366642135, 116.787072363),
            new WorldWind.Location(23.2108269969, 116.513891386),
            new WorldWind.Location(22.9390181371, 116.481718288),
            new WorldWind.Location(22.7391640605, 115.797763202),
            new WorldWind.Location(22.8841641127, 115.640263217),
            new WorldWind.Location(22.6588820241, 115.536654344),
            new WorldWind.Location(22.8083269995, 115.16137223),
            new WorldWind.Location(22.7027731896, 114.88889131),
            new WorldWind.Location(22.5330540667, 114.872209311),
            new WorldWind.Location(22.6402731931, 114.718045324),
            new WorldWind.Location(22.8140271966, 114.778182294),
            new WorldWind.Location(22.6997181535, 114.520827356),
            new WorldWind.Location(22.5042360777, 114.613591219),
            new WorldWind.Location(22.5500361379, 114.222263125),
            new WorldWind.Location(22.4299271531, 114.388527228),
            new WorldWind.Location(22.2605640934, 114.296109201),
            new WorldWind.Location(22.367354234, 113.90560924),
            new WorldWind.Location(22.5087361539, 114.033691258),
            new WorldWind.Location(22.4744360649, 113.860809308),
            new WorldWind.Location(22.8345819702, 113.605954189),
            new WorldWind.Location(23.0502731499, 113.525272168),
            new WorldWind.Location(23.1172361746, 113.821900346),
            new WorldWind.Location(23.0508271937, 113.479282173),
            new WorldWind.Location(22.8798541381, 113.362900286),
            new WorldWind.Location(22.549445046, 113.564772222),
            new WorldWind.Location(22.1870092048, 113.552682332),
            new WorldWind.Location(22.5670089889, 113.168727296),
            new WorldWind.Location(22.1796450323, 113.386791224),
            new WorldWind.Location(22.0406911822, 113.222618239),
            new WorldWind.Location(22.2048541091, 113.084845232),
            new WorldWind.Location(21.8693000372, 112.940045339),
            new WorldWind.Location(21.9647181145, 112.824018174),
            new WorldWind.Location(21.7013821853, 112.281936354),
            new WorldWind.Location(21.9161091109, 111.892136281),
            new WorldWind.Location(21.7513909667, 111.966927165),
            new WorldWind.Location(21.7781910964, 111.676227339),
            new WorldWind.Location(21.612636103, 111.78317221),
            new WorldWind.Location(21.5268002174, 111.643954162),
            new WorldWind.Location(21.5252730347, 111.028454247),
            new WorldWind.Location(21.2113821593, 110.532763411),
            new WorldWind.Location(21.3732181022, 110.394354217),
            new WorldWind.Location(20.843818102, 110.159354318),
            new WorldWind.Location(20.8408271037, 110.375536342),
            new WorldWind.Location(20.6400002234, 110.32388236),
            new WorldWind.Location(20.486173189, 110.527354234),
            new WorldWind.Location(20.2461091111, 110.278872211),
            new WorldWind.Location(20.2336091789, 109.924427173),
            new WorldWind.Location(20.4318001182, 110.006863358),
            new WorldWind.Location(20.9241641762, 109.662900226),
            new WorldWind.Location(21.4469451551, 109.941091235),
            new WorldWind.Location(21.5056912324, 109.660472156),
            new WorldWind.Location(21.7233271813, 109.5733183),
            new WorldWind.Location(21.4949910624, 109.534427275),
            new WorldWind.Location(21.3966641295, 109.142763235),
            new WorldWind.Location(21.5830541873, 109.137500238),
            new WorldWind.Location(21.6161090607, 108.910954326),
            new WorldWind.Location(21.7988821597, 108.870245266),
            new WorldWind.Location(21.5988820704, 108.740254352),
            new WorldWind.Location(21.9356179906, 108.469218304),
            new WorldWind.Location(21.5901360573, 108.512500273),
            new WorldWind.Location(21.6899911788, 108.333600284),
            new WorldWind.Location(21.5144451245, 108.244709362),
            new WorldWind.Location(21.5424091652, 107.99001836),
            new WorldWind.Location(21.6669360835, 107.783054251),
            new WorldWind.Location(21.6052642191, 107.362727286),
            new WorldWind.Location(22.0308271908, 106.693309269),
            new WorldWind.Location(22.4568179749, 106.55170942),
            new WorldWind.Location(22.7638821254, 106.787491184),
            new WorldWind.Location(22.866945169, 106.702900346),
            new WorldWind.Location(22.912527132, 105.877063275),
            new WorldWind.Location(23.3241642421, 105.358727219),
            new WorldWind.Location(23.1802731158, 104.907491316),
            new WorldWind.Location(22.8180541982, 104.731927157),
            new WorldWind.Location(22.6875001885, 104.374700166),
            new WorldWind.Location(22.7981270615, 104.111300199),
            new WorldWind.Location(22.5038729736, 103.96866334),
            new WorldWind.Location(22.7828730035, 103.653809384),
            new WorldWind.Location(22.5843642224, 103.522418358),
            new WorldWind.Location(22.7945090968, 103.333672315),
            new WorldWind.Location(22.4365181788, 103.030400305),
            new WorldWind.Location(22.7718732643, 102.474436209),
            new WorldWind.Location(22.3962821936, 102.140745267),
            new WorldWind.Location(22.4977731274, 101.741509182),
            new WorldWind.Location(22.2091640837, 101.574436226),
            new WorldWind.Location(21.8344450662, 101.765263161),
            new WorldWind.Location(21.1445089886, 101.785954224),
            new WorldWind.Location(21.1768731932, 101.291927197),
            new WorldWind.Location(21.5726361522, 101.14823623),
            new WorldWind.Location(21.7690271616, 101.099009313),
            new WorldWind.Location(21.4769361077, 100.639709348),
            new WorldWind.Location(21.435464127, 100.205682331),
            new WorldWind.Location(21.7255452006, 99.9776273406),
            new WorldWind.Location(22.0501820111, 99.9574091843),
            new WorldWind.Location(22.1559182113, 99.1678453023),
            new WorldWind.Location(22.9365910732, 99.5648452625),
            new WorldWind.Location(23.0820450893, 99.5113003238),
            new WorldWind.Location(23.1891641358, 98.9274720999),
            new WorldWind.Location(23.9707541455, 98.6799092362),
            new WorldWind.Location(24.1600731756, 98.890727345),
            new WorldWind.Location(23.9299911063, 97.5476182172),
            new WorldWind.Location(24.2605540901, 97.7593003327),
            new WorldWind.Location(24.4766641973, 97.5430452185),
            new WorldWind.Location(24.7399270363, 97.55255432),
            new WorldWind.Location(25.615272992, 98.1910821737),
            new WorldWind.Location(25.5694451039, 98.3613722718),
            new WorldWind.Location(25.8559730886, 98.7104002531),
            new WorldWind.Location(26.1252730772, 98.5694453074),
            new WorldWind.Location(26.1847180376, 98.7310913164),
            new WorldWind.Location(26.7916642211, 98.7777721469),
            new WorldWind.Location(27.5297179551, 98.6969912196),
            new WorldWind.Location(27.6725001557, 98.4588823045),
            new WorldWind.Location(27.5401359903, 98.3199182284),
            new WorldWind.Location(28.1488821036, 98.1449912614),
            new WorldWind.Location(28.5465271351, 97.5588722634),
            new WorldWind.Location(28.2227731066, 97.3488722283),
            new WorldWind.Location(28.4674909847, 96.65387214),
            new WorldWind.Location(28.3511092646, 96.4019272173),
            new WorldWind.Location(28.5250000608, 96.3402722843),
            new WorldWind.Location(28.79569111, 96.6137273499),
            new WorldWind.Location(29.0566641807, 96.4708272998),
            new WorldWind.Location(28.9013822155, 96.1753273258),
            new WorldWind.Location(29.0597182109, 96.1488822536),
            new WorldWind.Location(29.2575641511, 96.3917272793),
            new WorldWind.Location(29.4644362276, 96.0831453337),
            new WorldWind.Location(29.0352730608, 95.3877722508),
            new WorldWind.Location(29.3334641286, 94.6475092147),
            new WorldWind.Location(29.0734821342, 94.2345543018),
            new WorldWind.Location(28.6692001441, 93.9617272083),
            new WorldWind.Location(28.618753995, 93.3519363745),
            new WorldWind.Location(28.3193001096, 93.2220542582),
            new WorldWind.Location(28.1419001459, 92.7104451829),
            new WorldWind.Location(27.8619361972, 92.5449822228),
            new WorldWind.Location(27.76471819, 91.6577633012),
            new WorldWind.Location(27.9450000197, 91.6627632741),
            new WorldWind.Location(28.0811090519, 91.3013723209),
            new WorldWind.Location(27.9699909993, 91.0869271949),
            new WorldWind.Location(28.0795820367, 90.3765002138),
            new WorldWind.Location(28.2425641211, 90.3889723181),
            new WorldWind.Location(28.3236910534, 89.9981913948),
            new WorldWind.Location(28.0577729952, 89.487491253),
            new WorldWind.Location(27.3208271811, 88.9169272233)
        ];
    }
);
