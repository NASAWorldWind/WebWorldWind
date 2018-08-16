<img src="https://worldwind.arc.nasa.gov/img/nasa-logo.svg" height="100"/>

# Web WorldWind

[![Build Status](https://travis-ci.org/NASAWorldWind/WebWorldWind.svg?branch=develop)](https://travis-ci.org/NASAWorldWind/WebWorldWind)

3D virtual globe API in JavaScript for the web, developed by NASA. The European Space Agency has provided valuable
contributions to this platform since 2015. Web WorldWind provides a geographic context, complete with terrain, and a
collection for shapes for displaying and interacting with geographic or geo-located information in 3D and 2D in any
modern web browser. High-resolution terrain and imagery is retrieved from remote servers automatically as needed, while
enabling developers to include their own custom terrain and imagery.

- [worldwind.arc.nasa.gov](https://worldwind.arc.nasa.gov) has setup instructions, developers guides, API documentation and more
- [Forum](https://forum.worldwindcentral.com) provides help from the WorldWind community
- [WebStorm](https://www.jetbrains.com/webstorm) is used by the NASA WorldWind development team

## Get Started

The Web WorldWind [Developer's Guide](https://worldwind.arc.nasa.gov/web) has a complete description of Web WorldWind's
functionality. You'll also find there links to many Web WorldWind resources, including a user guide. The latest
Web WorldWind release provides many simple examples showing how to use all of Web WorldWind's functionality.

## Building

[Install NodeJS](https://nodejs.org). The build is known to work with v6.9.2 (LTS).

- `npm install` downloads WorldWind's dependencies

- `npm run build` builds everything

- `npm run doc` generates the WorldWind API documentation

- `npm run test` runs WorldWind's unit tests

- `npm run test:watch` automatically runs WorldWind's unit tests when source code changes

## License

Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
National Aeronautics and Space Administration. All rights reserved.

The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.