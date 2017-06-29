/*

    Used to generate placemarks for different types of landmarks

 */


define(['http://worldwindserver.net/webworldwind/worldwind.min.js', 'jquery'], function(ww, $) {


    function LandmarkFactory() {


        this.colorMap = {



        };


    }

    LandmarkFactory.prototype.createLandmarkPlacemark = function(latitude,
                                                                 longitude,
                                                                 placeTypeKey,
                                                                 placeTypeValue) {

        var color = this.colorMap[placeTypeKey + '-' + placeTypeKey];
        var attr = new WorldWind.PlacemarkAttributes(null);

        var canvas = $('<canvas></canvas>');
        var ctx2d = canvas.getContext('2d');
        var size = 10;
        var c = size / 2 - 0.5;
        var innerRadius = 0;
        var outerRadius = 2.2;
        canvas.height = size;
        canvas.width = size;
        ctx2d.fillStyle = color;
        ctx2d.arc(c, c, outerRadius, 0, 2 * Math.PI, false);
        ctx2d.fill();

        var placemark = new WorldWind.Placemark(new WorldWind.Position(latitude, longitude, 1e2));
        placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

        // Create the placemark attributes for the placemark.
        var placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        placemarkAttributes.imageScale = 1;
        placemarkAttributes.imageColor = new WorldWind.Color(1,1,1,.55)

        // Wrap the canvas created above in an ImageSource object to specify it as the placemark image source.
        placemarkAttributes.imageSource = new WorldWind.ImageSource(canvas);
        placemark.attributes = placemarkAttributes;
        // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
        // the default highlight attributes so that all properties are identical except the image scale. You could
        // instead vary the color, image, or other property to control the highlight representation.
        var highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        highlightAttributes.imageScale = 1.2;
        highlightAttributes.imageSource = new WorldWind.ImageSource(canvas);
        placemark.highlightAttributes = highlightAttributes;
        return placemark;
    }


    return LandmarkFactory;



});
