

requirejs.config({
    paths: {
        "worldwind" : "http://worldwindserver.net/webworldwind/worldwind.min.js",
        "jquery" : "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min",
        "OpenStreetMapApp" : "OpenStreetMapApp"
    }
});

requirejs(["OpenStreetMapApp"], function(OpenStreetMapApp) {
   new OpenStreetMapApp();
});


