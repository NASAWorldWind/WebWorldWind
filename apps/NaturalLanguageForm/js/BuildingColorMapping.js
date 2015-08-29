/*
    Decouples the activity of building color code selection
 */


define(['buckets','lodash'], function(buckets, _) {

    'use strict';


    function hexToRGB(hex) {

        var working = hex;

        if(hex[0] === '#') {
            working = hex.substr(1);
        }
        var red = parseInt(working.substr(0, 2), 16);
        var green = parseInt(working.substr(2, 2), 16);
        var blue = parseInt(working.substr(4, 2), 16);

        var color = {
            red: red,
            blue : blue,
            green : green
        };

        return color;
    }

    function rgbToWorldWindColor(rgb) {
        var red = rgb.red / 255;
        var blue = rgb.blue / 255;
        var green = rgb.green / 255;
        var color = new WorldWind.Color(red, green, blue);
        return color;
    }

    function hexToWorldWind(hex) {
        var rgb = hexToRGB(hex);
        var color = rgbToWorldWindColor(rgb);
        return color;
    }

    function worldWindColorToRGB(color) {
        var red = color.red * 255;
        var green = color.green * 255;
        var blue = color.blue * 255;
        var result = 'rgb(' + [red, green, blue].join(',') + ')';
        return result;
    }


    function BuildingColorMapping() {

        this._colors = new buckets.Dictionary();
        this._typeColorAssignments = new buckets.Dictionary();
        this.init();

    }

    /*
        Initializes the Dictionaries to be
        used for determining the colors of buildings by their building
        types
     */
    BuildingColorMapping.prototype.init = function() {

        // initialize the colors available here


        var self = this;

        var colors = [
            ['Powder Blue','#B0E0E6'],
            ['Crayola Blue','#1F75FE'],
            ['Fern Green', '#71BC78'],
            ['Champagne Pink', '#F1DDCF'],
            ['Apricot', '#FBCEB1'],
            ['Grape', '#6F2DA8'],
            ['Paris Green', '#50C878'],
            ['Persian Green', '#00A693'],
            ["Davy's Grey", '#555555'],
            ['Glaucous', '#6082B6'],
            ['Red-Violet', '#C71585'],
            ['Onyx', '#353839'],
            ['Cerulean', '#007BA7']
        ];


        var buildingTypes = [
            ['yes', 'Crayola Blue'],
            ['retail', 'Fern Green'],
            ['house', 'Champagne Pink'],
            ['apartment', 'Apricot'],
            ['office', 'Grape'],
            ['farm', 'Paris Green'],
            ['house', 'Persian Green'],
            ['industrial', "Davy's Grey"],
            ['warehouse', 'Glaucous'],
            ['public', 'Red-Violet'],
            ['garage', 'Onyx'],
            ['commercial', 'Cerulean']
        ];



        colors.forEach(function(pair) {
            var name = pair[0];
            var hexCode = pair[1];
            var color = hexToWorldWind(hexCode);
            self._colors.set(name, color);
        });



        // assign building types to colors here

        buildingTypes.forEach(function(pair) {
            var type = pair[0];
            var colorName = pair[1];
            self._typeColorAssignments.set(type, colorName);
        });

    }

    /*
        Given a building type, chooses the color to be used by the pre-programmed key
        @param {buildingType} : the type of building
        @return : the WorldWind.Color for the building type
     */
    BuildingColorMapping.prototype.getColor = function(buildingType) {
        if(this._typeColorAssignments.containsKey(buildingType)) {
            //console.log('checking for valid color');
            var colorName = this._typeColorAssignments.get(buildingType);
            //console.log('Color name ', colorName);
            var color = this._colors.get(colorName);
            //console.log('Color ', color);
            return color
        } else {
            //alert('No color set for ' +  buildingType);
            return WorldWind.Color.BLACK;
        }
    }

    /*
        Gives an array of 2 element arrays that represent the color key
     */
    BuildingColorMapping.prototype.getColorKey = function() {
        var self = this;
        var validTypes = this._typeColorAssignments.keys();
        var mappings = _.map(validTypes, function(type) {
            var wwColor = self.getColor(type);
            var color = worldWindColorToRGB(wwColor);
            return [type, color];
        });
        return mappings;
    }


    return BuildingColorMapping;

});