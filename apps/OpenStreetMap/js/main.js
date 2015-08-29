

requirejs.config({
    paths: {
        "worldwind" : "http://worldwindserver.net/webworldwind/worldwindlib.js",
        "jquery" : "http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min",
        "OpenStreetMapApp" : "OpenStreetMapApp"
    }
});

requirejs(["OpenStreetMapApp"], function(OpenStreetMapApp) {
   new OpenStreetMapApp();
});


