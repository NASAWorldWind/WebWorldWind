define(['Cylinder'], function(Cylinder) {


    'use strict';





    function GetColorFromSpectrum (fraction,spectrumArrayColors,wwS){
        //array looks like [[r,g,b],[r,g,b],...
        var divisions = spectrumArrayColors.length-1;
        for (var i = 0; i < divisions; i++){
            if (fraction >= i/divisions && fraction <= (i+1)/divisions){
                var r = spectrumArrayColors[i][0]+fraction*(spectrumArrayColors[i+1][0]-spectrumArrayColors[i][0]),
                    g = spectrumArrayColors[i][1]+fraction*(spectrumArrayColors[i+1][1]-spectrumArrayColors[i][1]),
                    b = spectrumArrayColors[i][2]+fraction*(spectrumArrayColors[i+1][2]-spectrumArrayColors[i][2]);
                return !wwS ?
                    "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1) :
                    new WorldWind.Color(r / 255, g / 255, b / 255, 1);

            }
        }

    }

    function Earthquake(logistics, magnitude, date, depth, lat, long, indexInArray, oldestDate) {

        this._enabled = true;
        this._magnitude = magnitude;
        this._date = date;
        this._depth = depth;
        this._lat = lat;
        this._long = long;
        this._indexInArray = indexInArray;
        this._position = new WorldWind.Position(lat, long, 1e2);
        this._age = Math.abs((new Date().getTime()) - new Date(date).getTime()) /
            (24 * 60 * 60 * 1000);
        this._oldestAge = Math.abs((new Date().getTime()) - new Date(oldestDate).getTime()) /
            (24 * 60 * 60 * 1000);

        var stampTest = Math.floor(this._age);

        if (stampTest === 0) {
            var tempVal = Math.floor(Math.abs((new Date().getTime() - new Date(this._date).getTime())
                / (60 * 60 * 1000)));
            this._stamp = tempVal  + ((tempVal === 1) ? " Hour" : " Hours") + ' Ago';
        } else {
            var day = ((stampTest === 1) ? ' Day' : ' Days') + " Ago";
            this._stamp = stampTest + day;
        }

        this._info = 'M' + this._magnitude + ' - ';
        this._info += logistics['place'] + "<br>" + this._stamp + "<br>" + (Math.round(this._depth) / 1000) +
            " km deep";
        this._relativeAge = this._age / this._oldestAge;

        this._color = this.colorIfWorldWind();

        this.createPlacemark();
        this.createCylinder();



    }

    Earthquake.prototype.addToRenderableLayer = function(layer) {
        layer.addRenderable(this);
        this._placemark.indexInRenderables = layer.renderables.length - 1;
        this._indexInRenderables = this._placemark.indexInRenderables;
    };

    Earthquake.prototype.highlight = function () {
        this._placemark.highlighted = true
    };

    Earthquake.prototype.unHighlight = function () {
        this._placemark.highlighted = false
    };

    Earthquake.prototype.isHighlighted = function () {
        return this._placemark.highlighted
    };

    Earthquake.prototype.colorIfWorldWind = function() {
        var colorSpect = [[255,0,0],[0,255,0]];
        var colors = {
            ifTrue : null,
            ifFalse : null
        };

        colors.ifFalse = GetColorFromSpectrum(this._relativeAge, colorSpect, false);
        colors.ifTrue = GetColorFromSpectrum(this._relativeAge, colorSpect, true);

        return colors;

    };

    Earthquake.prototype.createCylinder = function() {

        var format = false;

        var column,
            MapTo,
            grid = 0;
        if (!format) {
            MapTo = new WorldWind.Location(this._lat, this._long)
        } else {
            MapTo = new WorldWind.Location(
                Math.round(this._lat / grid) * grid,
                Math.round(this._long / grid) * grid
            )
        }
        var color = this._color.ifTrue;
        //color = new WorldWind.Color(1,0,0,1)
        column = (new Cylinder(
            color,
            MapTo, .12,
            this._magnitude * 5e5));
        column.data = this;
        column.column = true;

        this._cylinder = column;
    };

    Earthquake.prototype.createPlacemark = function() {

        var placemark, highlightAttributes,
            placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        var canvas = document.createElement("canvas"),
            ctx2d = canvas.getContext("2d");
        var size = Math.abs(this._magnitude * 5),
            c = size / 2  - 0.5,
            outerRadius = size/2.2;
        canvas.width = size;
        canvas.height = size;
        ctx2d.fillStyle = this._color.ifFalse;
        ctx2d.arc(c, c, outerRadius, 0, 2 * Math.PI, false);
        ctx2d.fill();
        // Create the placemark.
        placemark = new WorldWind.Placemark(new WorldWind.Position(this._lat, this._long, 1e2));
        placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        placemark.data = this;
        //placemark.indexInRenderables = self._baseLayer.renderables.length-1;
        //this._indexInRenderables = self._baseLayer.renderables.length-1;
        // Create the placemark attributes for the placemark.
        placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        placemarkAttributes.imageScale = 1;
        placemarkAttributes.imageColor = new WorldWind.Color(1,1,1,.55);

        // Wrap the canvas created above in an ImageSource object to specify it as the placemark image source.
        placemarkAttributes.imageSource = new WorldWind.ImageSource(canvas);
        placemark.attributes = placemarkAttributes;
        // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
        // the default highlight attributes so that all properties are identical except the image scale. You could
        // instead vary the color, image, or other property to control the highlight representation.
        highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        highlightAttributes.imageScale = 1.2;
        highlightAttributes.imageSource = new WorldWind.ImageSource(canvas);
        placemark.highlightAttributes = highlightAttributes;
        this._placemark = placemark;
    };


    Earthquake.prototype.render = function(dc) {

        if(this._enabled === true) {
            this._placemark.render(dc);
            this._cylinder.render(dc);
        }

    };

    Object.defineProperties(Earthquake.prototype, {

        enabled : {
            get: function() {
                return this._enabled;
            },

            set: function(value) {
                this._enabled = value;
            }
        },

        magnitude : {
            get: function() {
                return this._magnitude;
            }
        },

        date: {
            get: function() {
                return this._date;
            }
        },

        depth: {
            get: function() {
                return this._depth;
            }
        },

        lat: {
            get: function() {
                return this._lat;
            }
        },

        long: {
            get: function() {
                return this._long;
            }
        },

        indexInArray: {
            get: function() {
                return this._indexInArray;
            }
        },

        position: {
            get: function() {
                return this._position;
            }
        },

        age: {
            get: function() {
                return this._age;
            }
        },

        info: {
            get: function() {
                return this._info;
            }
        },

        stamp: {
            get: function() {
                return this._stamp;
            }
        },

        indexInRenderables : {
            get: function() {
                return this._indexInRenderables;
            },

            set: function(value) {
                this._indexInRenderables = value;
                this._placemark.indexInRenderables = value;
            }
        },

        attributes : {
            get: function() {
                return this._placemark.attributes;
            }
        },

        highlightAttributes : {
            get: function() {
                return this._placemark.highlightAttributes;
            }
        },

        renderable : {
            get: function() {
                return this._placemark;
            }
        },

        data: {
            get: function() {
                return this;
            }
        }

    });

    return Earthquake;

});