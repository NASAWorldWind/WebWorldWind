/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports LayersPanel
 * @version $Id: LayersPanel.js 3185 2015-06-12 19:12:09Z tgaskins $
 */
define(['Tour', 'TourManager'], function (Tour,
                                          TourManager) {
    "use strict";
    /**
     * Constructs a layers panel to manage the app's layer list.
     * @alias LayersPanel
     * @constructor
     * @classdesc Provides a list of buttons that control layer visibility.
     * @param {WorldWindow} worldWindow The World Window to associate this layers panel with.
     */
    var CommandsPanel = function (wwd,layer) {
        var self = this;
        this.layer = layer;
        this.buttons = [];
        this.bfunctions = [];
        this.createDropDown('Panels');
        //this.synchronizeLayerList();
    };

    CommandsPanel.prototype.initMouseClickListener = function () {
        var self = this;
        var ShowChanges = function (layerArg,INDEX) {
            var layer = layerArg;
            var display = $('#eData');
            display.empty();
            display.append('<p>' + layerArg.Manage.ParsedData[INDEX].info + '</p>');
            layerArg.Manage.Animations.animate(layerArg.renderables[INDEX]);
        };
        //whenever you click on an earthquake, it zooms in on that.
        document.getElementById("canvasOne").onmousedown = function tss (e) {
            console.log(e)
            if (e.which === 1 && e.type === 'mousedown'){
                for (var i in self.layer.renderables) {
                    if (self.layer.renderables[i].highlighted) {
                        ShowChanges(self.layer,i)
                    }

                }
            }
        };
    };

    CommandsPanel.prototype.createDropDown = function (htmlLoc) {
        var panel = $('<button>');
        panel.attr("type",'button')
        panel.attr("class","btn btn-info btn-block dropdown-toggle");
        panel.attr("data-toggle","collapse");
        panel.attr("data-target","#cp");
        panel.text(this.layer.displayName + " Panel");
        panel.append('<span class="' + 'caret' + '"></span>')
        var divi1 = $("<div>");
        divi1.attr("id","cp");
        divi1.attr("class","collapse");
        var divi2 = $("<div>");
        divi2.attr('class','list-group');
        divi2.attr('id','CPanel');
        divi1.append(divi2);
        $('#' + htmlLoc).append(panel);
        $('#' + htmlLoc).append(divi1);
    };

    CommandsPanel.prototype.addButton = function(buttonIDName) {
        //looks like ['id','name']
        this.buttons.push(buttonIDName);
    };

    CommandsPanel.prototype.addFunctionToButton = function (buttonID,funct) {
        for (var i = 0; i < this.buttons.length; i++){
            if (this.buttons[i][0]===buttonID){
                this.bfunctions[i] = (funct);
            };

        };

    };

    CommandsPanel.prototype.onLayerClick = function (layerButton) {
        var layerName = layerButton.text();
    };

    CommandsPanel.prototype.synchronizeLayerList = function () {
        var layerListItem = $("#CPanel");
        var self = this;
        /*
        layerListItem.find("button").off("click");
        layerListItem.find("button").remove();
        */


        // Synchronize the displayed layer list with the World Window's layer list.
        for (var i = 0; i < this.buttons.length; i++) {
            var index = i
            var self = this
            var d = $("<div>");
            d.attr("class","btn-group btn-group-justified");
            var d1 = $("<div>");
            d1.attr("class", "btn-group");
            var d2 = $('<button>');
            d2.attr("class","btn btn-primary");
            d2.attr("id","Button " + self.layer.displayName + ' ' + self.buttons[i][1]);
            d2.text(self.buttons[index][1]);
            console.log(self.bfunctions[index])
            if (self.bfunctions[index] !== undefined){
                d2.on("click",
                    //for whatever reason, you can't see var i from the for loop in here...
                    self.bfunctions[index]

                );

            }
            d1.append(d2);
            d.append(d1);
            layerListItem.append(d);
            //add a red separator
            if (i === this.buttons.length-1){
                var d = $("<div>");
                d.attr("class","btn-group btn-group-justified");
                var d1 = $("<div>");
                d1.attr("class", "btn-group");
                var d2 = $('<button>')
                d2.attr("class","btn btn-danger");
                d2.attr("id","Button " + this.layer.displayName + ' ' + this.buttons[i][1]);
                d1.append(d2)
                d.append(d1)
                layerListItem.append(d)
            }
        };
    };

    return CommandsPanel;
});
