/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports NavigatorState
 * @version $Id: NavigatorState.js 3279 2015-06-26 22:42:56Z tgaskins $
 */
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
        var NavigatorState = function (modelViewMatrix, projectionMatrix, viewport, heading, tilt) {

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
            // are used to support operations on navigator state, such as project, unProject, and pixelSizeAtDistance.
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

        /**
         * Transforms the specified model point from model coordinates to WebGL screen coordinates.
         * <p>
         * The resultant screen point is in WebGL screen coordinates, with the origin in the bottom-left corner and
         * axes that extend up and to the right from the origin.
         * <p>
         * This function stores the transformed point in the result argument, and returns true or false to indicate
         * whether or not the transformation is successful. It returns false if this navigator state's modelview or
         * projection matrices are malformed, or if the specified model point is clipped by the near clipping plane or
         * the far clipping plane.
         *
         * @param {Vec3} modelPoint The model coordinate point to project.
         * @param {Vec3} result A pre-allocated vector in which to return the projected point.
         * @returns {boolean} true if the transformation is successful, otherwise false.
         * @throws {ArgumentError} If either the specified point or result argument is null or undefined.
         */
        NavigatorState.prototype.project = function (modelPoint, result) {
            if (!modelPoint) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "NavigatorState", "project",
                    "missingPoint"));
            }

            if (!result) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "NavigatorState", "project",
                    "missingResult"));
            }

            // Transform the model point from model coordinates to eye coordinates then to clip coordinates. This
            // inverts the Z axis and stores the negative of the eye coordinate Z value in the W coordinate.
            var mx = modelPoint[0],
                my = modelPoint[1],
                mz = modelPoint[2],
                m = this.modelviewProjection,
                x = m[0] * mx + m[1] * my + m[2] * mz + m[3],
                y = m[4] * mx + m[5] * my + m[6] * mz + m[7],
                z = m[8] * mx + m[9] * my + m[10] * mz + m[11],
                w = m[12] * mx + m[13] * my + m[14] * mz + m[15],
                viewport = this.viewport;

            if (w == 0) {
                return false;
            }

            // Complete the conversion from model coordinates to clip coordinates by dividing by W. The resultant X, Y
            // and Z coordinates are in the range [-1,1].
            x /= w;
            y /= w;
            z /= w;

            // Clip the point against the near and far clip planes.
            if (z < -1 || z > 1) {
                return false;
            }

            // Convert the point from clip coordinate to the range [0,1]. This enables the X and Y coordinates to be
            // converted to screen coordinates, and the Z coordinate to represent a depth value in the range[0,1].
            x = x * 0.5 + 0.5;
            y = y * 0.5 + 0.5;
            z = z * 0.5 + 0.5;

            // Convert the X and Y coordinates from the range [0,1] to screen coordinates.
            x = x * viewport.width + viewport.x;
            y = y * viewport.height + viewport.y;

            result[0] = x;
            result[1] = y;
            result[2] = z;

            return true;
        };
        /**
         * Transforms the specified model point from model coordinates to WebGL screen coordinates, applying an offset
         * to the modelPoint's projected depth value.
         * <p>
         * The resultant screen point is in WebGL screen coordinates, with the origin in the bottom-left corner and axes
         * that extend up and to the right from the origin.
         * <p>
         * This function stores the transformed point in the result argument, and returns true or false to indicate whether or
         * not the transformation is successful. It returns false if this navigator state's modelview or projection
         * matrices are malformed, or if the modelPoint is clipped by the near clipping plane or the far clipping plane,
         * ignoring the depth offset.
         * <p>
         * The depth offset may be any real number and is typically used to move the screenPoint slightly closer to the
         * user's eye in order to give it visual priority over nearby objects or terrain. An offset of zero has no effect.
         * An offset less than zero brings the screenPoint closer to the eye, while an offset greater than zero pushes the
         * projected screen point away from the eye.
         * <p>
         * Applying a non-zero depth offset has no effect on whether the model point is clipped by this method or by
         * WebGL. Clipping is performed on the original model point, ignoring the depth offset. The final depth value
         * after applying the offset is clamped to the range [0,1].
         *
         * @param {Vec3} modelPoint The model coordinate point to project.
         * @param {Number} depthOffset The amount of offset to apply.
         * @param {Vec3} result A pre-allocated vector in which to return the projected point.
         * @returns {boolean} true if the transformation is successful, otherwise false.
         * @throws {ArgumentError} If either the specified point or result argument is null or undefined.
         */
        NavigatorState.prototype.projectWithDepth = function (modelPoint, depthOffset, result) {
            if (!modelPoint) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "NavigatorState", "projectWithDepth",
                    "missingPoint"));
            }

            if (!result) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "NavigatorState", "projectWithDepth",
                    "missingResult"));
            }

            // Transform the model point from model coordinates to eye coordinates. The eye coordinate and the clip
            // coordinate are transformed separately in order to reuse the eye coordinate below.
            var mx = modelPoint[0],
                my = modelPoint[1],
                mz = modelPoint[2],
                m = this.modelview,
                ex = m[0] * mx + m[1] * my + m[2] * mz + m[3],
                ey = m[4] * mx + m[5] * my + m[6] * mz + m[7],
                ez = m[8] * mx + m[9] * my + m[10] * mz + m[11],
                ew = m[12] * mx + m[13] * my + m[14] * mz + m[15];

            // Transform the point from eye coordinates to clip coordinates.
            var p = this.projection,
                x = p[0] * ex + p[1] * ey + p[2] * ez + p[3] * ew,
                y = p[4] * ex + p[5] * ey + p[6] * ez + p[7] * ew,
                z = p[8] * ex + p[9] * ey + p[10] * ez + p[11] * ew,
                w = p[12] * ex + p[13] * ey + p[14] * ez + p[15] * ew,
                viewport = this.viewport;

            if (w === 0) {
                return false;
            }

            // Complete the conversion from model coordinates to clip coordinates by dividing by W. The resultant X, Y
            // and Z coordinates are in the range [-1,1].
            x /= w;
            y /= w;
            z /= w;

            // Clip the point against the near and far clip planes.
            if (z < -1 || z > 1) {
                return false;
            }

            // Transform the Z eye coordinate to clip coordinates again, this time applying a depth offset. The depth
            // offset is applied only to the matrix element affecting the projected Z coordinate, so we inline the
            // computation here instead of re-computing X, Y, Z and W in order to improve performance. See
            // Matrix.offsetProjectionDepth for more information on the effect of this offset.
            z = p[8] * ex + p[9] * ey + p[10] * ez * (1 + depthOffset) + p[11] * ew;
            z /= w;

            // Clamp the point to the near and far clip planes. We know the point's original Z value is contained within
            // the clip planes, so we limit its offset z value to the range [-1, 1] in order to ensure it is not clipped
            // by WebGL. In clip coordinates the near and far clip planes are perpendicular to the Z axis and are
            // located at -1 and 1, respectively.
            z = WWMath.clamp(z, -1, 1);

            // Convert the point from clip coordinates to the range [0, 1]. This enables the XY coordinates to be
            // converted to screen coordinates, and the Z coordinate to represent a depth value in the range [0, 1].
            x = x * 0.5 + 0.5;
            y = y * 0.5 + 0.5;
            z = z * 0.5 + 0.5;

            // Convert the X and Y coordinates from the range [0,1] to screen coordinates.
            x = x * viewport.width + viewport.x;
            y = y * viewport.height + viewport.y;

            result[0] = x;
            result[1] = y;
            result[2] = z;

            return true;
        };

        /**
         * Transforms the specified screen point from WebGL screen coordinates to model coordinates.
         * <p>
         * The screen point is understood to be in WebGL screen coordinates, with the origin in the bottom-left corner
         * and axes that extend up and to the right from the origin.
         * <p>
         * This function stores the transformed point in the result argument, and returns true or false to indicate whether the
         * transformation is successful. It returns false if this navigator state's modelview or projection matrices
         * are malformed, or if the screenPoint is clipped by the near clipping plane or the far clipping plane.
         *
         * @param {Vec3} screenPoint The screen coordinate point to un-project.
         * @param {Vec3} result A pre-allocated vector in which to return the unprojected point.
         * @returns {boolean} true if the transformation is successful, otherwise false.
         * @throws {ArgumentError} If either the specified point or result argument is null or undefined.
         */
        NavigatorState.prototype.unProject = function (screenPoint, result) {
            if (!screenPoint) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "NavigatorState", "unProject",
                    "missingPoint"));
            }

            if (!result) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "NavigatorState", "unProject",
                    "missingResult"));
            }

            var sx = screenPoint[0],
                sy = screenPoint[1],
                sz = screenPoint[2],
                viewport = this.viewport;

            // Convert the XY screen coordinates to coordinates in the range [0, 1]. This enables the XY coordinates to
            // be converted to clip coordinates.
            sx = (sx - viewport.x) / viewport.width;
            sy = (sy - viewport.y) / viewport.height;

            // Convert from coordinates in the range [0, 1] to clip coordinates in the range [-1, 1].
            sx = sx * 2 - 1;
            sy = sy * 2 - 1;
            sz = sz * 2 - 1;

            // Clip the point against the near and far clip planes. In clip coordinates the near and far clip planes are
            // perpendicular to the Z axis and are located at -1 and 1, respectively.
            if (sz < -1 || sz > 1) {
                return false;
            }

            // Transform the screen point from clip coordinates to model coordinates. This inverts the Z axis and stores
            // the negative of the eye coordinate Z value in the W coordinate.
            var m = this.modelviewProjectionInv,
                x = m[0] * sx + m[1] * sy + m[2] * sz + m[3],
                y = m[4] * sx + m[5] * sy + m[6] * sz + m[7],
                z = m[8] * sx + m[9] * sy + m[10] * sz + m[11],
                w = m[12] * sx + m[13] * sy + m[14] * sz + m[15];

            if (w === 0) {
                return false;
            }

            // Complete the conversion from model coordinates to clip coordinates by dividing by W.
            result[0] = x / w;
            result[1] = y / w;
            result[2] = z / w;

            return true;
        };

        /**
         * Converts a WebGL screen point to window coordinates.
         * <p>
         * The specified point is understood to be in WebGL screen coordinates, with the origin in the bottom-left
         * corner and axes that extend up and to the right from the origin point.
         * <p>
         * The returned point is in the window coordinate system of the WorldWindow, with the origin in the top-left
         * corner and axes that extend down and to the right from the origin point.
         *
         * @param {Vec2} screenPoint The screen point to convert.
         * @param {Vec2} result A pre-allocated {@link Vec2} in which to return the computed point.
         * @returns {Vec2} The specified result argument set to the computed point.
         * @throws {ArgumentError} If either argument is null or undefined.
         */
        NavigatorState.prototype.convertPointToWindow = function (screenPoint, result) {
            if (!screenPoint) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "NavigatorState", "convertPointToWindow",
                    "missingPoint"));
            }

            if (!result) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "NavigatorState", "convertPointToWindow",
                    "missingResult"));
            }

            result[0] = screenPoint[0];
            result[1] = this.viewport.height - screenPoint[1];

            return result;
        };

        /**
         * Converts a window-coordinate point to WebGL screen coordinates.
         * <p>
         * The specified point is understood to be in the window coordinate system of the WorldWindow, with the origin
         * in the top-left corner and axes that extend down and to the right from the origin point.
         * <p>
         * The returned point is in WebGL screen coordinates, with the origin in the bottom-left corner and axes that
         * extend up and to the right from the origin point.
         *
         * @param {Vec2} point The window-coordinate point to convert.
         * @param {Vec2} result A pre-allocated {@link Vec2} in which to return the computed point.
         * @returns {Vec2} The specified result argument set to the computed point.
         * @throws {ArgumentError} If either argument is null or undefined.
         */
        NavigatorState.prototype.convertPointToViewport = function (point, result) {
            if (!point) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "NavigatorState", "convertPointToViewport",
                    "missingPoint"));
            }

            if (!result) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "NavigatorState", "convertPointToViewport",
                    "missingResult"));
            }

            result[0] = point[0];
            result[1] = this.viewport.height - point[1];

            return result;
        };

        /**
         * Computes a ray originating at the navigator's eyePoint and extending through the specified point in window
         * coordinates.
         * <p>
         * The specified point is understood to be in the window coordinate system of the WorldWindow, with the origin
         * in the top-left corner and axes that extend down and to the right from the origin point.
         * <p>
         * The results of this method are undefined if the specified point is outside of the WorldWindow's
         * bounds.
         *
         * @param {Vec2} point The window coordinates point to compute a ray for.
         * @returns {Line} A new Line initialized to the origin and direction of the computed ray, or null if the
         * ray could not be computed.
         */
        NavigatorState.prototype.rayFromScreenPoint = function (point) {
            if (!point) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "NavigatorState", "rayFromScreenPoint",
                    "missingPoint"));
            }

            // Convert the point's xy coordinates from window coordinates to WebGL screen coordinates.
            var screenPoint = this.convertPointToViewport(point, new Vec3(0, 0, 0)),
                nearPoint = new Vec3(0, 0, 0),
                farPoint = new Vec3(0, 0, 0);

            // Compute the model coordinate point on the near clip plane with the xy coordinates and depth 0.
            if (!this.unProject(screenPoint, nearPoint)) {
                return null;
            }

            // Compute the model coordinate point on the far clip plane with the xy coordinates and depth 1.
            screenPoint[2] = 1;
            if (!this.unProject(screenPoint, farPoint)) {
                return null;
            }

            // Compute a ray originating at the eye point and with direction pointing from the xy coordinate on the near
            // plane to the same xy coordinate on the far plane.
            var origin = new Vec3(this.eyePoint[0], this.eyePoint[1], this.eyePoint[2]),
                direction = new Vec3(farPoint[0], farPoint[1], farPoint[2]);

            direction.subtract(nearPoint);
            direction.normalize();

            return new Line(origin, direction);
        };

        /**
         * Computes the approximate size of a pixel at a specified distance from the navigator's eye point.
         * <p>
         * This method assumes rectangular pixels, where pixel coordinates denote
         * infinitely thin spaces between pixels. The units of the returned size are in model coordinates per pixel
         * (usually meters per pixel). This returns 0 if the specified distance is zero. The returned size is undefined
         * if the distance is less than zero.
         *
         * @param {Number} distance The distance from the eye point at which to determine pixel size, in model
         * coordinates.
         * @returns {Number} The approximate pixel size at the specified distance from the eye point, in model
         * coordinates per pixel.
         */
        NavigatorState.prototype.pixelSizeAtDistance = function (distance) {
            // Compute the pixel size from the width of a rectangle carved out of the frustum in model coordinates at
            // the specified distance along the -Z axis and the viewport width in screen coordinates. The pixel size is
            // expressed in model coordinates per screen coordinate (e.g. meters per pixel).
            //
            // The frustum width is determined by noticing that the frustum size is a linear function of distance from
            // the eye point. The linear equation constants are determined during initialization, then solved for
            // distance here.
            //
            // This considers only the frustum width by assuming that the frustum and viewport share the same aspect
            // ratio, so that using either the frustum width or height results in the same pixel size.

            return this.pixelSizeScale * distance + this.pixelSizeOffset;
        };

        return NavigatorState;
    });