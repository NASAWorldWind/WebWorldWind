/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: LayerDropdown.js 3411 2015-08-17 04:23:28Z tgaskins $
 */
define(function () {
    "use strict";

    var LayerDropdown = function (controller) {
        this.controller = controller;
    };

    LayerDropdown.prototype.setLayers = function (datasetCaps) {
        this.fillDropdownList(datasetCaps);

        $("#layerDropdownTitle").html(datasetCaps.layers[0].title + "<span class='caret'></span>");
    };

    LayerDropdown.prototype.fillDropdownList = function (datasetCaps) {

        var dropdownList = $('#layerDropdownList');

        dropdownList.empty();

        for (var i = 0; i < datasetCaps.layers.length; i++) {
            var layer = datasetCaps.layers[i];

            var menuItem = $('<li><a>' + layer.title + '</a></li>');
            dropdownList.append(menuItem);
        }

        var controller = this.controller;
        dropdownList.find(" li").on("click", function (e) {
            controller.onLayerClick(e);
        });
    };

    return LayerDropdown;
});