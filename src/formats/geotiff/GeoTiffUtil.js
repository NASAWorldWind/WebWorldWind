/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports GeoTiffUtil
 */
define(['../../error/ArgumentError'
    ],
    function (ArgumentError) {
        "use strict";

        var GeoTiffUtil = {

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

            // Converts canvas to an image
            canvasToTiffImage: function (canvas) {
                var image = new Image();
                image.src = canvas.toDataURL();

                return image;
            }
        };

        return GeoTiffUtil;
    }
);


