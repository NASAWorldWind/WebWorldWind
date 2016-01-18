/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports GeoTiffReader
 */
define([
        '../../error/AbstractError',
        '../../error/ArgumentError',
        './GeoTiff',
        './GeoTiffKeyEntry',
        './GeoTiffMetadata',
        './GeoTiffUtil',
        '../../geom/Location',
        '../../util/Logger',
        '../../util/proj4-src',
        './Tiff',
        './TiffIFDEntry'
    ],
    function (AbstractError,
              ArgumentError,
              GeoTiff,
              GeoTiffKeyEntry,
              GeoTiffMetadata,
              GeoTiffUtil,
              Location,
              Logger,
              Proj4,
              Tiff,
              TiffIFDEntry) {
        "use strict";

        /**
         * Constructs a geotiff reader object for a specified geotiff URL.
         * Call [readAsImage]{@link GeoTiffReader#readAsImage} to retrieve the image as a canvas or
         * [readAsData]{@link GeoTiffReader#readAsData} to retrieve the elevaton as an array of elevation values.
         * @alias GeoTiffReader
         * @constructor
         * @classdesc Parses a geotiff and creates an image or an elevation array representing its contents.
         * @param {String} url The location of the geotiff.
         * @throws {ArgumentError} If the specified URL is null or undefined.
         */
        var GeoTiffReader = function (url) {
            if (!url) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "constructor", "missingUrl"));
            }

            // Documented in defineProperties below.
            this._url = url;

            // Documented in defineProperties below.
            this._isLittleEndian = false;

            // Documented in defineProperties below.
            this._imageFileDirectories = [];

            // Documented in defineProperties below.
            this._geoTiffData = null;

            // Documented in defineProperties below.
            this._metadata = new GeoTiffMetadata();

            // Documented in defineProperties below.
            this._geoKeys = [];
        };

        Object.defineProperties(GeoTiffReader.prototype, {

            /**
             * The geotiff URL as specified to this GeoTiffReader's constructor.
             * @memberof GeoTiffReader.prototype
             * @type {String}
             * @readonly
             */
            url: {
                get: function () {
                    return this._url;
                }
            },

            /**
             *Indicates whether the geotiff byte order is little endian..
             * @memberof GeoTiffReader.prototype
             * @type {Boolean}
             * @readonly
             */
            isLittleEndian: {
                get: function () {
                    return this._isLittleEndian;
                }
            },

            /**
             * An array containing all the image file directories of the geotiff file.
             * @memberof GeoTiffReader.prototype
             * @type {TiffIFDEntry[]}
             * @readonly
             */
            imageFileDirectories: {
                get: function () {
                    return this._imageFileDirectories;
                }
            },

            /**
             * The buffer descriptor of the geotiff file's content.
             * @memberof GeoTiffReader.prototype
             * @type {ArrayBuffer}
             * @readonly
             */
            geoTiffData: {
                get: function () {
                    return this._geoTiffData;
                }
            },

            /**
             * An objct containing all tiff and geotiff metadata of the geotiff file.
             * @memberof GeoTiffReader.prototype
             * @type {Object}
             * @readonly
             */
            metadata: {
                get: function () {
                    return this._metadata;
                }
            },

            /**
             * An array containing the GeoKeys of the geotiff file.
             * @memberof GeoTiffReader.prototype
             * @type {GeoTiffKeyEntry[]}
             * @readonly
             */
            geoKeys: {
                get: function () {
                    return this._geoKeys;
                }
            }
        });

        // Get geotiff file as an array buffer using XMLHttpRequest. Internal use only.
        GeoTiffReader.prototype.requestUrl = function (url, callback) {
            var xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onreadystatechange = (function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var arrayBuffer = xhr.response;
                        if (arrayBuffer) {
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

        // Parse geotiff file. Internal use only
        GeoTiffReader.prototype.parse = function (arrayBuffer) {
            this._geoTiffData = new DataView(arrayBuffer);
            this.getEndianness();

            if (!this.isTiffFileType()) {
                throw new AbstractError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "parse", "invalidTiffFileType"));
            }

            var firstIFDOffset = GeoTiffUtil.getBytes(this.geoTiffData, 4, 4, this.isLittleEndian);

            this.parseImageFileDirectory(firstIFDOffset);
            this.getMetadataFromImageFileDirectory();
            this.parseGeoKeys();
            this.getMetadataFromGeoKeys();
            this.getBBox(this.metadata.tiff['IMAGE_LENGTH'], this.metadata.tiff['IMAGE_WIDTH']);

            console.log("Is GeoTiff: " + this.isGeoTiff());

            console.log("Metadata: ");
            console.log(this.metadata);
        };

        // Get byte order of the geotiff file. Internal use only.
        GeoTiffReader.prototype.getEndianness = function () {
            var byteOrderValue = GeoTiffUtil.getBytes(this.geoTiffData, 0, 2, this.isLittleEndian);
            if (byteOrderValue === 0x4949) {
                this._isLittleEndian = true;
            }
            else if (byteOrderValue === 0x4D4D) {
                this._isLittleEndian = false;
            }
            else {
                throw new AbstractError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "getEndianness", "invalidByteOrderValue"));
            }
        };

        /**
         * Indicates whether this geotiff is a tiff file type.
         *
         * @return {Boolean} True if this geotiff file is a tiff file type.
         */
        GeoTiffReader.prototype.isTiffFileType = function () {
            var fileTypeValue = GeoTiffUtil.getBytes(this.geoTiffData, 2, 2, this.isLittleEndian);
            if (fileTypeValue === 42) {
                return true;
            }
            else {
                return false;
            }
        };

        /**
         * Indicates whether this geotiff is a geotiff file type.
         *
         * @return {Boolean} True if this geotiff file is a geotiff file type.
         */
        GeoTiffReader.prototype.isGeoTiff = function () {
            if (this.getIFDByTag(GeoTiff.Tag.GEO_KEY_DIRECTORY)) {
                return true;
            }
            else {
                return false;
            }
        };

        /**
         * Retrieve the image as a canvas from a geotiff file.
         *
         * @return {Canvas} A canvas representing the geotiff image.
         */
        GeoTiffReader.prototype.readAsImage = function (callback) {
            this.requestUrl(this.url, (function () {
                var bitsPerSample = this.metadata.tiff['BITS_PER_SAMPLE'];
                var samplesPerPixel = this.metadata.tiff['SAMPLES_PER_PIXEL'][0];

                if (this.metadata.tiff['STRIP_OFFSETS']){
                    var strips = this.parseStrips();

                    var imageLength = this.metadata.tiff['IMAGE_LENGTH'][0];
                    var imageWidth = this.metadata.tiff['IMAGE_WIDTH'][0];
                    if (this.metadata.tiff['ROWS_PER_STRIP']) {
                        var rowsPerStrip = this.metadata.tiff['ROWS_PER_STRIP'][0];
                    } else {
                        var rowsPerStrip = imageLength;
                    }

                    var photometricInterpretation = this.metadata.tiff['PHOTOMETRIC_INTERPRETATION'][0];

                    var canvas = document.createElement('canvas');
                    canvas.width = this.metadata.tiff['IMAGE_WIDTH'][0];
                    canvas.height = this.metadata.tiff['IMAGE_LENGTH'][0];
                    var ctx = canvas.getContext("2d");

                    var numOfStrips = strips.length;
                    var numRowsInPreviousStrip = 0;
                    var numRowsInStrip = rowsPerStrip;
                    var imageLengthModRowsPerStrip = imageLength % rowsPerStrip;
                    var rowsInLastStrip = (imageLengthModRowsPerStrip === 0) ? rowsPerStrip :
                        imageLengthModRowsPerStrip;

                    for (var i=0; i < numOfStrips; i++){

                        if ((i + 1) === numOfStrips) {
                            numRowsInStrip = rowsInLastStrip;
                        }

                        var numOfPixels = strips[i].length;
                        var yPadding = numRowsInPreviousStrip * i;

                        for(var y= 0, j=0; y < numRowsInStrip, j < numOfPixels; y++){
                            for (var x=0; x < imageWidth; x++, j++ ){
                                var pixelSamples = strips[i][j];

                                var red = 0.0;
                                var green = 0.0;
                                var blue = 0.0;
                                var opacity = 1.0;

                                switch (photometricInterpretation){
                                    case Tiff.PhotometricInterpretation.WHITE_IS_ZERO:
                                        //todo
                                        console.log("Photometric interpretation: WHITE_IS_ZERO");
                                        break;
                                    case Tiff.PhotometricInterpretation.BLACK_IS_ZERO:
                                        red = green = blue =  GeoTiffUtil.clampColorSample(
                                            pixelSamples[0],
                                            bitsPerSample[0]);
                                        break;
                                    case Tiff.PhotometricInterpretation.RGB:
                                        red = GeoTiffUtil.clampColorSample(pixelSamples[0], bitsPerSample[0]);
                                        green = GeoTiffUtil.clampColorSample(pixelSamples[1], bitsPerSample[1]);
                                        blue = GeoTiffUtil.clampColorSample(pixelSamples[2], bitsPerSample[2]);

                                        if(samplesPerPixel === 4){
                                            var maxValue = Math.pow(2, bitsPerSample[3]);
                                            opacity = pixelSamples[3] / maxValue;
                                        }
                                        break;
                                    case Tiff.PhotometricInterpretation.RGB_PALETTE:
                                        //todo
                                        console.log("Photometric interpretation: RGB_PALETTE");
                                        break;
                                    case Tiff.PhotometricInterpretation.TRANSPARENCY_MASK:
                                        //todo
                                        console.log("Photometric interpretation: TRANSPARENCY_MASK");
                                        break;
                                    case Tiff.PhotometricInterpretation.CMYK:
                                        //todo
                                        console.log("Photometric interpretation: CMYK");
                                        break;
                                    case Tiff.PhotometricInterpretation.Y_Cb_Cr:
                                        //todo
                                        console.log("Photometric interpretation: Y_Cb_Cr");
                                        break;
                                    case Tiff.PhotometricInterpretation.CIE_LAB:
                                        //todo
                                        console.log("Photometric interpretation: CIE_LAB");
                                        break;
                                    default:
                                        console.log("Unknown photometric interpretation: " + photometricInterpretation);
                                        break;

                                }

                                ctx.fillStyle = GeoTiffUtil.getRGBAFillValue(red, green, blue, opacity);
                                ctx.fillRect(x, yPadding + y, 1,1);
                            }
                        }

                        numRowsInPreviousStrip = rowsPerStrip;
                    }

                    //callback(GeoTiffUtil.canvasToTiffImage(canvas));
                    callback(canvas);
                }
                else if (this.metadata.tiff['TILES_OFFSETS']){
                    this.parseTiles();
                }
            }).bind(this));
        };

        /**
         * Retrieve the elevation data as an array of elevations.
         *
         * @return {Number[]} An array containing geotiff's elevation data.
         */
        GeoTiffReader.prototype.readAsData = function () {
            this.requestUrl(this.url, (function () {
                //TODO read as data
            }));
        };

        // Parse geotiff strips. Internal use only
        GeoTiffReader.prototype.parseStrips = function(){
            var samplesPerPixel = this.metadata.tiff['SAMPLES_PER_PIXEL'][0];
            var bitsPerSample = this.metadata.tiff['BITS_PER_SAMPLE'];
            var stripOffsets = this.metadata.tiff['STRIP_OFFSETS'];
            var stripByteCounts = this.metadata.tiff['STRIP_BYTE_COUNTS'];
            var compression = this.metadata.tiff['COMPRESSION'][0];
            var sampleFormat = this.metadata.tiff['SAMPLE_FORMAT'];

            var bitsPerPixel = samplesPerPixel * bitsPerSample[0];
            var bytesPerPixel = bitsPerPixel / 8;

            var strips = [];
            // Loop through strips
            for (var i = 0; i < stripOffsets.length; i++) {
                var stripOffset = stripOffsets[i];
                strips[i] = [];
                var stripByteCount = stripByteCounts[i];

                    switch (compression) {
                        case Tiff.Compression.UNCOMPRESSED:
                            // Loop through pixels.
                            for (var byteOffset = 0, increment = bytesPerPixel;
                                 byteOffset < stripByteCount; byteOffset += increment) {
                                // Loop through samples (sub-pixels).
                                    for (var m = 0, pixel = []; m < samplesPerPixel; m++) {
                                        var bytesPerSample = bitsPerSample[m] / 8;
                                        var sampleOffset = m * bytesPerSample;

                                        pixel.push(GeoTiffUtil.getSampleBytes(
                                            this.geoTiffData,
                                            stripOffset + byteOffset + sampleOffset,
                                            bytesPerSample,
                                            sampleFormat[m],
                                            this.isLittleEndian));
                                    }
                                    strips[i].push(pixel);
                            }
                            break;
                        case Tiff.Compression.CCITT_1D:
                            //todo
                            console.log("Compression type: CCITT_1D");
                            break;
                        case Tiff.Compression.GROUP_3_FAX:
                            //todo
                            console.log("Compression type: GROUP_3_FAX");
                            break;
                        case Tiff.Compression.GROUP_4_FAX:
                            //todo
                            console.log("Compression type: GROUP_4_FAX");
                            break;
                        case Tiff.Compression.LZW:
                            //todo
                            console.log("Compression type: LZW");
                            break;
                        case Tiff.Compression.JPEG:
                            //todo
                            console.log("Compression type: JPEG");
                            break;
                        case Tiff.Compression.PACK_BITS:
                            //todo
                            console.log("Compression type: PACK_BITS");
                            break;
                        default:
                            console.log("Unknown compression type: " + compression);
                            break;
                    }
            }

            return strips;
        }

        // Parse geotiff tiles. Internal use only
        GeoTiffReader.prototype.parseTiles = function(){
            //todo
        }

        // Translate a pixel/line coordinates to projection coordinate. Interna use only.
        GeoTiffReader.prototype.geoTiffImageToPCS = function (xValue, yValue) {
            if (xValue === null || xValue === undefined) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "geoTiffImageToPCS", "missingXValue"));
            }
            if (yValue === null || yValue === undefined) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "geoTiffImageToPCS", "missingYValue"));
            }

            var res = [xValue, yValue];

            var tiePointValues = this.metadata.geotiff['MODEL_TIEPOINT'];
            var modelPixelScaleValues = this.metadata.geotiff['MODEL_PIXEL_SCALE'];
            var modelTransformationValues = this.metadata.geotiff['MODEL_TRANSFORMATION'];

            var tiePointCount = tiePointValues ? tiePointValues.length : 0;
            var modelPixelScaleCount = modelPixelScaleValues ? modelPixelScaleValues.length : 0;
            var modelTransformationCount = modelTransformationValues ? modelTransformationValues.length : 0;

            if (tiePointCount > 6 && modelPixelScaleCount === 0){
                //todo
            }
            else if (modelTransformationCount === 16) {
                var x_in = xValue;
                var y_in = yValue;

                xValue = x_in * modelTransformationValues[0] + y_in * modelTransformationValues[1] +
                    modelTransformationValues[3];
                yValue = x_in * modelTransformationValues[4] + y_in * modelTransformationValues[5] +
                    modelTransformationValues[7];

                res = [xValue, yValue];
            }
            else if (modelPixelScaleCount < 3 || tiePointCount < 6){
                res = [xValue, yValue];
            }
            else {
                xValue = (xValue - tiePointValues[0]) * modelPixelScaleValues[0] + tiePointValues[3];
                yValue = (yValue - tiePointValues[1]) * (-1 *  modelPixelScaleValues[1]) + tiePointValues[4];

                res = [xValue, yValue];
            }

            Proj4.defs([
                [
                    'EPSG:26771',
                    '+proj=tmerc +lat_0=36.66666666666666 +lon_0=-88.33333333333333 +k=0.9999749999999999 +' +
                    'x_0=152400.3048006096 +y_0=0 +ellps=clrk66 +datum=NAD27 +to_meter=0.3048006096012192 +no_defs '
                ],
                [
                    'EPSG:32633',
                    '+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs'
                ]
            ]);

            if (this.metadata.geotiff.geoKeys['ProjectedCSTypeGeoKey']){
                res = Proj4('EPSG:' + this.metadata.geotiff.geoKeys['ProjectedCSTypeGeoKey'], 'EPSG:4326', res);
            }

            return new Location(res[1], res[0]);
        };

        /**
         * Get the bounding box of the geotiff file.
         *
         * @return {Object} An object containing the bounding box having attributes: upperLeft, upperRight,
         * lowerLeft, lowerRight.
         * @param {Number} imageLength The length of the image in pixels.
         * @param {Number} imageWidth The width of the image in pixels.
         * @throws {ArgumentError} If the specified imageLength or  imageWidth are null or undefined.
         */
        GeoTiffReader.prototype.getBBox = function (imageLength, imageWidth) {
            if (!imageLength) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "setBbox", "missingImageLength"));
            }

            if (!imageWidth) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "setBbox", "missingImageWidth"));
            }

            this.metadata.geotiff.bbox.upperLeft = this.geoTiffImageToPCS(0, 0);
            this.metadata.geotiff.bbox.upperRight = this.geoTiffImageToPCS(imageWidth, 0);
            this.metadata.geotiff.bbox.lowerLeft = this.geoTiffImageToPCS(0, imageLength);
            this.metadata.geotiff.bbox.lowerRight = this.geoTiffImageToPCS(imageWidth, imageLength);
        }

        // Get metadata from image file directory. Internal use only.
        GeoTiffReader.prototype.getMetadataFromImageFileDirectory = function () {
            for (var i = 0; i < this.imageFileDirectories[0].length; i++) {

                var tagAsString = GeoTiffUtil.getTagValueAsString(Tiff.Tag, this.imageFileDirectories[0][i].tag);

                if (tagAsString){
                    this._metadata.tiff[tagAsString] =
                        this.imageFileDirectories[0][i].getIFDEntryValue();
                }
                else{
                    tagAsString = GeoTiffUtil.getTagValueAsString(GeoTiff.Tag, this.imageFileDirectories[0][i].tag);
                    if (tagAsString){
                        this._metadata.geotiff[tagAsString] =
                            this.imageFileDirectories[0][i].getIFDEntryValue();
                    }
                    else{
                        console.log("Unknown GeoTiff tag: " + this.imageFileDirectories[0][i].tag);
                        //throw new AbstractError(
                            //Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader",
                            // "getMetadataFromImageFileDirectory", "invalidGeoTiffTag"));
                    }
                }
            }
        }

        // Get metadata from GeoKeys. Internal use only.
        GeoTiffReader.prototype.getMetadataFromGeoKeys = function () {
            for (var i = 0; i < this.geoKeys.length; i++) {
                var keyAsString = GeoTiffUtil.getTagValueAsString(GeoTiff.Key, this.geoKeys[i].keyId);

                if (keyAsString){
                    this._metadata.geotiff.geoKeys[keyAsString] = this.geoKeys[i].getGeoKeyValue(
                        this.metadata.geotiff['GEO_DOUBLE_PARAMS'],
                        this.metadata.geotiff['GEO_ASCII_PARAMS']);
                }
                else{
                    console.log("Unknown GeoTiff key: " + this.imageFileDirectories[0][i].tag);
                    //throw new AbstractError(
                    //            Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader",
                    // "getMetadataFromGeoKeys", "invalidGeoTiffKey"));
                }
            }
        }

        // Parse GeoKeys. Internal use only.
        GeoTiffReader.prototype.parseGeoKeys = function () {
            if (!this.isGeoTiff()) {
                throw new AbstractError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "parse", "invalidGeoTiffFile"));
            }

            var geoKeyDirectory = this.metadata.geotiff['GEO_KEY_DIRECTORY'];
            if (geoKeyDirectory){
                var keyDirectoryVersion = geoKeyDirectory[0];
                var keyRevision = geoKeyDirectory[1];
                var minorRevision = geoKeyDirectory[2];
                var numberOfKeys = geoKeyDirectory[3];

                for (var i=0; i < numberOfKeys; i++){
                    var keyId = geoKeyDirectory[4 + i*4];
                    var tiffTagLocation = geoKeyDirectory[5 + i*4];
                    var count = geoKeyDirectory[6 + i*4];
                    var valueOffset = geoKeyDirectory[7 + i*4];

                    this._geoKeys.push(new GeoTiffKeyEntry(keyId, tiffTagLocation, count, valueOffset));
                }
            }
            else{
                throw new AbstractError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "parseGeoKeys",
                        "missingGeoKeyDirectoryTag"));
            }
        };

        // Parse image file directory. Internal use only.
        GeoTiffReader.prototype.parseImageFileDirectory = function (offset) {
            if (!offset) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "parseImageFileDirectory",
                        "missingOffset"));
            }

            var noOfDirectoryEntries = GeoTiffUtil.getBytes(this.geoTiffData, offset, 2, this.isLittleEndian);

            var directoryEntries = [];

            for (var i = offset + 2, directoryEntryCounter = 0; directoryEntryCounter < noOfDirectoryEntries;
                 i += 12, directoryEntryCounter++) {
                var tag = GeoTiffUtil.getBytes(this.geoTiffData, i, 2, this.isLittleEndian);
                var type = GeoTiffUtil.getBytes(this.geoTiffData, i + 2, 2, this.isLittleEndian);
                var count = GeoTiffUtil.getBytes(this.geoTiffData, i + 4, 4, this.isLittleEndian);
                var valueOffset = GeoTiffUtil.getBytes(this.geoTiffData, i + 8, 4, this.isLittleEndian);

                directoryEntries.push(new TiffIFDEntry(
                    tag,
                    type,
                    count,
                    valueOffset,
                    this.geoTiffData,
                    this.isLittleEndian));
            }

            this._imageFileDirectories.push(directoryEntries);

            var nextIFDOffset = GeoTiffUtil.getBytes(this.geoTiffData, i, 4, this.isLittleEndian);

            if (nextIFDOffset === 0) {
                return;
            }
            else {
                this.parseImageFileDirectory(nextIFDOffset);
            }
        };

        // Get image file directory by tag value. Internal use only.
        GeoTiffReader.prototype.getIFDByTag = function (tag) {
            if (!tag) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "getIFDByTag", "missingTag"));
            }

            for (var i = 0; i < this.imageFileDirectories[0].length; i++) {
                if (this.imageFileDirectories[0][i].tag === tag) {
                    return this.imageFileDirectories[0][i];
                }
            }

            return null;
        }

        return GeoTiffReader;
    }
);