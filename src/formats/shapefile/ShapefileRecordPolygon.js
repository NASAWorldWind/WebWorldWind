/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports ShapefileRecordPolygon
 * @version $Id: ShapefileRecordPolygon.js 2984 2015-04-06 23:00:34Z danm $
 */
define(['../../formats/shapefile/Shapefile',
        '../../formats/shapefile/ShapefileRecord'
    ],
    function (Shapefile,
              ShapefileRecord) {
        "use strict";

        /**
         * Constructs a shapefile record for a polygon. Applications typically do not call this constructor. It is called by
         * {@link Shapefile} as shapefile records are read.
         * @alias ShapefileRecordPolygon
         * @constructor
         * @classdesc Contains the data associated with a shapefile record.
         * @augments ShapefileRecord
         * @param {Shapefile} shapefile The shapefile containing this record.
         * @param {ByteBuffer} buffer A buffer descriptor to read data from.
         * @throws {ArgumentError} If either the specified shapefile or buffer are null or undefined.
         */
        var ShapefileRecordPolygon = function (shapefile, buffer) {
            ShapefileRecord.call(this, shapefile, buffer);
        };

        ShapefileRecordPolygon.prototype = Object.create(ShapefileRecord.prototype);

        ShapefileRecordPolygon.prototype.readContents = function() {
            this.readPolylineContents();
        };

        return ShapefileRecordPolygon;
    }
);