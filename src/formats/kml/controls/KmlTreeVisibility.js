/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../../../util/WWUtil',
    './KmlControls'
], function (WWUtil,
             KmlControls
    ) {
    "use strict";

    /**
     * This class represents the structure of Documents, Folders and Features in the document. It renders them into
     * some of the outside area with defined classes, so that user can specify the look and feel.
     * Important part of this effort is to allow user show/hide subset of the Features present in the document.
     * Implementing this functionality also simplifies the manual testing.
     * @param visualElementId {String} Id of the element into which this will be rendered.
     * @param wwd {WorldWindow} WorldWindow instance necessary to control the redraw in the framework.
     * @constructor
     * @augments KmlControls
     * @alias KmlTreeVisibility
     * @classdesc Class for controlling the visibility of features.
     */
    var KmlTreeVisibility = function (visualElementId, wwd) {
        KmlControls.apply(this);

        this._visualElementId = visualElementId;
        this._wwd = wwd;
    };

    KmlTreeVisibility.prototype = Object.create(KmlControls.prototype);

    /**
     * @inheritDoc
     */
    KmlTreeVisibility.prototype.hook = function (node, options) {
        if(options.isFeature) {
            this.createControls(node);
        }
    };

    // For internal use only.
    KmlTreeVisibility.prototype.createControls = function (node) {
        var name = node.kmlName || node.id || WWUtil.guid();
        var enabled = node.enabled || node.kmlVisibility === true;

        var controlsForSingleElement = document.createElement("div");
        var toggleVisibility = document.createElement("input");
        toggleVisibility.setAttribute("type", "checkbox");
        if (enabled) {
            toggleVisibility.setAttribute("checked", "checked");
        }
        toggleVisibility.addEventListener("click", toggleVisibilityOfElement, true);

        controlsForSingleElement.appendChild(toggleVisibility);

        var lookAtName = document.createElement("span");
        lookAtName.appendChild(document.createTextNode(name));
        lookAtName.addEventListener("click", lookAt, true);
        controlsForSingleElement.appendChild(lookAtName);

        document.getElementById(this._visualElementId).appendChild(controlsForSingleElement);

        var self = this;

        function toggleVisibilityOfElement() {
            enabled = !enabled;
            self.updateDescendants(node, enabled);
        }

        function lookAt() {
            if (node.kmlAbstractView) {
                node.kmlAbstractView.update({wwd: self._wwd});
            }
        }
    };

    // Internal use only. Updates all descendants of given Feature.
    KmlTreeVisibility.prototype.updateDescendants = function (node, enabled) {
        node.controlledVisibility = enabled;
        this._wwd.redraw();
    };

    return KmlTreeVisibility;
});