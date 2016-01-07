/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define(['../../../util/Logger'], function (Logger) {
    "use strict";
    /**
     * Every control used by the KML should inherit from this class. It contains common functionality and basically
     * serves as a reference to what needs to be implemented in the descendants.
     * @alias KmlControls
     * @constructor
     */
    var KmlControls = function() {

    };

    /**
     * Controls added to the KML document will be notified by the update of the Kml document. Hook is method which is
     * called once, when the element is updated. It is necessary to be careful and hook the element only once. The
     * other solution is to make sure the ids will be used correctly.
     */
    KmlControls.prototype.hook = function() {
        Logger.logMessage(Logger.LEVEL_WARNING, "KmlControls", "hook", "Every KML controls should override hook" +
            " method.");
    };

    return KmlControls;
});