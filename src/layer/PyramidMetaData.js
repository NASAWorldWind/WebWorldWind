/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
/**
 * @exports PyramidMetaData
 */
define([
        '../util/Logger',
        '../util/XmlDocument',
        '../geom/Location',
        '../geom/Sector'
    ],
    function (Logger,
              XmlDocument,
              Location,
              Sector) {
        "use strict";

        const PyramidAttrs = {
            Text: "#text",
            DisplayName: "DisplayName",
            FormatSuffix: "FormatSuffix",
            NumLevels: "NumLevels",
            NumEmpty: "numEmpty",
            Count: "count",
            SectorElement: "Sector",
            SouthWest: "SouthWest",
            NorthEast: "NorthEast",
            LatLon: "LatLon",
            Units: "units",
            Degrees: "degrees",
            Latitude: "latitude",
            Longitude: "longitude",
            TileOrigin: "TileOrigin",
            TileSize: "TileSize",
            Dimension: "Dimension",
            Height: "height",
            Width: "width",
            LevelZeroTileDelta: "LevelZeroTileDelta",
            ImageFormat: "ImageFormat"
        }

        var PyramidMetaData = function (url) {
            this.url = url;
            this.levelCount = 10;
            this.numEmptyLevels = 0;
            this.sector = Sector.FULL_SPHERE;
            this.tileOrigin = new Location(-90, -180);
            this.tileWidth = 512;
            this.tileHeight = 512;
            this.imageFormat = "image/png";
        };

        // Location.fromRadians = function (latitudeRadians, longitudeRadians) {
        //     return new Location(latitudeRadians * Angle.RADIANS_TO_DEGREES, longitudeRadians * Angle.RADIANS_TO_DEGREES);
        // };

        PyramidMetaData.prototype.getChildValue = function (children, attr) {
            const childNodes = Array.prototype.slice.call(children);
            for (const childNode of childNodes) {
                if (childNode.nodeName === attr) {
                    if (attr === PyramidAttrs.Text) {
                        return childNode.nodeValue;
                    }
                    return childNode;
                }
            }
            return null;
        };

        PyramidMetaData.prototype.getLatLon = function (children) {
            const latLon = this.getChildValue(children, PyramidAttrs.LatLon);
            if (latLon) {
                const latitude = latLon.attributes.getNamedItem(PyramidAttrs.Latitude);
                const longitude = latLon.attributes.getNamedItem(PyramidAttrs.Longitude);
                if (!latitude || !longitude) {
                    return null;
                }
                const units = latLon.attributes.getNamedItem(PyramidAttrs.Units);
                if (!units || units.value === PyramidAttrs.Degrees) {
                    return new Location(parseFloat(latitude.value), parseFloat(longitude.value));
                } else {
                    return Location.fromRadians(parseFloat(latitude.value), parseFloat(longitude.value));
                }
            }
            return null;
        };
        PyramidMetaData.prototype.processElement = function (element) {
            switch (element.nodeName) {
                case PyramidAttrs.DisplayName:
                    this.displayName = this.getChildValue(element.childNodes, PyramidAttrs.Text);
                    break;
                case PyramidAttrs.FormatSuffix:
                    this.formatSuffix = this.getChildValue(element.childNodes, PyramidAttrs.Text);
                    break;
                case PyramidAttrs.NumLevels: {
                    let attr = element.attributes.getNamedItem(PyramidAttrs.NumEmpty);
                    if (attr) {
                        this.numEmptyLevels = parseInt(attr.value);
                    }
                    attr = element.attributes.getNamedItem(PyramidAttrs.Count);
                    if (attr) {
                        this.levelCount = parseInt(attr.value);
                    }
                }
                    break;
                case PyramidAttrs.SectorElement: {
                    const southWest = this.getChildValue(element.childNodes, PyramidAttrs.SouthWest);
                    let swLatLon;
                    if (southWest) {
                        swLatLon = this.getLatLon(southWest.childNodes);
                    }
                    const northEast = this.getChildValue(element.childNodes, PyramidAttrs.NorthEast);
                    let neLatLon;
                    if (northEast) {
                        neLatLon = this.getLatLon(northEast.childNodes);
                    }
                    if (swLatLon && neLatLon) {
                        this.sector = new Sector(swLatLon.latitude, neLatLon.latitude,
                            swLatLon.longitude, neLatLon.longitude);
                    }

                }
                    break;
                case PyramidAttrs.TileOrigin: {
                    const origin = this.getLatLon(element.childNodes);
                    if (origin) {
                        this.tileOrigin = origin;
                    }
                }
                    break;
                case PyramidAttrs.TileSize: {
                    const dimension = this.getChildValue(element.childNodes, PyramidAttrs.Dimension);
                    if (dimension) {
                        let attr = dimension.attributes.getNamedItem(PyramidAttrs.Height);
                        if (attr) {
                            this.tileHeight = parseInt(attr.value);
                        }
                        attr = dimension.attributes.getNamedItem(PyramidAttrs.Width);
                        if (attr) {
                            this.tileWidth = parseInt(attr.value);
                        }
                    }
                }
                    break;
                case PyramidAttrs.LevelZeroTileDelta: {
                    const delta = this.getLatLon(element.childNodes);
                    if (delta) {
                        this.levelZeroTileDelta = delta;
                    }
                }
                    break;
                case PyramidAttrs.ImageFormat:
                    this.imageFormat = this.getChildValue(element.childNodes, PyramidAttrs.Text);
                    break;
                default: {
                    const childNodes = Array.prototype.slice.call(element.childNodes);
                    for (const childNode of childNodes) {
                        this.processElement(childNode);
                    }
                }
                    break;
            }
        };

        PyramidMetaData.prototype.parseDocument = function (xml) {
            const document = new XmlDocument(xml).dom();
            this.processElement(document.documentElement);
        };

        PyramidMetaData.prototype.load = function (callback) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this;
            const xhr = new XMLHttpRequest();
            xhr.open("GET", self.url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    self.parseDocument(xhr.responseText);
                    if (callback) {
                        callback(self);
                    }
                }
            };
            xhr.onerror = function () {
                Logger.logMessage(Logger.LEVEL_WARNING, "PyramidMetaData", "load", "Document retrieval failed. " + " " + self.url);
            };
            xhr.ontimeout = function () {
                Logger.logMessage(Logger.LEVEL_WARNING, "PyramidMetaData", "load", "Document retrieval timed out. " + " " + self.url);
            };
            xhr.send(null);
        };

        PyramidMetaData.prototype.getDisplayName = function () {
            return this.displayName;
        };

        PyramidMetaData.prototype.getSector = function () {
            return this.sector;
        };

        PyramidMetaData.prototype.getLevelZeroTileDelta = function () {
            return this.levelZeroTileDelta;
        };

        PyramidMetaData.prototype.getLevelCount = function () {
            return this.levelCount;
        };

        PyramidMetaData.prototype.getImageFormat = function () {
            return this.imageFormat;
        };

        PyramidMetaData.prototype.getTileWidth = function () {
            return this.tileWidth;
        };

        PyramidMetaData.prototype.getTileHeight = function () {
            return this.tileHeight;
        };

        PyramidMetaData.prototype.getTileOrigin = function () {
            return this.tileOrigin;
        };

        return PyramidMetaData;
    });