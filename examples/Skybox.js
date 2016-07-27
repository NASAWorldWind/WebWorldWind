/**
 * Created by Florin on 7/27/2016.
 */

require(['../src/WorldWind', './LayerManager'], function (WorldWind, LayerManager) {
    'use strict';

    WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

    var wwd = new WorldWind.WorldWindow("canvasOne");

    //SkyboxLayer must come before AtmosphereLayer
    var layers = [
        {layer: new WorldWind.BMNGLayer(), enabled: true},
        {layer: new WorldWind.CompassLayer(), enabled: false},
        {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: false},
        {layer: new WorldWind.ViewControlsLayer(wwd), enabled: false},
        {layer: new WorldWind.SkyboxLayer(null, wwd), enabled: true},
        {layer: new WorldWind.AtmosphereLayer(), enabled: true}
    ];

    for (var l = 0; l < layers.length; l++) {
        layers[l].layer.enabled = layers[l].enabled;
        wwd.addLayer(layers[l].layer);
    }

    // Create a layer manager for controlling layer visibility.
    var layerManger = new LayerManager(wwd);


});