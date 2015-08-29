/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports LayersPanel
 * @version $Id: LayersPanel.js 3362 2015-07-31 19:29:12Z tgaskins $
 */
define(function () {
    "use strict";

    /**
     * Constructs a layers panel to manage the app's layer list.
     * @alias LayersPanel
     * @constructor
     * @classdesc Provides a list of buttons that control layer visibility.
     * @param {WorldWindow} worldWindow The World Window to associate this layers panel with.
     */
    var LayersPanel = function (worldWindow) {
        this.wwd = worldWindow;
        //
        //$("#layerList").sortable({
        //    handle: '.list-group-item',
        //    update: function () {
        //        console.log("GOT HERE");
        //    },
        //    axis: 'y',
        //    containment: 'parent',
        //    cursor: 'move'
        //});

        this.synchronizeLayerList();
    };

    LayersPanel.prototype.onLayerClick = function (layerButton) {
        var layerName = layerButton.text();

        // Update the layer state for the selected layer.
        for (var i = 0, len = this.wwd.layers.length; i < len; i++) {
            var layer = this.wwd.layers[i];
            if (layer.hide) {
                continue;
            }

            if (layer.displayName === layerName) {
                layer.enabled = !layer.enabled;
                this.synchronizeLayerList();

                if (layer.companionLayer) {
                    if (layer.enabled) {
                        ++layer.companionLayer.refCount;
                    } else {
                        --layer.companionLayer.refCount;
                    }

                    layer.companionLayer.enabled = layer.companionLayer.refCount > 0;
                }

                this.wwd.redraw();
            }
        }
    };

    LayersPanel.prototype.onTimeButtonClick = function (timeButton) {
        var isOn = timeButton.hasClass("btn-primary");

        if (this.timeSeriesPlayer) {
            var layer = null;

            for (var i = 0, len = this.wwd.layers.length; i < len; i++) {
                var layer = this.wwd.layers[i];

                if (timeButton.hasClass(layer.displayName)) {
                    break;
                }
            }

            if (isOn) {
                this.timeSeriesPlayer.layer = null;
                this.timeSeriesPlayer.timeSequence = null;
            } else {
                layer.enabled = true;
                this.timeSeriesPlayer.layer = layer;
                this.timeSeriesPlayer.timeSequence = layer.timeSequence;
            }

            this.synchronizeLayerList();
        }
    };

    LayersPanel.prototype.onLayerDropdownClicked = function (dropButton) {
    };

    LayersPanel.prototype.synchronizeLayerList = function () {
        var thisLayersPanel = this,
            layerListItem = $("#layerList");

        layerListItem.find("button").off("click");
        layerListItem.empty();

        // Synchronize the displayed layer list with the World Window's layer list.
        for (var i = 0, len = this.wwd.layers.length; i < len; i++) {
            var layer = this.wwd.layers[i];
            if (layer.hide) {
                continue;
            }

            var btnGroup = $('<div class="btn-group btn-block" style="display: flex; display: -webkit-flex"></div>'),
                layerButton, dropButton = null, timeButton = null;

            if (!layer.timeSequence) {
                layerButton = $('<button type="button" class="btn wrap-panel-heading" style="display: block; width: 100%">' + layer.displayName + '</button>');
                btnGroup.append(layerButton);
            } else {
                //var caretSpan = $('<span class="caret"></span><span class="sr-only"></span>');
                var timeSpan = $('<span class="glyphicon glyphicon-time"></span>');

                layerButton = $('<button type="button" class="btn wrap-panel-heading" style="display: block; width: 85%">' + layer.displayName + '</button>');
                //dropButton = $('<button type=button class="btn dropdown-toggle" data-toggle="dropdown" style="width: 10%"></button>');
                timeButton = $('<button type=button class="btn timeButton" style="width: 15%"></button>');
                timeButton.addClass(layer.displayName);

                timeButton.append(timeSpan);
                //dropButton.append(caretSpan);
                btnGroup.append(layerButton);
                btnGroup.append(timeButton);
            }

            layerListItem.append(btnGroup);

            if (layer.enabled) {
                layerButton.addClass("btn-primary");
                if (dropButton) {
                    dropButton.addClass("btn-primary");
                }
            } else {
                layerButton.removeClass("btn-primary");
                if (dropButton) {
                    dropButton.removeClass("btn-primary");
                }
            }

            layerButton.on("click", function (e) {
                thisLayersPanel.onLayerClick($(this));
            });

            if (timeButton) {
                if (this.timeSeriesPlayer && this.timeSeriesPlayer.layer === layer) {
                    timeButton.addClass("btn-primary");
                }

                timeButton.on("click", function(e) {
                    thisLayersPanel.onTimeButtonClick($(this));
                })
            }

            if (dropButton) {
                dropButton.on("click", function (e) {
                    thisLayersPanel.onLayerDropdownClicked($(this));
                });
            }
        }
    };

    return LayersPanel;
});