/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports TerrainOpacityController
 * @version $Id: TerrainOpacityController.js 3217 2015-06-19 18:58:03Z tgaskins $
 */
define(function () {
    "use strict";

    /**
     * Constructs a TerrainOpacityController.
     * @alias TerrainOpacityController
     * @constructor
     * @classdesc Provides a slider to control the opacity of TiledImageLayer layers.
     * @param {WorldWindow} worldWindow The World Window to associate with this opacity controller.
     */
    var TerrainOpacityController = function (worldWindow) {
        var thisController = this;

        this.wwd = worldWindow;

        this.slider = $("#terrainOpacitySlider").slider({
            value: this.wwd.surfaceOpacity * 100,
            min: 0,
            max: 100,
            animate: true,
            slide: function (event, ui) {
                $("#terrainOpacityReadout").html(ui.value / 100);
                thisController.updateOpacity(ui.value);
            }
        });
        $("#terrainOpacityReadout").html(this.slider.slider("value") / 100);
    };

    TerrainOpacityController.prototype.updateOpacity = function (value) {
        this.wwd.surfaceOpacity = value / 100;
        //for (var i = 0; i < this.wwd.layers.length; i++) {
        //    var layer = this.wwd.layers[i];
        //
        //    if (layer instanceof WorldWind.TiledImageLayer) {
        //        layer.opacity = value / 100;
        //    }
        //}

        this.wwd.redraw();
    };

    return TerrainOpacityController;
});