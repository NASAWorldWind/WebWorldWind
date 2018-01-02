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
        '../geom/Vec3',
        '../util/WWMath'
    ],
    function (ArgumentError,
              Frustum,
              Line,
              Logger,
              Matrix,
              Rectangle,
              Vec2,
              Vec3,
              WWMath) {
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
         * @param {Rectangle} viewport The navigator's viewport.
         * @param {Number} heading The navigator's heading.
         * @param {Number} tilt The navigator's tilt.
         */
        var NavigatorState = function (modelViewMatrix, projectionMatrix, viewport, heading, tilt, dc) {

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
             * The concatenation of the navigator's model-view and projection matrices. This matrix transforms points
             * from model coordinates to clip coordinates.
             * @type {Matrix}
             * @readonly
             */
            this.modelviewProjection = Matrix.fromIdentity();
            this.modelviewProjection.setToMultiply(projectionMatrix, modelViewMatrix);

            /**
             * The navigator's viewport, in WebGL screen coordinates. The viewport places the origin in the bottom-left
             * corner and has axes that extend up and to the right from the origin.
             * @type {Rectangle}
             * @readonly
             */
            this.viewport = viewport;

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

            // Compute the inverse of the modelview, projection, and modelview-projection matrices. The inverse matrices
            // are used to support operations on navigator state.
            this.modelviewInv = Matrix.fromIdentity();
            this.modelviewInv.invertOrthonormalMatrix(this.modelview);
            this.projectionInv = Matrix.fromIdentity();
            this.projectionInv.invertMatrix(this.projection);
            this.modelviewProjectionInv = Matrix.fromIdentity();
            this.modelviewProjectionInv.invertMatrix(this.modelviewProjection);

            /**
             * The matrix that transforms normal vectors in model coordinates to normal vectors in eye coordinates.
             * Typically used to transform a shape's normal vectors during lighting calculations.
             * @type {Matrix}
             * @readonly
             */
            this.modelviewNormalTransform = Matrix.fromIdentity().setToTransposeOfMatrix(this.modelviewInv.upper3By3());

            // Compute the eye coordinate rectangles carved out of the frustum by the near and far clipping planes, and
            // the distance between those planes and the eye point along the -Z axis. The rectangles are determined by
            // transforming the bottom-left and top-right points of the frustum from clip coordinates to eye
            // coordinates.
            var nbl = new Vec3(-1, -1, -1),
                ntr = new Vec3(+1, +1, -1),
                fbl = new Vec3(-1, -1, +1),
                ftr = new Vec3(+1, +1, +1);
            // Convert each frustum corner from clip coordinates to eye coordinates by multiplying by the inverse
            // projection matrix.
            nbl.multiplyByMatrix(this.projectionInv);
            ntr.multiplyByMatrix(this.projectionInv);
            fbl.multiplyByMatrix(this.projectionInv);
            ftr.multiplyByMatrix(this.projectionInv);

            var nrRectWidth = WWMath.fabs(ntr[0] - nbl[0]),
                frRectWidth = WWMath.fabs(ftr[0] - fbl[0]),
                nrDistance = -nbl[2],
                frDistance = -fbl[2];

            // Compute the scale and offset used to determine the width of a pixel on a rectangle carved out of the
            // frustum at a distance along the -Z axis in eye coordinates. These values are found by computing the scale
            // and offset of a frustum rectangle at a given distance, then dividing each by the viewport width.
            var frustumWidthScale = (frRectWidth - nrRectWidth) / (frDistance - nrDistance),
                frustumWidthOffset = nrRectWidth - frustumWidthScale * nrDistance;
            this.pixelSizeScale = frustumWidthScale / viewport.width;
            this.pixelSizeOffset = frustumWidthOffset / viewport.height;
        };

        return NavigatorState;
    });