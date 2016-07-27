/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports SkyboxLayer
 */

define([
        './Layer',
        '../geom/Matrix',
        '../shaders/SkyboxProgram'
    ],
    function (Layer,
              Matrix,
              SkyboxProgram) {
        'use strict';

        /**
         * Constructs a Skybox layer
         * @alias SkyboxLayer
         * @constructor
         * @augments Layer
         * @classdesc Represents skybox.
         * @param {Object} imageUrls The image urls for the skybox.
         * @param {WorldWindow} wwd The WOrldWindow instance.
         * @example new SkyboxLayer({
         *              posX: 'images/space_PosX.png',
         *              negX: 'images/space_NegX.png',
         *              posY: 'images/space_PosY.png',
         *              negY: 'images/space_NegY.png',
         *              posZ: 'images/space_PosZ.png',
         *              negZ: 'images/space_NegZ.png'
         *          }, wwd);
         */
        var SkyboxLayer = function (imageUrls, wwd) {

            Layer.call(this, "Skybox");

            //Documented in defineProperties below.
            this._imageUrls = imageUrls || this.getDefaultImageUrls();

            //Documented in defineProperties below.
            this._wwd = wwd;

            //Disable picking for the skybox.
            this.pickEnabled = false;

            //Internal use. The number of triangles to draw.
            this._numTriangles = 36;

            //Internal use. The cache key for the vertex positions.
            this._positionsCacheKey = 'skyboxPositions';

            //Internal use. The skybox mvp matrix.
            this._mvpMatrix = Matrix.fromIdentity();

            //Internal use. A minimum scale so that the skybox is not to small.
            this._minScale = 10000000;

        };

        SkyboxLayer.prototype = Object.create(Layer.prototype);

        Object.defineProperties(SkyboxLayer.prototype, {
            /**
             * The WorldWindow instance.
             * @memberof SkyboxLayer.prototype
             * @type {WorldWindow}
             */
            wwd: {
                set: function (value) {
                    this._wwd = wwd;
                }
            },

            /**
             * The image urls for the skybox.
             * @memberof SkyboxLayer.prototype
             * @type {Object}
             * @example
             * {
             *      posX: 'images/space_PosX.png',
             *      negX: 'images/space_NegX.png',
             *      posY: 'images/space_PosY.png',
             *      negY: 'images/space_NegY.png',
             *      posZ: 'images/space_PosZ.png',
             *      negZ: 'images/space_NegZ.png'
             * }
             */
            imageUrls: {
                get: function () {
                    return this._imageUrls;
                },
                set: function (value) {
                    this._imageUrls = value;
                }
            }
        });

        //Internal use. Intentionally not documented.
        SkyboxLayer.prototype.doRender = function (dc) {
            if (dc.globe.is2D() || !this._wwd || !this._imageUrls) {
                return;
            }

            var gl = dc.currentGlContext,
                program = dc.findAndBindProgram(SkyboxProgram),
                viewport = this._wwd.viewport,
                range = this._wwd.navigator.range,
                vboId;

            var texture = dc.gpuResourceCache.resourceForKey(this._imageUrls.posX);
            if (!texture) {
                dc.gpuResourceCache.retrieveCubeMapTextures(gl, this._imageUrls);
                return;
            }

            texture.bind(dc);
            program.loadTextureUnit(gl, gl.TEXTURE0);

            //In portrait mode the skybox does not fill the whole height.
            //Makes the skybox bigger in portrait mode.
            var aspect = 1;
            if (viewport.width < viewport.height) {
                aspect = viewport.width / viewport.height
            }

            //Make sure the box is bigger then the globe.
            var scale = Math.max(range, this._minScale) / aspect;

            this._mvpMatrix.copy(dc.navigatorState.modelviewProjection);

            //remove the translations so that the box does not move and remains at the center of the scene.
            this._mvpMatrix[3] = 0;
            this._mvpMatrix[7] = 0;
            this._mvpMatrix[11] = 0;

            this._mvpMatrix.multiplyByScale(scale, scale, scale);
            program.loadModelviewProjection(gl, this._mvpMatrix);

            vboId = dc.gpuResourceCache.resourceForKey(this._positionsCacheKey);
            if (!vboId) {
                var positions = this.getVertexPositions();
                this._numTriangles = Math.floor(positions.length / 3);
                vboId = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
                gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
                dc.gpuResourceCache.putResource(this._positionsCacheKey, vboId, positions.length * 4);
                dc.frameStatistics.incrementVboLoadCount(1);
            }
            else {
                gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
                dc.frameStatistics.incrementVboLoadCount(1);
            }

            gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(0);

            //Disable depth writes so that the skybox does not occlude the globe.
            gl.depthMask(false);

            gl.drawArrays(gl.TRIANGLES, 0, this._numTriangles);

            gl.depthMask(true);
        };

        //Internal use. Intentionally not documented.
        //Default images for the skybox.
        SkyboxLayer.prototype.getDefaultImageUrls = function () {
            var baseUrl = WorldWind.configuration.baseUrl + 'images/';
            return {
                posX: baseUrl + 'space_PosX.png',
                negX: baseUrl + 'space_NegX.png',
                posY: baseUrl + 'space_PosY.png',
                negY: baseUrl + 'space_NegY.png',
                posZ: baseUrl + 'space_PosZ.png',
                negZ: baseUrl + 'space_NegZ.png'
            };
        };

        //Internal use. Intentionally not documented.
        //Returns non-indexed vertex positions of a cube.
        SkyboxLayer.prototype.getVertexPositions = function () {

            var SIZE = 1;

            return new Float32Array([
                -SIZE, SIZE, -SIZE,
                -SIZE, -SIZE, -SIZE,
                SIZE, -SIZE, -SIZE,
                SIZE, -SIZE, -SIZE,
                SIZE, SIZE, -SIZE,
                -SIZE, SIZE, -SIZE,

                -SIZE, -SIZE, SIZE,
                -SIZE, -SIZE, -SIZE,
                -SIZE, SIZE, -SIZE,
                -SIZE, SIZE, -SIZE,
                -SIZE, SIZE, SIZE,
                -SIZE, -SIZE, SIZE,

                SIZE, -SIZE, -SIZE,
                SIZE, -SIZE, SIZE,
                SIZE, SIZE, SIZE,
                SIZE, SIZE, SIZE,
                SIZE, SIZE, -SIZE,
                SIZE, -SIZE, -SIZE,

                -SIZE, -SIZE, SIZE,
                -SIZE, SIZE, SIZE,
                SIZE, SIZE, SIZE,
                SIZE, SIZE, SIZE,
                SIZE, -SIZE, SIZE,
                -SIZE, -SIZE, SIZE,

                -SIZE, SIZE, -SIZE,
                SIZE, SIZE, -SIZE,
                SIZE, SIZE, SIZE,
                SIZE, SIZE, SIZE,
                -SIZE, SIZE, SIZE,
                -SIZE, SIZE, -SIZE,

                -SIZE, -SIZE, -SIZE,
                -SIZE, -SIZE, SIZE,
                SIZE, -SIZE, -SIZE,
                SIZE, -SIZE, -SIZE,
                -SIZE, -SIZE, SIZE,
                SIZE, -SIZE, SIZE
            ]);

        };

        return SkyboxLayer;

    });