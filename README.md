<img src="https://worldwind.arc.nasa.gov/img/nasa-logo.svg" height="100"/>

# Web WorldWind

## New versions of WorldWind released
 
Web WorldWind 0.10.0 and WorldWind Java 2.2.0 are now available on GitHub. The new version of Web WorldWind addresses potential vulnerabilities in the code and underlying packages. The new version of WorldWind Java focuses on upgrading to Java 11 and JOGL 2.4 as well as a switch to Apache 2.0 license. WorldWind's API remains largely unchanged in this release and we are committed to maintaining a consistent API in future releases.
More information on the release can be found at these links: [Web WorldWind 0.10.0](https://github.com/NASAWorldWind/WebWorldWind/releases) and [WorldWind Java 2.2.0](https://github.com/NASAWorldWind/WorldWindJava/releases).
Please direct questions to our new email address: 

arc-worldwind@mail.nasa.gov

[![Build Status](https://travis-ci.com/NASAWorldWind/WebWorldWind.svg?branch=develop)](https://travis-ci.com/NASAWorldWind/WebWorldWind)

3D virtual globe API in JavaScript for the web, developed by NASA. The European Space Agency has provided valuable
contributions to this platform since 2015. Web WorldWind provides a geographic context, complete with terrain, and a
collection for shapes for displaying and interacting with geographic or geo-located information in 3D and 2D in any
modern web browser. High-resolution terrain and imagery is retrieved from remote servers automatically as needed, while
enabling developers to include their own custom terrain and imagery.

[worldwind.arc.nasa.gov](https://worldwind.arc.nasa.gov) has setup instructions, developers guides, API documentation and more.

## Get Started

The Web WorldWind [Developer's Guide](https://worldwind.arc.nasa.gov/web) has a complete description of Web WorldWind's
functionality. You'll also find there links to many Web WorldWind resources, including a user guide. For novices on WorldWind, 
A [Get Started](https://worldwind.arc.nasa.gov/web/get-started/) tutorial is the place to go. The latest Web WorldWind release 
provides many simple [examples](https://github.com/NASAWorldWind/WebWorldWind/tree/develop/examples) showing how to use all of
 Web WorldWind's functionality.

## Building

[Install NodeJS](https://nodejs.org). The build is known to work with Node.js 12.18.0 LTS.

- `npm install` downloads WorldWind's dependencies and builds everything

- `npm run build` builds everything

- `npm run doc` generates the WorldWind API documentation

- `npm run test` runs WorldWind's unit tests

- `npm run test:watch` automatically runs WorldWind's unit tests when source code changes

## License

Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
by the Administrator of the National Aeronautics and Space Administration.
All rights reserved.

The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
Version 2.0 (the "License"); you may not use this file except in compliance
with the License. You may obtain a copy of the License
at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.

NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
software:

   ES6-Promise – under MIT License
   libtess.js – SGI Free Software License B
   Proj4 – under MIT License
   JSZip – under MIT License

A complete listing of 3rd Party software notices and licenses included in
WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
PDF found in code  directory.
