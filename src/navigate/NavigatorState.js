/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
/**
 * @exports NavigatorState
 */
// TODO: Refactor into other classes
define([
        '../error/ArgumentError',
        '../geom/Frustum',
        '../geom/Line',
        '../util/Logger',
        '../geom/Matrix',
        '../geom/Rectangle',
        '../geom/Vec2',
        '../geom/Vec3'
    ],
    function (ArgumentError,
              Frustum,
              Line,
              Logger,
              Matrix,
              Rectangle,
              Vec2,
              Vec3) {
        "use strict";

        /**
         * Constructs a navigator state. This constructor is meant to be called by navigators when their current state
         * is requested.
         * @alias NavigatorState
         * @constructor
         * @classdesc Represents the state of a navigator.
         * <p>
         * Properties of NavigatorState objects are
         * read-only because they are values captured from a {@link Navigator}. Setting the properties on
         * a NavigatorState instance has no effect on the Navigator from which they came.
         * @param {Matrix} modelViewMatrix The navigator's model-view matrix.
         * @param {Matrix} projectionMatrix The navigator's projection matrix.
         * @param {Rectangle} vp The navigator's vp.
         * @param {Number} heading The navigator's heading.
         * @param {Number} tilt The navigator's tilt.
         */
        var NavigatorState = function (modelViewMatrix, projectionMatrix, vp, heading, tilt, dc) {

            this.dc = dc;
            /**
             * The navigator's model-view matrix. The model-view matrix transforms points from model coordinates to eye
             * coordinates.
             * @type {Matrix}
             * @readonly
             */
            this.modelview = modelViewMatrix;

            /**
             * The navigator's projection matrix. The projection matrix transforms points from eye coordinates to clip
             * coordinates.
             * @type {Matrix}
             * @readonly
             */
            this.projection = projectionMatrix;

            /**
             * Indicates the number of degrees clockwise from north to which the view is directed.
             * @type {Number}
             * @readonly
             */
            this.heading = heading;

            /**
             * The number of degrees the globe is tilted relative to its surface being parallel to the screen. Values are
             * typically in the range 0 to 90 but may vary from that depending on the navigator in use.
             * @type {Number}
             * @readonly
             */
            this.tilt = tilt;

            /**
             * The navigator's eye point in model coordinates, relative to the globe's center.
             * @type {Vec3}
             * @readonly
             */
            this.eyePoint = this.modelview.extractEyePoint(new Vec3(0, 0, 0));

            /**
             * The navigator's viewing frustum in model coordinates. The frustum originates at the eyePoint and extends
             * outward along the forward vector. The navigator's near distance and far distance identify the minimum and
             * maximum distance, respectively, at which an object in the scene is visible.
             * @type {Frustum}
             * @readonly
             */
            this.frustumInModelCoordinates = null;
            // Compute the frustum in model coordinates. Start by computing the frustum in eye coordinates from the
            // projection matrix, then transform this frustum to model coordinates by multiplying its planes by the
            // transpose of the modelview matrix. We use the transpose of the modelview matrix because planes are
            // transformed by the inverse transpose of a matrix, and we want to transform from eye coordinates to model
            // coordinates.
            var modelviewTranspose = Matrix.fromIdentity();
            modelviewTranspose.setToTransposeOfMatrix(this.modelview);
            this.frustumInModelCoordinates = Frustum.fromProjectionMatrix(this.projection);
            this.frustumInModelCoordinates.transformByMatrix(modelviewTranspose);
            this.frustumInModelCoordinates.normalize();
        };

        return NavigatorState;
    });