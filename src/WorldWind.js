/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define([ // PLEASE KEEP ALL THIS IN ALPHABETICAL ORDER BY MODULE NAME (not directory name).
        './formats/aaigrid/AAIGridConstants',
        './formats/aaigrid/AAIGridMetadata',
        './formats/aaigrid/AAIGridReader',
        './error/AbstractError',
        './geom/Angle',
        './shapes/Annotation',
        './shapes/AnnotationAttributes',
        './util/measure/AreaMeasurer',
        './error/ArgumentError',
        './globe/AsterV2ElevationCoverage',
        './layer/AtmosphereLayer',
        './shaders/AtmosphereProgram',
        './shaders/BasicProgram',
        './shaders/BasicTextureProgram',
        './util/BasicTimeSequence',
        './BasicWorldWindowController',
        './layer/BingAerialLayer',
        './layer/BingAerialWithLabelsLayer',
        './layer/BingRoadsLayer',
        './layer/BingWMSLayer',
        './layer/BMNGLandsatLayer',
        './layer/BMNGLayer',
        './layer/BMNGOneImageLayer',
        './layer/BMNGRestLayer',
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
        './globe/EarthRestElevationCoverage',
        './globe/ElevationCoverage',
        './globe/ElevationModel',
        './util/Font',
        './util/FrameStatistics',
        './layer/FrameStatisticsLayer',
        './render/FramebufferTexture',
        './render/FramebufferTile',
        './render/FramebufferTileController',
        './geom/Frustum',
        './globe/GebcoElevationCoverage',
        './shapes/GeographicMesh',
        './projections/GeographicProjection',
        './shapes/GeographicText',
        './formats/geojson/GeoJSONExporter',
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
        './layer/heatmap/HeatMapColoredTile',
        './layer/heatmap/HeatMapIntervalType',
        './layer/heatmap/HeatMapLayer',
        './layer/heatmap/HeatMapTile',
        './util/HighlightController',
        './util/ImageSource',
        './render/ImageTile',
        './util/Insets',
        './formats/kml/KmlAbstractView',
        './formats/kml/util/KmlAttribute',
        './formats/kml/styles/KmlBalloonStyle',
        './formats/kml/KmlCamera',
        './formats/kml/util/KmlChange',
        './formats/kml/styles/KmlColorStyle',
        './formats/kml/features/KmlContainer',
        './formats/kml/controls/KmlControls',
        './formats/kml/util/KmlCreate',
        './formats/kml/util/KmlDelete',
        './formats/kml/features/KmlDocument',
        './formats/kml/KmlElements',
        './formats/kml/util/KmlElementsFactory',
        './formats/kml/util/KmlElementsFactoryCached',
        './formats/kml/features/KmlFeature',
        './formats/kml/KmlFile',
        './formats/kml/KmlFileCache',
        './formats/kml/features/KmlFolder',
        './formats/kml/geom/KmlGeometry',
        './formats/kml/features/KmlGroundOverlay',
        './formats/kml/util/KmlHrefResolver',
        './formats/kml/KmlIcon',
        './formats/kml/styles/KmlIconStyle',
        './formats/kml/util/KmlImagePyramid',
        './formats/kml/util/KmlItemIcon',
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
        './formats/kml/geom/KmlMultiTrack',
        './formats/kml/features/KmlNetworkLink',
        './formats/kml/util/KmlNetworkLinkControl',
        './formats/kml/util/KmlNodeTransformers',
        './formats/kml/KmlObject',
        './formats/kml/KmlOrientation',
        './formats/kml/features/KmlOverlay',
        './formats/kml/util/KmlPair',
        './formats/kml/features/KmlPhotoOverlay',
        './formats/kml/features/KmlPlacemark',
        './formats/kml/geom/KmlPoint',
        './formats/kml/geom/KmlPolygon',
        './formats/kml/styles/KmlPolyStyle',
        './formats/kml/util/KmlRefreshListener',
        './formats/kml/KmlRegion',
        './formats/kml/util/KmlRemoteFile',
        './formats/kml/util/KmlScale',
        './formats/kml/util/KmlSchema',
        './formats/kml/features/KmlScreenOverlay',
        './formats/kml/styles/KmlStyle',
        './formats/kml/styles/KmlStyleMap',
        './formats/kml/util/KmlStyleResolver',
        './formats/kml/styles/KmlStyleSelector',
        './formats/kml/styles/KmlSubStyle',
        './formats/kml/KmlTimePrimitive',
        './formats/kml/KmlTimeSpan',
        './formats/kml/KmlTimeStamp',
        './formats/kml/features/KmlTour',
        './formats/kml/geom/KmlTrack',
        './formats/kml/util/KmlTreeKeyValueCache',
        './formats/kml/controls/KmlTreeVisibility',
        './formats/kml/util/KmlUpdate',
        './formats/kml/util/KmlViewVolume',
        './formats/kml/KmzFile',
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
        './geom/MeasuredLocation',
        './util/measure/MeasurerUtils',
        './cache/MemoryCache',
        './cache/MemoryCacheListener',
        './layer/MercatorTiledImageLayer',
        './navigate/Navigator',
        './util/NominatimGeocoder',
        './error/NotYetImplementedError',
        './util/Offset',
        './layer/OpenStreetMapImageLayer',
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
        './shapes/ScreenImage',
        './shapes/ScreenText',
        './geom/Sector',
        './shapes/ShapeAttributes',
        './formats/shapefile/Shapefile',
        './layer/ShowTessellationLayer',
        './shaders/SkyProgram',
        './layer/StarFieldLayer',
        './shaders/StarFieldProgram',
        './util/SunPosition',
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
        './render/TextRenderer',
        './render/Texture',
        './render/TextureTile',
        './util/Tile',
        './globe/TiledElevationCoverage',
        './layer/TiledImageLayer',
        './util/TileFactory',
        './gesture/TiltRecognizer',
        './gesture/Touch',
        './shapes/TriangleMesh',
        './error/UnsupportedOperationError',
        './globe/UsgsNedElevationCoverage',
        './globe/UsgsNedHiElevationCoverage',
        './util/UrlBuilder',
        './geom/Vec2',
        './geom/Vec3',
        './layer/ViewControlsLayer',
        './ogc/wcs/WcsCapabilities',
        './ogc/wcs/WcsCoverage',
        './ogc/wcs/WcsCoverageDescriptions',
        './globe/WcsEarthElevationCoverage',
        './util/WcsTileUrlBuilder',
        './ogc/wcs/WebCoverageService',
        './ogc/WfsCapabilities',
        './formats/wkt/Wkt',
        './formats/wkt/WktElements',
        './formats/wkt/WktExporter',
        './formats/wkt/geom/WktGeometryCollection',
        './formats/wkt/geom/WktLineString',
        './formats/wkt/geom/WktMultiLineString',
        './formats/wkt/geom/WktMultiPoint',
        './formats/wkt/geom/WktMultiPolygon',
        './formats/wkt/geom/WktObject',
        './formats/wkt/geom/WktPoint',
        './formats/wkt/geom/WktPolygon',
        './formats/wkt/WktTokens',
        './formats/wkt/geom/WktTriangle',
        './formats/wkt/WktType',
        './ogc/wms/WmsCapabilities',
        './layer/WmsLayer',
        './ogc/wms/WmsLayerCapabilities',
        './layer/WmsTimeDimensionedLayer',
        './util/WmsUrlBuilder',
        './ogc/wmts/WmtsCapabilities',
        './layer/WmtsLayer',
        './ogc/wmts/WmtsLayerCapabilities',
        './WorldWindow',
        './WorldWindowController',
        './util/WWMath',
        './util/WWMessage',
        './util/WWUtil',
        './util/XmlDocument'],
    function (AAIGridConstants,
              AAIGridMetadata,
              AAIGridReader,
              AbstractError,
              Angle,
              Annotation,
              AnnotationAttributes,
              AreaMeasurer,
              ArgumentError,
              AsterV2ElevationCoverage,
              AtmosphereLayer,
              AtmosphereProgram,
              BasicProgram,
              BasicTextureProgram,
              BasicTimeSequence,
              BasicWorldWindowController,
              BingAerialLayer,
              BingAerialWithLabelsLayer,
              BingRoadsLayer,
              BingWMSLayer,
              BMNGLandsatLayer,
              BMNGLayer,
              BMNGOneImageLayer,
              BMNGRestLayer,
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
              EarthRestElevationCoverage,
              ElevationCoverage,
              ElevationModel,
              Font,
              FrameStatistics,
              FrameStatisticsLayer,
              FramebufferTexture,
              FramebufferTile,
              FramebufferTileController,
              Frustum,
              GebcoElevationCoverage,
              GeographicMesh,
              GeographicProjection,
              GeographicText,
              GeoJSONExporter,
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
              HeatMapColoredTile,
              HeatMapIntervalType,
              HeatMapLayer,
              HeatMapTile,
              HighlightController,
              ImageSource,
              ImageTile,
              Insets,
              KmlAbstractView,
              KmlAttribute,
              KmlBalloonStyle,
              KmlCamera,
              KmlChange,
              KmlColorStyle,
              KmlContainer,
              KmlControls,
              KmlCreate,
              KmlDelete,
              KmlDocument,
              KmlElements,
              KmlElementsFactory,
              KmlElementsFactoryCached,
              KmlFeature,
              KmlFile,
              KmlFileCache,
              KmlFolder,
              KmlGeometry,
              KmlGroundOverlay,
              KmlHrefResolver,
              KmlIcon,
              KmlIconStyle,
              KmlImagePyramid,
              KmlItemIcon,
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
              KmlMultiTrack,
              KmlNetworkLink,
              KmlNetworkLinkControl,
              KmlNodeTransformers,
              KmlObject,
              KmlOrientation,
              KmlOverlay,
              KmlPair,
              KmlPhotoOverlay,
              KmlPlacemark,
              KmlPoint,
              KmlPolygon,
              KmlPolyStyle,
              KmlRefreshListener,
              KmlRegion,
              KmlRemoteFile,
              KmlScale,
              KmlSchema,
              KmlScreenOverlay,
              KmlStyle,
              KmlStyleMap,
              KmlStyleResolver,
              KmlStyleSelector,
              KmlSubStyle,
              KmlTimePrimitive,
              KmlTimeSpan,
              KmlTimeStamp,
              KmlTour,
              KmlTrack,
              KmlTreeKeyValueCache,
              KmlTreeVisibility,
              KmlUpdate,
              KmlViewVolume,
              KmzFile,
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
              MeasuredLocation,
              MeasurerUtils,
              MemoryCache,
              MemoryCacheListener,
              MercatorTiledImageLayer,
              Navigator,
              NominatimGeocoder,
              NotYetImplementedError,
              Offset,
              OpenStreetMapImageLayer,
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
              ScreenImage,
              ScreenText,
              Sector,
              ShapeAttributes,
              Shapefile,
              ShowTessellationLayer,
              SkyProgram,
              StarFieldLayer,
              StarFieldProgram,
              SunPosition,
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
              TextRenderer,
              Texture,
              TextureTile,
              Tile,
              TiledElevationCoverage,
              TiledImageLayer,
              TileFactory,
              TiltRecognizer,
              Touch,
              TriangleMesh,
              UsgsNedElevationCoverage,
              UsgsNedHiElevationCoverage,
              UnsupportedOperationError,
              UrlBuilder,
              Vec2,
              Vec3,
              ViewControlsLayer,
              WcsCapabilities,
              WcsCoverage,
              WcsCoverageDescriptions,
              WcsEarthElevationCoverage,
              WcsTileUrlBuilder,
              WebCoverageService,
              WfsCapabilities,
              Wkt,
              WktElements,
              WktExporter,
              WktGeometryCollection,
              WktLineString,
              WktMultiLineString,
              WktMultiPoint,
              WktMultiPolygon,
              WktObject,
              WktPoint,
              WktPolygon,
              WktTokens,
              WktTriangle,
              WktType,
              WmsCapabilities,
              WmsLayer,
              WmsLayerCapabilities,
              WmsTimeDimensionedLayer,
              WmsUrlBuilder,
              WmtsCapabilities,
              WmtsLayer,
              WmtsLayerCapabilities,
              WorldWindow,
              WorldWindowController,
              WWMath,
              WWMessage,
              WWUtil,
              XmlDocument
    ) {
        "use strict";
        /**
         * This is the top-level WorldWind module. It is global.
         * @exports WorldWind
         * @global
         */
        var WorldWind = {
            /**
             * The WorldWind version number.
             * @default "0.9.0"
             * @constant
             */
            VERSION: "0.9.0",

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
             * @deprecated Use WGS84_SEMI_MAJOR_AXIS instead.
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
             * Indicates a linear filter.
             * @constant
             */
            FILTER_LINEAR: "filter_linear",

            /**
             * Indicates a nearest neighbor filter.
             * @constant
             */
            FILTER_NEAREST: "filter_nearest",

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
             * The event name of WorldWind redraw events.
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
            WEST: "west",

            /**
             * WGS 84 reference value for Earth's semi-major axis: 6378137.0. Taken from NGA.STND.0036_1.0.0_WGS84,
             * section 3.4.1.
             * @constant
             */
            WGS84_SEMI_MAJOR_AXIS: 6378137.0,

            /**
             * WGS 84 reference value for Earth's inverse flattening: 298.257223563. Taken from
             * NGA.STND.0036_1.0.0_WGS84, section 3.4.2.
             * @constant
             */
            WGS84_INVERSE_FLATTENING: 298.257223563
        };

        WorldWind['AAIGridConstants'] = AAIGridConstants;
        WorldWind['AAIGridMetadata'] = AAIGridMetadata;
        WorldWind['AAIGridReader'] = AAIGridReader;
        WorldWind['AbstractError'] = AbstractError;
        WorldWind['Angle'] = Angle;
        WorldWind['Annotation'] = Annotation;
        WorldWind['AnnotationAttributes'] = AnnotationAttributes;
        WorldWind['AreaMeasurer'] = AreaMeasurer;
        WorldWind['ArgumentError'] = ArgumentError;
        WorldWind['AsterV2ElevationCoverage'] = AsterV2ElevationCoverage;
        WorldWind['AtmosphereLayer'] = AtmosphereLayer;
        WorldWind['AtmosphereProgram'] = AtmosphereProgram;
        WorldWind['BasicProgram'] = BasicProgram;
        WorldWind['BasicTextureProgram'] = BasicTextureProgram;
        WorldWind['BasicTimeSequence'] = BasicTimeSequence;
        WorldWind['BasicWorldWindowController'] = BasicWorldWindowController;
        WorldWind['BingAerialLayer'] = BingAerialLayer;
        WorldWind['BingAerialWithLabelsLayer'] = BingAerialWithLabelsLayer;
        WorldWind['BingRoadsLayer'] = BingRoadsLayer;
        WorldWind['BingWMSLayer'] = BingWMSLayer;
        WorldWind['BMNGLandsatLayer'] = BMNGLandsatLayer;
        WorldWind['BMNGLayer'] = BMNGLayer;
        WorldWind['BMNGOneImageLayer'] = BMNGOneImageLayer;
        WorldWind['BMNGRestLayer'] = BMNGRestLayer;
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
        WorldWind['EarthRestElevationCoverage'] = EarthRestElevationCoverage;
        WorldWind['ElevationCoverage'] = ElevationCoverage;
        WorldWind['ElevationModel'] = ElevationModel;
        WorldWind['Font'] = Font;
        WorldWind['FrameStatistics'] = FrameStatistics;
        WorldWind['FrameStatisticsLayer'] = FrameStatisticsLayer;
        WorldWind['FramebufferTexture'] = FramebufferTexture;
        WorldWind['FramebufferTile'] = FramebufferTile;
        WorldWind['FramebufferTileController'] = FramebufferTileController;
        WorldWind['Frustum'] = Frustum;
        WorldWind['GebcoElevationCoverage'] = GebcoElevationCoverage;
        WorldWind['GeographicMesh'] = GeographicMesh;
        WorldWind['GeographicProjection'] = GeographicProjection;
        WorldWind['GeographicText'] = GeographicText;
        WorldWind['GeoJSONExporter'] = GeoJSONExporter;
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
        WorldWind['HeatMapColoredTile'] = HeatMapColoredTile;
        WorldWind['HeatMapIntervalType'] = HeatMapIntervalType;
        WorldWind['HeatMapLayer'] = HeatMapLayer;
        WorldWind['HeatMapTile'] = HeatMapTile;
        WorldWind['HighlightController'] = HighlightController;
        WorldWind['ImageSource'] = ImageSource;
        WorldWind['ImageTile'] = ImageTile;
        WorldWind['Insets'] = Insets;
        WorldWind['KmlAbstractView'] = KmlAbstractView;
        WorldWind['KmlAttribute'] = KmlAttribute;
        WorldWind['KmlBalloonStyle'] = KmlBalloonStyle;
        WorldWind['KmlCamera'] = KmlCamera;
        WorldWind['KmlChange'] = KmlChange;
        WorldWind['KmlColorStyle'] = KmlColorStyle;
        WorldWind['KmlContainer'] = KmlContainer;
        WorldWind['KmlControls'] = KmlControls;
        WorldWind['KmlCreate'] = KmlCreate;
        WorldWind['KmlDelete'] = KmlDelete;
        WorldWind['KmlDocument'] = KmlDocument;
        WorldWind['KmlElements'] = KmlElements;
        WorldWind['KmlElementsFactory'] = KmlElementsFactory;
        WorldWind['KmlElementsFactoryCached'] = KmlElementsFactoryCached;
        WorldWind['KmlFeature'] = KmlFeature;
        WorldWind['KmlFile'] = KmlFile;
        WorldWind['KmlFileCache'] = KmlFileCache;
        WorldWind['KmlFolder'] = KmlFolder;
        WorldWind['KmlGeometry'] = KmlGeometry;
        WorldWind['KmlGroundOverlay'] = KmlGroundOverlay;
        WorldWind['KmlHrefResolver'] = KmlHrefResolver;
        WorldWind['KmlIcon'] = KmlIcon;
        WorldWind['KmlIconStyle'] = KmlIconStyle;
        WorldWind['KmlImagePyramid'] = KmlImagePyramid;
        WorldWind['KmlItemIcon'] = KmlItemIcon;
        WorldWind['KmlLabelStyle'] = KmlLabelStyle;
        WorldWind['KmlLatLonAltBox'] = KmlLatLonAltBox;
        WorldWind['KmlLatLonBox'] = KmlLatLonBox;
        WorldWind['KmlLatLonQuad'] = KmlLatLonQuad;
        WorldWind['KmlLinearRing'] = KmlLinearRing;
        WorldWind['KmlLineString'] = KmlLineString;
        WorldWind['KmlLineStyle'] = KmlLineStyle;
        WorldWind['KmlListStyle'] = KmlListStyle;
        WorldWind['KmlLink'] = KmlLink;
        WorldWind['KmlLocation'] = KmlLocation;
        WorldWind['KmlLod'] = KmlLod;
        WorldWind['KmlLookAt'] = KmlLookAt;
        WorldWind['KmlMultiGeometry'] = KmlMultiGeometry;
        WorldWind['KmlMultiTrack'] = KmlMultiTrack;
        WorldWind['KmlNetworkLink'] = KmlNetworkLink;
        WorldWind['KmlNetworkLinkControl'] = KmlNetworkLinkControl;
        WorldWind['KmlNodeTransformers'] = KmlNodeTransformers;
        WorldWind['KmlObject'] = KmlObject;
        WorldWind['KmlOrientation'] = KmlOrientation;
        WorldWind['KmlOverlay'] = KmlOverlay;
        WorldWind['KmlPair'] = KmlPair;
        WorldWind['KmlPhotoOverlay'] = KmlPhotoOverlay;
        WorldWind['KmlPlacemark'] = KmlPlacemark;
        WorldWind['KmlPoint'] = KmlPoint;
        WorldWind['KmlPolygon'] = KmlPolygon;
        WorldWind['KmlPolyStyle'] = KmlPolyStyle;
        WorldWind['KmlRefreshListener'] = KmlRefreshListener;
        WorldWind['KmlRegion'] = KmlRegion;
        WorldWind['KmlRemoteFile'] = KmlRemoteFile;
        WorldWind['KmlScale'] = KmlScale;
        WorldWind['KmlSchema'] = KmlSchema;
        WorldWind['KmlScreenOverlay'] = KmlScreenOverlay;
        WorldWind['KmlStyle'] = KmlStyle;
        WorldWind['KmlStyleMap'] = KmlStyleMap;
        WorldWind['KmlStyleResolver'] = KmlStyleResolver;
        WorldWind['KmlStyleSelector'] = KmlStyleSelector;
        WorldWind['KmlSubStyle'] = KmlSubStyle;
        WorldWind['KmlTimePrimitive'] = KmlTimePrimitive;
        WorldWind['KmlTimeSpan'] = KmlTimeSpan;
        WorldWind['KmlTimeStamp'] = KmlTimeStamp;
        WorldWind['KmlTour'] = KmlTour;
        WorldWind['KmlTrack'] = KmlTrack;
        WorldWind['KmlTreeKeyValueCache'] = KmlTreeKeyValueCache;
        WorldWind['KmlTreeVisibility'] = KmlTreeVisibility;
        WorldWind['KmlUpdate'] = KmlUpdate;
        WorldWind['KmlViewVolume'] = KmlViewVolume;
        WorldWind['KmzFile'] = KmzFile;
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
        WorldWind['MeasuredLocation'] = MeasuredLocation;
        WorldWind['MeasurerUtils'] = MeasurerUtils;
        WorldWind['MemoryCache'] = MemoryCache;
        WorldWind['MemoryCacheListener'] = MemoryCacheListener;
        WorldWind['MercatorTiledImageLayer'] = MercatorTiledImageLayer;
        WorldWind['Navigator'] = Navigator;
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
        WorldWind['StarFieldLayer'] = StarFieldLayer;
        WorldWind['StarFieldProgram'] = StarFieldProgram;
        WorldWind['SunPosition'] = SunPosition;
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
        WorldWind['TextRenderer'] = TextRenderer;
        WorldWind['Texture'] = Texture;
        WorldWind['TextureTile'] = TextureTile;
        WorldWind['Tile'] = Tile;
        WorldWind['TiledElevationCoverage'] = TiledElevationCoverage;
        WorldWind['TiledImageLayer'] = TiledImageLayer;
        WorldWind['TileFactory'] = TileFactory;
        WorldWind['TiltRecognizer'] = TiltRecognizer;
        WorldWind['Touch'] = Touch;
        WorldWind['TriangleMesh'] = TriangleMesh;
        WorldWind['UsgsNedElevationCoverage'] = UsgsNedElevationCoverage;
        WorldWind['UsgsNedHiElevationCoverage'] = UsgsNedHiElevationCoverage;
        WorldWind['UnsupportedOperationError'] = UnsupportedOperationError;
        WorldWind['UrlBuilder'] = UrlBuilder;
        WorldWind['Vec2'] = Vec2;
        WorldWind['Vec3'] = Vec3;
        WorldWind['ViewControlsLayer'] = ViewControlsLayer;
        WorldWind['WcsCapabilities'] = WcsCapabilities;
        WorldWind['WcsCoverage'] = WcsCoverage;
        WorldWind['WcsCoverageDescriptions'] = WcsCoverageDescriptions;
        WorldWind['WcsEarthElevationCoverage'] = WcsEarthElevationCoverage;
        WorldWind['WcsTileUrlBuilder'] = WcsTileUrlBuilder;
        WorldWind['WebCoverageService'] = WebCoverageService;
        WorldWind['WfsCapabilities'] = WfsCapabilities;
        WorldWind['Wkt'] = Wkt;
        WorldWind['WktElements'] = WktElements;
        WorldWind['WktExporter'] = WktExporter;
        WorldWind['WktGeometryCollection'] = WktGeometryCollection;
        WorldWind['WktLineString'] = WktLineString;
        WorldWind['WktMultiLineString'] = WktMultiLineString;
        WorldWind['WktMultiPoint'] = WktMultiPoint;
        WorldWind['WktMultiPolygon'] = WktMultiPolygon;
        WorldWind['WktObject'] = WktObject;
        WorldWind['WktPoint'] = WktPoint;
        WorldWind['WktPolygon'] = WktPolygon;
        WorldWind['WktTokens'] = WktTokens;
        WorldWind['WktTriangle'] = WktTriangle;
        WorldWind['WktType'] = WktType;
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
        WorldWind['WorldWindowController'] = WorldWindowController;

        /**
         * Holds configuration parameters for WorldWind. Applications may modify these parameters prior to creating
         * their first WorldWind objects. Configuration properties are:
         * <ul>
         *     <li><code>gpuCacheSize</code>: A Number indicating the size in bytes to allocate from GPU memory for
         *     resources such as textures, GLSL programs and buffer objects. Default is 250e6 (250 MB).</li>
         *     <li><code>baseUrl</code>: The URL of the directory containing the WorldWind Library and its resources.</li>
         *     <li><code>layerRetrievalQueueSize</code>: The number of concurrent tile requests allowed per layer. The default is 16.</li>
         *     <li><code>coverageRetrievalQueueSize</code>: The number of concurrent tile requests allowed per elevation coverage. The default is 16.</li>
         *     <li><code>bingLogoPlacement</code>: An {@link Offset} to place a Bing logo attribution. The default is a 7px margin inset from the lower right corner of the screen.</li>
         *     <li><code>bingLogoAlignment</code>: An {@link Offset} to align the Bing logo relative to its placement position. The default is the lower right corner of the logo.</li>
         * </ul>
         * @type {{gpuCacheSize: number}}
         */
        WorldWind.configuration = {
            gpuCacheSize: 250e6,
            baseUrl: (WWUtil.worldwindlibLocation()) || (WWUtil.currentUrlSansFilePart() + '/../'),
            layerRetrievalQueueSize: 16,
            coverageRetrievalQueueSize: 16,
            bingLogoPlacement: new Offset(WorldWind.OFFSET_INSET_PIXELS, 7, WorldWind.OFFSET_PIXELS, 7),
            bingLogoAlignment: new Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, 0)
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