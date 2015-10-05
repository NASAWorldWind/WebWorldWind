/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
requirejs(['../src/WorldWind',
        '../src/formats/kml/KmlFile'],
    function (WorldWind,
              KmlFile) {
        var kmlFileXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
            "<kml xmlns=\"http://www.opengis.net/kml/2.2\">" +
            "<Point id=\"1\">" +
            "   <extrude>true</extrude>" +
            "   <altitudeMode>clampToGround</altitudeMode>" +
            "   <coordinates>14.4491169,50.0773403,0</coordinates>" +
            "</Point>" +
            "<LineString id=\"2\">" +
            "   <coordinates>-82.364167,37.824787,0 -122.363917,37.824423,0</coordinates>" +
            "</LineString>" +
            "<LinearRing id=\"3\">" +
            "   <coordinates>-92.365662,37.826988,0 -112.365202,37.826302,0 -102.364581,27.82655,0 -115.365038,47.827237,0 -92.365662,37.826988,0</coordinates>" +
            "</LinearRing>" +
            "<MultiGeometry id=\"7\">" +
            "   <LineString id=\"8\">" +
            "       <coordinates>10,10,0 20,10,0</coordinates>" +
            "   </LineString>" +
            "   <LineString id=\"9\">" +
            "       <coordinates>10,20,0 20,20,0</coordinates>" +
            "   </LineString>" +
            "</MultiGeometry>" +
            "<Placemark id=\"10\">" +
            "   <description>Example of a placemark.</description>" +
            "   <Polygon id=\"4\">" +
            "       <outerBoundaryIs>" +
            "           <LinearRing id=\"5\">" +
            "               <coordinates>-60,30,1000000 -30,30,1000000 -30,0,1000000 -60,0,1000000 -60,30,1000000</coordinates>" +
            "           </LinearRing>" +
            "       </outerBoundaryIs>" +
            "       <innerBoundaryIs>" +
            "           <LinearRing id=\"6\">" +
            "               <coordinates>-50,20,1000000 -40,20,1000000 -40,10,1000000 -50,10,1000000 -50,20,1000000</coordinates>" +
            "           </LinearRing>" +
            "       </innerBoundaryIs>" +
            "       <extrude>1</extrude>" +
            "   </Polygon>" +
            "   <Style id=\"11\">" +
            "       <PolyStyle id=\"12\">" +
            "           <color>ffffffff</color>" +
            "           <fill>1</fill>" +
            "           <outline>1</outline>" +
            "       </PolyStyle>" +
            "   </Style>" +
            "</Placemark>" +
            "</kml>";

        var kmlFileXml = "countries_world.kml";
        var xhr = new XMLHttpRequest();

        xhr.open("GET", kmlFileXml, true);
        xhr.onreadystatechange = (function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var text = xhr.responseText;
                    var renderableLayer = new WorldWind.RenderableLayer("Surface Shapes");
                    wwd.addLayer(renderableLayer);

                    var kmlFileRepresentation = new WorldWind.KmlFile(text);
                    kmlFileRepresentation.parseDocument();
                    kmlFileRepresentation.render(renderableLayer);
                }
            }
        }).bind(this);

        xhr.onerror = (function () {
            console.log("Error");
        }).bind(this);

        xhr.ontimeout = (function () {
            console.log("Timeout");
        }).bind(this);

        xhr.send(null);

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

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
    });