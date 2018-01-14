/*
* Copyright 2015-2017 WorldWind Contributors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
 * @exports WktExporter
 */
define(['../../error/ArgumentError',
        '../../util/Logger',
        './WktType'
    ],
    function (ArgumentError,
              Logger,
              WktType) {
        "use strict";

        var WktExporter = {
            exportRenderable: function (renderable) {
                if (!renderable) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WktExporter", "exportRenderable",
                            "missingRenderable"));
                }

                if (renderable instanceof WorldWind.Placemark) {
                    return this.exportPlacemark(renderable);
                }
                else if (renderable instanceof WorldWind.Path) {
                    return this.exportPath(renderable);
                }
                else if (renderable instanceof WorldWind.Polygon) {
                    return this.exportPolygon(renderable);
                }
                else if (renderable instanceof WorldWind.SurfacePolyline) {
                    return this.exportSurfacePolyline(renderable);
                }
                else if (renderable instanceof WorldWind.SurfacePolygon) {
                    return this.exportSurfacePolygon(renderable);
                }
                else {
                    Logger.log(Logger.LEVEL_WARNING, "Export renderable not implemented: " + renderable);
                    return null;
                }
            },
            exportRenderables: function (renderables) {
                if (!renderables) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WktExporter", "exportRenderables",
                            "missingRenderables"));
                }

                if (renderables.length == 0)
                    return;

                if (renderables.length > 1) {
                    var sb = WktType.SupportedGeometries.GEOMETRY_COLLECTION + '(';

                    for (var i = 0; i < renderables.length; i++) {
                        var exportedRenderable = this.exportRenderable(renderables[i])
                        if (exportedRenderable) {
                            sb = sb + exportedRenderable;
                            sb = sb + ',';
                        }
                    }
                    sb = sb.substring(0, sb.length - 1);
                    sb = sb + ')';

                    return sb;
                }
                else {
                    return this.exportRenderable(renderables[0]);
                }
            },
            exportLayer: function (layer) {
                if (!layer) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "WktExporter", "exportLayer",
                            "missingLayer"));
                }

                return this.exportRenderables(layer.renderables);
            },
            exportPlacemark: function (renderable) {
                var sb = WktType.SupportedGeometries.POINT + '(';
                sb = sb + renderable.position.longitude + ' ' + renderable.position.latitude;
                sb = sb + ')';
                return sb;
            },
            exportPath: function (renderable) {
                var sb = WktType.SupportedGeometries.LINE_STRING + '(';
                for (var i = 0; i < renderable.positions.length; i++) {
                    sb = sb + renderable.positions[i].longitude + ' ' +
                        renderable.positions[i].latitude;
                }
                sb = sb.substring(0, sb.length - 2);
                sb = sb + ')';
                return sb;
            },
            exportPolygon: function (renderable) {
                var sb = WktType.SupportedGeometries.POLYGON + '(';
                if (renderable.boundaries.length > 0 && renderable.boundaries[0].length > 2) {
                    //with holes
                    for (var i = 0; i < renderable.boundaries.length; i++) {
                        sb = sb + '(';
                        for (var j = 0; j < renderable.boundaries[i].length; j++) {
                            sb = sb + renderable.boundaries[i][j].longitude + ' ' +
                                renderable.boundaries[i][j].latitude;
                            sb = sb + ', ';
                        }
                        sb = sb.substring(0, sb.length - 2);
                        sb = sb + ')';
                        sb = sb + ', ';
                    }
                    sb = sb.substring(0, sb.length - 2);
                }
                else {
                    //no holes
                    sb = sb + '(';
                    for (var i = 0; i < renderable.boundaries.length; i++) {
                        sb = sb + renderable.boundaries[i].longitude + ' ' +
                            renderable.boundaries[i].latitude;
                        sb = sb + ', ';
                    }

                    sb = sb.substring(0, sb.length - 2);
                    sb = sb + ')';
                }
                sb = sb + ')';
                return sb;
            },
            exportSurfacePolyline: function (renderable) {
                var sb = WktType.SupportedGeometries.LINE_STRING + '(';
                for (var i = 0; i < renderable.boundaries.length; i++) {
                    sb = sb + renderable.boundaries[i].longitude + ' ' +
                        renderable.boundaries[i].latitude;
                    sb = sb + ', ';
                }
                sb = sb.substring(0, sb.length - 2);
                sb = sb + ')';
                return sb;
            },
            exportSurfacePolygon: function (renderable) {
                var sb = WktType.SupportedGeometries.POLYGON + '(';
                if (renderable.boundaries.length > 0 && renderable.boundaries[0].length > 2) {
                    //with holes
                    for (var i = 0; i < renderable.boundaries.length; i++) {
                        sb = sb + '(';
                        for (var j = 0; j < renderable.boundaries[i].length; j++) {
                            sb = sb + renderable.boundaries[i][j].longitude + ' ' +
                                renderable.boundaries[i][j].latitude;
                            sb = sb + ', ';
                        }
                        sb = sb.substring(0, sb.length - 2);
                        sb = sb + ')';
                        sb = sb + ', ';
                    }
                    sb = sb.substring(0, sb.length - 2);
                }
                else {
                    //no holes
                    sb = sb + '(';
                    for (var i = 0; i < renderable.boundaries.length; i++) {
                        sb = sb + renderable.boundaries[i].longitude + ' ' +
                            renderable.boundaries[i].latitude;
                        sb = sb + ', ';
                    }
                    sb = sb.substring(0, sb.length - 2);
                    sb = sb + ')';
                }
                sb = sb + ')';
                return sb;
            }
        };

        return WktExporter;
    });