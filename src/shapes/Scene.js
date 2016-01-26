/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports Scene
 */

define([
        '../shaders/BasicTextureProgram',
        '../geom/BoundingBox',
        '../util/Color',
        '../geom/Matrix',
        '../util/Offset',
        '../geom/Position',
        '../pick/PickedObject',
        '../render/Renderable',
        '../geom/Vec2',
        '../geom/Vec3'
    ],
    function (BasicTextureProgram, BoundingBox, Color, Matrix, Offset, Position, PickedObject, Renderable, Vec2, Vec3) {
        "use strict";

        /**
         * Constructs a scene
         * @alias Scene
         * @augments Renderable
         * @classdesc Represents a Scene shape. A scene is a collection of nodes with meshes, materials and textures.
         * @param {Position} position The scene's geographic position.
         * @param {Object} sceneData The scene's data containing the nodes, meshes, materials, textures and other
         * info needed to render the scene.
         */

        var Scene = function (position, sceneData) {

            Renderable.call(this);

            this.position = new Position(0, 0, 0);

            this.setPosition(position);
            this.add(sceneData);

            //the scale of the scene
            this.scale = 1;

            //the rotation around the three axes
            this.xRotation = 0;
            this.yRotation = 0;
            this.zRotation = 0;

            //the place point of the scene on the globe
            this.placePoint = new Vec3(0, 0, 0);

            /**
             * The scene's altitude mode. May be one of
             * <ul>
             *  <li>[WorldWind.ABSOLUTE]{@link WorldWind#ABSOLUTE}</li>
             *  <li>[WorldWind.RELATIVE_TO_GROUND]{@link WorldWind#RELATIVE_TO_GROUND}</li>
             *  <li>[WorldWind.CLAMP_TO_GROUND]{@link WorldWind#CLAMP_TO_GROUND}</li>
             * </ul>
             * @default WorldWind.ABSOLUTE
             */
            this.altitudeMode = WorldWind.ABSOLUTE;

            this.layer = null;

            this.localTransforms = true;

            //the scene's transformation matrix
            this.transformationMatrix = null;

            //the scene's rotation matrix
            this.rotationMatrix = null;

            //the scene's bounding box
            this.boundingBox = null;
        };

        Scene.prototype = Object.create(Renderable.prototype);

        Scene.prototype.constructor = Scene;

        /**
         * Sets the geographic position of the scene.
         * @param {Position} position The scene's geographic position.
         */
        Scene.prototype.setPosition = function (position) {
            if (position) {
                this.position.latitude = position.latitude;
                this.position.longitude = position.longitude;
                this.position.altitude = position.altitude;
            }
        };

        /**
         * Sets the altitude mode of the scene.
         * @param {String} altitudeMode The scene's altitude mode.
         */
        Scene.prototype.setAltitudeMode = function (altitudeMode) {
            this.altitudeMode = altitudeMode;
        };

        /**
         * Force the use of the nodes transformation info.
         * @param {Boolean} useLocalTransforms
         */
        Scene.prototype.useLocalTransforms = function (useLocalTransforms) {
            this.localTransforms = useLocalTransforms;
        };

        /**
         * Sets the scale of the scene.
         * @param {Number} scale The scene's scale.
         */
        Scene.prototype.setScale = function (scale) {
            this.scale = scale;
            this.computeTransformationMatrix();
        };

        /**
         * Sets the rotation of the scene along the three axes.
         * @param {Number} x The scene's rotation angle in degrees for the x axis.
         * @param {Number} y The scene's rotation angle in degrees for the y axis.
         * @param {Number} z The scene's rotation angle in degrees for the z axis.
         */
        Scene.prototype.setRotation = function (x, y, z) {
            this.xRotation = x;
            this.yRotation = y;
            this.zRotation = z;
            this.computeRotationMatrix();
            this.computeTransformationMatrix();
        };

        /**
         * Sets the rotation of the scene along the x axis.
         * @param {Number} x The scene's rotation angle in degrees for the x axis.
         */
        Scene.prototype.setRotationX = function (x) {
            this.xRotation = x;
            this.computeRotationMatrix();
            this.computeTransformationMatrix();
        };

        /**
         * Sets the rotation of the scene along the y axis.
         * @param {Number} y The scene's rotation angle in degrees for the y axis.
         */
        Scene.prototype.setRotationY = function (y) {
            this.yRotation = y;
            this.computeRotationMatrix();
            this.computeTransformationMatrix();
        };

        /**
         * Sets the rotation of the scene along the z axis.
         * @param {Number} z The scene's rotation angle in degrees for the z axis.
         */
        Scene.prototype.setRotationZ = function (z) {
            this.zRotation = z;
            this.computeRotationMatrix();
            this.computeTransformationMatrix();
        };

        /**
         * Adds the data needed to render this scene.
         * @param {Object} sceneData The scene's data containing the nodes, meshes, materials, textures and other
         * info needed to render the scene.
         */
        Scene.prototype.add = function (sceneData) {

            if (sceneData) {

                this.nodes = sceneData.root.children;
                this.meshes = sceneData.meshes;
                this.materials = sceneData.materials;
                this.images = sceneData.images;
                this.upAxis = sceneData.metadata.up_axis;
                this.filePath = sceneData.filePath;

            }
        };

        // Internal. Intentionally not documented.
        Scene.prototype.renderOrdered = function (dc) {

            this.drawOrderedScene(dc);

            if (dc.pickingMode) {
                var po = new PickedObject(this.pickColor.clone(), this,
                    this.position, this.layer, false);

                dc.resolvePick(po);
            }
        };

        // Internal. Intentionally not documented.
        Scene.prototype.drawOrderedScene = function (dc) {

            this.beginDrawing(dc);

            try {
                this.doDrawOrderedScene(dc);
            }
            finally {
                this.endDrawing(dc);
            }
        };

        // Internal. Intentionally not documented.
        Scene.prototype.beginDrawing = function (dc) {
            var gl = dc.currentGlContext;

            dc.findAndBindProgram(BasicTextureProgram);

            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);
        };

        // Internal. Intentionally not documented.
        Scene.prototype.endDrawing = function (dc) {
            dc.bindProgram(null);
        };

        // Internal. Intentionally not documented.
        Scene.prototype.doDrawOrderedScene = function (dc) {

            if (dc.pickingMode) {
                this.pickColor = dc.uniquePickColor();
            }

            for (var i = 0, nodesLen = this.nodes.length; i < nodesLen; i++) {
                this.traverseNodeTree(dc, this.nodes[i]);
            }
        };

        // Internal. Intentionally not documented.
        Scene.prototype.traverseNodeTree = function (dc, node) {

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

        };

        // Internal. Intentionally not documented.
        Scene.prototype.draw = function (dc, buffers, material, nodeWorldMatrix, nodeNormalMatrix) {

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

            program.loadTextureEnabled(gl, false);

            this.applyColor(dc, material);

            var hasTexture = (material && material.textures != null && buffers.uvs && buffers.uvs.length);
            if (hasTexture) {
                this.applyTexture(dc, buffers, material);
            }

            var hasLighting = (buffers.normals != null && buffers.normals.length > 0);
            if (hasLighting) {
                this.applyLighting(dc, buffers);
            }

            this.applyMatrix(dc, hasLighting, nodeWorldMatrix, nodeNormalMatrix);

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

            gl.drawElements(gl.TRIANGLES, buffers.indices.length, gl.UNSIGNED_SHORT, 0);

            this.resetDraw(dc, hasLighting, hasTexture);

        };

        // Internal. Intentionally not documented.
        Scene.prototype.render = function (dc) {

            var orderedScene;
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
        Scene.prototype.makeOrderedRenderable = function (dc) {

            var refPt = new Vec3(0, 0, 0);
            this.globe = dc.globe;

            dc.surfacePointForMode(this.position.latitude, this.position.longitude, this.position.altitude,
                this.altitudeMode, refPt);

            if (refPt[0] !== this.placePoint[0] ||
                refPt[1] !== this.placePoint[1] ||
                refPt[2] !== this.placePoint[2]) {

                this.placePoint[0] = refPt[0];
                this.placePoint[1] = refPt[1];
                this.placePoint[2] = refPt[2];

                this.computeRotationMatrix();
                this.computeTransformationMatrix();
                this.eyeDistance = dc.navigatorState.eyePoint.distanceTo(this.placePoint);
            }

            return this;

        };

        // Internal. Intentionally not documented.
        Scene.prototype.applyMatrix = function (dc, hasLighting, nodeWorldMatrix, nodeNormalMatrix) {

            var mvpMatrix = Matrix.fromIdentity();
            mvpMatrix.copy(dc.navigatorState.modelviewProjection);
            mvpMatrix.multiplyMatrix(this.transformationMatrix);
            if (nodeWorldMatrix && this.localTransforms) {
                mvpMatrix.multiplyMatrix(nodeWorldMatrix);
            }

            if (hasLighting) {
                var normalMatrix = Matrix.fromIdentity();
                normalMatrix.copy(dc.navigatorState.modelviewNormalTransform);
                normalMatrix.multiplyMatrix(this.normalMatrix);

                if (nodeNormalMatrix && this.localTransforms){
                    normalMatrix.multiplyMatrix(nodeNormalMatrix);
                }

                dc.currentProgram.loadModelviewInverse(dc.currentGlContext, normalMatrix);
            }

            dc.currentProgram.loadModelviewProjection(dc.currentGlContext, mvpMatrix);

        };

        // Internal. Intentionally not documented.
        Scene.prototype.applyTexture = function(dc, buffers, material){

            var textureBound, vboId,
                gl = dc.currentGlContext,
                program = dc.currentProgram;

            if (material.textures.diffuse) {
                var imageKey = material.textures.diffuse.mapId;
            }
            else {
                imageKey = material.textures.reflective.mapId;
            }

            var image = this.images[imageKey].filename || this.images[imageKey].path;

            buffers.activeTexture = dc.gpuResourceCache.resourceForKey(this.filePath + image + "");
            if (!buffers.activeTexture) {
                buffers.activeTexture = dc.gpuResourceCache.retrieveTexture(gl, this.filePath + image + "");
            }

            textureBound = buffers.activeTexture && buffers.activeTexture.bind(dc);
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

                if (buffers.isClamp) {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                }
                else {
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                }

                program.loadTextureEnabled(gl, true);
                gl.enableVertexAttribArray(program.vertexTexCoordLocation);
                gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, gl.FLOAT, false, 0, 0);
                program.loadTextureUnit(gl, gl.TEXTURE0);
                program.loadModulateColor(gl, dc.pickingMode);
            }
        };

        // Internal. Intentionally not documented.
        Scene.prototype.applyLighting = function(dc, buffers){

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
        Scene.prototype.applyColor = function(dc, material){

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

        Scene.prototype.resetDraw = function(dc, hasLighting, hasTexture){

            var gl = dc.currentGlContext,
                program = dc.currentProgram;

            if (hasLighting) {
                program.loadApplyLighting(gl, false);
                gl.disableVertexAttribArray(program.normalVectorLocation);
            }

            if (hasTexture) {
                gl.disableVertexAttribArray(program.vertexTexCoordLocation);
            }

            gl.disableVertexAttribArray(program.vertexPointLocation);
        };

        // Computes this scene's rotation matrix.
        Scene.prototype.computeRotationMatrix = function () {

            this.rotationMatrix = Matrix.fromIdentity();
            this.rotationMatrix.multiplyByRotation(1, 0, 0, this.xRotation);
            this.rotationMatrix.multiplyByRotation(0, 1, 0, this.yRotation);
            this.rotationMatrix.multiplyByRotation(0, 0, 1, this.zRotation);
        };

        // Computes this scene's transformation matrix.
        Scene.prototype.computeTransformationMatrix = function () {

            this.transformationMatrix = Matrix.fromIdentity();

            if (!this.rotationMatrix) {
                this.computeRotationMatrix();
            }

            if (this.globe) {
                this.transformationMatrix.multiplyByLocalCoordinateTransform(this.placePoint, this.globe);
            }
            else {
                this.transformationMatrix.multiplyByTranslation(this.placePoint[0], this.placePoint[1], this.placePoint[2]);
            }

            this.transformationMatrix.multiplyMatrix(this.rotationMatrix);
            this.transformationMatrix.multiplyByScale(this.scale, this.scale, this.scale);

            this.computeNormalMatrix();

        };

        // Computes this scene's normal matrix.
        Scene.prototype.computeNormalMatrix = function () {
            this.rotAngles = new Vec3(0, 0, 0);
            this.transformationMatrix.extractRotationAngles(this.rotAngles);
            this.normalMatrix = Matrix.fromIdentity();
            this.normalMatrix.multiplyByRotation(-1, 0, 0, this.rotAngles[0]);
            this.normalMatrix.multiplyByRotation(0, -1, 0, this.rotAngles[1]);
            this.normalMatrix.multiplyByRotation(0, 0, -1, this.rotAngles[2]);
        };

        // Computes this scene's bounding box.
        Scene.prototype.computeBoundingBox = function () {

            if (!this.boundingBox) {
                this.boundingBox = new BoundingBox();
            }

            var points = this.concatenateVertices();

            this.boundingBox.setToPoints(points);
        };

        // Concatenates all the vertices of the scene's meshes in one typed array.
        Scene.prototype.concatenateVertices = function () {

            var points = [];

            for (var key in this.meshes) {
                if (this.meshes.hasOwnProperty(key)) {
                    var buffers = this.meshes[key].buffers;

                    for (var j = 0, bufLen = buffers.length; j < bufLen; j++) {
                        var vertices = buffers[j].vertices;

                        for (var k = 0, vertLen = vertices.length; k < vertLen; k += 3) {

                            var vertex = new Vec3(vertices[k], vertices[k + 1], vertices[k + 2]);

                            vertex.multiply(this.scale);

                            this.normalRotationMatrix1 = Matrix.fromIdentity();
                            this.normalRotationMatrix1.multiplyByRotation(1, 0, 0, this.rotAngles[0]);
                            this.normalRotationMatrix1.multiplyByRotation(0, 1, 0, this.rotAngles[1]);
                            this.normalRotationMatrix1.multiplyByRotation(0, 0, 1, this.rotAngles[2]);

                            vertex.multiplyByMatrix(this.normalRotationMatrix1);
                            vertex.add(this.placePoint);

                            points.push(vertex[0]);
                            points.push(vertex[1]);
                            points.push(vertex[2]);
                        }
                    }
                }
            }

            return new Float32Array(points);
        };

        return Scene;
    });