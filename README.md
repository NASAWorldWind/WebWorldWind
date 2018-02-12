<img src="https://worldwind.arc.nasa.gov/img/nasa-logo.svg" height="100"/>
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

The Web WorldWind [Developer's Guide](https://worldwind.arc.nasa.gov/web) has a complete description of Web 
WorldWind's functionality. You'll also find there links to many Web WorldWind resources, including a user guide. The 
latest Web WorldWind release provides many simple examples showing how to use all of Web WorldWind's functionality.

## Building

[Install NodeJS](https://nodejs.org). The build is known to work with v6.9.2 (LTS).

- `npm install` downloads WorldWind's dependencies

- `npm run build` builds everything

- `npm run doc` generates the WorldWind API documentation

- `npm run test` runs WorldWind's unit tests

- `npm run test:watch` automatically runs WorldWind's unit tests when source code changes

## License

Licensed under the [Apache License, Version 2.0](https://apache.org/licenses/LICENSE-2.0).
