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
        './GeoTiffConstants',
        './GeoTiffKeyEntry',
        './GeoTiffMetadata',
        './GeoTiffUtil',
        '../../geom/Location',
        '../../geom/Sector',
        '../../util/Logger',
        '../../util/proj4-src',
        './TiffConstants',
        './TiffIFDEntry'
    ],
    function (AbstractError,
              ArgumentError,
              GeoTiffConstants,
              GeoTiffKeyEntry,
              GeoTiffMetadata,
              GeoTiffUtil,
              Location,
              Sector,
              Logger,
              Proj4,
              TiffConstants,
              TiffIFDEntry) {
        "use strict";

        /**
         * Constructs a geotiff reader object for a specified geotiff URL.
         * Call [readAsImage]{@link GeoTiffReader#readAsImage} to retrieve the image as a canvas or
         * [readAsData]{@link GeoTiffReader#readAsData} to retrieve the elevations as an array of elevation values.
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
             * @type {GeoTiffMetadata}
             * @readonly
             */
            metadata: {
                get: function () {
                    return this._metadata;
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
            this.setBBox();
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
            if (this.getIFDByTag(GeoTiffConstants.Tag.GEO_KEY_DIRECTORY)) {
                return true;
            }
            else {
                return false;
            }
        };

        /**
         * Retrieves the GeoTiff file, parses it and creates a canvas of its content. The canvas is passed
         * to the callback function as a parameter.
         *
         * @param {Function} callback A function called when GeoTiff parsing is complete.
         */
        GeoTiffReader.prototype.readAsImage = function (callback) {
            this.requestUrl(this.url, (function () {
                var bitsPerSample = this.metadata.bitsPerSample;
                var samplesPerPixel = this.metadata.samplesPerPixel;

                if (this.metadata.colorMap){
                    var colorMapValues = this.metadata.colorMap;
                    var colorMapSampleSize = Math.pow(2, bitsPerSample[0]);
                }

                if (this.metadata.stripOffsets){
                    var strips = this.parseStrips(false);

                    var imageLength = this.metadata.imageLength;
                    var imageWidth = this.metadata.imageWidth;
                    if (this.metadata.rowsPerStrip) {
                        var rowsPerStrip = this.metadata.rowsPerStrip;
                    } else {
                        var rowsPerStrip = imageLength;
                    }

                    var photometricInterpretation = this.metadata.photometricInterpretation;

                    var canvas = document.createElement('canvas');
                    canvas.width = this.metadata.imageWidth;
                    canvas.height = this.metadata.imageLength;
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

                                if (this.metadata.noData &&
                                    pixelSamples[0] == this.metadata.noData ){
                                    opacity = 0.0;
                                }

                                switch (photometricInterpretation){
                                    case TiffConstants.PhotometricInterpretation.WHITE_IS_ZERO:
                                        var invertValue = Math.pow(2, bitsPerSample) - 1;
                                        pixelSamples[0] = invertValue - pixelSamples[0];
                                        red = green = blue =  GeoTiffUtil.clampColorSample(
                                                pixelSamples[0],
                                                bitsPerSample[0]);
                                        break;
                                    case TiffConstants.PhotometricInterpretation.BLACK_IS_ZERO:
                                        red = green = blue =  GeoTiffUtil.clampColorSample(
                                                pixelSamples[0],
                                                bitsPerSample[0]);
                                        break;
                                    case TiffConstants.PhotometricInterpretation.RGB:
                                        red = GeoTiffUtil.clampColorSample(pixelSamples[0], bitsPerSample[0]);
                                        green = GeoTiffUtil.clampColorSample(pixelSamples[1], bitsPerSample[1]);
                                        blue = GeoTiffUtil.clampColorSample(pixelSamples[2], bitsPerSample[2]);

                                        if(samplesPerPixel === 4){
                                            var maxValue = Math.pow(2, bitsPerSample[3]);
                                            opacity = pixelSamples[3] / maxValue;
                                        }
                                        break;
                                    case TiffConstants.PhotometricInterpretation.RGB_PALETTE:
                                        if (colorMapValues){
                                            var colorMapIndex = pixelSamples[0];

                                            red = GeoTiffUtil.clampColorSample(colorMapValues[colorMapIndex], bitsPerSample);
                                            green = GeoTiffUtil.clampColorSample(
                                                colorMapValues[colorMapSampleSize + colorMapIndex],
                                                bitsPerSample);
                                            blue = GeoTiffUtil.clampColorSample(
                                                colorMapValues[(2 * colorMapSampleSize) + colorMapIndex],
                                                bitsPerSample);
                                        }
                                        break;
                                    case TiffConstants.PhotometricInterpretation.TRANSPARENCY_MASK:
                                        //todo
                                        Logger.log(Logger.LEVEL_WARNING, "Photometric interpretation not yet " +
                                            "implemented: TRANSPARENCY_MASK");
                                        break;
                                    case TiffConstants.PhotometricInterpretation.CMYK:
                                        //todo
                                        Logger.log(Logger.LEVEL_WARNING, "Photometric interpretation not yet " +
                                            "implemented: CMYK");
                                        break;
                                    case TiffConstants.PhotometricInterpretation.Y_Cb_Cr:
                                        //todo
                                        Logger.log(Logger.LEVEL_WARNING, "Photometric interpretation not yet " +
                                            "implemented: Y_Cb_Cr");
                                        break;
                                    case TiffConstants.PhotometricInterpretation.CIE_LAB:
                                        //todo
                                        Logger.log(Logger.LEVEL_WARNING, "Photometric interpretation not yet " +
                                            "implemented: CIE_LAB");
                                        break;
                                    default:
                                        Logger.log(Logger.LEVEL_WARNING, "Unknown photometric interpretation: " +
                                            photometricInterpretation);
                                        break;

                                }

                                ctx.fillStyle = GeoTiffUtil.getRGBAFillValue(red, green, blue, opacity);
                                ctx.fillRect(x, yPadding + y, 1,1);
                            }
                        }

                        numRowsInPreviousStrip = rowsPerStrip;
                    }

                    //callback(GeoTiffUtil.canvasToTiffImage(canvas));
                    this._geoTiffData = null;
                    callback(canvas);
                }
                else if (this.metadata.tileOffests){
                    this.parseTiles();
                }
            }).bind(this));
        };

        GeoTiffReader.prototype.createTypedElevationArray = function(bitsPerSample, sampleFormat, untypedElevationArray){
            switch(bitsPerSample){
                case 8:
                    if (sampleFormat === TiffConstants.SampleFormat.SIGNED){
                        return new Int8Array(untypedElevationArray);
                    }
                    else{
                        return new Uint8Array(untypedElevationArray);
                    }
                    break
                case 16:
                    if (sampleFormat === TiffConstants.SampleFormat.SIGNED){
                        return new Int16Array(untypedElevationArray);
                    }
                    else{
                        return new Uint16Array(untypedElevationArray);
                    }
                    break;
                case 32:
                    if (sampleFormat === TiffConstants.SampleFormat.SIGNED){
                        return new Int32Array(untypedElevationArray);
                    }
                    else if (sampleFormat === TiffConstants.SampleFormat.IEEE_FLOAT){
                        return new Float32Array(untypedElevationArray);
                    }
                    else {
                        return new Uint32Array(untypedElevationArray);
                    }
                    break;
                default:
                    break;
            }
        }

        /**
         * Retrieves the GeoTiff file, parses it and creates a typed array of its content. The array is passed
         * to the callback function as a parameter.
         *
         * @param {Function} callback A function called when GeoTiff parsing is complete. 
         *
         */
        GeoTiffReader.prototype.readAsData = function (callback) {
            this.requestUrl(this.url, (function () {
                if (this.metadata.stripOffsets) {
                    var strips = this.parseStrips(true);

                    var elevationArray = [];

                    for (var i = 0; i < strips.length; i++ ){
                        elevationArray = elevationArray.concat(strips[i]);
                    }


                    callback(this.createTypedElevationArray(
                        this.metadata.bitsPerSample[0],
                        this.metadata.sampleFormat[0],
                        elevationArray
                    ));
                }
                else if (this.metadata.tilesOffests){
                    this.parseTiles();
                }

            }).bind(this));
        };

        // Parse geotiff strips. Internal use only
        GeoTiffReader.prototype.parseStrips = function(isElevation){
            var samplesPerPixel = this.metadata.samplesPerPixel;
            var bitsPerSample = this.metadata.bitsPerSample;
            var stripOffsets = this.metadata.stripOffsets;
            var stripByteCounts = this.metadata.stripByteCounts;
            var compression = this.metadata.compression;
            if (this.metadata.sampleFormat){
                var sampleFormat = this.metadata.sampleFormat;
            }
            else{
                var sampleFormat = TiffConstants.SampleFormat.UNSIGNED;
            }

            var bitsPerPixel = samplesPerPixel * bitsPerSample[0];
            var bytesPerPixel = bitsPerPixel / 8;

            var strips = [];
            // Loop through strips
            for (var i = 0; i < stripOffsets.length; i++) {
                var stripOffset = stripOffsets[i];
                strips[i] = [];
                var stripByteCount = stripByteCounts[i];

                    switch (compression) {
                        case TiffConstants.Compression.UNCOMPRESSED:
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
                                if (isElevation){
                                    strips[i].push(pixel[0]);
                                }
                                else{
                                    strips[i].push(pixel);
                                }
                            }
                            break;
                        case TiffConstants.Compression.CCITT_1D:
                            //todo
                            Logger.log(Logger.LEVEL_WARNING, "Compression type not yet implemented: CCITT_1D");
                            break;
                        case TiffConstants.Compression.GROUP_3_FAX:
                            //todo
                            Logger.log(Logger.LEVEL_WARNING, "Compression type not yet implemented: GROUP_3_FAX");
                            break;
                        case TiffConstants.Compression.GROUP_4_FAX:
                            //todo
                            Logger.log(Logger.LEVEL_WARNING, "Compression type not yet implemented: GROUP_4_FAX");
                            break;
                        case TiffConstants.Compression.LZW:
                            //todo
                            Logger.log(Logger.LEVEL_WARNING, "Compression type not yet implemented: LZW");
                            break;
                        case TiffConstants.Compression.JPEG:
                            //todo
                            Logger.log(Logger.LEVEL_WARNING, "Compression type not yet implemented: JPEG");
                            break;
                        case TiffConstants.Compression.PACK_BITS:
                            //Loop until you get the number of unpacked bytes you are expecting:
                            //Read the next source byte into n.
                            //If n is between 0 and 127 inclusive, copy the next n+1 bytes literally.
                            //Else if n is between -127 and -1 inclusive, copy the next byte -n+1
                            //times.
                            //    Else if n is -128, noop.
                            //Endloop
                            // Loop through pixels.


                            var newBlock = true;
                            var numOfParsedSamples = 0;
                            var currentSample = 0;
                            var numOfBytes = 0;
                            var pixel = [];
                            var blockLength = 0;
                            var numOfIterations = 0;

                            for (var byteOffset = 0; byteOffset < stripByteCount; byteOffset += 1) {
                                if (newBlock){
                                    blockLength = 1;
                                    numOfIterations = 1;
                                    newBlock = false;

                                    var nextSourceByte = this.geoTiffData.getInt8(stripOffset + byteOffset,
                                        this.isLittleEndian);

                                    if (nextSourceByte >= 0 && nextSourceByte <= 127){
                                        blockLength = nextSourceByte + 1;
                                    }
                                    else if (nextSourceByte >= -127 && nextSourceByte <= -1){
                                        numOfIterations = -nextSourceByte + 1;
                                    }
                                    else{
                                        newBlock = true;
                                    }
                                }
                                else {
                                    var currentByte = GeoTiffUtil.getBytes(this.geoTiffData, stripOffset + byteOffset,
                                        1, this.isLittleEndian);

                                    for (var currentIteration = 0; currentIteration < numOfIterations;
                                         currentIteration++){
                                        currentSample = (currentSample << (8 * numOfBytes)) | currentByte;
                                        numOfBytes++;

                                        if (numOfBytes === bitsPerSample[0] / 8){
                                            pixel.push(currentSample);
                                            currentSample = numOfBytes = 0;
                                            numOfParsedSamples++;
                                        }

                                        if (numOfParsedSamples === samplesPerPixel)
                                        {
                                            if (isElevation){
                                                strips[i].push(pixel[0]);
                                            }
                                            else{
                                                strips[i].push(pixel);
                                            }
                                            pixel = [];
                                            numOfParsedSamples = 0;
                                        }
                                    }

                                    blockLength--;

                                    if (blockLength === 0){
                                        newBlock = true;
                                    }

                                }
                            }
                            break;
                        default:
                            Logger.log(Logger.LEVEL_WARNING, "Unknown compression type: " + compression);
                            break;
                    }
            }

            return strips;
        }

        // Parse geotiff tiles. Internal use only
        GeoTiffReader.prototype.parseTiles = function(){
            //todo
        }

        // Translate a pixel/line coordinates to projection coordinate. Internal use only.
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

            var tiePointValues = this.metadata.modelTiepoint;
            var modelPixelScaleValues = this.metadata.modelPixelScale;
            var modelTransformationValues = this.metadata.modelTransformation;

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

            if (this.metadata.projectedCSType){
                res = Proj4('EPSG:' + this.metadata.projectedCSType, 'EPSG:4326', res);
            }

            return new Location(res[1], res[0]);
        };

        /**
         * Set the bounding box of the geotiff file.
         */
        GeoTiffReader.prototype.setBBox = function () {
            var upperLeft = this.geoTiffImageToPCS(0, 0);
            var upperRight = this.geoTiffImageToPCS(this.metadata.imageWidth, 0);
            var lowerLeft = this.geoTiffImageToPCS(0, this.metadata.imageLength);
            var lowerRight = this.geoTiffImageToPCS(
                this.metadata.imageWidth, this.metadata.imageLength);

            this.metadata.bbox = new Sector(
                lowerLeft.latitude,
                upperLeft.latitude,
                upperLeft.longitude,
                upperRight.longitude
            );
        }

        // Get metadata from image file directory. Internal use only.
        GeoTiffReader.prototype.getMetadataFromImageFileDirectory = function () {
            for (var i = 0; i < this.imageFileDirectories[0].length; i++) {

                switch(this.imageFileDirectories[0][i].tag){
                    case TiffConstants.Tag.BITS_PER_SAMPLE:
                        this.metadata.bitsPerSample = this.imageFileDirectories[0][i].getIFDEntryValue();
                        break;
                    case TiffConstants.Tag.COLOR_MAP:
                        this.metadata.colorMap = this.imageFileDirectories[0][i].getIFDEntryValue();
                        break;
                    case TiffConstants.Tag.COMPRESSION:
                        this.metadata.compression = this.imageFileDirectories[0][i].getIFDEntryValue()[0];
                        break;
                    case TiffConstants.Tag.IMAGE_LENGTH:
                        this.metadata.imageLength = this.imageFileDirectories[0][i].getIFDEntryValue()[0];
                        break;
                    case TiffConstants.Tag.IMAGE_WIDTH:
                        this.metadata.imageWidth = this.imageFileDirectories[0][i].getIFDEntryValue()[0];
                        break;
                    case TiffConstants.Tag.PHOTOMETRIC_INTERPRETATION:
                        this.metadata.photometricInterpretation = this.imageFileDirectories[0][i].getIFDEntryValue()[0];
                        break;
                    case TiffConstants.Tag.PLANAR_CONFIGURATION:
                        this.metadata.planarConfiguration = this.imageFileDirectories[0][i].getIFDEntryValue()[0];
                        break;
                    case TiffConstants.Tag.ROWS_PER_STRIP:
                        this.metadata.rowsPerStrip = this.imageFileDirectories[0][i].getIFDEntryValue()[0];
                        break;
                    case TiffConstants.Tag.SAMPLES_PER_PIXEL:
                        this.metadata.samplesPerPixel = this.imageFileDirectories[0][i].getIFDEntryValue()[0];
                        break;
                    case TiffConstants.Tag.SAMPLE_FORMAT:
                        this.metadata.sampleFormat = this.imageFileDirectories[0][i].getIFDEntryValue();
                        break;
                    case TiffConstants.Tag.STRIP_BYTE_COUNTS:
                        this.metadata.stripByteCounts = this.imageFileDirectories[0][i].getIFDEntryValue();
                        break;
                    case TiffConstants.Tag.STRIP_OFFSETS:
                        this.metadata.stripOffsets = this.imageFileDirectories[0][i].getIFDEntryValue();
                        break;

                    //geotiff
                    case GeoTiffConstants.Tag.GEO_ASCII_PARAMS:
                        this.metadata.geoAsciiParams = this.imageFileDirectories[0][i].getIFDEntryValue();
                        break;
                    case GeoTiffConstants.Tag.GEO_KEY_DIRECTORY:
                        this.metadata.geoKeyDirectory = this.imageFileDirectories[0][i].getIFDEntryValue();
                        break;
                    case GeoTiffConstants.Tag.MODEL_PIXEL_SCALE:
                        this.metadata.modelPixelScale = this.imageFileDirectories[0][i].getIFDEntryValue();
                        break;
                    case GeoTiffConstants.Tag.MODEL_TIEPOINT:
                        this.metadata.modelTiepoint = this.imageFileDirectories[0][i].getIFDEntryValue();
                        break;
                    case GeoTiffConstants.Tag.GDAL_NODATA:
                        this.metadata.noData = this.imageFileDirectories[0][i].getIFDEntryValue();
                        break;
                    default:
                        Logger.log(Logger.LEVEL_WARNING, "Ignored GeoTiff tag: " + this.imageFileDirectories[0][i].tag);
                }
            }
        }

        // Get metadata from GeoKeys. Internal use only.
        GeoTiffReader.prototype.getMetadataFromGeoKeys = function () {
            for (var i = 0; i < this.geoKeys.length; i++) {
                var keyAsString = GeoTiffUtil.getTagValueAsString(GeoTiffConstants.Key, this.geoKeys[i].keyId);

                if (keyAsString){
                    this._metadata.geotiff.geoKeys[keyAsString] = this.geoKeys[i].getGeoKeyValue(
                        this.metadata.geoDoubleParams,
                        this.metadata.geoAsciiParams);
                }
                else{
                    Logger.log(Logger.LEVEL_WARNING, "Unknown GeoTiff key: " + this.geoKeys[i].keyId);
                }
            }
        }

        // Parse GeoKeys. Internal use only.
        GeoTiffReader.prototype.parseGeoKeys = function () {
            if (!this.isGeoTiff()) {
                throw new AbstractError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "parse", "invalidGeoTiffFile"));
            }

            var geoKeyDirectory = this.metadata.geoKeyDirectory;
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

                    switch (keyId){
                        case GeoTiffConstants.Key.ProjectedCSTypeGeoKey:
                            this.metadata.projectedCSType =
                                new GeoTiffKeyEntry(keyId, tiffTagLocation, count, valueOffset).getGeoKeyValue(
                                    this.metadata.geoDoubleParams,
                                    this.metadata.geoAsciiParams);
                            break;
                        default:
                            Logger.log(Logger.LEVEL_WARNING, "Ignored GeoTiff key: " + keyId);
                            break;

                    }
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