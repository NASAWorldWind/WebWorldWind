/*
 * Author: Inzamam Rahaman, Matt Evers
 */

requirejs.config({
    paths: {
        "worldwind" : "http://worldwindserver.net/webworldwind/worldwind.min.js",
        "jquery" : "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min",
        "OpenStreetMapApp" : "OpenStreetMapApp"
    }
});

requirejs(['jquery', "OpenStreetMapApp", 'nlform', 'nlbuilder', 'WorldWindBase'],
    function($, OpenStreetMapApp, NaturalLanguageCanvas, NLBuilder) {
        var worldWindow = new WorldWindBase( window );
        new OpenStreetMapApp( worldWindow );
});


