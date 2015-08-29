/*
    Encapsulates the data for a building that has been retrieved using
    the OSMBuildings API
 */

define(function() {


    'use strict';




    function Building(id, polygon, buildingType, colorMapper) {
        this._id = id;
        this._polygon = polygon;
        this._buildingType = buildingType;
        this._colorMapper = colorMapper;
        this._shape = null;
    }





    /*
        Gets the outline color for a building depending on the type of building
        @param {buildingType} : the building type as a string, eg. public, garage, yes
        @return : a WorldWind Color for the building's outline
     */
    Building.prototype.chooseOutlineColorBasedOnBuildingType = function(buildingType) {
        var color = this._colorMapper.getColor(buildingType);
        return color;
    }

    Building.prototype.setVisibility = function(trueFalse){
        this.enabled = (trueFalse || false)
        if (this._shape){
            this._shape.enabled = (trueFalse || false);
        }

    };

    /*
        Assigns colors for both the building's outline and interior fill based on its type
        @param {buildingType} : the type of building
        @return : an object that contains both the interior and outline colors
     */

    Building.prototype.assignColors = function(buildingType) {

        var outlineColor = this.chooseOutlineColorBasedOnBuildingType(buildingType);
        var interiorColor = new WorldWind.Color(outlineColor.red * 0.5, outlineColor.green * 0.5,
            outlineColor.blue * 0.5);

        var colors = {
            interiorColor : interiorColor,
            outlineColor : outlineColor
        };

        return colors;

    }

    /*
        Given a polygon as an array of WorldWind.Locations and a buildingType
        greates a polygon to be rendered
        @param {polgyon} : the polygon for the building as an array of WorldWind.Locations
        @param {buildingType} : the type of the building
        @return : a WorldWind.SurfacePolygon to be rendered
     */
    Building.prototype.createSurfacePolygon = function(polygon, buildingType) {

        var colors = this.assignColors(buildingType);
        var shapeAttributes = new WorldWind.ShapeAttributes(null);
        shapeAttributes.interiorColor = colors.interiorColor;
        shapeAttributes.outlineColor = colors.outlineColor;
        shapeAttributes.drawOutline = true;
        shapeAttributes.outlineWidth = 0.1;

        var polygonShape = new WorldWind.SurfacePolygon(polygon, shapeAttributes);
        return polygonShape;

    }

    /*
        Renders this building's representative polygon
        @param {dc} : a WorldWind.DrawContext object to be used in rendering
     */
    Building.prototype.render = function(dc) {
        if(this._shape === null) {
            this._shape = this.createSurfacePolygon(this._polygon, this._buildingType);
        }
        if (this.enabled){
            this._shape.render(dc);
        }

    }




    Object.defineProperties(Building.prototype, {

        id : {
            get: function() {
                return this._id;
            }
        },

        polygon : {
            get: function() {
                return this._polygon;
            }
        },

        buildingType : {
            get: function() {
                return this._buildingType;
            },

            set: function(value) {
                this._buildingType = value;
            }
        }

    });

    return Building;


});