/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports LayerManager
 */
define(function () {
    "use strict";

    /**
     * Constructs a layer manager for a specified {@link WorldWindow}.
     * @alias LayerManager
     * @constructor
     * @classdesc Provides a layer manager to interactively control layer visibility for a World Window.
     * @param {WorldWindow} worldWindow The World Window to associated this layer manager with.
     */
    var LayerManager = function (worldWindow) {
        var thisExplorer = this;

        this.wwd = worldWindow;

        this.roundGlobe = this.wwd.globe;

        this.createProjectionList();
        $("#projectionDropdown").find(" li").on("click", function (e) {
            thisExplorer.onProjectionClick(e);
        });

        this.createLayerList();
        $("#layerDropdown").find(" li").on("click", function (e) {
            thisExplorer.onLayerClick2(e);
        });

        this.synchronizeLayerList();

        $("#searchBox").find("button").on("click", function (e) {
            thisExplorer.onSearchButton(e);
        });

        this.geocoder = new WorldWind.NominatimGeocoder();
        this.goToAnimator = new WorldWind.GoToAnimator(this.wwd);
        $("#searchText").on("keypress", function (e) {
            thisExplorer.onSearchTextKeyPress($(this), e);
        });

        //
        //this.wwd.redrawCallbacks.push(function (worldWindow, stage) {
        //    if (stage == WorldWind.AFTER_REDRAW) {
        //        thisExplorer.updateVisibilityState(worldWindow);
        //    }
        //});
    };

    LayerManager.prototype.onProjectionClick = function (event) {
        var projectionName = event.target.innerText || event.target.innerHTML;
        $("#projectionDropdown").find("button").html(projectionName + ' <span class="caret"></span>');

        if (projectionName === "3D") {
            if (!this.roundGlobe) {
                this.roundGlobe = new WorldWind.Globe(new WorldWind.EarthElevationModel());
            }

            if (this.wwd.globe !== this.roundGlobe) {
                this.wwd.globe = this.roundGlobe;
            }
        } else {
            if (!this.flatGlobe) {
                this.flatGlobe = new WorldWind.Globe2D();
            }

            if (projectionName === "Equirectangular") {
                this.flatGlobe.projection = new WorldWind.ProjectionEquirectangular();
            } else if (projectionName === "Mercator") {
                this.flatGlobe.projection = new WorldWind.ProjectionMercator();
            } else if (projectionName === "North Polar") {
                this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("North");
            } else if (projectionName === "South Polar") {
                this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("South");
            } else if (projectionName === "North UPS") {
                this.flatGlobe.projection = new WorldWind.ProjectionUPS("North");
            } else if (projectionName === "South UPS") {
                this.flatGlobe.projection = new WorldWind.ProjectionUPS("South");
            } else if (projectionName === "North Gnomonic") {
                this.flatGlobe.projection = new WorldWind.ProjectionUPS("North");
            } else if (projectionName === "South Gnomonic") {
                this.flatGlobe.projection = new WorldWind.ProjectionUPS("South");
            }

            if (this.wwd.globe !== this.flatGlobe) {
                this.wwd.globe = this.flatGlobe;
            }
        }

        this.wwd.redraw();
    };

    LayerManager.prototype.onLayerClick = function (layerButton) {
        // var layerName = layerButton.text();

        var identifier = layerButton.attr("identifier");

        // Update the layer state for the selected layer.
        // for (var i = 0, len = this.wwd.layers.length; i < len; i++) {
        //     var layer = this.wwd.layers[i];
        //     if (layer.hide) {
        //         continue;
        //     }
        //
        //     if (layer.displayName === layerName) {
        //         layer.enabled = !layer.enabled;
        //         if (layer.enabled) {
        //             layerButton.addClass("active");
        //         } else {
        //             layerButton.removeClass("active");
        //         }
        //         this.wwd.redraw();
        //         break;
        //     }
        // }

        var layer = this.wwd.layers[identifier];
        layer.layerSelected = true;
        layer.enabled = !layer.enabled;
        if (layer.enabled) {
            layerButton.addClass("active");
        } else {
            layerButton.removeClass("active");
        }
        this.wwd.redraw();
    };


    LayerManager.prototype.createLayerList = function () {
        var layerDropdown = $("#layerDropdown");

        var dropdownButton = $('<button class="btn btn-info btn-block dropdown-toggle" type="button" data-toggle="dropdown">Add<span class="caret"></span></button>');
        layerDropdown.append(dropdownButton);

        var ulItem = $('<ul class="dropdown-menu">');
        layerDropdown.append(ulItem);

        for (var i = 0; i < this.wwd.layers.length; i++) {
            var layerItem = $('<li><a >' + this.wwd.layers[i].displayName + '</a></li>');
            ulItem.append(layerItem);
        }

        ulItem = $('</ul>');
        layerDropdown.append(ulItem);

        dropdownButton.html("Add ("+this.wwd.layers.length+") <span class='caret'></span>");
    };


    LayerManager.prototype.onLayerClick2 = function (event) {
        var layerName = event.target.innerText || event.target.innerHTML;//layerButton.text();

        var layerListItem = $("#layerList");

        var self = this;
        // Update the layer state for the selected layer.
        for (var i = 0, len = this.wwd.layers.length; i < len; i++) {
            var layer = this.wwd.layers[i];
            if (layer.hide) {
                continue;
            }

            if (layer.displayName === layerName) {
                layer.enabled = true;
                // var layerItem = $('<button class="list-group-item btn btn-block">' + layer.displayName + '</button>');
                // layerListItem.append(layerItem);
                // layerItem.addClass("active");

                this.wwd.redraw();
                this.synchronizeLayerList();
                break;
            }
        }
    };

    LayerManager.prototype.onLayerClick3 = function (e) {
        var identifier = e.attr("identifier");

        var layer = this.wwd.layers[identifier];
        layer.enabled = false;
        layer.layerSelected = false;

        this.synchronizeLayerList();
        this.wwd.redraw();

        // Update the layer state for the selected layer.
        // for (var i = 0, len = this.wwd.layers.length; i < len; i++) {
        //     var layer = this.wwd.layers[i];
        //     if (layer.hide) {
        //         continue;
        //     }
        //     if (layer.displayName === layerName) {
        //         layer.enabled = false;
        //         layerButton.remove();
        //     }
        //     this.wwd.redraw();
        // }
    };


    LayerManager.prototype.synchronizeLayerList = function () {
        var layerListItem = $("#layerList");

        // layerListItem.find("button").off("click");
        layerListItem.find("button").remove();

        var self = this;

        // Synchronize the displayed layer list with the World Window's layer list.
        for (var i = 0, len = this.wwd.layers.length; i < len; i++) {
            var layer = this.wwd.layers[i];
            if (layer.hide) {
                continue;
            }


            if (layer.enabled || layer.layerSelected) {
                var toDisplay = layer.displayName;
                if (toDisplay.length > 28) {
                    toDisplay = toDisplay.substr(0,25)+"...";
                }
                var layerItem = $('<button class="list-group-item btn btn-block" identifier="'+i+'"><span class="glyphicon glyphicon-remove pull-right" identifier="'+i+'"></span>' + toDisplay + '</button>');


                layerListItem.append(layerItem);


                layerItem.find("span").on("click", function (e) {
                    self.onLayerClick3($(this));
                });

                layerItem.on("click", function (e) {
                    self.onLayerClick($(this));
                });




                if (layer.enabled) {
                    layerItem.addClass("active");
                }
            }
        }

        $("#count").text("Selected layers ("+layerListItem.find("button").length+")");


        // layerListItem.find("button").on("click", function (e) {
        //     self.onLayerClick3($(this));
        // });
    };
//
//LayerManager.prototype.updateVisibilityState = function (worldWindow) {
//    var layerButtons = $("#layerList").find("button"),
//        layers = worldWindow.layers;
//
//    for (var i = 0; i < layers.length; i++) {
//        var layer = layers[i];
//        for (var j = 0; j < layerButtons.length; j++) {
//            var button = layerButtons[j];
//
//            if (layer.displayName === button.innerText) {
//                if (layer.inCurrentFrame) {
//                    button.innerHTML = "<em>" + layer.displayName + "</em>";
//                } else {
//                    button.innerHTML = layer.displayName;
//                }
//            }
//        }
//    }
//};

    LayerManager.prototype.createProjectionList = function () {
        var projectionNames = [
            "3D",
            "Equirectangular",
            "Mercator",
            "North Polar",
            "South Polar",
            "North UPS",
            "South UPS",
            "North Gnomonic",
            "South Gnomonic"
        ];
        var projectionDropdown = $("#projectionDropdown");

        var dropdownButton = $('<button class="btn btn-info btn-block dropdown-toggle" type="button" data-toggle="dropdown">3D<span class="caret"></span></button>');
        projectionDropdown.append(dropdownButton);

        var ulItem = $('<ul class="dropdown-menu">');
        projectionDropdown.append(ulItem);

        for (var i = 0; i < projectionNames.length; i++) {
            var projectionItem = $('<li><a >' + projectionNames[i] + '</a></li>');
            ulItem.append(projectionItem);
        }

        ulItem = $('</ul>');
        projectionDropdown.append(ulItem);
    };

    LayerManager.prototype.onSearchButton = function (event) {
        this.performSearch($("#searchText")[0].value)
    };

    LayerManager.prototype.onSearchTextKeyPress = function (searchInput, event) {
        if (event.keyCode === 13) {
            searchInput.blur();
            this.performSearch($("#searchText")[0].value)
        }
    };

    LayerManager.prototype.performSearch = function (queryString) {
        if (queryString) {
            var thisLayerManager = this,
                latitude, longitude;

            if (queryString.match(WorldWind.WWUtil.latLonRegex)) {
                var tokens = queryString.split(",");
                latitude = parseFloat(tokens[0]);
                longitude = parseFloat(tokens[1]);
                thisLayerManager.goToAnimator.goTo(new WorldWind.Location(latitude, longitude));
            } else {
                this.geocoder.lookup(queryString, function (geocoder, result) {
                    if (result.length > 0) {
                        latitude = parseFloat(result[0].lat);
                        longitude = parseFloat(result[0].lon);

                        WorldWind.Logger.log(
                            WorldWind.Logger.LEVEL_INFO, queryString + ": " + latitude + ", " + longitude);

                        thisLayerManager.goToAnimator.goTo(new WorldWind.Location(latitude, longitude));
                    }
                });
            }
        }
    };

    return LayerManager;
});