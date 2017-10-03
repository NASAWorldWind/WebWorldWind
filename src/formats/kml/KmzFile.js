/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports KmzFile
 */
define([], function(){
    "use strict";

    /**
     * Constructs KmzFile
     * @constructor
     */
    var KmzFile = function(binary, fileCache) {
        this._binary = binary;

        this._fileCache = fileCache;
    };

    /**
     * It loads the whole file and register all its contents. The href resolver must therefore load.
     * @returns Promise
     */
    KmzFile.prototype.load = function() {

    };

    return KmzFile;
});