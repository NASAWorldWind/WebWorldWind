/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: DatasetDropdown.js 3411 2015-08-17 04:23:28Z tgaskins $
 */
define(function () {
    "use strict";

    var DatasetDropdown = function (controller) {
        var self = this;

        this.controller = controller;

        this.attachServer();
    };

    DatasetDropdown.prototype.attachServer = function () {
        var serverAddress = location.protocol + "//neowms.sci.gsfc.nasa.gov/wms/wms";

        var self = this,
            request = new XMLHttpRequest(),
            url = serverAddress + "?service=WMS&request=GetCapabilities&version=1.3.0";

        request.open("GET", url, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                var xmlDom = request.responseXML;

                if (!xmlDom && request.responseText.indexOf("<?xml") === 0) {
                    xmlDom = new window.DOMParser().parseFromString(request.responseText, "text/xml");
                }

                if (!xmlDom) {
                    alert(serverAddress + " retrieval failed.");
                    return;
                }

                self.wmsCapsDoc = new WorldWind.WmsCapabilities(xmlDom);

                if (self.wmsCapsDoc.version) { // if no version, then the URL doesn't point to a caps doc.
                    self.fillDropdownList(self.wmsCapsDoc);
                } else {
                    alert("WMS capabilities document invalid.");
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

    DatasetDropdown.prototype.fillDropdownList = function (wmsCapsDoc) {
        var layers = wmsCapsDoc.capability.layers[0].layers;

        var datasetList = $('#datasetDropdownList');

        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];

            var menuItem = $('<li><a>' + layer.title + '</a></li>');
            datasetList.append(menuItem);
        }

        var controller = this.controller;
        datasetList.find(" li").on("click", function (e) {
            controller.onDatasetClick(e);
        });
    };

    return DatasetDropdown;
});