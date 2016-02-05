/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports GeoTiffUtil
 */
define([
        '../../error/ArgumentError',
        './Tiff'
    ],
    function (ArgumentError,
              Tiff) {
        "use strict";

        var GeoTiffUtil = {

            // Get bytes from an arraybuffer depending on the size.
            getBytes: function (geoTiffData, byteOffset, numOfBytes, isLittleEndian) {
                if (numOfBytes <= 0) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "getBytes", "noBytesRequested"));
                } else if (numOfBytes <= 1) {
                    return geoTiffData.getUint8(byteOffset, isLittleEndian);
                } else if (numOfBytes <= 2) {
                    return geoTiffData.getUint16(byteOffset, isLittleEndian);
                } else if (numOfBytes <= 3) {
                    return geoTiffData.getUint32(byteOffset, isLittleEndian) >>> 8;
                } else if (numOfBytes <= 4) {
                    return geoTiffData.getUint32(byteOffset, isLittleEndian);
                } else if (numOfBytes <= 8) {
                    return geoTiffData.getFloat64(byteOffset, isLittleEndian);
                } else {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeoTiffReader", "getBytes", "tooManyBytesRequested"));
                }
            },

            // Get sample value from an arraybuffer depending on the sample format.
            getSampleBytes: function (geoTiffData, byteOffset, numOfBytes, sampleFormat, isLittleEndian) {
                var res;

                switch (sampleFormat) {
                    case Tiff.SampleFormat.UNSIGNED:
                    case Tiff.SampleFormat.SIGNED:
                        res = this.getBytes(geoTiffData, byteOffset, numOfBytes, isLittleEndian);
                        break;
                    case Tiff.SampleFormat.IEEE_FLOAT:
                        if (numOfBytes == 3) {
                            res = geoTiffData.getFloat32(byteOffset, isLittleEndian) >>> 8;
                        } else if (numOfBytes == 4) {
                            res = geoTiffData.getFloat32(byteOffset, isLittleEndian);
                        }
                        else{
                            console.log("Do not attempt to parse the data  not handled  : " + sampleFormat);
                        }
                        break;
                    case Tiff.SampleFormat.UNDEFINED:
                    default:
                        res = this.getBytes(geoTiffData, byteOffset, numOfBytes, isLittleEndian);
                        break;
                }

                return res;
            },

            // Converts canvas to an image.
            canvasToTiffImage: function (canvas) {
                var image = new Image();
                image.src = canvas.toDataURL();
                return image;
            },

            // Get RGBA fill style for a canvas context as a string.
            getRGBAFillValue: function(r, g, b, a) {
                if(typeof a === 'undefined') {
                    a = 1.0;
                }
                return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
            },

            // Get the tag value as a string.
            getTagValueAsString: function (tagName, tagValue) {
                for (var property in tagName) {
                    if (tagName[property] === tagValue) {
                        return property;
                    }
                }
                return undefined;
            },

            // Clamp color sample from color sample value and number of bits per sample.
            clampColorSample: function(colorSample, bitsPerSample) {
                var multiplier = Math.pow(2, 8 - bitsPerSample);
                return Math.floor((colorSample * multiplier) + (multiplier - 1));
            }
        };

        return GeoTiffUtil;
    }
);