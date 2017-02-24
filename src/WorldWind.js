/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: WorldWind.js 3418 2015-08-22 00:17:05Z tgaskins $
 */
define([ // PLEASE KEEP ALL THIS IN ALPHABETICAL ORDER BY MODULE NAME (not directory name).
        './error/AbstractError',
        './geom/Angle',
        './shapes/Annotation',
        './shapes/AnnotationAttributes',
        './util/measure/AreaMeasurer',
        './error/ArgumentError',
        './layer/AtmosphereLayer',
        './shaders/AtmosphereProgram',
        './shaders/BasicProgram',
        './shaders/BasicTextureProgram',
        './util/BasicTimeSequence',
        './layer/BingAerialLayer',
        './layer/BingAerialWithLabelsLayer',
        './layer/BingRoadsLayer',
        './layer/BingWMSLayer',
        './layer/BlueMarbleLayer',
        './layer/BMNGLandsatLayer',
        './layer/BMNGLayer',
        './layer/BMNGOneImageLayer',
        './geom/BoundingBox',
        './gesture/ClickRecognizer',
        './formats/collada/ColladaLoader',
        './util/Color',
        './shapes/Compass',
        './layer/CompassLayer',
        './layer/CoordinatesDisplayLayer',
        './util/Date',
        './layer/DigitalGlobeTiledImageLayer',
        './gesture/DragRecognizer',
        './render/DrawContext',
        './globe/EarthElevationModel',
        './globe/EarthRestElevationModel',
        './globe/ElevationModel',
        './util/Font',
        './util/FrameStatistics',
        './layer/FrameStatisticsLayer',
        './render/FramebufferTexture',
        './render/FramebufferTile',
        './render/FramebufferTileController',
        './geom/Frustum',
        './shapes/GeographicMesh',
        './projections/GeographicProjection',
        './shapes/GeographicText',
        './formats/geojson/GeoJSONGeometry',
        './formats/geojson/GeoJSONGeometryCollection',
        './formats/geojson/GeoJSONGeometryLineString',
        './formats/geojson/GeoJSONGeometryMultiLineString',
        './formats/geojson/GeoJSONGeometryMultiPoint',
        './formats/geojson/GeoJSONGeometryMultiPolygon',
        './formats/geojson/GeoJSONGeometryPoint',
        './formats/geojson/GeoJSONGeometryPolygon',
        './formats/geojson/GeoJSONParser',
        './formats/geotiff/GeoTiffReader',
        './gesture/GestureRecognizer',
        './globe/Globe',
        './globe/Globe2D',
        './util/GoToAnimator',
        './shaders/GpuProgram',
        './cache/GpuResourceCache',
        './shaders/GpuShader',
        './shaders/GroundProgram',
        './util/HashMap',
        './util/HighlightController',
        './formats/kml/util/ImagePyramid',
        './util/ImageSource',
        './render/ImageTile',
        './util/Insets',
        './formats/kml/util/ItemIcon',
        './formats/kml/KmlAbstractView',
        './formats/kml/styles/KmlBalloonStyle',
        './formats/kml/KmlCamera',
        './formats/kml/styles/KmlColorStyle',
        './formats/kml/features/KmlContainer',
        './formats/kml/features/KmlDocument',
        './formats/kml/KmlElements',
        './formats/kml/features/KmlFeature',
        './formats/kml/KmlFile',
        './formats/kml/features/KmlFolder',
        './formats/kml/geom/KmlGeometry',
        './formats/kml/features/KmlGroundOverlay',
        './formats/kml/KmlIcon',
        './formats/kml/styles/KmlIconStyle',
        './formats/kml/styles/KmlLabelStyle',
        './formats/kml/KmlLatLonAltBox',
        './formats/kml/KmlLatLonBox',
        './formats/kml/KmlLatLonQuad',
        './formats/kml/geom/KmlLinearRing',
        './formats/kml/geom/KmlLineString',
        './formats/kml/styles/KmlLineStyle',
        './formats/kml/KmlLink',
        './formats/kml/styles/KmlListStyle',
        './formats/kml/KmlLocation',
        './formats/kml/KmlLod',
        './formats/kml/KmlLookAt',
        './formats/kml/geom/KmlMultiGeometry',
        './formats/kml/features/KmlNetworkLink',
        './formats/kml/KmlObject',
        './formats/kml/KmlOrientation',
        './formats/kml/features/KmlOverlay',
        './formats/kml/features/KmlPhotoOverlay',
        './formats/kml/features/KmlPlacemark',
        './formats/kml/geom/KmlPoint',
        './formats/kml/geom/KmlPolygon',
        './formats/kml/styles/KmlPolyStyle',
        './formats/kml/KmlRegion',
        './formats/kml/features/KmlScreenOverlay',
        './formats/kml/styles/KmlStyle',
        './formats/kml/styles/KmlStyleMap',
        './formats/kml/styles/KmlStyleSelector',
        './formats/kml/styles/KmlSubStyle',
        './formats/kml/KmlTimePrimitive',
        './formats/kml/KmlTimeSpan',
        './formats/kml/KmlTimeStamp',
        './formats/kml/features/KmlTour',
        './formats/kml/geom/KmlTrack',
        './layer/LandsatRestLayer',
        './layer/Layer',
        './util/measure/LengthMeasurer',
        './util/Level',
        './util/LevelRowColumnUrlBuilder',
        './util/LevelSet',
        './geom/Line',
        './geom/Location',
        './util/Logger',
        './navigate/LookAtNavigator',
        './geom/Matrix',
        './util/measure/MeasurerUtils',
        './cache/MemoryCache',
        './cache/MemoryCacheListener',
        './layer/MercatorTiledImageLayer',
        './navigate/Navigator',
        './navigate/NavigatorState',
        './util/NominatimGeocoder',
        './error/NotYetImplementedError',
        './util/Offset',
        './layer/OpenStreetMapImageLayer',
        './formats/kml/util/Pair',
        './gesture/PanRecognizer',
        './shapes/Path',
        './util/PeriodicTimeSequence',
        './pick/PickedObject',
        './pick/PickedObjectList',
        './gesture/PinchRecognizer',
        './shapes/Placemark',
        './shapes/PlacemarkAttributes',
        './geom/Plane',
        './shapes/Polygon',
        './util/PolygonSplitter',
        './geom/Position',
        './projections/ProjectionEquirectangular',
        './projections/ProjectionGnomonic',
        './projections/ProjectionMercator',
        './projections/ProjectionPolarEquidistant',
        './projections/ProjectionUPS',
        './projections/ProjectionWgs84',
        './geom/Rectangle',
        './render/Renderable',
        './layer/RenderableLayer',
        './layer/RestTiledImageLayer',
        './gesture/RotationRecognizer',
        './formats/kml/util/Scale',
        './formats/kml/util/Schema',
        './shapes/ScreenImage',
        './shapes/ScreenText',
        './geom/Sector',
        './shapes/ShapeAttributes',
        './formats/shapefile/Shapefile',
        './layer/ShowTessellationLayer',
        './shaders/SkyProgram',
        './shapes/SurfaceImage',
        './shapes/SurfaceCircle',
        './shapes/SurfaceEllipse',
        './shapes/SurfacePolygon',
        './shapes/SurfacePolyline',
        './shapes/SurfaceRectangle',
        './render/SurfaceRenderable',
        './shapes/SurfaceSector',
        './shapes/SurfaceShape',
        './shapes/SurfaceShapeTile',
        './shapes/SurfaceShapeTileBuilder',
        './render/SurfaceTile',
        './render/SurfaceTileRenderer',
        './shaders/SurfaceTileRendererProgram',
        './gesture/TapRecognizer',
        './layer/TectonicPlatesLayer',
        './globe/Terrain',
        './globe/TerrainTile',
        './globe/TerrainTileList',
        './globe/Tessellator',
        './shapes/Text',
        './shapes/TextAttributes',
        './render/TextSupport',
        './render/Texture',
        './render/TextureTile',
        './util/Tile',
        './layer/TiledImageLayer',
        './util/TileFactory',
        './gesture/TiltRecognizer',
        './gesture/Touch',
        './shapes/TriangleMesh',
        './error/UnsupportedOperationError',
        './geom/Vec2',
        './geom/Vec3',
        './layer/ViewControlsLayer',
        './formats/kml/util/ViewVolume',
        './util/WcsTileUrlBuilder',
        './ogc/WfsCapabilities',
        './ogc/wms/WmsCapabilities',
        './layer/WmsLayer',
        './ogc/wms/WmsLayerCapabilities',
        './layer/WmsTimeDimensionedLayer',
        './util/WmsUrlBuilder',
        './ogc/wmts/WmtsCapabilities',
        './layer/WmtsLayer',
        './ogc/wmts/WmtsLayerCapabilities',
        './WorldWindow',
        './util/WWMath',
        './util/WWMessage',
        './util/WWUtil',
        './util/XmlDocument',
        './globe/ZeroElevationModel'],
    function (AbstractError,
              Angle,
              Annotation,
              AnnotationAttributes,
              AreaMeasurer,
              ArgumentError,
              AtmosphereLayer,
              AtmosphereProgram,
              BasicProgram,
              BasicTextureProgram,
              BasicTimeSequence,
              BingAerialLayer,
              BingAerialWithLabelsLayer,
              BingRoadsLayer,
              BingWMSLayer,
              BlueMarbleLayer,
              BMNGLandsatLayer,
              BMNGLayer,
              BMNGOneImageLayer,
              BoundingBox,
              ClickRecognizer,
              ColladaLoader,
              Color,
              Compass,
              CompassLayer,
              CoordinatesDisplayLayer,
              DateWW,
              DigitalGlobeTiledImageLayer,
              DragRecognizer,
              DrawContext,
              EarthElevationModel,
              EarthRestElevationModel,
              ElevationModel,
              Font,
              FrameStatistics,
              FrameStatisticsLayer,
              FramebufferTexture,
              FramebufferTile,
              FramebufferTileController,
              Frustum,
              GeographicMesh,
              GeographicProjection,
              GeographicText,
              GeoJSONGeometry,
              GeoJSONGeometryCollection,
              GeoJSONGeometryLineString,
              GeoJSONGeometryMultiLineString,
              GeoJSONGeometryMultiPoint,
              GeoJSONGeometryMultiPolygon,
              GeoJSONGeometryPoint,
              GeoJSONGeometryPolygon,
              GeoJSONParser,
              GeoTiffReader,
              GestureRecognizer,
              Globe,
              Globe2D,
              GoToAnimator,
              GpuProgram,
              GpuResourceCache,
              GpuShader,
              GroundProgram,
              HashMap,
              HighlightController,
              ImagePyramid,
              ImageSource,
              ImageTile,
              Insets,
              ItemIcon,
              KmlAbstractView,
              KmlBalloonStyle,
              KmlColorStyle,
              KmlContainer,
              KmlCamera,
              KmlDocument,
              KmlElements,
              KmlFeature,
              KmlFile,
              KmlFolder,
              KmlGeometry,
              KmlGroundOverlay,
              KmlIcon,
              KmlIconStyle,
              KmlLabelStyle,
              KmlLatLonAltBox,
              KmlLatLonBox,
              KmlLatLonQuad,
              KmlLinearRing,
              KmlLineString,
              KmlLineStyle,
              KmlLink,
              KmlListStyle,
              KmlLocation,
              KmlLod,
              KmlLookAt,
              KmlMultiGeometry,
              KmlNetworkLink,
              KmlObject,
              KmlOrientation,
              KmlOverlay,
              KmlPhotoOverlay,
              KmlPlacemark,
              KmlPoint,
              KmlPolygon,
              KmlPolyStyle,
              KmlRegion,
              KmlScreenOverlay,
              KmlStyle,
              KmlStyleMap,
              KmlStyleSelector,
              KmlSubStyle,
              KmlTimePrimitive,
              KmlTimeSpan,
              KmlTimeStamp,
              KmlTour,
              KmlTrack,
              LandsatRestLayer,
              Layer,
              LengthMeasurer,
              Level,
              LevelRowColumnUrlBuilder,
              LevelSet,
              Line,
              Location,
              Logger,
              LookAtNavigator,
              Matrix,
              MeasurerUtils,
              MemoryCache,
              MemoryCacheListener,
              MercatorTiledImageLayer,
              Navigator,
              NavigatorState,
              NominatimGeocoder,
              NotYetImplementedError,
              Offset,
              OpenStreetMapImageLayer,
              Pair,
              PanRecognizer,
              Path,
              PeriodicTimeSequence,
              PickedObject,
              PickedObjectList,
              PinchRecognizer,
              Placemark,
              PlacemarkAttributes,
              Plane,
              Polygon,
              PolygonSplitter,
              Position,
              ProjectionEquirectangular,
              ProjectionGnomonic,
              ProjectionMercator,
              ProjectionPolarEquidistant,
              ProjectionUPS,
              ProjectionWgs84,
              Rectangle,
              Renderable,
              RenderableLayer,
              RestTiledImageLayer,
              RotationRecognizer,
              Scale,
              Schema,
              ScreenImage,
              ScreenText,
              Sector,
              ShapeAttributes,
              Shapefile,
              ShowTessellationLayer,
              SkyProgram,
              SurfaceImage,
              SurfaceCircle,
              SurfaceEllipse,
              SurfacePolygon,
              SurfacePolyline,
              SurfaceRectangle,
              SurfaceRenderable,
              SurfaceSector,
              SurfaceShape,
              SurfaceShapeTile,
              SurfaceShapeTileBuilder,
              SurfaceTile,
              SurfaceTileRenderer,
              SurfaceTileRendererProgram,
              TapRecognizer,
              TectonicPlatesLayer,
              Terrain,
              TerrainTile,
              TerrainTileList,
              Tessellator,
              Text,
              TextAttributes,
              TextSupport,
              Texture,
              TextureTile,
              Tile,
              TiledImageLayer,
              TileFactory,
              TiltRecognizer,
              Touch,
              TriangleMesh,
              UnsupportedOperationError,
              Vec2,
              Vec3,
              ViewControlsLayer,
              ViewVolume,
              WcsTileUrlBuilder,
              WfsCapabilities,
              WmsCapabilities,
              WmsLayer,
              WmsLayerCapabilities,
              WmsTimeDimensionedLayer,
              WmsUrlBuilder,
              WmtsCapabilities,
              WmtsLayer,
              WmtsLayerCapabilities,
              WorldWindow,
              WWMath,
              WWMessage,
              WWUtil,
              XmlDocument,
              ZeroElevationModel) {
        "use strict";
        /**
         * This is the top-level World Wind module. It is global.
         * @exports WorldWind
         * @global
         */
        var WorldWind = {
            /**
             * The World Wind version number.
             * @default "0.0.0"
             * @constant
             */
            VERSION: "0.0.0",

            // PLEASE KEEP THE ENTRIES BELOW IN ALPHABETICAL ORDER
            /**
             * Indicates an altitude mode relative to the globe's ellipsoid.
             * @constant
             */
            ABSOLUTE: "absolute",

            /**
             * Indicates that a redraw callback has been called immediately after a redraw.
             * @constant
             */
            AFTER_REDRAW: "afterRedraw",

            /**
             * Indicates that a redraw callback has been called immediately before a redraw.
             * @constant
             */
            BEFORE_REDRAW: "beforeRedraw",

            /**
             * The BEGAN gesture recognizer state. Continuous gesture recognizers transition to this state from the
             * POSSIBLE state when the gesture is first recognized.
             * @constant
             */
            BEGAN: "began",

            /**
             * The CANCELLED gesture recognizer state. Continuous gesture recognizers may transition to this state from
             * the BEGAN state or the CHANGED state when the touch events are cancelled.
             * @constant
             */
            CANCELLED: "cancelled",

            /**
             * The CHANGED gesture recognizer state. Continuous gesture recognizers transition to this state from the
             * BEGAN state or the CHANGED state, whenever an input event indicates a change in the gesture.
             * @constant
             */
            CHANGED: "changed",

            /**
             * Indicates an altitude mode always on the terrain.
             * @constant
             */
            CLAMP_TO_GROUND: "clampToGround",

            /**
             * The radius of Earth.
             * @constant
             */
            EARTH_RADIUS: 6371e3,

            /**
             * Indicates the cardinal direction east.
             * @constant
             */
            EAST: "east",

            /**
             * The ENDED gesture recognizer state. Continuous gesture recognizers transition to this state from either
             * the BEGAN state or the CHANGED state when the current input no longer represents the gesture.
             * @constant
             */
            ENDED: "ended",

            /**
             * The FAILED gesture recognizer state. Gesture recognizers transition to this state from the POSSIBLE state
             * when the gesture cannot be recognized given the current input.
             * @constant
             */
            FAILED: "failed",

            /**
             * Indicates a great circle path.
             * @constant
             */
            GREAT_CIRCLE: "greatCircle",

            /**
             * Indicates a linear, straight line path.
             * @constant
             */
            LINEAR: "linear",

            /**
             * Indicates a multi-point shape, typically within a shapefile.
             */
            MULTI_POINT: "multiPoint",

            /**
             * Indicates the cardinal direction north.
             * @constant
             */
            NORTH: "north",

            /**
             * Indicates a null shape, typically within a shapefile.
             * @constant
             */
            NULL: "null",

            /**
             * Indicates that the associated parameters are fractional values of the virtual rectangle's width or
             * height in the range [0, 1], where 0 indicates the rectangle's origin and 1 indicates the corner
             * opposite its origin.
             * @constant
             */
            OFFSET_FRACTION: "fraction",

            /**
             * Indicates that the associated parameters are in units of pixels relative to the virtual rectangle's
             * corner opposite its origin corner.
             * @constant
             */
            OFFSET_INSET_PIXELS: "insetPixels",

            /**
             * Indicates that the associated parameters are in units of pixels relative to the virtual rectangle's
             * origin.
             * @constant
             */
            OFFSET_PIXELS: "pixels",

            /**
             * Indicates a point shape, typically within a shapefile.
             */
            POINT: "point",

            /**
             * Indicates a polyline shape, typically within a shapefile.
             */
            POLYLINE: "polyline",

            /**
             * Indicates a polygon shape, typically within a shapefile.
             */
            POLYGON: "polygon",

            /**
             * The POSSIBLE gesture recognizer state. Gesture recognizers in this state are idle when there is no input
             * event to evaluate, or are evaluating input events to determine whether or not to transition into another
             * state.
             * @constant
             */
            POSSIBLE: "possible",

            /**
             * The RECOGNIZED gesture recognizer state. Discrete gesture recognizers transition to this state from the
             * POSSIBLE state when the gesture is recognized.
             * @constant
             */
            RECOGNIZED: "recognized",

            /**
             * The event name of World Wind redraw events.
             */
            REDRAW_EVENT_TYPE: "WorldWindRedraw",

            /**
             * Indicates that the related value is specified relative to the globe.
             * @constant
             */
            RELATIVE_TO_GLOBE: "relativeToGlobe",

            /**
             * Indicates an altitude mode relative to the terrain.
             * @constant
             */
            RELATIVE_TO_GROUND: "relativeToGround",

            /**
             * Indicates that the related value is specified relative to the plane of the screen.
             * @constant
             */
            RELATIVE_TO_SCREEN: "relativeToScreen",

            /**
             * Indicates a rhumb path -- a path of constant bearing.
             * @constant
             */
            RHUMB_LINE: "rhumbLine",

            /**
             * Indicates the cardinal direction south.
             * @constant
             */
            SOUTH: "south",

            /**
             * Indicates the cardinal direction west.
             * @constant
             */
            WEST: "west"
        };

        WorldWind['AbstractError'] = AbstractError;
        WorldWind['Angle'] = Angle;
        WorldWind['Annotation'] = Annotation;
        WorldWind['AnnotationAttributes'] = AnnotationAttributes;
        WorldWind['AreaMeasurer'] = AreaMeasurer;
        WorldWind['ArgumentError'] = ArgumentError;
        WorldWind['AtmosphereLayer'] = AtmosphereLayer;
        WorldWind['AtmosphereProgram'] = AtmosphereProgram;
        WorldWind['BasicProgram'] = BasicProgram;
        WorldWind['BasicTextureProgram'] = BasicTextureProgram;
        WorldWind['BasicTimeSequence'] = BasicTimeSequence;
        WorldWind['BingAerialLayer'] = BingAerialLayer;
        WorldWind['BingAerialWithLabelsLayer'] = BingAerialWithLabelsLayer;
        WorldWind['BingRoadsLayer'] = BingRoadsLayer;
        WorldWind['BingWMSLayer'] = BingWMSLayer;
        WorldWind['BlueMarbleLayer'] = BlueMarbleLayer;
        WorldWind['BMNGLandsatLayer'] = BMNGLandsatLayer;
        WorldWind['BMNGLayer'] = BMNGLayer;
        WorldWind['BMNGOneImageLayer'] = BMNGOneImageLayer;
        WorldWind['BoundingBox'] = BoundingBox;
        WorldWind['ClickRecognizer'] = ClickRecognizer;
        WorldWind['ColladaLoader'] = ColladaLoader;
        WorldWind['Color'] = Color;
        WorldWind['Compass'] = Compass;
        WorldWind['CompassLayer'] = CompassLayer;
        WorldWind['CoordinatesDisplayLayer'] = CoordinatesDisplayLayer;
        WorldWind['DateWW'] = DateWW;
        WorldWind['DigitalGlobeTiledImageLayer'] = DigitalGlobeTiledImageLayer;
        WorldWind['DragRecognizer'] = DragRecognizer;
        WorldWind['DrawContext'] = DrawContext;
        WorldWind['EarthElevationModel'] = EarthElevationModel;
        WorldWind['EarthRestElevationModel'] = EarthRestElevationModel;
        WorldWind['ElevationModel'] = ElevationModel;
        WorldWind['Font'] = Font;
        WorldWind['FrameStatistics'] = FrameStatistics;
        WorldWind['FrameStatisticsLayer'] = FrameStatisticsLayer;
        WorldWind['FramebufferTexture'] = FramebufferTexture;
        WorldWind['FramebufferTile'] = FramebufferTile;
        WorldWind['FramebufferTileController'] = FramebufferTileController;
        WorldWind['Frustum'] = Frustum;
        WorldWind['GeographicMesh'] = GeographicMesh;
        WorldWind['GeographicProjection'] = GeographicProjection;
        WorldWind['GeographicText'] = GeographicText;
        WorldWind['GeoJSONGeometry'] = GeoJSONGeometry;
        WorldWind['GeoJSONGeometryCollection'] = GeoJSONGeometryCollection;
        WorldWind['GeoJSONGeometryLineString'] = GeoJSONGeometryLineString;
        WorldWind['GeoJSONGeometryMultiLineString'] = GeoJSONGeometryMultiLineString;
        WorldWind['GeoJSONGeometryMultiPoint'] = GeoJSONGeometryMultiPoint;
        WorldWind['GeoJSONGeometryMultiPolygon'] = GeoJSONGeometryMultiPolygon;
        WorldWind['GeoJSONGeometryPoint'] = GeoJSONGeometryPoint;
        WorldWind['GeoJSONGeometryPolygon'] = GeoJSONGeometryPolygon;
        WorldWind['GeoJSONParser'] = GeoJSONParser;
        WorldWind['GeoTiffReader'] = GeoTiffReader;
        WorldWind['GestureRecognizer'] = GestureRecognizer;
        WorldWind['Globe'] = Globe;
        WorldWind['Globe2D'] = Globe2D;
        WorldWind['GoToAnimator'] = GoToAnimator;
        WorldWind['GpuProgram'] = GpuProgram;
        WorldWind['GpuResourceCache'] = GpuResourceCache;
        WorldWind['GpuShader'] = GpuShader;
        WorldWind['GroundProgram'] = GroundProgram;
        WorldWind['HashMap'] = HashMap;
        WorldWind['HighlightController'] = HighlightController;
        WorldWind['ImageSource'] = ImageSource;
        WorldWind['ImageTile'] = ImageTile;
        WorldWind['Insets'] = Insets;
        WorldWind['KmlFile'] = KmlFile;
        WorldWind['LandsatRestLayer'] = LandsatRestLayer;
        WorldWind['Layer'] = Layer;
        WorldWind['LengthMeasurer'] = LengthMeasurer;
        WorldWind['Level'] = Level;
        WorldWind['LevelRowColumnUrlBuilder'] = LevelRowColumnUrlBuilder;
        WorldWind['LevelSet'] = LevelSet;
        WorldWind['Line'] = Line;
        WorldWind['Location'] = Location;
        WorldWind['Logger'] = Logger;
        WorldWind['LookAtNavigator'] = LookAtNavigator;
        WorldWind['Matrix'] = Matrix;
        WorldWind['MeasurerUtils'] = MeasurerUtils;
        WorldWind['MemoryCache'] = MemoryCache;
        WorldWind['MemoryCacheListener'] = MemoryCacheListener;
        WorldWind['MercatorTiledImageLayer'] = MercatorTiledImageLayer;
        WorldWind['Navigator'] = Navigator;
        WorldWind['NavigatorState'] = NavigatorState;
        WorldWind['NominatimGeocoder'] = NominatimGeocoder;
        WorldWind['NotYetImplementedError'] = NotYetImplementedError;
        WorldWind['Offset'] = Offset;
        WorldWind['OpenStreetMapImageLayer'] = OpenStreetMapImageLayer;
        WorldWind['PanRecognizer'] = PanRecognizer;
        WorldWind['Path'] = Path;
        WorldWind['PeriodicTimeSequence'] = PeriodicTimeSequence;
        WorldWind['PickedObject'] = PickedObject;
        WorldWind['PickedObjectList'] = PickedObjectList;
        WorldWind['PinchRecognizer'] = PinchRecognizer;
        WorldWind['Placemark'] = Placemark;
        WorldWind['PlacemarkAttributes'] = PlacemarkAttributes;
        WorldWind['Plane'] = Plane;
        WorldWind['Polygon'] = Polygon;
        WorldWind['PolygonSplitter'] = PolygonSplitter;
        WorldWind['Position'] = Position;
        WorldWind['ProjectionEquirectangular'] = ProjectionEquirectangular;
        WorldWind['ProjectionGnomonic'] = ProjectionGnomonic;
        WorldWind['ProjectionMercator'] = ProjectionMercator;
        WorldWind['ProjectionPolarEquidistant'] = ProjectionPolarEquidistant;
        WorldWind['ProjectionUPS'] = ProjectionUPS;
        WorldWind['ProjectionWgs84'] = ProjectionWgs84;
        WorldWind['Rectangle'] = Rectangle;
        WorldWind['Renderable'] = Renderable;
        WorldWind['RenderableLayer'] = RenderableLayer;
        WorldWind['RestTiledImageLayer'] = RestTiledImageLayer;
        WorldWind['RotationRecognizer'] = RotationRecognizer;
        WorldWind['ScreenText'] = ScreenText;
        WorldWind['ScreenImage'] = ScreenImage;
        WorldWind['Sector'] = Sector;
        WorldWind['ShapeAttributes'] = ShapeAttributes;
        WorldWind['Shapefile'] = Shapefile;
        WorldWind['ShowTessellationLayer'] = ShowTessellationLayer;
        WorldWind['SkyProgram'] = SkyProgram;
        WorldWind['SurfaceImage'] = SurfaceImage;
        WorldWind['SurfaceCircle'] = SurfaceCircle;
        WorldWind['SurfaceEllipse'] = SurfaceEllipse;
        WorldWind['SurfacePolygon'] = SurfacePolygon;
        WorldWind['SurfacePolyline'] = SurfacePolyline;
        WorldWind['SurfaceRectangle'] = SurfaceRectangle;
        WorldWind['SurfaceRenderable'] = SurfaceRenderable;
        WorldWind['SurfaceSector'] = SurfaceSector;
        WorldWind['SurfaceShape'] = SurfaceShape;
        WorldWind['SurfaceShapeTile'] = SurfaceShapeTile;
        WorldWind['SurfaceShapeTileBuilder'] = SurfaceShapeTileBuilder;
        WorldWind['SurfaceTile'] = SurfaceTile;
        WorldWind['SurfaceTileRenderer'] = SurfaceTileRenderer;
        WorldWind['SurfaceTileRendererProgram'] = SurfaceTileRendererProgram;
        WorldWind['TapRecognizer'] = TapRecognizer;
        WorldWind['TectonicPlatesLayer'] = TectonicPlatesLayer;
        WorldWind['Terrain'] = Terrain;
        WorldWind['TerrainTile'] = TerrainTile;
        WorldWind['TerrainTileList'] = TerrainTileList;
        WorldWind['Tessellator'] = Tessellator;
        WorldWind['Text'] = Text;
        WorldWind['TextAttributes'] = TextAttributes;
        WorldWind['TextSupport'] = TextSupport;
        WorldWind['Texture'] = Texture;
        WorldWind['TextureTile'] = TextureTile;
        WorldWind['Tile'] = Tile;
        WorldWind['TiledImageLayer'] = TiledImageLayer;
        WorldWind['TileFactory'] = TileFactory;
        WorldWind['TiltRecognizer'] = TiltRecognizer;
        WorldWind['Touch'] = Touch;
        WorldWind['TriangleMesh'] = TriangleMesh;
        WorldWind['UnsupportedOperationError'] = UnsupportedOperationError;
        WorldWind['Vec2'] = Vec2;
        WorldWind['Vec3'] = Vec3;
        WorldWind['ViewControlsLayer'] = ViewControlsLayer;
        WorldWind['WcsTileUrlBuilder'] = WcsTileUrlBuilder;
        WorldWind['WfsCapabilities'] = WfsCapabilities;
        WorldWind['WmsCapabilities'] = WmsCapabilities;
        WorldWind['WmsLayer'] = WmsLayer;
        WorldWind['WmsLayerCapabilities'] = WmsLayerCapabilities;
        WorldWind['WmsTimeDimensionedLayer'] = WmsTimeDimensionedLayer;
        WorldWind['WmsUrlBuilder'] = WmsUrlBuilder;
        WorldWind['WmtsCapabilities'] = WmtsCapabilities;
        WorldWind['WmtsLayer'] = WmtsLayer;
        WorldWind['WmtsLayerCapabilities'] = WmtsLayerCapabilities;
        WorldWind['WWMath'] = WWMath;
        WorldWind['WWMessage'] = WWMessage;
        WorldWind['WWUtil'] = WWUtil;
        WorldWind['WorldWindow'] = WorldWindow;
        WorldWind['ZeroElevationModel'] = ZeroElevationModel;

        /**
         * Holds configuration parameters for World Wind. Applications may modify these parameters prior to creating
         * their first World Wind objects. Configuration properties are:
         * <ul>
         *     <li><code>gpuCacheSize</code>: A Number indicating the size in bytes to allocate from GPU memory for
         *     resources such as textures, GLSL programs and buffer objects. Default is 250e6 (250 MB).</li>
         *     <li><code>baseUrl</code>: The URL of the directory containing the World Wind Library and its resources.</li>
         * </ul>
         * @type {{gpuCacheSize: number}}
         */
        WorldWind.configuration = {
            gpuCacheSize: 250e6,
            baseUrl: (WWUtil.worldwindlibLocation()) || (WWUtil.currentUrlSansFilePart() + '/../')
        };

        /**
         * Indicates the Bing Maps key to use when requesting Bing Maps resources.
         * @type {String}
         * @default null
         */
        WorldWind.BingMapsKey = null;

        window.WorldWind = WorldWind;

        return WorldWind;
    }
);