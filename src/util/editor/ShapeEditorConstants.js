/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
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

            // Indicates a control point controlling a location.
            LOCATION: "location",

            // Indicates a control point controlling the rotation of shape.
            ROTATION: "rotation",

            // Indicates a control point controlling the width of a shape.
            WIDTH: "width",

            // Indicates a control point controlling the height of a shape.
            HEIGHT: "height",

            // Indicates a control point controlling the radius of a shape.
            RADIUS: "radius",

            // Indicates that an entire shape is being dragged.
            DRAG: "drag",

            // Indicates the corner with min latitude for a surface sector
            MIN_CORNER: "min_corner",

            // Indicates the corner with max latitude for a surface sector
            MAX_CORNER: "max_corner",

            // Indicates a control point that marks the middle of a segment.
            SHADOW: "shadow"
        };

        return ShapeEditorConstants;
    });