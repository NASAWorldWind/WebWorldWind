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
 * @exports ColladaScene
 */

define([
        '../../error/ArgumentError',
        '../../shaders/BasicTextureProgram',
        '../../util/Color',
        '../../util/Logger',
        '../../geom/Matrix',
        '../../geom/Position',
        '../../pick/PickedObject',
        '../../render/Renderable',
        '../../geom/Vec3'
    ],
    function (ArgumentError,
              BasicTextureProgram,
              Color,
              Logger,
              Matrix,
              Position,
              PickedObject,
              Renderable,
              Vec3) {
        "use strict";

        /**
         * Constructs a collada scene
         * @alias ColladaScene
         * @constructor
         * @augments Renderable
         * @classdesc Represents a scene. A scene is a collection of nodes with meshes, materials and textures.
         * @param {Position} position The scene's geographic position.
         * @param {Object} sceneData The scene's data containing the nodes, meshes, materials, textures and other
         * info needed to render the scene.
         */
        var ColladaScene = function (position, sceneData) {

            if (!position) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ColladaScene", "constructor", "missingPosition"));
            }

            Renderable.call(this);

            // Documented in defineProperties below.
            this._position = position;

            // Documented in defineProperties below.
            this._nodes = [];
            this._meshes = {};
            this._materials = {};
            this._images = {};
            this._upAxis = '';
            this._dirPath = '';

            // Documented in defineProperties below.
            this._xRotation = 0;
            this._yRotation = 0;
            this._zRotation = 0;

            // Documented in defineProperties below.
            this._xTranslation = 0;
            this._yTranslation = 0;
            this._zTranslation = 0;

            // Documented in defineProperties below.
            this._scale = 1;

            // Documented in defineProperties below.
            this._altitudeMode = WorldWind.ABSOLUTE;

            // Documented in defineProperties below.
            this._localTransforms = true;

            // Documented in defineProperties below.
            this._useTexturePaths = true;

            // Documented in defineProperties below.
            this._nodesToHide = [];
            this._hideNodes = false;

            this.setSceneData(sceneData);

            // Documented in defineProperties below.
            this._placePoint = new Vec3(0, 0, 0);

            // Documented in defineProperties below.
            this._transformationMatrix = Matrix.fromIdentity();

            // Documented in defineProperties below.
            this._normalMatrix = Matrix.fromIdentity();

            this._texCoordMatrix = Matrix.fromIdentity().setToUnitYFlip();

            this._activeTexture = null;

        };

        ColladaScene.prototype = Object.create(Renderable.prototype);
        ColladaScene.prototype.constructor = ColladaScene;

        Object.defineProperties(ColladaScene.prototype, {

            /**
             * The scene's geographic position.
             * @memberof ColladaScene.prototype
             * @type {Position}
             */
            position: {
                get: function () {
                    return this._position;
                },
                set: function (value) {
                    this._position = value;
                }
            },

            /**
             * An array of nodes extracted from the collada file.
             * @memberof ColladaScene.prototype
             * @type {ColladaNode[]}
             */
            nodes: {
                get: function () {
                    return this._nodes;
                },
                set: function (value) {
                    this._nodes = value;
                }
            },

            /**
             * An object with meshes extracted from the collada file.
             * @memberof ColladaScene.prototype
             * @type {{ColladaMesh}}
             */
            meshes: {
                get: function () {
                    return this._meshes;
                },
                set: function (value) {
                    this._meshes = value;
                }
            },

            /**
             * An object with materials and their effects extracted from the collada file.
             * @memberof ColladaScene.prototype
             * @type {ColladaMaterial}
             */
            materials: {
                get: function () {
                    return this._materials;
                },
                set: function (value) {
                    this._materials = value;
                }
            },

            /**
             * An object with images extracted from the collada file.
             * @memberof ColladaScene.prototype
             * @type {ColladaImage}
             */
            images: {
                get: function () {
                    return this._images;
                },
                set: function (value) {
                    this._images = value;
                }
            },

            /**
             * The up axis of the collada model extracted from the collada file.
             * @memberof ColladaScene.prototype
             * @type {String}
             */
            upAxis: {
                get: function () {
                    return this._upAxis;
                },
                set: function (value) {
                    this._upAxis = value;
                }
            },

            /**
             * The path to the directory of the collada file.
             * @memberof ColladaScene.prototype
             * @type {String}
             */
            dirPath: {
                get: function () {
                    return this._dirPath;
                },
                set: function (value) {
                    this._dirPath = value;
                }
            },

            /**
             * The scene's rotation angle in degrees for the x axis.
             * @memberof ColladaScene.prototype
             * @type {Number}
             */
            xRotation: {
                get: function () {
                    return this._xRotation;
                },
                set: function (value) {
                    this._xRotation = value;
                }
            },

            /**
             * The scene's rotation angle in degrees for the x axis.
             * @memberof ColladaScene.prototype
             * @type {Number}
             */
            yRotation: {
                get: function () {
                    return this._yRotation;
                },
                set: function (value) {
                    this._yRotation = value;
                }
            },

            /**
             * The scene's rotation angle in degrees for the x axis.
             * @memberof ColladaScene.prototype
             * @type {Number}
             */
            zRotation: {
                get: function () {
                    return this._zRotation;
                },
                set: function (value) {
                    this._zRotation = value;
                }
            },

            /**
             * The scene's translation for the x axis.
             * @memberof ColladaScene.prototype
             * @type {Number}
             */
            xTranslation: {
                get: function () {
                    return this._xTranslation;
                },
                set: function (value) {
                    this._xTranslation = value;
                }
            },

            /**
             * The scene's translation for the y axis.
             * @memberof ColladaScene.prototype
             * @type {Number}
             */
            yTranslation: {
                get: function () {
                    return this._yTranslation;
                },
                set: function (value) {
                    this._yTranslation = value;
                }
            },

            /**
             * The scene's translation for the z axis.
             * @memberof ColladaScene.prototype
             * @type {Number}
             */
            zTranslation: {
                get: function () {
                    return this._zTranslation;
                },
                set: function (value) {
                    this._zTranslation = value;
                }
            },

            /**
             * The scene's scale.
             * @memberof ColladaScene.prototype
             * @type {Number}
             */
            scale: {
                get: function () {
                    return this._scale;
                },
                set: function (value) {
                    this._scale = value;
                }
            },

            /**
             * The scene's Cartesian point on the globe for the specified position.
             * @memberof ColladaScene.prototype
             * @type {Vec3}
             */
            placePoint: {
                get: function () {
                    return this._placePoint;
                },
                set: function (value) {
                    this._placePoint = value;
                }
            },

            /**
             * The scene's altitude mode. May be one of
             * <ul>
             *  <li>[WorldWind.ABSOLUTE]{@link WorldWind#ABSOLUTE}</li>
             *  <li>[WorldWind.RELATIVE_TO_GROUND]{@link WorldWind#RELATIVE_TO_GROUND}</li>
             *  <li>[WorldWind.CLAMP_TO_GROUND]{@link WorldWind#CLAMP_TO_GROUND}</li>
             * </ul>
             * @default WorldWind.ABSOLUTE
             * @memberof ColladaScene.prototype
             * @type {String}
             */
            altitudeMode: {
                get: function () {
                    return this._altitudeMode;
                },
                set: function (value) {
                    this._altitudeMode = value;
                }
            },

            /**
             * The scene's transformation matrix containing the scale, rotations and translations
             * @memberof ColladaScene.prototype
             * @type {Matrix}
             */
            transformationMatrix: {
                get: function () {
                    return this._transformationMatrix;
                },
                set: function (value) {
                    this._transformationMatrix = value;
                }
            },

            /**
             * The scene's normal matrix
             * @memberof ColladaScene.prototype
             * @type {Matrix}
             */
            normalMatrix: {
                get: function () {
                    return this._normalMatrix;
                },
                set: function (value) {
                    this._normalMatrix = value;
                }
            },

            /**
             * Force the use of the nodes transformation info. Some 3d software may break the transformations when
             * importing/exporting models to collada format. Set to false to ignore the the nodes transformation.
             * Only use this option if the model does not render properly.
             * @memberof ColladaScene.prototype
             * @default true
             * @type {Boolean}
             */
            localTransforms: {
                get: function () {
                    return this._localTransforms;
                },
                set: function (value) {
                    this._localTransforms = value;
                }
            },

            /**
             * Force the use of the texture path specified in the collada file. Set to false to ignore the paths of the
             * textures in the collada file and instead get the textures from the same dir as the collada file.
             * @memberof ColladaScene.prototype
             * @default true
             * @type {Boolean}
             */
            useTexturePaths: {
                get: function () {
                    return this._useTexturePaths;
                },
                set: function (value) {
                    this._useTexturePaths = value;
                }
            },

            /**
             * An array of node id's to not render.
             * @memberof ColladaScene.prototype
             * @type {String[]}
             */
            nodesToHide: {
                get: function () {
                    return this._nodesToHide;
                },
                set: function (value) {
                    this._nodesToHide = value;
                }
            },

            /**
             * Set to true to force the renderer to not draw the nodes passed to the nodesToHide list.
             * @memberof ColladaScene.prototype
             * @default false
             * @type {Boolean}
             */
            hideNodes: {
                get: function () {
                    return this._hideNodes;
                },
                set: function (value) {
                    this._hideNodes = value;
                }
            }

        });

        // Internal. Intentionally not documented.
        ColladaScene.prototype.setSceneData = function (sceneData) {
            if (sceneData) {
                this.nodes = sceneData.root.children;
                this.meshes = sceneData.meshes;
                this.materials = sceneData.materials;
                this.images = sceneData.images;
                this.upAxis = sceneData.metadata.up_axis;
                this.dirPath = sceneData.dirPath;
            }
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.render = function (dc) {

            var orderedScene;

            if (!this.enabled) {
                return;
            }

            if (this.lastFrameTime !== dc.timestamp) {
                orderedScene = this.makeOrderedRenderable(dc);
            }

            if (!orderedScene) {
                return;
            }

            orderedScene.layer = dc.currentLayer;

            this.lastFrameTime = dc.timestamp;

            dc.addOrderedRenderable(orderedScene);
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.makeOrderedRenderable = function (dc) {

            dc.surfacePointForMode(this.position.latitude, this.position.longitude, this.position.altitude,
                this.altitudeMode, this.placePoint);

            this.eyeDistance = dc.navigatorState.eyePoint.distanceTo(this.placePoint);

            return this;

        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.renderOrdered = function (dc) {

            this.drawOrderedScene(dc);

            if (dc.pickingMode) {
                var po = new PickedObject(this.pickColor.clone(), this,
                    this.position, this.layer, false);

                dc.resolvePick(po);
            }
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.drawOrderedScene = function (dc) {

            this.beginDrawing(dc);

            try {
                this.doDrawOrderedScene(dc);
            }
            finally {
                this.endDrawing(dc);
            }

        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.beginDrawing = function (dc) {

            var gl = dc.currentGlContext;

            dc.findAndBindProgram(BasicTextureProgram);

            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.doDrawOrderedScene = function (dc) {

            if (dc.pickingMode) {
                this.pickColor = dc.uniquePickColor();
            }

            this.computeTransformationMatrix(dc.globe);

            for (var i = 0, nodesLen = this.nodes.length; i < nodesLen; i++) {
                this.traverseNodeTree(dc, this.nodes[i]);
            }
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.traverseNodeTree = function (dc, node) {

            var renderNode = this.mustRenderNode(node.id);

            if (renderNode) {

                if (node.mesh) {
                    var meshKey = node.mesh;
                    var buffers = this.meshes[meshKey].buffers;

                    for (var i = 0, bufLen = buffers.length; i < bufLen; i++) {

                        var materialBuf = buffers[i].material;

                        for (var j = 0; j < node.materials.length; j++) {
                            if (materialBuf === node.materials[j].symbol) {
                                var materialKey = node.materials[j].id;
                                break;
                            }
                        }

                        var material = this.materials[materialKey];

                        this.draw(dc, buffers[i], material, node.worldMatrix, node.normalMatrix);
                    }
                }

                for (var k = 0; k < node.children.length; k++) {
                    this.traverseNodeTree(dc, node.children[k]);
                }
            }

        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.draw = function (dc, buffers, material, nodeWorldMatrix, nodeNormalMatrix) {

            var gl = dc.currentGlContext,
                program = dc.currentProgram,
                vboId;

            this.applyVertices(dc, buffers);

            program.loadTextureEnabled(gl, false);

            this.applyColor(dc, material);

            var hasTexture = (material && material.textures != null && buffers.uvs && buffers.uvs.length > 0);
            if (hasTexture) {
                this.applyTexture(dc, buffers, material);
            }

            var hasLighting = (buffers.normals != null && buffers.normals.length > 0);
            if (hasLighting && !dc.pickingMode) {
                this.applyLighting(dc, buffers);
            }

            this.applyMatrix(dc, hasLighting, hasTexture , nodeWorldMatrix, nodeNormalMatrix);

            if (buffers.indexedRendering) {
                this.applyIndices(dc, buffers);
                gl.drawElements(gl.TRIANGLES, buffers.indices.length, gl.UNSIGNED_SHORT, 0);
            }
            else {
                gl.drawArrays(gl.TRIANGLES, 0, Math.floor(buffers.vertices.length / 3));
            }

            this.resetDraw(dc, hasLighting, hasTexture);

        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.applyVertices = function (dc, buffers) {

            var gl = dc.currentGlContext,
                program = dc.currentProgram,
                vboId;

            if (!buffers.verticesVboCacheKey) {
                buffers.verticesVboCacheKey = dc.gpuResourceCache.generateCacheKey();
            }

            vboId = dc.gpuResourceCache.resourceForKey(buffers.verticesVboCacheKey);
            if (!vboId) {
                vboId = gl.createBuffer();
                dc.gpuResourceCache.putResource(buffers.verticesVboCacheKey, vboId,
                    buffers.vertices.length);
                buffers.refreshVertexBuffer = true;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
            if (buffers.refreshVertexBuffer) {
                gl.bufferData(gl.ARRAY_BUFFER, buffers.vertices, gl.STATIC_DRAW);
                dc.frameStatistics.incrementVboLoadCount(1);
                buffers.refreshVertexBuffer = false;
            }

            gl.enableVertexAttribArray(program.vertexPointLocation);
            gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);

        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.applyColor = function (dc, material) {

            var gl = dc.currentGlContext,
                program = dc.currentProgram;

            if (material) {
                if (material.techniqueType === 'constant') {
                    var diffuse = material.reflective;
                }
                else {
                    diffuse = material.diffuse;
                }
            }

            var opacity;
            var r = 1, g = 1, b = 1, a = 1;

            if (diffuse) {
                r = diffuse[0];
                g = diffuse[1];
                b = diffuse[2];
                a = diffuse[3] != null ? diffuse[3] : 1;
            }

            var color = new Color(r, g, b, a);
            opacity = a * dc.currentLayer.opacity;
            gl.depthMask(opacity >= 1 || dc.pickingMode);
            program.loadColor(gl, dc.pickingMode ? this.pickColor : color);
            program.loadOpacity(gl, dc.pickingMode ? (opacity > 0 ? 1 : 0) : opacity);
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.applyTexture = function (dc, buffers, material) {

            var textureBound, vboId,
                gl = dc.currentGlContext,
                program = dc.currentProgram,
                wrapMode;

            if (material.textures.diffuse) {
                var imageKey = material.textures.diffuse.mapId;
            }
            else {
                imageKey = material.textures.reflective.mapId;
            }

            var image = this.useTexturePaths ? this.images[imageKey].path : this.images[imageKey].filename;

            this._activeTexture = dc.gpuResourceCache.resourceForKey(this.dirPath + image + "");
            if (!this._activeTexture) {
                wrapMode = buffers.isClamp ? gl.CLAMP_TO_EDGE : gl.REPEAT;
                this._activeTexture = dc.gpuResourceCache.retrieveTexture(gl, this.dirPath + image + "", wrapMode);
            }
            textureBound = this._activeTexture && this._activeTexture.bind(dc);

            if (textureBound) {
                if (!buffers.texCoordsVboCacheKey) {
                    buffers.texCoordsVboCacheKey = dc.gpuResourceCache.generateCacheKey();
                }

                vboId = dc.gpuResourceCache.resourceForKey(buffers.texCoordsVboCacheKey);
                if (!vboId) {
                    vboId = gl.createBuffer();
                    dc.gpuResourceCache.putResource(buffers.texCoordsVboCacheKey, vboId, buffers.uvs.length);
                    buffers.refreshTexCoordBuffer = true;
                }

                gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
                if (buffers.refreshTexCoordBuffer) {
                    gl.bufferData(gl.ARRAY_BUFFER, buffers.uvs, gl.STATIC_DRAW);
                    dc.frameStatistics.incrementVboLoadCount(1);
                    buffers.refreshTexCoordBuffer = false;
                }

                program.loadTextureEnabled(gl, true);
                gl.enableVertexAttribArray(program.vertexTexCoordLocation);
                gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, gl.FLOAT, false, 0, 0);
                program.loadTextureUnit(gl, gl.TEXTURE0);
                program.loadModulateColor(gl, dc.pickingMode);
            }
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.applyLighting = function (dc, buffers) {

            var vboId,
                gl = dc.currentGlContext,
                program = dc.currentProgram;

            program.loadApplyLighting(gl, true);
            if (!buffers.normalsVboCacheKey) {
                buffers.normalsVboCacheKey = dc.gpuResourceCache.generateCacheKey();
            }

            vboId = dc.gpuResourceCache.resourceForKey(buffers.normalsVboCacheKey);
            if (!vboId) {
                vboId = gl.createBuffer();
                dc.gpuResourceCache.putResource(buffers.normalsVboCacheKey, vboId, buffers.normals.length);
                buffers.refreshNormalBuffer = true;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
            if (buffers.refreshNormalBuffer) {
                gl.bufferData(gl.ARRAY_BUFFER, buffers.normals, gl.STATIC_DRAW);
                dc.frameStatistics.incrementVboLoadCount(1);
                buffers.refreshNormalBuffer = false;
            }

            gl.enableVertexAttribArray(program.normalVectorLocation);
            gl.vertexAttribPointer(program.normalVectorLocation, 3, gl.FLOAT, false, 0, 0);
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.applyMatrix = function (dc, hasLighting, hasTexture, nodeWorldMatrix, nodeNormalMatrix) {

            var mvpMatrix = Matrix.fromIdentity();

            mvpMatrix.copy(dc.navigatorState.modelviewProjection);

            mvpMatrix.multiplyMatrix(this.transformationMatrix);

            if (nodeWorldMatrix && this.localTransforms) {
                mvpMatrix.multiplyMatrix(nodeWorldMatrix);
            }

            if (hasLighting && !dc.pickingMode) {

                var normalMatrix = Matrix.fromIdentity();

                normalMatrix.copy(dc.navigatorState.modelviewNormalTransform);

                normalMatrix.multiplyMatrix(this.normalMatrix);

                if (nodeNormalMatrix && this.localTransforms) {
                    normalMatrix.multiplyMatrix(nodeNormalMatrix);
                }

                dc.currentProgram.loadModelviewInverse(dc.currentGlContext, normalMatrix);
            }

            if (hasTexture && this._activeTexture){
                dc.currentProgram.loadTextureMatrix(dc.currentGlContext, this._texCoordMatrix);
                this._activeTexture = null;
            }

            dc.currentProgram.loadModelviewProjection(dc.currentGlContext, mvpMatrix);

        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.applyIndices = function (dc, buffers) {

            var gl = dc.currentGlContext,
                vboId;

            if (!buffers.indicesVboCacheKey) {
                buffers.indicesVboCacheKey = dc.gpuResourceCache.generateCacheKey();
            }

            vboId = dc.gpuResourceCache.resourceForKey(buffers.indicesVboCacheKey);
            if (!vboId) {
                vboId = gl.createBuffer();
                dc.gpuResourceCache.putResource(buffers.indicesVboCacheKey, vboId, buffers.indices.length);
                buffers.refreshIndicesBuffer = true;
            }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vboId);
            if (buffers.refreshIndicesBuffer) {
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, buffers.indices, gl.STATIC_DRAW);
                dc.frameStatistics.incrementVboLoadCount(1);
                buffers.refreshIndicesBuffer = false;
            }

        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.resetDraw = function (dc, hasLighting, hasTexture) {

            var gl = dc.currentGlContext,
                program = dc.currentProgram;

            if (hasLighting && !dc.pickingMode) {
                program.loadApplyLighting(gl, false);
                gl.disableVertexAttribArray(program.normalVectorLocation);
            }

            if (hasTexture) {
                gl.disableVertexAttribArray(program.vertexTexCoordLocation);
            }

            gl.disableVertexAttribArray(program.vertexPointLocation);
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.endDrawing = function (dc) {
            dc.bindProgram(null);
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.computeTransformationMatrix = function (globe) {

            this.transformationMatrix = Matrix.fromIdentity();

            this.transformationMatrix.multiplyByLocalCoordinateTransform(this.placePoint, globe);

            this.transformationMatrix.multiplyByRotation(1, 0, 0, this.xRotation);
            this.transformationMatrix.multiplyByRotation(0, 1, 0, this.yRotation);
            this.transformationMatrix.multiplyByRotation(0, 0, 1, this.zRotation);

            this.transformationMatrix.multiplyByScale(this.scale, this.scale, this.scale);

            this.transformationMatrix.multiplyByTranslation(this.xTranslation, this.yTranslation, this.zTranslation);

            this.computeNormalMatrix();

        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.computeNormalMatrix = function () {

            var rotAngles = new Vec3(0, 0, 0);

            this.transformationMatrix.extractRotationAngles(rotAngles);

            this.normalMatrix = Matrix.fromIdentity();

            this.normalMatrix.multiplyByRotation(-1, 0, 0, rotAngles[0]);
            this.normalMatrix.multiplyByRotation(0, -1, 0, rotAngles[1]);
            this.normalMatrix.multiplyByRotation(0, 0, -1, rotAngles[2]);
        };

        // Internal. Intentionally not documented.
        ColladaScene.prototype.mustRenderNode = function (nodeId) {
            var draw = true;
            if (this.hideNodes) {
                var pos = this.nodesToHide.indexOf(nodeId);
                draw = (pos === -1);
            }
            return draw;
        };

        return ColladaScene;

    });