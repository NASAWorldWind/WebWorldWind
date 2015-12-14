/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports GeoTiffReader
 */
define(['../../error/AbstractError',
        '../../error/ArgumentError',
        './GeoTiff',
        './GeoTiffUtil',
        '../../util/Logger',
        './Tiff',
        './TiffIFDEntry'
    ],
    function (AbstractError,
              ArgumentError,
              GeoTiff,
              GeoTiffUtil,
              Logger,
              Tiff,
              TiffIFDEntry
              ) {
        "use strict";

        var GeoTiffReader = function (url) {
            if (!url) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "constructor", "missingUrl"));
            }

            this._isLittleEndian = false;

            this._layer = null;

            this._url = url;

            this._geoTiffData = null;

            this._imageFileDirectories = [];

            this._imageWidth = null;

            this._imageLength = null;

            this._bitsPerSample = null;

            this._compression = null;

            this._photometricInterpretation = null;

            this._samplesPerPixel = null;

            this._planarConfiguration = null;

            this._artist = null;

            this._software = null;

            this._dateTime = null;

            this._xResolution = null;

            this._yResolution = null;

            this._resolutionUnit= null;

            this._orientation = null;

            this._rowsPerStrip = null;

            this._stripByteCounts = null;

            this._stripOffsets = null;

            this._fillOrder = null;

            this._newSubfileType = null;

            this._sampleFormat = null;

            this._colorMap = null;

        };

        Object.defineProperties(GeoTiffReader.prototype, {

            isLittleEndian: {
                get: function () {
                    return this._isLittleEndian;
                }
            },

            layer: {
                get: function () {
                    return this._layer;
                }
            },

            url: {
                get: function () {
                    return this._url;
                }
            },

            geoTiffData: {
                get: function () {
                    return this._geoTiffData;
                }
            },

            imageFileDirectories: {
                get: function () {
                    return this._imageFileDirectories;
                }
            },

            imageWidth: {
                get: function () {
                    return this._imageWidth;
                }
            },

            imageLength: {
                get: function () {
                    return this._imageLength;
                }
            },

            bitsPerSample: {
                get: function () {
                    return this._bitsPerSample;
                }
            },

            compression: {
                get: function () {
                    return this._compression;
                }
            },

            photometricInterpretation: {
                get: function () {
                    return this._photometricInterpretation;
                }
            },

            samplesPerPixel: {
                get: function () {
                    return this._samplesPerPixel;
                }
            },

            planarConfiguration: {
                get: function () {
                    return this._planarConfiguration;
                }
            },

            artist: {
                get: function () {
                    return this._artist;
                }
            },

            software: {
                get: function () {
                    return this._software;
                }
            },

            dateTime: {
                get: function () {
                    return this._dateTime;
                }
            },

            xResolution: {
                get: function () {
                    return this._xResolution;
                }
            },

            yResolution: {
                get: function () {
                    return this._yResolution;
                }
            },

            resolutionUnit: {
                get: function () {
                    return this._resolutionUnit;
                }
            },

            orientation: {
                get: function () {
                    return this._orientation;
                }
            },

            rowsPerStrip: {
                get: function () {
                    return this._rowsPerStrip;
                }
            },

            stripByteCounts: {
                get: function () {
                    return this._stripByteCounts;
                }
            },

            stripOffsets: {
                get: function () {
                    return this._stripOffsets;
                }
            },

            fillOrder: {
                get: function () {
                    return this._fillOrder;
                }
            },

            newSubfileType: {
                get: function () {
                    return this._newSubfileType;
                }
            },

            sampleFormat: {
                get: function () {
                    return this._sampleFormat;
                }
            },

            colorMap: {
                get: function () {
                    return this._colorMap;
                }
            }
        });

        GeoTiffReader.prototype.readAsImage = function (callback) {
            this.requestUrl(this.url, (function(){

                var canvas = document.createElement('canvas');
                canvas.width = this.imageWidth[0];
                canvas.height = this.imageLength[0];

                var ctx = canvas.getContext("2d");
                ctx.rect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle="red";
                ctx.fill();

                callback(GeoTiffUtil.canvasToTiffImage(canvas));
            }).bind(this));
        };

        GeoTiffReader.prototype.readAsData = function () {
            this.requestUrl(this.url);
        };

        //GeoTiffReader.prototype.load = function (layer) {
        //    this._layer = layer || new RenderableLayer();
        //    this.requestUrl(this.url);
        //};

        GeoTiffReader.prototype.requestUrl = function (url, callback) {
            var xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onreadystatechange = (function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var arrayBuffer = xhr.response;
                        if(arrayBuffer){
                            this.parse(arrayBuffer);
                            callback();
                        }
                    }
                    else {
                        Logger.log(Logger.LEVEL_WARNING,
                            "GeoTiff retrieval failed (" + xhr.statusText + "): " + url);
                    }
                }
            }).bind(this);

            xhr.onerror = function () {
                Logger.log(Logger.LEVEL_WARNING, "GeoTiff retrieval failed: " + url);
            };

            xhr.ontimeout = function () {
                Logger.log(Logger.LEVEL_WARNING, "GeoTiff retrieval timed out: " + url);
            };

            xhr.send(null);
        };

        GeoTiffReader.prototype.parse = function (arrayBuffer) {
            this._geoTiffData = new DataView(arrayBuffer);
            this.setEndianness();
            //console.log("Is little endian:" + this.isLittleEndian);

            if (!this.isTiffFileType()){
                throw new AbstractError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "parse", "invalidTiffFileType"));
            }

            var firstIFDOffset = GeoTiffUtil.getBytes(this.geoTiffData, 4, 4, this.isLittleEndian);
            //console.log("First IFD offset: " + firstIFDOffset);

            this.parseImageFileDirectory(firstIFDOffset);

            console.log("*****")
            console.log("Is GeoTiff: " + this.isGeoTiff());


            this._imageWidth = this.getIFDByTag(Tiff.Tag.IMAGE_WIDTH).getIFDEntryValue(this.isLittleEndian);
            this._imageLength = this.getIFDByTag(Tiff.Tag.IMAGE_LENGTH).getIFDEntryValue(this.isLittleEndian);
            this._bitsPerSample = this.getIFDByTag(Tiff.Tag.BITS_PER_SAMPLE).getIFDEntryValue(this.isLittleEndian);
            this._compression = this.getIFDByTag(Tiff.Tag.COMPRESSION).getIFDEntryValue(this.isLittleEndian);
            this._photometricInterpretation = this.getIFDByTag(Tiff.Tag.PHOTOMETRIC_INTERPRETATION).getIFDEntryValue(this.isLittleEndian);
            this._samplesPerPixel = this.getIFDByTag(Tiff.Tag.SAMPLES_PER_PIXEL).getIFDEntryValue(this.isLittleEndian);
            this._planarConfiguration = this.getIFDByTag(Tiff.Tag.PLANAR_CONFIGURATION).getIFDEntryValue(this.isLittleEndian);
            this._artist = this.getIFDByTag(Tiff.Tag.ARTIST).getIFDEntryValue(this.isLittleEndian);
            this._software = this.getIFDByTag(Tiff.Tag.SOFTWARE).getIFDEntryValue(this.isLittleEndian);
            this._dateTime = this.getIFDByTag(Tiff.Tag.DATE_TIME).getIFDEntryValue(this.isLittleEndian);
            this._xResolution = this.getIFDByTag(Tiff.Tag.X_RESOLUTION).getIFDEntryValue(this.isLittleEndian);
            this._yResolution = this.getIFDByTag(Tiff.Tag.Y_RESOLUTION).getIFDEntryValue(this.isLittleEndian);
            this._resolutionUnit = this.getIFDByTag(Tiff.Tag.RESOLUTION_UNIT).getIFDEntryValue(this.isLittleEndian);
            this._orientation = this.getIFDByTag(Tiff.Tag.ORIENTATION).getIFDEntryValue(this.isLittleEndian);
            this._rowsPerStrip = this.getIFDByTag(Tiff.Tag.ROWS_PER_STRIP).getIFDEntryValue(this.isLittleEndian);
            this._stripByteCounts = this.getIFDByTag(Tiff.Tag.STRIP_BYTE_COUNTS).getIFDEntryValue(this.isLittleEndian);
            this._stripOffsets = this.getIFDByTag(Tiff.Tag.STRIP_OFFSETS).getIFDEntryValue(this.isLittleEndian);
            this._fillOrder = this.getIFDByTag(Tiff.Tag.FILL_ORDER).getIFDEntryValue(this.isLittleEndian);
            this._newSubfileType = this.getIFDByTag(Tiff.Tag.NEW_SUBFILE_TYPE).getIFDEntryValue(this.isLittleEndian);

            if (this.getIFDByTag(Tiff.Tag.SAMPLE_FORMAT)){
                this._sampleFormat = this.getIFDByTag(Tiff.Tag.SAMPLE_FORMAT).getIFDEntryValue(this.isLittleEndian);
            }
            else{
                this._sampleFormat = Tiff.SampleFormat.DEFAULT;
            }

            this._colorMap = this.getIFDByTag(Tiff.Tag.COLOR_MAP).getIFDEntryValue(this.isLittleEndian);

            console.log("Image width: " + this.imageWidth);
            console.log("Image length: " + this.imageLength);
            console.log("Bits per sample: " + this.bitsPerSample);
            console.log("Compression: " + Tiff.getTagValueAsString(Tiff.Compression, this.compression[0]));
            console.log("Photometric interpretation: " + Tiff.getTagValueAsString(Tiff.PhotometricInterpretation, this.photometricInterpretation[0]));
            console.log("Samples per pixel: " + this.samplesPerPixel);
            console.log("Planar configuration: " + Tiff.getTagValueAsString(Tiff.PlanarConfiguration, this.planarConfiguration[0]));
            console.log("Artist: " + this.artist);
            console.log("Software: " + this.software);
            console.log("Date time: " + this.dateTime);
            console.log("X resolution: " + this.xResolution);
            console.log("Y resolution: " + this.yResolution);
            console.log("Resolution unit: " + Tiff.getTagValueAsString(Tiff.ResolutionUnit, this.resolutionUnit[0]));
            console.log("Orientation: " + Tiff.getTagValueAsString(Tiff.Orientation, this.orientation[0]));
            console.log("Rows per strip: " + this.rowsPerStrip);
            console.log("Strip byte counts:");
            console.log(this.stripByteCounts);
            console.log("Strip offsets:");
            console.log(this.stripOffsets);
            console.log("Fill order: " + this.fillOrder);
            console.log("New subfile type: " + this.newSubfileType);
            console.log("Sample format: " + this.sampleFormat);
            console.log("Color map:");
            console.log(this.colorMap);
        };

        GeoTiffReader.prototype.setEndianness = function () {
            var byteOrderValue = GeoTiffUtil.getBytes(this.geoTiffData, 0, 2, this.isLittleEndian);
            if (byteOrderValue === 0x4949){
                this._isLittleEndian = true;
            }
            else if (byteOrderValue === 0x4D4D){
                this._isLittleEndian = false;
            }
            else{
                throw new AbstractError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "setEndianness", "invalidByteOrderValue"));
            }
        };

        GeoTiffReader.prototype.isTiffFileType = function () {
            var fileTypeValue = GeoTiffUtil.getBytes(this.geoTiffData, 2, 2, this.isLittleEndian);
            if (fileTypeValue === 42){
                return true;
            }
            else{
                return false;
            }
        };

        GeoTiffReader.prototype.isGeoTiff = function () {
            if(this.getIFDByTag(GeoTiff.Tag.GEO_KEY_DIRECTORY)){
                return true;
            }
            else{
                return false;
            }
        };

        GeoTiffReader.prototype.parseImageFileDirectory = function (offset) {
            if (!offset) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "parseImageFileDirectory", "missingOffset"));
            }

            var noOfDirectoryEntries = GeoTiffUtil.getBytes(this.geoTiffData, offset, 2, this.isLittleEndian);
            //console.log("No of directory entries: " + noOfDirectoryEntries);

            var directoryEntries = [];

            for (var i = offset + 2, directoryEntryCounter = 0; directoryEntryCounter < noOfDirectoryEntries; i += 12, directoryEntryCounter++){
                var tag = GeoTiffUtil.getBytes(this.geoTiffData, i, 2, this.isLittleEndian);
                var type = GeoTiffUtil.getBytes(this.geoTiffData, i + 2, 2, this.isLittleEndian);
                var count = GeoTiffUtil.getBytes(this.geoTiffData, i + 4, 4, this.isLittleEndian);
                var valueOffset = GeoTiffUtil.getBytes(this.geoTiffData, i + 8, 4, this.isLittleEndian);

                //console.log("Tag: " + Tiff.getTagString(tag));
                //console.log("Type: " + type);
                //console.log("Count: " + count);
                //console.log("Value Offset:" + valueOffset);

                directoryEntries.push(new TiffIFDEntry(tag, type, count, valueOffset, this.geoTiffData, this.isLittleEndian));
            }

            this._imageFileDirectories.push(directoryEntries);

            var nextIFDOffset = GeoTiffUtil.getBytes(this.geoTiffData, i, 4, this.isLittleEndian);

            if (nextIFDOffset === 0){
                return;
            }
            else{
                this.parseImageFileDirectory(nextIFDOffset);
            }
        };

        GeoTiffReader.prototype.getIFDByTag = function(tag){
            if (!tag) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "getIFDByTag", "missingTag"));
            }

            for (var i = 0; i <  this.imageFileDirectories[0].length; i++){
                if (this.imageFileDirectories[0][i].tag === tag){
                    return this.imageFileDirectories[0][i];
                }
            }

            return null;
        }

        return GeoTiffReader;
    }
);
