/*
 * Copyright (C) 2017 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([], function () {
    //noinspection UnnecessaryLocalVariableJS
    /**
     * Map representing the available elements. Basically this is a way to overcome circular dependencies issues. They
     * might happen when there are inter dependencies among objects. It shouldn't happen in case of WKT.
     * @exports WktElements
     */
    var WktElements = {
    };

    return WktElements;
});