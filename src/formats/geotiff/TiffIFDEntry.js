/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports TiffIFDEntry
 */
define(['../../error/AbstractError',
        '../../error/ArgumentError',
        './GeoTiffUtil',
        '../../util/Logger',
        './Tiff'
    ],
    function (AbstractError,
              ArgumentError,
              GeoTiffUtil,
              Logger,
              Tiff) {
        "use strict";

        var TiffIFDEntry = function (tag, type, count, valueOffset, geoTiffData, isLittleEndian) {
            if (!tag) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiffIFDEntry", "constructor", "missingTag"));
            }

            if (!type) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiffIFDEntry", "constructor", "missingType"));
            }

            if (!count) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiffIFDEntry", "constructor", "missingCount"));
            }

            //if (!valueOffset) {
            //    throw new ArgumentError(
            //        Logger.logMessage(Logger.LEVEL_SEVERE, "TiffIFDEntry", "constructor", "missingValueOffset"));
            //}

            if (!geoTiffData) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiffIFDEntry", "constructor", "missingGeoTiffData"));
            }

            if (!isLittleEndian) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "TiffIFDEntry", "constructor", "missingIsLittleEndian"));
            }

            this._tag = tag;

            this._type = type;

            this._count = count;

            this._valueOffset = valueOffset;

            this._geoTiffData = geoTiffData;

            this._isLittleEndian = isLittleEndian;
        };

        Object.defineProperties(TiffIFDEntry.prototype, {

            tag: {
                get: function () {
                    return this._tag;
                }
            },

            type: {
                get: function () {
                    return this._type;
                }
            },

            count: {
                get: function () {
                    return this._count;
                }
            },

            valueOffset: {
                get: function () {
                    return this._valueOffset;
                }
            },

            geoTiffData: {
                get: function () {
                    return this._geoTiffData;
                }
            },

            isLittleEndian: {
                get: function () {
                    return this._isLittleEndian;
                }
            }
        });

        TiffIFDEntry.prototype.getIFDTypeLength = function (fieldTypeName) {
            switch(this.type){
                case Tiff.Type.BYTE:
                case Tiff.Type.ASCII:
                case Tiff.Type.SBYTE:
                case Tiff.Type.UNDEFINED:
                    return 1;
                case Tiff.Type.SHORT:
                case Tiff.Type.SSHORT:
                    return 2;
                case Tiff.Type.LONG:
                case Tiff.Type.SLONG:
                case Tiff.Type.FLOAT:
                    return 4;
                case Tiff.Type.RATIONAL:
                case Tiff.Type.SRATIONAL:
                case Tiff.Type.DOUBLE:
                    return 8;
                default:
                    return -1;
            }
        }

        TiffIFDEntry.prototype.getIFDEntryValue = function (isLittleEndian) {
            var ifdValues = [];
            var value = null;
            var ifdTypeLength = this.getIFDTypeLength(this.type);
            var ifdValueSize = ifdTypeLength * this.count;

            if (ifdValueSize <= 4) {
                if (isLittleEndian === false) {
                    value = this.valueOffset >>> ((4 - ifdTypeLength) * 8);
                } else {
                    value = this.valueOffset;
                }
                ifdValues.push(value);
            } else {
                for (var i = 0; i < this.count; i++) {
                    var indexOffset = ifdTypeLength * i;

                    if (ifdTypeLength >= 8) {
                        if (this.type === Tiff.Type.RATIONAL || this.type === Tiff.Type.SRATIONAL) {
                            // Numerator
                            ifdValues.push(GeoTiffUtil.getBytes(this.geoTiffData, this.valueOffset + indexOffset, 4, this.isLittleEndian));
                            // Denominator
                            ifdValues.push(GeoTiffUtil.getBytes(this.geoTiffData, this.valueOffset + indexOffset + 4, 4, this.isLittleEndian));
                        } else if (this.type === Tiff.Type.DOUBLE) {
                            ifdValues.push(GeoTiffUtil.getBytes(this.geoTiffData, this.valueOffset + indexOffset, 8, this.isLittleEndian));
                        } else {
                            throw new AbstractError(
                                Logger.logMessage(Logger.LEVEL_SEVERE, "TiffIFDEntry", "parse", "invalidTypeOfIFD"));
                        }
                    } else {
                        ifdValues.push(GeoTiffUtil.getBytes(this.geoTiffData, this.valueOffset + indexOffset, ifdTypeLength, this.isLittleEndian));
                    }
                }
            }

            if (this.type === Tiff.Type.ASCII) {
                ifdValues.forEach(function (element, index, array) {
                    array[index] = String.fromCharCode(element);
                });

                return ifdValues.join("");
            }

            return ifdValues;

        };

        return TiffIFDEntry;
    }
);
