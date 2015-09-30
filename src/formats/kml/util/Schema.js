/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './../KmlElements',
    '../KmlObject'
], function (
    KmlElements,
    KmlObject
) {
    // TODO KmlSchema isn't actually descendant of the KmlObject. The relevant logic should be applied differently.
    "use strict";
    var Schema = function(node) {
        KmlObject.call(this, node);
    };

    Schema.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(Schema.prototype, {
        tagName: {
            get: function() {
                return ['Schema']
            }
        }
    });

    KmlElements.addKey("Schema", Schema);

    return Schema;
});