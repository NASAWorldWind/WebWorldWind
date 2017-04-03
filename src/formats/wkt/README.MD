# Well Known Text

The specification against which we verify the implementation is there: 
Simple Feature Access - Part 1: Common Architecture, v1.2.1, ref. 06-103r4, http://www.opengeospatial.org/standards/sfa. 
It's the section 7 of this document

## Current state of the implementation

Currently the Well Known Text implementation supports parsing of any valid Well Known Text string. Only subset of the 
shapes will be processed, displayed and returned for further updates from the user.   

### Overall architecture

Well Known Text parser (WKTObjects) supports multiple shapes in one String as long as the shapes are properly formatted. 
The WKTParser parses the shapes from the text string and adds them to the provided layer. It is possible to update the 
properties to the shape either for each shape before added to the layer or modifying shapes after they were added to 
the layer.

From the architectural point of view, there are three classes at play as external interface and then the classes for each 
of the Well Known Text shapes that are supported.   
 
 - WKTParser - It is a core parser class, which receives texts and returns contained WKTObjects and add associated shapes to the layer. 
 - WKTTokens - It is a parser of the String transforming it at first to lexical tokens and then to the WKT Objects and then shapes
 - WKTObject - It is a base class for all WKTObjects which can be displayed. Those that can be displayed will have its 
    own implementation as a subclass which handles the retrieval of valid shapes. 
 
### Supported shapes

In general the Z value is supported and used. If the shape has the Z flag it will be displayed in 3D. 

In general the M value is supported for parsing, but we don't display such shapes as we aren't sure about the used system.

Point - It is correctly parsed and displayed as Placemark

MultiPoint - It is correctly parsed and displayed as Placemarks. For the cases such as higlighting or hover the contained 
shapes are processed separately.  

LineString - It is correctly parsed and displayed as either a Path or SurfacePolyLine based on whether the shape is 2D 
or 3D

MultiLineString - It is correctly parsed and displayed as either set of Paths or SurfacePolylines. For the cases such as 
higlighting or hover the contained shapes are processed separately.  

Polygon - It is correctly parsed and displayed as either a Polygon or SurfacePolygon based on whether it is in 3D. It 
does correctly represent the inner and outer boundaries of such polygon.  

Multipolygon - It is correctly parsed and displayed as either set of Polygons or SurfacePolygons. For the cases such as 
highlighting or hover the contained shapes are processed separately.  

Triangle - It is correctly parsed and displayed as either Polygon or SurfacePolygon based on whether it is in 3D or not. 

GeometryCollection - It is correctly parsed and all known geometries inside the collection are displayed as explained 
above. 

### Shapes not supported

- CircularString
- Curve, MultiCurve, CompoundCurve
- CurvePolygon 
- Surface, MultiSurface, PolyhedralSurface
- TIN