/*
    Abstracts away the process of creating the buildings
 */


define(['Building','BuildingColorMapping'], function(Building, BuildingColorMapping) {


    'use strict';

    function BuildingFactory() {
        this._colorMapping = new BuildingColorMapping();
        //alert(JSON.stringify(this._colorMapping.getColorKey()));
    }

    /*
        Given an id, polygon, and buildingTypes of a building, generates the
        Bulilding object to represent it.
        @param {id} : the OSMBuildings ID for the building being considered
        @param {polygon} : the polygon for the building as an array of WorldWind.Location
        @param {buildingType} : the type of the building
        @return : a Building object representing the building
     */
    BuildingFactory.prototype.createBuilding = function(id, polygon, buildingType) {
        var building = new Building(id, polygon, buildingType, this._colorMapping);
        return building;
    }




    return BuildingFactory;

});