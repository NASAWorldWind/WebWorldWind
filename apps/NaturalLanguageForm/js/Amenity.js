/*
    Written by Inzamam Rahaman
    Encapsulates the amenity information to provide a consistent interface
    for working on amenity information
 */


define(function() {

    'use strict';

    function Amenity(id, amenity, name, location) {
        this._name = name;
        this._amenity = amenity;
        this._id = id;
        this._location = location;
    }

    Object.defineProperties(Amenity.prototype, {

        id : {
            get: function() {
                return this._id;
            }
        },

        name: {
            get: function() {
                return this._name;
            }
        },

        amenity: {
            get: function() {
                return this._amenity;
            }
        },

        location: {
            get: function() {
                return this._location;
            }
        }

    });

    return Amenity;
})