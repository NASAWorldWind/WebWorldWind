/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports ServersPanel
 * @version $Id: ServersPanel.js 3413 2015-08-20 19:08:20Z tgaskins $
 */
define(function () {
    "use strict";

    /**
     * Constructs a servers panel.
     * @alias ServersPanel
     * @constructor
     * @classdesc Provides a list of collapsible panels that indicate the layers associated with a WMS or other
     * image server. Currently on WMS is supported. The user can select a server's layers and they will be added to
     * the World Window's layer list.
     * @param {WorldWindow} worldWindow The World Window to associate this layers panel with.
     * @param {LayersPanel} layersPanel The layers panel managing the specified World Windows layer list.
     */
    var ServersPanel = function (worldWindow, layersPanel, timeSeriesPlayer) {
        var thisServersPanel = this;

        this.wwd = worldWindow;
        this.layersPanel = layersPanel;
        this.timeSeriesPlayer = timeSeriesPlayer;

        this.idCounter = 1;

        this.legends = {};

        $("#addServerBox").find("button").on("click", function (e) {
            thisServersPanel.onAddServerButton(e);
        });

        $("#addServerText").on("keypress", function (e) {
            thisServersPanel.onAddServerTextKeyPress($(this), e);
        });
    };

    ServersPanel.prototype.onAddServerButton = function (event) {
        this.attachServer($("#addServerText")[0].value);
        $("#addServerText").val("");
    };

    ServersPanel.prototype.onAddServerTextKeyPress = function (searchInput, event) {
        if (event.keyCode === 13) {
            searchInput.blur();
            this.attachServer($("#addServerText")[0].value);
            $("#addServerText").val("");
        }
    };

    ServersPanel.prototype.attachServer = function (serverAddress) {
        if (!serverAddress) {
            return;
        }

        serverAddress = serverAddress.trim();

        serverAddress = serverAddress.replace("Http", "http");
        if (serverAddress.lastIndexOf("http", 0) != 0) {
            serverAddress = "http://" + serverAddress;
        }

        var thisExplorer = this,
            request = new XMLHttpRequest(),
            url = WorldWind.WmsUrlBuilder.fixGetMapString(serverAddress);

        url += "service=WMS&request=GetCapabilities&vers";

        request.open("GET", url, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                var xmlDom = request.responseXML;

                if (!xmlDom && request.responseText.indexOf("<?xml") === 0) {
                    xmlDom = new window.DOMParser().parseFromString(request.responseText, "text/xml");
                }

                if (!xmlDom) {
                    alert(serverAddress + " retrieval failed. It is probably not a WMS server.");
                    return;
                }

                var wmsCapsDoc = new WorldWind.WmsCapabilities(xmlDom);

                if (wmsCapsDoc.version) { // if no version, then the URL doesn't point to a caps doc.
                    thisExplorer.addServerPanel(serverAddress, wmsCapsDoc);
                } else {
                    alert(serverAddress +
                        " WMS capabilities document invalid. The server is probably not a WMS server.");
                }
            } else if (request.readyState === 4) {
                if (request.statusText) {
                    alert(request.responseURL + " " + request.status + " (" + request.statusText + ")");
                } else {
                    alert("Failed to retrieve WMS capabilities from " + serverAddress + ".");
                }
            }
        };

        request.send(null);
    };

    ServersPanel.prototype.addServerPanel = function (serverAddress, wmsCapsDoc) {
        var treeId = this.idCounter++,
            headingID = this.idCounter++,
            collapseID = this.idCounter++,
            wmsService = wmsCapsDoc.service,
            panelTitle = wmsService.title && wmsService.title.length > 0 ? wmsService.title : serverAddress;
        //
        //var html = '<div class="panel panel-default">';
        //html += '<div class="panel-heading" role="tab" id="' + headingID + '">';
        //html += '<h4 class="panel-title wrap-panel-heading">';
        ////html += '<a data-toggle="collapse" data-parent="#servers"';
        //html += '<a data-toggle="collapse"';
        //html += ' href="#' + collapseID + '"';
        //html += ' aria-expanded="true" aria-controls="' + collapseID + '">';
        //html += serverAddress;
        //html += '</a></h4></div>';
        //html += '<div id="' + collapseID + '" class="panel-collapse collapse in"';
        //html += ' role="tabpanel" aria-labelledby="' + headingID + '">';
        //html += '<div class="panel-body">';
        //html += 'This is some text to display in the collapse panel.';
        //html += '</div></div></div>';

        var topDiv = $('<div class="panel panel-default"></div>'),
            heading = $('<div class="panel-heading" role="tab" id="' + headingID + '"></div>'),
            title = $('<h4 class="panel-title wrap-panel-heading"></h4>'),
            anchor = $('<a data-toggle="collapse" href="#' + collapseID + '"' +
                ' aria-expanded="true" aria-controls="' + collapseID + '">' + panelTitle + '</a>'),
            remove = $('<a href="#"><small><span class="pull-right glyphicon glyphicon-remove clickable_space"></span></small></a>'),
            bodyParent = $('<div id="' + collapseID + '" class="panel-collapse collapse in" role="tabpanel"' +
                ' aria-labelledby="' + headingID + '"></div>'),
            body = $('<div style="max-height: 250px; overflow-y: scroll; -webkit-overflow-scrolling: touch;"></div>'),
            treeDiv = this.makeTree(serverAddress, treeId);

        remove.on("click", function () {
            topDiv.remove();
        });

        title.append(anchor);
        title.append(remove);
        heading.append(title);
        topDiv.append(heading);
        body.append(treeDiv);
        bodyParent.append(body);
        topDiv.append(bodyParent);

        var serversItem = $("#servers");
        serversItem.append(topDiv);

        var treeRoot = treeDiv.fancytree("getRootNode");

        // Don't show the top-level layer if it's a grouping layer with the same title as the server title.
        // The NEO server is set up this way, for example.
        var layers = wmsCapsDoc.capability.layers;
        if ((layers.length === 1) && (layers[0].layers) &&
            (layers[0].title === wmsCapsDoc.service.title) && !(layers[0].name && layers[0].name.length > 0)) {
            layers = layers[0].layers;
        }
        treeRoot.addChildren(this.assembleLayers(layers, []));

        // Collapse grouping nodes if there are many of them.
        var numNodes = 0;
        treeRoot.visit(function (node) {
            ++numNodes;
        });
        if (numNodes > 10) {
            treeRoot.visit(function (node) {
                node.setExpanded(false);
            });
        }
    };

    ServersPanel.prototype.makeTree = function (serverAddress, treeId) {
        var thisServersPanel = this,
            treeDivId = "treeDiv" + treeId,
            treeDataId = "treeData" + treeId,
            treeDiv = $('<div id="' + treeDivId + '">'),
            treeUl = $('<ul id="' + treeDataId + 'style="display: none;">');

        treeDiv.append(treeUl);

        treeDiv.fancytree({
            click: function (event, data) {
                var node = data.node,
                    layer = node.data.layer;

                if (layer) {
                    node.setSelected(false); // only an argument of false causes the select method to be called?
                    return false;
                }
            },
            select: function (event, data) {
                var node = data.node,
                    layer = node.data.layer;

                if (layer) {
                    if (!node.selected) {
                        node.data.layer = null;
                        thisServersPanel.removeLayer(layer);
                    }
                    //layer.enabled = node.selected;
                } else if (node.selected && node.data.layerCaps && node.data.layerCaps.name) {
                    node.data.layer = thisServersPanel.addLayer(node.data.layerCaps);
                }

                thisServersPanel.wwd.redraw();
                return false;
            }
        });
        treeDiv.fancytree("option", "checkbox", true);
        treeDiv.fancytree("option", "icons", false);

        $("form").submit(false);

        return treeDiv;
    };

    ServersPanel.prototype.assembleLayers = function (layers, result) {

        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i],
                subLayers = null,
                node = {
                    title: layer.title,
                    tooltip: layer.title,
                    layerCaps: layer
                };

            if (layer.layers && layer.layers.length > 0) {
                subLayers = this.assembleLayers(layer.layers, []);
            }

            if (!layer.name) {
                node.expanded = true;
                node.unselectable = true;
                node.hideCheckbox = true;
                node.folder = true;
            }

            if (subLayers) {
                node.children = subLayers;
            }

            result.push(node);
        }

        return result;
    };

    ServersPanel.prototype.addLayer = function (layerCaps) {
        if (layerCaps.name) {
            var config = WorldWind.WmsLayer.formLayerConfiguration(layerCaps, null);
            var layer;

            if (config.timeSequences &&
                (config.timeSequences[config.timeSequences.length - 1] instanceof WorldWind.PeriodicTimeSequence)) {
                var timeSequence = config.timeSequences[config.timeSequences.length - 1];
                config.levelZeroDelta = new WorldWind.Location(180, 180);
                layer = new WorldWind.WmsTimeDimensionedLayer(config);
                layer.opacity = 0.8;
                layer.time = timeSequence.startTime;
                this.timeSeriesPlayer.timeSequence = timeSequence;
                this.timeSeriesPlayer.layer = layer;
                layer.timeSequence = timeSequence;

                //for (var t = timeSequence.currentTime; t != null; t = timeSequence.next()) {
                //    console.log(t.toISOString());
                //}
                //timeSequence.reset();

            }
            else if (config.timeSequences &&
                (config.timeSequences[config.timeSequences.length - 1] instanceof Date)) {
                timeSequence = config.timeSequences[config.timeSequences.length - 1];
                config.levelZeroDelta = new WorldWind.Location(180, 180);
                layer = new WorldWind.WmsTimeDimensionedLayer(config);
                layer.opacity = 0.8;
                layer.time = config.timeSequences[0];
                this.timeSeriesPlayer.timeSequence = new WorldWind.BasicTimeSequence(config.timeSequences);
                this.timeSeriesPlayer.layer = layer;
                layer.timeSequence = timeSequence;
            }
            else {
                layer = new WorldWind.WmsLayer(config, null);
                this.timeSeriesPlayer.timeSequence = null;
                this.timeSeriesPlayer.layer = null;
            }

            if (layerCaps.styles && layerCaps.styles.length > 0
                && layerCaps.styles[0].legendUrls && layerCaps.styles[0].legendUrls.length > 0) {
                layer.companionLayer = this.addLegend(layerCaps.styles[0].legendUrls[0]);
            }

            layer.enabled = true;
            this.wwd.addLayer(layer);
            this.wwd.redraw();

            this.layersPanel.synchronizeLayerList();

            return layer;
        }

        return null;
    };

    ServersPanel.prototype.removeLayer = function (layer) {
        this.removeLegend(layer.companionLayer);

        this.wwd.removeLayer(layer);
        //if (layer.companionLayer) {
        //    this.wwd.removeLayer(layer.companionLayer);
        //}

        if (this.timeSeriesPlayer && this.timeSeriesPlayer.layer === layer) {
            this.timeSeriesPlayer.timeSequence = null;
            this.timeSeriesPlayer.layer = null;
        }

        this.wwd.redraw();
        this.layersPanel.synchronizeLayerList();
    };

    ServersPanel.prototype.addLegend = function (legendCaps) {
        var legend = this.legends[legendCaps.url];

        if (legend) {
            ++legend.refCount;
            legend.layer.enabled = true;
        } else {
            legend = {refCount: 1, legendCaps: legendCaps};
            legend.layer = new WorldWind.RenderableLayer();

            var dummyOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 0),
                screenImage = new WorldWind.ScreenImage(dummyOffset, legendCaps.url);
            screenImage.imageOffset =
                new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_INSET_PIXELS, 0);
            legend.layer.addRenderable(screenImage);
            legend.layer.hide = true;
            legend.layer.refCount = 0;
            this.wwd.addLayer(legend.layer);

            this.legends[legendCaps.url] = legend;

            this.updateLegendOffsets();
        }

        ++legend.layer.refCount;

        return legend.layer;
    };

    ServersPanel.prototype.removeLegend = function (legendLayer) {
        for (var legendKey in this.legends) {
            if (this.legends.hasOwnProperty(legendKey)) {
                var legend = this.legends[legendKey];
                if (legend.layer === legendLayer) {
                    --legend.refCount;
                    --legend.layer.refCount;
                    if (legend.refCount <= 0) {
                        this.wwd.removeLayer(legend.layer);
                        delete this.legends[legend.legendCaps.url];
                    }
                    break;
                }
            }
        }

        this.updateLegendOffsets();
    };

    ServersPanel.prototype.updateLegendOffsets = function () {
        var yOffset = 0,
            verticalMargin = 5;

        for (var legendKey in this.legends) {
            if (this.legends.hasOwnProperty(legendKey)) {
                var legend = this.legends[legendKey],
                    screenImage = legend.layer.renderables[0];

                screenImage.screenOffset =
                    new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_INSET_PIXELS, yOffset);

                yOffset += legend.legendCaps.height + verticalMargin;

            }
        }
    };

    return ServersPanel;
});