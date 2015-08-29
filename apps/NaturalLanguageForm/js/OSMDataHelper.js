/*
    Author: Inzamam Rahaman
    Provides helper methods to process OSM data
 */

define(['osmtogeojson', 'Amenity'], function(osmtogeojson, Amenity) {

    'use strict';

    function OSMDataHelper() {

    }

    /*

        For reference on how the osmtogeojson works paste
     <?xml version="1.0" encoding="UTF-8"?>
     <osm version="0.6" generator="Overpass API">
     <note>The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.</note>
     <meta osm_base="2015-07-14T06:16:02Z"/>

     <node id="307397391" lat="45.8964775" lon="9.4247374">
     <tag k="amenity" v="cafe"/>
     <tag k="name" v="Bar Circolo"/>
     <tag k="source" v="survey"/>
     </node>

     </osm>

     into the editor at http://tyrasd.github.io/osmtogeojson/

     */



    /*
        Extracts coordinate information from a geoJSON point and generates a WorldWind.Location
        @param {feature} : a geoJSON point document
        @return : a WorldWind.Location for the feature's location
     */
    OSMDataHelper.prototype.extractWorldWindLocation = function(feature) {
        var geometry = feature['geometry'];
        var coordinates = geometry['coordinates'];
        var longitude = coordinates[0];
        var latitude = coordinates[1];
        var location = new WorldWind.Location(latitude, longitude);
        return location;
    };

    /*
        Constructs an amenity using a geoJSON point object that has been
        retrieved from OSM and converted from osm xml to geoJSON
        @param {feature} : the geoJSON with the amenity information
        @return : an amenity object that encapsulates the information from the
                  supplied feature
     */
    OSMDataHelper.prototype.generateAmenityObject = function(feature) {
        var location = this.extractWorldWindLocation(feature);
        var id = feature['id'];
        var properties = feature['properties'];
        var tags = properties['tags'];
        var amenity = tags['amenity'];
        var name = tags['name'];
        var amenityRepr = new Amenity(id, name, amenity, location);
        //console.log('Aneminity :', amenityRepr );
        return amenityRepr;
    };

    /*
        Takes the response from the OSM server, and parses it, generating
        an array of Amenity objects
        @param {rawOSMData} : the OSM data returned from the Overpass API as an XML document
        @return : an array of Amenity objects
     */
    OSMDataHelper.prototype.processOSMData = function(rawOSMData) {
        var self = this;
        var asGeoJSON = osmtogeojson(rawOSMData);
        var features = asGeoJSON['features'];
        var amenities = features.map(function(feature) {
            return self.generateAmenityObject(feature);
        });
        return amenities;
    }

    return OSMDataHelper;


})
