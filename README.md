<img src="https://worldwind.arc.nasa.gov/css/images/nasa-logo.svg" height="100"/>
<p>in partnership with the <a href="http://www.esa.int" target="_blank">European Space Agency</a></p>

# Web WorldWind

[![Build Status](https://travis-ci.org/NASAWorldWind/WebWorldWind.svg?branch=develop)](https://travis-ci.org/NASAWorldWind/WebWorldWind)

3D virtual globe API for JavaScript, developed by NASA in partnership with ESA. Provides a geographic context, complete with terrain, 
for visualizing geographic or geo-located information in 3D and 2D. Web WorldWind provides high-resolution terrain and 
imagery, retrieved from remote servers automatically as needed. Developers can provide custom terrain and imagery.
Provides a collection of shapes for displaying and interacting with geographic data and representing a range of 
geometric objects.   

- [worldwind.arc.nasa.gov](https://worldwind.arc.nasa.gov) has setup instructions, developers guides, API documentation and more
- [Forum](https://forum.worldwindcentral.com) provides help from the WorldWind community
- [WebStorm](https://www.jetbrains.com/webstorm) is used by the NASA WorldWind development team

## Get Started

The Web WorldWind [Developer's Guide](https://webworldwind.org/developers-guide) has a complete description of Web 
WorldWind's functionality. You'll  also find there links to many Web WorldWind resources, including a user guide. The 
latest Web WorldWind release provides many simple examples showing how to use all of Web WorldWind's functionality.

## Example Usage

Here is a simple web app using Web WorldWind. It is the contents of SimplestExample.html in the example collection. It 
displays an interactive virtual globe in an HTML canvas.

    <!DOCTYPE html>
    <!-- This is a very simple example of using Web WorldWind. -->
    <html>
    <head lang="en">
        <meta charset="UTF-8">
        <title>WorldWind Example</title>
        <!-- Include the Web WorldWind library. -->
        <script src="http://worldwindserver.net/webworldwind/worldwind.min.js" type="text/javascript"></script>
    </head>
    <body>
    <div style="position: absolute; top: 50px; left: 50px;">
        <!-- Create a canvas for Web WorldWind. -->
        <canvas id="canvasOne" width="1024" height="768">
            Your browser does not support HTML5 Canvas.
        </canvas>
    </div>
    <script>
        // Register an event listener to be called when the page is loaded.
        window.addEventListener("load", eventWindowLoaded, false);

        // Define the event listener to initialize Web WorldWind.
        function eventWindowLoaded() {
            // Create a WorldWindow for the canvas.
            var wwd = new WorldWind.WorldWindow("canvasOne");

            // Add some image layers to the WorldWindow's globe.
            wwd.addLayer(new WorldWind.BMNGOneImageLayer());
            wwd.addLayer(new WorldWind.BingAerialWithLabelsLayer());

            // Add a compass, a coordinates display and some view controls to the WorldWindow.
            wwd.addLayer(new WorldWind.CompassLayer());
            wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
            wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));
        }
    </script>
    </body>
    </html>

## License

    NASA WorldWind

    Copyright (C) 2001 United States Government
    as represented by the Administrator of the
    National Aeronautics and Space Administration.
    All Rights Reserved.

    NASA OPEN SOURCE AGREEMENT VERSION 1.3

    This open source agreement ("agreement") defines the rights of use, reproduction,
    distribution, modification and redistribution of certain computer software originally
    released by the United States Government as represented by the Government Agency
    listed below ("Government Agency"). The United States Government, as represented by
    Government Agency, is an intended third-party beneficiary of all subsequent
    distributions or redistributions of the subject software. Anyone who uses, reproduces,
    distributes, modifies or redistributes the subject software, as defined herein, or any
    part thereof, is, by that action, accepting in full the responsibilities and obligations 
    contained in this agreement.

    Government Agency: National Aeronautics and Space Administration (NASA)
    Government Agency Original Software Designation: ARC-15166-1
    Government Agency Original Software Title: NASA WorldWind
    User Registration Requested. Please send email with your contact information to Patrick.Hogan@nasa.gov
    Government Agency Point of Contact for Original Software: Patrick.Hogan@nasa.gov

    You may obtain a full copy of the license at:

        https://worldwind.arc.nasa.gov/LICENSE.html
