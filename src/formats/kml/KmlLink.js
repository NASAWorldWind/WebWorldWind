/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    './KmlElements',
    './KmlObject'
], function (KmlElements,
             KmlObject) {
    "use strict";

    /**
     * Constructs an KmlLink. Applications usually don't call this constructor. It is called by {@link KmlFile} as
     * objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlLink
     * @classdesc Contains the data associated with Link node.
     * @param node Node representing link in the document.
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#link
     */
    var KmlLink = function (node) {
        KmlObject.call(this, node);

        Object.defineProperties(this, {
            /**
             * A URL (either an HTTP address or a local file specification). When the parent of <Link> is a NetworkLink,
             * <href> is a KML file. When the parent of <Link> is a Model, <href> is a COLLADA file. When the parent of
             * <Icon> (same fields as <Link>) is an Overlay, <href> is an image. Relative URLs can be used in this tag and
             * are evaluated relative to the enclosing KML file. See KMZ Files for details on constructing relative
             * references in KML and KMZ files.
             * @memberof KmlLink.prototype
             * @readonly
             * @type {Array}
             */
            href: {
                get: function () {
                    return this.retrieve({name: 'href'});
                }
            },

            /**
             * Specifies a time-based refresh mode, which can be one of the following:
             * onChange - refresh when the file is loaded and whenever the Link parameters change (the default).
             * onInterval - refresh every n seconds (specified in <refreshInterval>).
             * onExpire - refresh the file when the expiration time is reached. If a fetched file has a
             *  NetworkLinkControl, the <expires> time takes precedence over expiration times specified in HTTP headers. If
             * no <expires> time is specified, the HTTP max-age header is used (if present). If max-age is not present, the
             * Expires HTTP header is used (if present). (See Section RFC261b of the Hypertext Transfer Protocol - HTTP 1.1
             * for details on HTTP header fields.)
             * @memberof KmlLink.prototype
             * @readonly
             * @type {String}
             */
            refreshMode: {
                get: function () {
                    return this.retrieve({name: 'refreshMode'});
                }
            },

            /**
             * Indicates to refresh the file every n seconds.
             * @memberof KmlLink.prototype
             * @readonly
             * @type {Number}
             */
            refreshInterval: {
                get: function () {
                    return this.retrieve({name: 'refreshInterval', transformer: Number});
                }
            },

            /**
             * Specifies how the link is refreshed when the "camera" changes.
             * Can be one of the following:
             * never (default) - Ignore changes in the view. Also ignore <viewFormat> parameters, if any.
             * onStop - Refresh the file n seconds after movement stops, where n is specified in <viewRefreshTime>.
             * onRequest - Refresh the file only when the user explicitly requests it. (For example, in Google Earth, the
             *  user right-clicks and selects Refresh in the Context menu.)
             * onRegion - Refresh the file when the Region becomes active. See <Region>.
             * @memberof KmlLink.prototype
             * @readonly
             * @type {String}
             */
            viewRefreshMode: {
                get: function () {
                    return this.retrieve({name: 'viewRefreshMode'});
                }
            },

            /**
             * After camera movement stops, specifies the number of seconds to wait before refreshing the view. (See
             * <viewRefreshMode> and onStop above.)
             * @memberof KmlLink.prototype
             * @readonly
             * @type {Number}
             */
            viewRefreshTime: {
                get: function () {
                    return this.retrieve({name: 'viewRefreshTime', transformer: Number});
                }
            },

            /**
             * Scales the BBOX parameters before sending them to the server. A value less than 1 specifies to use less than
             * the full view (screen). A value greater than 1 specifies to fetch an area that extends beyond the edges of
             * the current view.
             * @memberof KmlLink.prototype
             * @readonly
             * @type {Number}
             */
            viewBoundScale: {
                get: function () {
                    return this.retrieve({name: 'viewBoundScale', transformer: Number});
                }
            },

            /**
             * Specifies the format of the query string that is appended to the Link's <href> before the file is
             * fetched.(If the <href> specifies a local file, this element is ignored.) If you specify a <viewRefreshMode>
             * of onStop and do not include the <viewFormat> tag in the file, the following information is automatically
             * appended to the query string: BBOX=[bboxWest],[bboxSouth],[bboxEast],[bboxNorth] This information matches
             * the Web Map Service (WMS) bounding box specification. If you specify an empty <viewFormat> tag, no
             * information is appended to the query string. You can also specify a custom set of viewing parameters to add
             * to the query string. If you supply a format string, it is used instead of the BBOX information. If you also
             * want the BBOX information, you need to add those parameters along with the custom parameters. You can use
             * any of the following parameters in your format string (and Google Earth will substitute the appropriate
             * current value at the time it creates the query string):
             * [lookatLon], [lookatLat] - longitude and latitude of the point that <LookAt> is viewing
             * [lookatRange], [lookatTilt], [lookatHeading] - values used by the <LookAt> element (see descriptions of
             *  <range>, <tilt>, and <heading> in <LookAt>)
             * [lookatTerrainLon], [lookatTerrainLat], [lookatTerrainAlt] - point on the terrain in degrees/meters that
             *  <LookAt> is viewing
             * [cameraLon], [cameraLat], [cameraAlt] - degrees/meters of the eyepoint for the camera
             * [horizFov], [vertFov] - horizontal, vertical field of view for the camera
             * [horizPixels], [vertPixels] - size in pixels of the 3D viewer
             * [terrainEnabled] - indicates whether the 3D viewer is showing terrain
             * @memberof KmlLink.prototype
             * @readonly
             * @type {String}
             */
            viewFormat: {
                get: function () {
                    return this.retrieve({name: 'viewFormat'});
                }
            },

            /**
             * Appends information to the query string, based on the parameters specified. (Google Earth substitutes the
             * appropriate current value at the time it creates the query string.) The following parameters are supported:
             * [clientVersion]
             * [kmlVersion]
             * [clientName]
             * [language]
             * @memberof KmlLink.prototype
             * @readonly
             * @type {String}
             */
            httpQuery: {
                get: function () {
                    return this.retrieve({name: 'httpQuery'});
                }
            }
        });
    };

    KmlLink.prototype.getTagNames = function() {
        return ['Link'];
    };

    KmlElements.addKey(KmlLink.prototype.getTagNames()[0], KmlLink);

    return KmlLink;
});