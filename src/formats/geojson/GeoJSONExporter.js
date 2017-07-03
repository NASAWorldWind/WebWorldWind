/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports GeoJSONExporter
 */
define(['../../error/ArgumentError',
        './GeoJSONConstants',
        '../../util/Logger'
    ],
    function (ArgumentError,
              GeoJSONConstants,
              Logger) {
        "use strict";

        var GeoJSONExporter = {
            exportRenderable: function (renderable) {
                if (!renderable) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONExporter", "exportRenderable",
                            "missingRenderable"));
                }

                if (renderable instanceof WorldWind.Placemark) {
                    return this.exportPlacemark(renderable);
                }
                else if (renderable instanceof WorldWind.SurfacePolyline) {
                    return this.exportSurfacePolyline(renderable);
                }
                else if (renderable instanceof WorldWind.SurfacePolygon) {
                    return this.exportSurfacePolygon(renderable);
                }
                else if (renderable instanceof WorldWind.SurfaceEllipse) {
                    return this.exportSurfaceEllipse(renderable);
                }
                else if (renderable instanceof WorldWind.SurfaceRectangle) {
                    return this.exportSurfaceRectangle(renderable);
                }
                else if (renderable instanceof WorldWind.SurfaceSector) {
                    return this.exportSurfaceSector(renderable);
                }
                else if (renderable instanceof WorldWind.Path) {
                    this.exportPath(renderable);
                }
                else if (renderable instanceof WorldWind.Polygon) {
                    this.exportPolygon(renderable);
                }
                else {
                    Logger.log(Logger.LEVEL_WARNING, "Export renderable not implemented: " + renderable);
                    return null;
                }
            },
            exportRenderables: function (renderables) {
                if (!renderables) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONExporter", "exportRenderables",
                            "missingRenderables"));
                }

                if (renderables.length == 0)
                    return;

                if (renderables.length > 1) {
                    var sb = '{';
                    sb = sb + '"' + GeoJSONConstants.FIELD_TYPE + '":"' + GeoJSONConstants.TYPE_GEOMETRY_COLLECTION + '"';
                    sb = sb + ',"' + GeoJSONConstants.FIELD_GEOMETRIES + '":[';
                    for (var i = 0; i < renderables.length; i++) {
                        var exportedRenderable = this.exportRenderable(renderables[i])
                        if (exportedRenderable) {
                            sb = sb + exportedRenderable;
                            sb = sb + ',';
                        }
                    }
                    if (sb.slice(-1) === ',') {
                        sb = sb.substring(0, sb.length - 1);
                    }
                    sb = sb + ']';
                    sb = sb + '}';

                    return sb;
                }
                else {
                    return this.exportRenderable(renderables[0]);
                }
            },
            exportLayer: function (layer) {
                if (!layer) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoJSONExporter", "exportLayer",
                            "missingLayer"));
                }

                return this.exportRenderables(layer.renderables);
            },
            exportPlacemark: function (renderable) {
                var sb = '{';
                sb = sb + '"' + GeoJSONConstants.FIELD_TYPE + '":"' + GeoJSONConstants.TYPE_POINT + '",';
                sb = sb + '"' + GeoJSONConstants.FIELD_COORDINATES + '":';
                sb = sb + '[' + renderable.position.longitude + ',' + renderable.position.latitude + ']';
                sb = sb + '}';
                return sb;
            },
            exportSurfacePolyline: function (renderable) {
                var sb = '{';
                sb = sb + '"' + GeoJSONConstants.FIELD_TYPE + '":"' + GeoJSONConstants.TYPE_LINE_STRING + '",';
                sb = sb + '"' + GeoJSONConstants.FIELD_COORDINATES + '":[';
                for (var i = 0; i < renderable.boundaries.length; i++) {
                    sb = sb + '[' + renderable.boundaries[i].longitude + ',' +
                        renderable.boundaries[i].latitude + ']';
                    if (i !== renderable.boundaries.length - 1) {
                        sb = sb + ',';
                    }
                }
                sb = sb + ']';
                return sb;
            },
            exportSurfacePolygon: function (renderable) {
                var sb = '{';
                sb = sb + '"' + GeoJSONConstants.FIELD_TYPE + '":"' + GeoJSONConstants.TYPE_POLYGON + '",';
                sb = sb + '"' + GeoJSONConstants.FIELD_COORDINATES + '":[';
                if (renderable.boundaries.length > 0 && renderable.boundaries[0].length > 2) {
                    //with holes
                    for (var i = 0; i < renderable.boundaries.length; i++) {
                        sb = sb + '[';
                        for (var j = 0; j < renderable.boundaries[i].length; j++) {
                            sb = sb + '[' + renderable.boundaries[i][j].longitude + ',' +
                                renderable.boundaries[i][j].latitude + ']';
                            sb = sb + ',';

                            if (j === renderable.boundaries[i].length - 1) {
                                sb = sb + '[' + renderable.boundaries[i][0].longitude + ',' +
                                    renderable.boundaries[i][0].latitude + ']';
                            }
                        }
                        sb = sb + ']';
                        if (i !== renderable.boundaries.length - 1) {
                            sb = sb + ',';
                        }
                    }
                }
                else {
                    //no holes
                    sb = sb + '[';
                    for (var i = 0; i < renderable.boundaries.length; i++) {
                        sb = sb + '[' + renderable.boundaries[i].longitude + ',' +
                            renderable.boundaries[i].latitude + ']';
                        sb = sb + ',';

                        if (i === renderable.boundaries.length - 1) {
                            sb = sb + '[' + renderable.boundaries[0].longitude + ',' +
                                renderable.boundaries[0].latitude + ']';
                        }
                    }
                    sb = sb + ']';
                }
                sb = sb + ']';
                return sb;
            },
            exportSurfaceEllipse: function (renderable) {
                var sb = '{';
                sb = sb + '"' + GeoJSONConstants.FIELD_TYPE + '":"' + GeoJSONConstants.TYPE_POLYGON + '",';
                sb = sb + '"' + GeoJSONConstants.FIELD_COORDINATES + '":[';
                sb = sb + '[';
                for (var i = 0; i < renderable._boundaries.length; i++) {
                    sb = sb + '[' + renderable._boundaries[i].longitude + ',' +
                        renderable._boundaries[i].latitude + ']';
                    sb = sb + ',';

                    if (i === renderable._boundaries.length - 1) {
                        sb = sb + '[' + renderable._boundaries[0].longitude + ',' +
                            renderable._boundaries[0].latitude + ']';
                    }
                }
                sb = sb + ']';
                sb = sb + ']';
                return sb;
            },
            exportSurfaceRectangle: function (renderable) {
                var sb = '{';
                sb = sb + '"' + GeoJSONConstants.FIELD_TYPE + '":"' + GeoJSONConstants.TYPE_POLYGON + '",';
                sb = sb + '"' + GeoJSONConstants.FIELD_COORDINATES + '":[';
                sb = sb + '[';
                for (var i = 0; i < renderable._boundaries.length; i++) {
                    sb = sb + '[' + renderable._boundaries[i].longitude + ',' +
                        renderable._boundaries[i].latitude + ']';
                    sb = sb + ',';

                    if (i === renderable._boundaries.length - 1) {
                        sb = sb + '[' + renderable._boundaries[0].longitude + ',' +
                            renderable._boundaries[0].latitude + ']';
                    }
                }
                sb = sb + ']';
                sb = sb + ']';
                return sb;
            },
            exportSurfaceSector: function (renderable) {
                var sb = '{';
                sb = sb + '"' + GeoJSONConstants.FIELD_TYPE + '":"' + GeoJSONConstants.TYPE_POLYGON + '",';
                sb = sb + '"' + GeoJSONConstants.FIELD_COORDINATES + '":[';
                sb = sb + '[';

                //right-hand rule
                renderable._boundaries.reverse();

                for (var i = 0; i < renderable._boundaries.length; i++) {
                    sb = sb + '[' + renderable._boundaries[i].longitude + ',' +
                        renderable._boundaries[i].latitude + ']';
                    sb = sb + ',';

                    if (i === renderable._boundaries.length - 1) {
                        sb = sb + '[' + renderable._boundaries[0].longitude + ',' +
                            renderable._boundaries[0].latitude + ']';
                    }
                }
                sb = sb + ']';
                sb = sb + ']';
                return sb;
            },
            exportPath: function (renderable) {
                var sb = '{';
                sb = sb + '"' + GeoJSONConstants.FIELD_TYPE + '":"' + GeoJSONConstants.TYPE_LINE_STRING + '",';
                sb = sb + '"' + GeoJSONConstants.FIELD_COORDINATES + '":[';
                for (var i = 0; i < renderable.positions.length; i++) {
                    sb = sb + '[' + renderable.positions[i].longitude + ',' +
                        renderable.positions[i].latitude + ',' +
                        renderable.positions[i].altitude + ']';
                    if (i !== renderable.positions.length - 1) {
                        sb = sb + ',';
                    }
                }
                sb = sb + ']';
                return sb;
            },
            exportPolygon: function (renderable) {
                var sb = '{';
                sb = sb + '"' + GeoJSONConstants.FIELD_TYPE + '":"' + GeoJSONConstants.TYPE_POLYGON + '",';
                sb = sb + '"' + GeoJSONConstants.FIELD_COORDINATES + '":[';
                if (renderable.boundaries.length > 0 && renderable.boundaries[0].length > 2) {
                    //with holes
                    for (var i = 0; i < renderable.boundaries.length; i++) {
                        sb = sb + '[';
                        for (var j = 0; j < renderable.boundaries[i].length; j++) {
                            sb = sb + '[' + renderable.boundaries[i][j].longitude + ',' +
                                renderable.boundaries[i][j].latitude + ',' +
                                renderable.boundaries[i][j].altitude + ']';
                            sb = sb + ',';

                            if (j === renderable.boundaries[i].length - 1) {
                                sb = sb + '[' + renderable.boundaries[i][0].longitude + ',' +
                                    renderable.boundaries[i][0].latitude + ',' +
                                    renderable.boundaries[i][0].altitude + ']';
                            }
                        }
                        sb = sb + ']';
                        if (i !== renderable.boundaries.length - 1) {
                            sb = sb + ',';
                        }
                    }
                }
                else {
                    //no holes
                    sb = sb + '[';
                    for (var i = 0; i < renderable.boundaries.length; i++) {
                        sb = sb + '[' + renderable.boundaries[i].longitude + ',' +
                            renderable.boundaries[i].latitude + ',' +
                            renderable.boundaries[i].altitude + ']';
                        sb = sb + ',';

                        if (i === renderable.boundaries.length - 1) {
                            sb = sb + '[' + renderable.boundaries[0].longitude + ',' +
                                renderable.boundaries[0].latitude + ',' +
                                renderable.boundaries[0].altitude + ']';
                        }
                    }
                    sb = sb + ']';
                }
                sb = sb + ']';
                return sb;
            }
        };

        return GeoJSONExporter;
    });