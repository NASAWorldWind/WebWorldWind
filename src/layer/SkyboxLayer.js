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
         * @classdesc Represents skybox. If used together with the AtmosphereLayer, the SkyboxLayer must be added
         * before the AtmosphereLayer.
         * @param {Object} imageUrls The image urls for the skybox.
         * @example new SkyboxLayer({
         *              posX: 'images/space_PosX.png',
         *              negX: 'images/space_NegX.png',
         *              posY: 'images/space_PosY.png',
         *              negY: 'images/space_NegY.png',
         *              posZ: 'images/space_PosZ.png',
         *              negZ: 'images/space_NegZ.png'
         *          });
         */
        var SkyboxLayer = function (imageUrls) {

            Layer.call(this, 'Skybox');

            //Documented in defineProperties below.
            this._imageUrls = imageUrls || this.getDefaultImageUrls();

            //Disable picking for the skybox.
            this.pickEnabled = false;

            //Internal use. The number of triangles to draw.
            this._numTriangles = 36;

            //Internal use. The cache key for the vertex positions.
            this._positionsCacheKey = 'skyboxPositions';

        };

        SkyboxLayer.prototype = Object.create(Layer.prototype);

        Object.defineProperties(SkyboxLayer.prototype, {
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
            if (dc.globe.is2D()) {
                return;
            }

            var gl = dc.currentGlContext,
                program = dc.findAndBindProgram(SkyboxProgram),
                vboId;

            var texture = dc.gpuResourceCache.resourceForKey(this._imageUrls.posX);
            if (!texture) {
                dc.gpuResourceCache.retrieveCubeMapTextures(gl, this._imageUrls);
                return;
            }

            texture.bind(dc);
            program.loadTextureUnit(gl, gl.TEXTURE0);
            program.loadModelviewProjection(gl, dc.navigatorState.infiniteModelviewProjection);

            vboId = dc.gpuResourceCache.resourceForKey(this._positionsCacheKey);
            if (!vboId) {
                var positions = this.getVertexPositions();
                this._numTriangles = Math.floor(positions.length / 3);
                vboId = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
                gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
                dc.gpuResourceCache.putResource(this._positionsCacheKey, vboId, positions.length * 4);
            }
            else {
                gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
            }
            dc.frameStatistics.incrementVboLoadCount(1);

            gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(0);

            //Disable depth writes so that the skybox does not occlude the globe.
            gl.depthMask(false);

            gl.drawArrays(gl.TRIANGLES, 0, this._numTriangles);

            gl.disableVertexAttribArray(0);
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

            var SIZE = Number.MAX_SAFE_INTEGER || 9007199254740991; //(2 ^ 53) - 1;

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