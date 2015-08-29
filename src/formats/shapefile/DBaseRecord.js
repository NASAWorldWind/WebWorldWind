/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports DBaseRecord
 * @version $Id: DBaseRecord.js 2980 2015-04-03 23:45:43Z danm $
 */
define(['../../error/ArgumentError',
        '../../util/ByteBuffer',
        '../../formats/shapefile/DBaseField',
        '../../formats/shapefile/DBaseFile',
        '../../util/Logger'
    ],
    function (ArgumentError,
              ByteBuffer,
              DBaseField,
              DBaseFile,
              Logger) {
        "use strict";

        /**
         * Create a DBase record. Applications typically do not call this constructor. It is called by
         * {@link DBaseFile} as attribute records are read.
         * @param {DBaseFile} dbaseFile A dBase attribute file.
         * @param {ByteBuffer} buffer A buffer descriptor from which to parse a record.
         * @param {Number} recordNumber The number of the record to parse.
         * @returns {DBaseRecord} The DBase record that was parsed.
         * @constructor
         */
        var DBaseRecord = function(dbaseFile, buffer, recordNumber) {
            if (!dbaseFile) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "DBaseRecord", "constructor", "missingAttributeName")
                );
            }

            if (!buffer) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "DBaseRecord", "constructor", "missingBuffer")
                );
            }

            /**
             * Indicates whether the record was deleted.
             * @type {Boolean}
             */
            this.deleted = false;

            /**
             * Indicates the current record number.
             * @type {Number}
             */
            this.recordNumber = recordNumber;

            //DateFormat dateformat = new SimpleDateFormat("yyyyMMdd");

            this.values = null;

            this.readFromBuffer(dbaseFile, buffer, recordNumber);
        };

        /**
         * Returned whether the record was deleted
         * @returns {Boolean} True if the record was deleted.
         */
        DBaseRecord.prototype.isDeleted = function() {
            return this.deleted;
        };

        /**
         * Returns the number of the record.
         * @returns {Number} The number of the record.
         */
        DBaseRecord.prototype.getRecordNumber = function() {
            return this.recordNumber;
        };

        /**
         * Reads a dBase record from the buffer.
         * @param {DBaseFile} dbaseFile The dBase file from which to read a record.
         * @param {ByteBuffer} buffer The buffer descriptor to read the record from.
         * @param {Number} recordNumber The record number to read.
         */
        DBaseRecord.prototype.readFromBuffer = function(dbaseFile, buffer, recordNumber) {
            buffer.order(ByteBuffer.LITTLE_ENDIAN);

            this.recordNumber = recordNumber;

            // Read deleted record flag.
            var b = buffer.getByte();
            this.deleted = (b == 0x2A);

            var fields = dbaseFile.getFields();

            this.values = {};

            for (var idx = 0, len = fields.length; idx < len; idx += 1) {
                var field = fields[idx];

                var key = field.getName();

                var value = dbaseFile.readNullTerminatedString(buffer, field.getLength()).trim();

                try {
                    if (field.getType() == DBaseField.TYPE_BOOLEAN) {
                        var firstChar = value.charAt(0);
                        this.values[key] = firstChar == 't' || firstChar == 'T' || firstChar == 'Y' || firstChar == 'y';
                    }
                    else if (field.getType() == DBaseField.TYPE_CHAR) {
                        this.values[key] = value;
                    }
                    else if (field.getType() == DBaseField.TYPE_DATE) {
                        this.values[key] = new Date(value);
                    }
                    else if (field.getType() == DBaseField.TYPE_NUMBER) {
                        this.values[key] = +value;
                    }
                }
                catch (e) {
                    // Log warning but keep reading.
                    Logger.log(Logger.LEVEL_WARNING,
                        "Shapefile attribute parsing error:" +
                        field.toString() +
                        " -> " +
                        value.toString() +
                        " [" + e + "]"
                    );
                }
            }
        };

        return DBaseRecord;
    }
);