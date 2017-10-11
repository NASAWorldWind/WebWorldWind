# KML

## Current state of the implementation

KML is a format, which allows you to encode geographical data structures and other additional
information, which can be displayed on the map. This implementation is based on the KML version 2.1 

The reference of the whole format is available on the URL:
https://developers.google.com/kml/documentation/kmlreference

Overall status at the current moment is that we can parse more or less any kml file. We will understand
the top level .kml file in the kmz. As for the support of the .kmz it is very limited at the moment. It doesn't load 
the resources inlined in the kmz file. 

### Features

* gx:Tour - It is currently only parsed. It isn't displayed at all.
* NetworkLink - It is correctly parsed and the resources are correctly retrieved. The only issue is with the resources packed in the kmz file. These aren't displayed.
* Placemark - It is correctly parsed. Associated geometry is displayed. Style is correctly applied. Name is displayed as Placemark in the center of the geometry. 

#### Overlays

* PhotoOverlay - It is correctly parsed. It isn't displayed yet.  
* ScreenOverlay - It is correctly parsed. It is displayed on the screen following overlay and screen options. The rotation isn't supported yet. 
* GroundOverlay - It is correctly parsed. It is displayed draped over the terrain therefore altitude and altitude mode isn't yet supported. The image must be rectangular as only lat lon box is taken into consideration.  

#### Containers

* Folder - It is correctly parsed and its properties such as Time properties, visibility, Region and LookAt are applied. 
* Document - It is correctly parsed and its properties such as Time properties, visibility, Region and LookAt are applied.

### Geometry

* Point - Fully supported. Correctly parsed and displayed as a part of Placemark for example. 
* LineString - Fully supported. Correctly parsed and displayed as either Path or SurfacePolyline based on the altitude mode.
* LinearRing - Fully supported. Correctly parsed and displayed as either Path or SurfacePolyline based on the altitude mode. 
* Polygon - Fully supported. Correctly parsed and displayed as either Polygon or SurfacePolygon based on the altitude mode. 
* MultiGeometry - Fully supported. The only limit is that highlighting works on the objects constituting the multi geometry and not on that multi geometry. 
* Model - Not supported yet.
* gx:Track - It is correctly parsed. It isn't displayed.
* gx:MultiTrack - It is correctly parsed. It isn't displayed.

### StyleSelector

* Style - It is correctly parsed and correctly applied as inline style as well as a style from another document. 
* StyleMap - It is correctly parsed and the normal as well as highlighted styles are correctly applied. 

### TimePrimitive

* TimeSpan - It represents the span in the time. It is reflected in all the Features that are currently supported.
* TimeStamp - It represents the point in the time. It is reflected in all the Features that are currently supported.

### AbstractView

* Camera - It is correctly parsed, but it isn't rendered yet.
* LookAt - It is correctly parsed. It is also displayed meaning that the GoToAnimator is used to get to the LookAt location.

### SubStyle

* BalloonStyle - It is correctly parsed but it isn't used for display yet.
* ListStyle - It is correctly parsed but it isn't used for display yet.
* LineStyle - It is correctly parsed and the outline color and outline width is taken form this style.
* PolyStyle - It is correctly parsed and fill, outline, outline color, color and color mode is used.
* IconStyle - It is correctly parsed and the scale and href are used when this style is applied.
* LabelStyle - It is correctly parsed but it isn't used for display yet.

### Miscellaneous

* Link - It is correctly parsed and correctly used in the scope of the NetworkLinks
* Icon - It is correctly parsed and correctly used in the scope of the relevant Features.
* Orientation - It is correctly parsed but ignored for rendering.
* Location - It is correctly parsed but ignored for rendering.
* Scale - It is correctly parsed but ignored for rendering.
* Region - It is correctly parsed and correctly used in the scope of the Features and NetworkLinks.
* Lod - It is correctly parsed but ignored for rendering.
* LatLonBox - It is correctly parsed and correctly used in the scope of Overlays. 
* LatLonAltBox - It is correctly parsed but ignored for rendering.
* LatLonQuad - It is correctly parsed but ignored for rendering.

### KMZ Support

- Load KMZ file

#### Embedded KML Resources

- Load imagery from KMZ file
- Load other KML files from KMZ file

#### Multiple KMZ files in one parsing

- Load external KMZ file
- Load resources from the external kmz file.

## Examples

### Load KML File

The core of the example loading and displaying the KML File. In this example we prepare a new Layer which contains
time information relevant for the rendering and add the kmlFile renderable to that layer.

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

### Load KMZ File

The core of the example loading and displaying the KMZ File. In this example we prepare a new Layer which contains
time information relevant for the rendering and add the kmlFile renderable to that layer.

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

### Supply your own implementation for any of elements

In certain cases you need to change the behavior of some of the elements. It is possible to supply your own implementation
for any element. If for example you needed different implementation of LineString such as one adding 1 000m altitude to
all points rendered, you can create new javascript class. In the example named NewKmlLineString and provide it to the
framework in following way:

```javascript
WorldWind.KmlElements.addKey('LineString', NewKmlLineString);
```