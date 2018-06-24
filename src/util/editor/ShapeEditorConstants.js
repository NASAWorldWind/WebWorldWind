/*
 * Copyright 2015-2018 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define([],
    function () {
        'use strict';

        /**
         * Provides constants for the ShapeEditor.
         * @exports ShapeEditorConstants
         */
        var ShapeEditorConstants = {

            // Indicates that a control point is associated with annotation.
            ANNOTATION: "annotation",

            // Indicates a control point is associated with a location.
            LOCATION: "location",

            // Indicates that a control point is associated with whole-shape rotation.
            ROTATION: "rotation",

            // Indicates that a control point is associated with width change.
            WIDTH: "width",

            // Indicates that a control point is associated with height change.
            HEIGHT: "height",

            // Indicates that a control point is associated with the right width of a shape.
            RIGHT_WIDTH: "rightWidth",

            // Indicates that a control point is associated with the outer radius of a shape.
            OUTER_RADIUS: "outerRadius"
        };

        return ShapeEditorConstants;
    });