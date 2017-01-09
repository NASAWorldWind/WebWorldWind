/*
 * Author: Inzamam Rahaman, Matt Evers
 */

requirejs.config({
    paths: {
        "worldwind" : "http://worldwindserver.net/webworldwind/worldwind.min.js",
        "jquery" : "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min",
        "buckets" : "https://cdn.rawgit.com/mauriciosantos/Buckets-JS/master/buckets.min",
        "Cylinder" : "../../Earthquakes/src/scripts/Cylinder"
        //,"jquery-ui.min" : "https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min"
    }
});

requirejs(['Canvas'
  ],
    function(Canvas) {
        new Canvas()

});


