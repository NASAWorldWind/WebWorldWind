/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/extend',
    './../KmlElements',
    './KmlFeature',
    '../KmlLink',
    '../../../util/WWUtil'
], function (extend,
             KmlElements,
             KmlFeature,
             KmlLink,
             WWUtil) {
    "use strict";

    /**
     * Constructs an KmlNetworkLink. Applications usually don't call this constructor. It is called by {@link KmlFile}
     * as objects from Kml file are read. This object is already concrete implementation.
     * @alias KmlNetworkLink
     * @classdesc Contains the data associated with NetworkLink node.
     * @param options {Object}
     * @param options.objectNode {Node} Node representing NetworkLink
     * @constructor
     * @throws {ArgumentError} If the node is null or undefined.
     * @see https://developers.google.com/kml/documentation/kmlreference#networklink
     * @augments KmlFeature
     */
    var KmlNetworkLink = function (options) {
        KmlFeature.call(this, options);

        Object.defineProperties(this, {
            /**
             * Boolean value. A value of 0 leaves the visibility of features within the control of the Google Earth
             * user. Set the value to 1 to reset the visibility of features each time the NetworkLink is refreshed. For
             * example, suppose a Placemark within the linked KML file has &lt;visibility&gt; set to 1 and the NetworkLink
             * has
             * &lt;refreshVisibility&gt; set to 1. When the file is first loaded into Google Earth, the user can clear the
             * check box next to the item to turn off display in the 3D viewer. However, when the NetworkLink is
             * refreshed, the Placemark will be made visible again, since its original visibility state was TRUE.
             * @memberof KmlNetworkLink.prototype
             * @readonly
             * @type {Boolean}
             */
            kmlRefreshVisibility: {
                get: function () {
                    return this.retrieve({name: 'refreshVisibility', transformer: WWUtil.transformToBoolean});
                }
            },

            /**
             * Boolean value. A value of 1 causes Google Earth to fly to the view of the LookAt or Camera in the
             * NetworkLinkControl (if it exists). If the NetworkLinkControl does not contain an AbstractView element,
             * Google Earth flies to the LookAt or Camera element in the Feature child within the &lt;kml&gt; element in the
             * refreshed file. If the &lt;kml&gt; element does not have a LookAt or Camera specified, the view is unchanged.
             * For example, Google Earth would fly to the &lt;LookAt&gt; view of the parent Document, not the &lt;LookAt&gt; of the
             * Placemarks contained within the Document.
             * @memberof KmlNetworkLink.prototype
             * @readonly
             * @type {Boolean}
             */
            kmlFlyToView: {
                get: function () {
                    return this.retrieve({name: 'flyToView', transformer: WWUtil.transformToBoolean});
                }
            },

            /**
             * @memberof KmlNetworkLink.prototype
             * @readonly
             * @type {KmlLink}
             * @see {KmlLink}
             */
            kmlLink: {
                get: function () {
                    return this.createChildElement({
                        name: KmlLink.prototype.getTagNames()
                    });
                }
            }
        });

        extend(this, KmlNetworkLink.prototype);
    };

    /**
     * @inheritDoc
     */
    KmlNetworkLink.prototype.getTagNames = function () {
        return ['NetworkLink'];
    };

    return KmlNetworkLink;
});