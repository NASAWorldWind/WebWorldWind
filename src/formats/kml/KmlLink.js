/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlElements',
    './KmlObject'
], function (
    KmlElements,
    KmlObject
) {
    "use strict";

    var KmlLink = function(node) {
        KmlObject.call(this, node);
    };

    KmlLink.prototype = Object.create(KmlObject.prototype);

    Object.defineProperties(KmlLink.prototype, {
        tagName: {
            get: function() {
                return ['Link']
            }
        },

        href: {
            get: function() {
                return this.retrieve({name: 'href'});
            }
        },

        refreshMode: {
            get: function() {
                return this.retrieve({name: 'refreshMode'});
            }
        },

        refreshInterval: {
            get: function() {
                return this.retrieve({name: 'refreshInterval'});
            }
        },

        viewRefreshMode: {
            get: function() {
                return this.retrieve({name: 'viewRefreshMode'});
            }
        },

        viewRefreshTime: {
            get: function() {
                return this.retrieve({name: 'viewRefreshTime'});
            }
        },

        viewBoundScale: {
            get: function() {
                return this.retrieve({name: 'viewBoundScale'});
            }
        },

        viewFormat: {
            get: function() {
                return this.retrieve({name: 'viewFormat'});
            }
        },

        httpQuery: {
            get: function() {
                return this.retrieve({name: 'httpQuery'});
            }
        }
    });

    KmlElements.addKey(KmlLink.prototype.tagName[0], KmlLink);

    return KmlLink;
});