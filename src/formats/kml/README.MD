# KML - Keyhole Markup Language

## Current State of the Implementation

KML is an XML-based file format, which allows you to encode geographical data
structures and additional information to be displayed on a map or 3D globe. The
current implementation is based on version 2.1 as found at
http://www.opengeospatial.org/standards/kml.

A tutorial is also available at
https://developers.google.com/kml/documentation/kmlreference.

The overall status is that WebWorldWind can parse almost any KML files. The top
level KML file in a KMZ (compressed version of KML) will also be parsed
properly. The support of other resources embedded in KMZ files is currently not
implemented.

### Features

* gx:Tour - Only parsed, not displayed.
* NetworkLink - Parsed and resources retrieved. There are however limitations
  with resources embedded in KMZ files.
* Placemark - Parsed, associated geometry displayed, style applied and name
  displayed as Placemark in the center of the geometry.

#### Overlays

* PhotoOverlay - Only parsed, not displayed. 
* ScreenOverlay - Parsed and displayed on the screen following overlay and
  screen options. The rotation property isn't supported at the moment. 
* GroundOverlay - Parsed and displayed wrapped over the terrain therefore
  altitude and altitude mode isn't supported at the moment. The image must be
  rectangular as only the latitude and longitude box is taken into
  consideration.  

#### Containers

* Folder - Parsed and properties applied including time, visibility, region and
  lookAt. 
* Document - Parsed and properties applied including time, visibility, region
  and lookAt.

### Geometry

* Point - Fully supported. Parsed and displayed as a part of Placemark for
  example. 
* LineString - Fully supported. Parsed and displayed as either Path or
  SurfacePolyline based on the altitude mode.
* LinearRing - Fully supported. Parsed and displayed as either Path or
  SurfacePolyline based on the altitude mode. 
* Polygon - Fully supported. Parsed and displayed as either Polygon or
  SurfacePolygon based on the altitude mode. 
* MultiGeometry - Supported. The only limitation is that highlighting works on
  the objects composing the multi-geometry and not on the multi-geometry as a
  whole. 
* Model - Not supported yet.
* gx:Track - Only parsed, not displayed.
* gx:MultiTrack - Only parsed, not displayed.

### StyleSelector

* Style - Parsed and applied as inline style as well as a style from another
  document. 
* StyleMap - Parsed and normal as well as highlighted styles applied. 

### TimePrimitive

* TimeSpan - Represents a span of time and is reflected in the Features
  currently supported.
* TimeStamp - Represents a point in time and is reflected in the Features
  currently supported.

### AbstractView

* Camera - Only parsed, has no effect.
* LookAt - Parsed and triggers a transition using the GoToAnimator.

### SubStyle

* BalloonStyle - Only parsed, not used for display.
* ListStyle - Only parsed, not used for display.
* LineStyle - Parsed and outline color and outline width applied from this
  style.
* PolyStyle - Parsed and fill, outline, outline color, color and color mode
  applied from this style.
* IconStyle - Parsed and scale and href applied from this style.
* LabelStyle - Only parsed, not used for display.

### Miscellaneous

* Link - Parsed and used in the scope of NetworkLinks
* Icon - Parsed and used in the scope of the relevant Features.
* Orientation - Parsed, but ignored for rendering.
* Location - Parsed, but ignored for rendering.
* Scale - Parsed, but ignored for rendering.
* Region - Parsed and used in the scope of Features and NetworkLinks.
* Lod - Parsed, but ignored for rendering.
* LatLonBox - Parsed and used in the scope of Overlays. 
* LatLonAltBox - Parsed, but ignored for rendering.
* LatLonQuad - Parsed, but ignored for rendering.

## Examples

### Displaying a KML file

In this example, a KML file is loaded and then displayed. In the promise, a new
Layer is created and a time span is defined for it. The parsed KML file is then
added as a renderable to the Layer before the Layer itself is added to the
globe.

```javascript
var kmlFilePromise = new KmlFile('data/KML_Samples.kml', []);
kmlFilePromise.then(function (kmlFile) {
    var renderableLayer = new WorldWind.RenderableLayer("Surface Shapes");
    renderableLayer.currentTimeInterval = [
        new Date("Mon Aug 09 2015 12:10:10 GMT+0200 (Střední Evropa (letní čas))").valueOf(),
        new Date("Mon Aug 11 2015 12:10:10 GMT+0200 (Střední Evropa (letní čas))").valueOf()
    ];
    renderableLayer.addRenderable(kmlFile);

    wwd.addLayer(renderableLayer);
    wwd.redraw();
});
```

### Displaying a KMZ archive

In this example, a KMZ archive is loaded and then displayed. In the promise, a
new Layer is created and a time span is defined for it. The parsed KML content,
that was extracted from the KMZ archive, is then added as a renderable to the
Layer before the Layer itself is added to the globe.

```javascript
var kmlFilePromise = new KmlFile('data/KML_Samples.kmz', []);
kmlFilePromise.then(function (kmlFile) {
    var renderableLayer = new WorldWind.RenderableLayer("Surface Shapes");
    renderableLayer.currentTimeInterval = [
        new Date("Mon Aug 09 2015 12:10:10 GMT+0200 (Střední Evropa (letní čas))").valueOf(),
        new Date("Mon Aug 11 2015 12:10:10 GMT+0200 (Střední Evropa (letní čas))").valueOf()
    ];
    renderableLayer.addRenderable(kmlFile);

    wwd.addLayer(renderableLayer);
    wwd.redraw();
});
```

### Customizing elements

In particular cases, it might be needed to change the behavior of the parser for
some elements. For this purpose, custom implementations can be provided to the
parser.

For example, one might need to render all LineStrings of a given KML file 1000m
meters higher than they were defined originally. A new JavaScript class,
possibly extending the provided KmlLineString class, can be created and provided
as follows:

```javascript
WorldWind.KmlElements.addKey('LineString', NewKmlLineString);
```
