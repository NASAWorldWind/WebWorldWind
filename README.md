# Web World Wind #

Web World Wind is a 3D virtual globe API for JavaScript. You can use it to provide a geographic context, complete
with terrain, for visualizing geographic or geo-located information. Web World Wind provides high-resolution terrain
and imagery, retrieved from remote servers automatically as needed. You can also provide your own terrain and
imagery. Web World Wind additionally provides a rich collection of shapes that you can use to represent information on
the globe or in space.

See [webworldwind.org](http://webworldwind.org) for a complete description of Web World Wind's functionality.
You'll also find there links to many Web World Wind resources, including a user guide. The Web World Wind distribution
provides many simple examples showing how to use all of Web World Wind's functionality.

The web site you're currently viewing contains the detailed Web World Wind API documentation. These pages describe
each class, function and property in the Web World Wind library.

Here is a very simple example of using Web World Wind. It is the contents of SimplestExample.html in the
example collection. It displays an interactive virtual globe in an HTML canvas.

    <!DOCTYPE html>
    <!-- This is a very simple example of using Web World Wind. -->
    <html>
    <head lang="en">
        <meta charset="UTF-8">
        <title>World Wind Example</title>
        <!-- Include the Web World Wind library. -->
        <script src="http://worldwindserver.net/webworldwind/worldwindlib.js" type="text/javascript"></script>
    </head>
    <body>
    <div style="position: absolute; top: 50px; left: 50px;">
        <!-- Create a canvas for Web World Wind. -->
        <canvas id="canvasOne" width="1024" height="768">
            Your browser does not support HTML5 Canvas.
        </canvas>
    </div>
    <script>
        // Register an event listener to be called when the page is loaded.
        window.addEventListener("load", eventWindowLoaded, false);

        // Define the event listener to initialize Web World Wind.
        function eventWindowLoaded() {
            // Create a World Window for the canvas.
            var wwd = new WorldWind.WorldWindow("canvasOne");

            // Add some image layers to the World Window's globe.
            wwd.addLayer(new WorldWind.BMNGOneImageLayer());
            wwd.addLayer(new WorldWind.BingAerialWithLabelsLayer());

            // Add a compass, a coordinates display and some view controls to the World Window.
            wwd.addLayer(new WorldWind.CompassLayer());
            wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
            wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));
        }
    </script>
    </body>
    </html>
