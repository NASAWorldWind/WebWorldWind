/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
requirejs(['../src/WorldWind',
        '../examples/LayerManager'],
    function (ww,
              LayerManager) {
        "use strict";

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        var wwd = new WorldWind.WorldWindow("canvasOne");

        var layers = [
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: true},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: false},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true},
            {layer: new WorldWind.CompassLayer(), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        var dotImage = WorldWind.WWUtil.currentUrlSansFilePart() + "/../images/white-dot.png"; // location of the dot image file

        // Set up the common placemark attributes.
        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        placemarkAttributes.imageScale = 0.025;
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.imageSource = dotImage;

        var addLabelForName = function (attributes, record, layer) {
            var name = attributes.values.name || attributes.values.Name || attributes.values.NAME;
            if (!!name) {
                var bounds = record.boundingRectangle;
                var position = new WorldWind.Position(
                    0.5 * (bounds[0] + bounds[1]),
                    0.5 * (bounds[2] + bounds[3]),
                    100);
                var namePlacemark = new WorldWind.Placemark(position);
                namePlacemark.label = name;
                namePlacemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                layer.addRenderable(namePlacemark);
            }
        };

        // For this example, cities are provided in a shapefile that just has points,
        // and a database that has names (among other attributes).
        var cityAttributeCallback = function (layer) {
            return function (attributes, record) {
                // Add the label for a name record in the database to a separate layer.
                if (!!layer) {
                    addLabelForName(attributes, record, layer);
                }

                if (record.isPointType()) {
                    // Modify placemark attributes in a data dependent manner as appropriate.

                    var currentPlacemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);

                    if (attributes.values.hasOwnProperty('pop_max')) {
                        var population = attributes.values.pop_max;
                        currentPlacemarkAttributes.imageScale = 0.01 * Math.log(population);
                    }

                    return {attributes: currentPlacemarkAttributes};
                }
                else {
                    // This should never be reached.
                    alert("Invalid record type was encountered!");
                    return null;
                }
            }
        };

        var defaultAttributeCallback = function (layer) {
            return function (attributes, record) {
                // Add the label for a name record in the database to a separate layer.
                if (!!layer) {
                    addLabelForName(attributes, record, layer);
                }

                if (record.isPolylineType()) {
                    // Modify path attributes in a data dependent manner as appropriate.

                    var pathAttributes = new WorldWind.ShapeAttributes(null);

                    pathAttributes.drawVerticals = true;
                    pathAttributes.outlineColor = WorldWind.Color.RED;

                    return {attributes: pathAttributes};
                }
                else if (record.isPolygonType()) {
                    // Modify polygon attributes in a data dependent manner as appropriate.

                    var polygonAttributes = new WorldWind.ShapeAttributes(null);

                    // Fill the polygon with a random pastel color.
                    var interiorColor = new WorldWind.Color(
                        0.375 + 0.5 * Math.random(),
                        0.375 + 0.5 * Math.random(),
                        0.375 + 0.5 * Math.random(),
                        1.0);
                    polygonAttributes.interiorColor = interiorColor;

                    // Paint the outline in a darker variant of the interior color.
                    polygonAttributes.outlineColor = new WorldWind.Color(
                        0.5 * interiorColor.red,
                        0.5 * interiorColor.green,
                        0.5 * interiorColor.blue,
                        1.0);

                    return {attributes: polygonAttributes};
                }
                if (record.isPointType()) {
                    // Modify placemark attributes in a data dependent manner as appropriate.

                    var currentPlacemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);

                    return {attributes: currentPlacemarkAttributes};
                }
                else {
                    // This should never be reached.
                    alert("Invalid record type was encountered!");
                    return null;
                }
            }
        };

        var shapefileLibrary = "https://worldwind.arc.nasa.gov/web/examples/data/shapefiles/naturalearth";

        // Create data for the world.
        var worldLayer = new WorldWind.RenderableLayer("Countries");
        var worldLabelsLayer = new WorldWind.RenderableLayer("Country Labels");

        var worldShapefile = new WorldWind.Shapefile(shapefileLibrary + "/ne_110m_admin_0_countries/ne_110m_admin_0_countries.shp");
        worldShapefile.load(null, defaultAttributeCallback(worldLabelsLayer), worldLayer);

        var worldBordersShapefile = new WorldWind.Shapefile(shapefileLibrary + "/ne_110m_admin_0_boundary_lines_land/ne_110m_admin_0_boundary_lines_land.shp");
        worldBordersShapefile.load(null, defaultAttributeCallback(null), worldLayer);

        wwd.addLayer(worldLayer);
        wwd.addLayer(worldLabelsLayer);

        // Create data for the US.
        var usLayer = new WorldWind.RenderableLayer("US States");
        var usLabelsLayer = new WorldWind.RenderableLayer("State Labels");

        var usShapefile = new WorldWind.Shapefile(shapefileLibrary + "/ne_110m_admin_1_states_provinces_lakes/ne_110m_admin_1_states_provinces_lakes.shp");
        usShapefile.load(null, defaultAttributeCallback(usLabelsLayer), usLayer);

        var usBordersShapefile = new WorldWind.Shapefile(shapefileLibrary + "/ne_110m_admin_1_states_provinces_lines/ne_110m_admin_1_states_provinces_lines.shp");
        usBordersShapefile.load(null, defaultAttributeCallback(null), usLayer);

        wwd.addLayer(usLayer);
        wwd.addLayer(usLabelsLayer);

        // Create data for cities.
        var cityLayer = new WorldWind.RenderableLayer("Cities");
        var cityLabelsLayer = new WorldWind.RenderableLayer("City Labels");

        var cityShapefile = new WorldWind.Shapefile(shapefileLibrary + "/ne_50m_populated_places_simple/ne_50m_populated_places_simple.shp");
        cityShapefile.load(null, cityAttributeCallback(cityLabelsLayer), cityLayer);

        cityLabelsLayer.enabled = false;
        wwd.addLayer(cityLayer);
        wwd.addLayer(cityLabelsLayer);

        wwd.redraw();

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });