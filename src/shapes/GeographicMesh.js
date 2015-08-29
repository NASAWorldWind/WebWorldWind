/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports GeographicMesh
 * @version $Id: GeographicMesh.js 3345 2015-07-28 20:28:35Z dcollins $
 */
define([
        '../shapes/AbstractShape',
        '../error/ArgumentError',
        '../shaders/BasicTextureProgram',
        '../geom/BoundingBox',
        '../util/Color',
        '../util/ImageSource',
        '../geom/Location',
        '../util/Logger',
        '../geom/Matrix',
        '../pick/PickedObject',
        '../geom/Position',
        '../shapes/ShapeAttributes',
        '../shapes/SurfacePolygon',
        '../geom/Vec2',
        '../geom/Vec3',
    ],
    function (AbstractShape,
              ArgumentError,
              BasicTextureProgram,
              BoundingBox,
              Color,
              ImageSource,
              Location,
              Logger,
              Matrix,
              PickedObject,
              Position,
              ShapeAttributes,
              SurfacePolygon,
              Vec2,
              Vec3) {
        "use strict";

        /**
         * Constructs a geographic mesh.
         * @alias GeographicMesh
         * @constructor
         * @augments AbstractShape
         * @classdesc Represents a 3D geographic mesh.
         * <p>
         *     Altitudes within the mesh's positions are interpreted according to the mesh's altitude mode, which
         *     can be one of the following:
         * <ul>
         *     <li>[WorldWind.ABSOLUTE]{@link WorldWind#ABSOLUTE}</li>
         *     <li>[WorldWind.RELATIVE_TO_GROUND]{@link WorldWind#RELATIVE_TO_GROUND}</li>
         *     <li>[WorldWind.CLAMP_TO_GROUND]{@link WorldWind#CLAMP_TO_GROUND}</li>
         * </ul>
         * If the latter, the mesh positions' altitudes are ignored. (If the mesh should be draped onto the
         * terrain, you might want to use {@link SurfacePolygon} instead.)
         * <p>
         *     Meshes have separate attributes for normal display and highlighted display. They use the interior and
         *     outline attributes of {@link ShapeAttributes}. If those attributes identify an image, that image is
         *     applied to the mesh. Texture coordinates for the image may be specified, but if not specified the full
         *     image is stretched over the full mesh. If texture coordinates are specified, there must be one texture
         *     coordinate for each vertex in the mesh.
         *
         * @param {Position[][]} positions A two-dimensional array containing the mesh vertices.
         * Each entry of the array specifies the vertices of one row of the mesh. The arrays for all rows must
         * have the same length. There must be at least two rows, and each row must have at least two vertices.
         * @param {ShapeAttributes} attributes The attributes to associate with this mesh. May be null, in which case
         * default attributes are associated. There must be no more than 65536 positions.
         *
         * @throws {ArgumentError} If the specified positions array is null or undefined, the number of rows or the
         * number of vertices per row is less than 2, the array lengths are inconsistent, or too many positions are
         * specified (limit is 65536).
         */
        var GeographicMesh = function (positions, attributes) {
            if (!positions) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicMesh", "constructor", "missingPositions"));
            }

            if (positions.length < 2 || positions[0].length < 2) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicMesh", "constructor",
                        "Number of positions is insufficient."));
            }

            // Check for size limit, which is the max number of available indices for a 16-bit unsigned int.
            if (positions.length * positions[0].length > 65536) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicMesh", "constructor",
                        "Too many positions. Must be fewer than 65537. Try using multiple meshes."));
            }

            var length = positions[0].length;
            for (var i = 1; i < positions.length; i++) {
                if (positions[i].length !== length) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicMesh", "constructor",
                            "Array lengths are inconsistent."));
                }
            }

            AbstractShape.call(this, attributes);

            /**
             * Indicates whether this mesh is pickable when the pick point intersects transparent pixels of the
             * image applied to this mesh. If no image is applied to this mesh, this property is ignored. If this
             * property is true and an image with fully transparent pixels is applied to the mesh, the mesh is
             * pickable at those transparent pixels, otherwise this mesh is not pickable at those transparent pixels.
             * @type {Boolean}
             * @default true
             */
            this.pickTransparentImagePixels = true;

            // Private. Documentation is with the defined property below and the constructor description above.
            this._positions = positions;

            // Private. Documentation is with the defined property below.
            this._altitudeScale = 1;

            // Internal. Intentionally not documented.
            this.numRows = positions.length;
            this.numColumns = positions[0].length;

            // Internal. Intentionally not documented.
            this._textureCoordinates = null;

            // Internal. Intentionally not documented.
            this.referencePosition = this.determineReferencePosition(this._positions);
        };

        GeographicMesh.prototype = Object.create(AbstractShape.prototype);

        Object.defineProperties(GeographicMesh.prototype, {
            /**
             * This mesh's positions. Each array in the positions array specifies the geographic positions of one
             * row of the mesh.
             *
             * @type {Position[][]}
             * @memberof GeographicMesh.prototype
             */
            positions: {
                get: function () {
                    return this._positions;
                },
                set: function (positions) {
                    if (!positions) {
                        throw new ArgumentError(
                            Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicMesh", "positions", "missingPositions"));
                    }

                    if (positions.length < 2 || positions[0].length < 2) {
                        throw new ArgumentError(
                            Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicMesh", "positions",
                                "Number of positions is insufficient."));
                    }

                    var length = positions[0].length;
                    for (var i = 1; i < positions.length; i++) {
                        if (positions[i].length !== length) {
                            throw new ArgumentError(
                                Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicMesh", "positions",
                                    "Array lengths are inconsistent."));
                        }
                    }

                    this.numRows = positions.length;
                    this.numColumns = positions[0].length;

                    this._positions = positions;
                    this.referencePosition = this.determineReferencePosition(this._positions);
                    this.reset();

                    this.meshIndices = null;
                    this.outlineIndices = null;
                }
            },

            /**
             * This mesh's texture coordinates if this mesh is textured. A texture coordinate must be
             * provided for each mesh position. The texture coordinates are specified as a two-dimensional array,
             * each entry of which specifies the texture coordinates for one row of the mesh. Each texture coordinate
             * is a {@link Vec2} containing the s and t coordinates. If no texture coordinates are specified and
             * the attributes associated with this mesh indicate an image source, then texture coordinates are
             * automatically generated for the mesh.
             * @type {Vec2[][]}
             * @default null
             * @memberof GeographicMesh.prototype
             */
            textureCoordinates: {
                get: function () {
                    return this._textureCoordinates;
                },
                set: function (coords) {

                    if (coords && coords.length != this.numRows) {
                        throw new ArgumentError(
                            Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicMesh", "textureCoordinates",
                                "Number of texture coordinate rows is inconsistent with the currently specified positions."));
                    }

                    for (var i = 0; i < this.numRows; i++) {
                        if (coords[i].length !== this.numColumns) {
                            throw new ArgumentError(
                                Logger.logMessage(Logger.LEVEL_SEVERE, "GeographicMesh", "textureCoordinates",
                                    "Texture coordinate row lengths are inconsistent with the currently specified positions."));
                        }
                    }

                    this._textureCoordinates = coords;
                    this.reset();
                    this.texCoords = null;
                }
            },

            /**
             * Scales the altitudes of this mesh.
             * @type {Number}
             * @default 1
             * @memberof GeographicMesh.prototype
             */
            altitudeScale: {
                get: function () {
                    return this._altitudeScale;
                },
                set: function (value) {
                    this._altitudeScale = value;
                    this.reset();
                }
            }
        });

        // Intentionally not documented.
        GeographicMesh.prototype.determineReferencePosition = function (positions) {
            // Assign the first position as the reference position.
            return positions[0][0];
        };

        // Internal. Determines whether this shape's geometry must be re-computed.
        GeographicMesh.prototype.mustGenerateGeometry = function (dc) {
            if (!this.currentData.meshPoints) {
                return true;
            }

            if (this.currentData.drawInterior !== this.activeAttributes.drawInterior) {
                return true;
            }

            if (this.activeAttributes.applyLighting && !this.currentData.normals) {
                return true;
            }

            if (this.activeAttributes.imageSource && !this.texCoords) {
                return true;
            }

            if (this.altitudeMode === WorldWind.ABSOLUTE) {
                return false;
            }

            return this.currentData.isExpired
        };

        // Overridden from AbstractShape base class.
        GeographicMesh.prototype.createSurfaceShape = function () {
            var boundaries = [];

            for (var c = 0; c < this.numColumns; c++) {
                boundaries.push(this._positions[0][c]);
            }

            for (var r = 1; r < this.numRows; r++) {
                boundaries.push(this._positions[r][this.numColumns - 1]);
            }

            for (c = this.numColumns - 2; c >= 0; c--) {
                boundaries.push(this._positions[this.numRows - 1][c]);
            }

            for (r = this.numRows - 2; r > 0; r--) {
                boundaries.push(this._positions[r][0]);
            }

            return new SurfacePolygon(boundaries, null);
        };

        // Overridden from AbstractShape base class.
        GeographicMesh.prototype.doMakeOrderedRenderable = function (dc) {
            // A null reference position is a signal that there are no boundaries to render.
            if (!this.activeAttributes.drawInterior && !this.activeAttributes.drawOutline) {
                return null;
            }

            // See if the current shape data can be re-used.
            if (!this.mustGenerateGeometry(dc)) {
                return this;
            }

            var currentData = this.currentData;

            // Set the transformation matrix to correspond to the reference position.
            var refPt = currentData.referencePoint;
            dc.surfacePointForMode(this.referencePosition.latitude, this.referencePosition.longitude,
                this.referencePosition.altitude, this._altitudeMode, refPt);
            currentData.transformationMatrix.setToTranslation(refPt[0], refPt[1], refPt[2]);

            // Convert the geographic coordinates to the Cartesian coordinates that will be rendered.
            this.computeMeshPoints(dc, currentData);

            // Capture texture coordinates in a parallel array to the mesh points. These are associated with this
            // shape, itself, because they're independent of elevation of globe state.
            if (this.activeAttributes.imageSource) {
                if (this._textureCoordinates) {
                    if (!this.texCoords) {
                        this.computeTexCoords(currentData);
                    }
                } else {
                    this.computeCanonicalTexCoords(currentData);
                }
            }

            // Compute the mesh and outline indices. These are associated with this shape, itself, because they're
            // independent of elevation and globe state.
            if (!this.outlineIndices) {
                this.computeMeshIndices(currentData);
                this.computeOutlineIndices(currentData);
            }

            if (this.activeAttributes.applyLighting) {
                this.computeNormals(currentData);
            }

            currentData.drawInterior = this.activeAttributes.drawInterior; // remember for validation
            this.resetExpiration(currentData);

            // Create the extent from the Cartesian points. Those points are relative to this path's reference point,
            // so translate the computed extent to the reference point.
            if (!currentData.extent) {
                currentData.extent = new BoundingBox();
            }

            currentData.extent.setToPoints(currentData.meshPoints);
            currentData.extent.translate(currentData.referencePoint);

            return this;
        };

        // Private. Intentionally not documented.
        GeographicMesh.prototype.computeMeshPoints = function (dc, currentData) {
            // Unwrap the mesh row arrays into one long array.

            var eyeDistSquared = Number.MAX_VALUE,
                eyePoint = dc.navigatorState.eyePoint,
                meshPoints = new Float32Array((this.numRows * this.numColumns) * 3),
                pt = new Vec3(0, 0, 0),
                k = 0,
                pos, dSquared;

            for (var r = 0; r < this._positions.length; r++) {
                for (var c = 0, len = this._positions[r].length; c < len; c++) {
                    pos = this._positions[r][c];

                    dc.surfacePointForMode(pos.latitude, pos.longitude, pos.altitude * this._altitudeScale,
                        this.altitudeMode, pt);

                    dSquared = pt.distanceToSquared(eyePoint);
                    if (dSquared < eyeDistSquared) {
                        eyeDistSquared = dSquared;
                    }

                    pt.subtract(this.currentData.referencePoint);

                    meshPoints[k++] = pt[0];
                    meshPoints[k++] = pt[1];
                    meshPoints[k++] = pt[2];
                }
            }

            this.currentData.eyeDistance = Math.sqrt(eyeDistSquared);

            currentData.meshPoints = meshPoints;
            currentData.refreshVertexBuffer = true;
        };

        // Intentionally not documented.
        GeographicMesh.prototype.computeTexCoords = function (currentData) {
            // Capture the texture coordinates to a single array parallel to the mesh points array.

            var texCoords = new Float32Array(2 * this.numRows * this.numColumns),
                k = 0;

            for (var r = 0; r < this._textureCoordinates.length; r++) {
                for (var c = 0, len = this._textureCoordinates[r].length; c < len; c++) {
                    var texCoord = this._textureCoordinates[r][c];

                    texCoords[k++] = texCoord[0];
                    texCoords[k++] = texCoord[1];
                }
            }

            this.texCoords = texCoords;
            currentData.refreshTexCoordBuffer = true;
        };

        GeographicMesh.prototype.computeCanonicalTexCoords = function (currentData) {
            // Create texture coordinates that map the full image source into the full mesh.

            var texCoords = new Float32Array(2 * this.numRows * this.numColumns),
                rowDelta = 1.0 / (this.numRows - 1),
                columnDelta = 1.0 / (this.numColumns - 1),
                k = 0;

            for (var r = 0; r < this._positions.length; r++) {
                var t = (r === this.numRows - 1) ? 1.0 : r * rowDelta;

                for (var c = 0, len = this._positions[r].length; c < len; c++) {
                    texCoords[k++] = (c === this.numColumns - 1) ? 1.0 : c * columnDelta;
                    texCoords[k++] = t;
                }
            }

            this.texCoords = texCoords; // texture coordinates are independent of elevation or globe
            currentData.refreshTexCoordBuffer = true;
        };

        GeographicMesh.prototype.computeMeshIndices = function (currentData) {
            // Compute indices for individual triangles.
            // TODO: Compute them for a single tri-strip.

            var meshIndices = new Int16Array((this.numRows - 1) * (this.numColumns - 1) * 6),
                i = 0;

            for (var r = 0; r < this.numRows - 1; r++) {
                for (var c = 0; c < this.numColumns - 1; c++) {
                    var k = r * this.numColumns + c;

                    meshIndices[i++] = k;
                    meshIndices[i++] = k + 1;
                    meshIndices[i++] = k + this.numColumns;
                    meshIndices[i++] = k + 1;
                    meshIndices[i++] = k + 1 + this.numColumns;
                    meshIndices[i++] = k + this.numColumns;
                }
            }

            this.meshIndices = meshIndices; // indices are independent of elevation or globe
            currentData.refreshMeshIndices = true;
        };

        GeographicMesh.prototype.computeOutlineIndices = function (currentData) {
            // Walk the mesh boundary and capture those positions for the outline.

            var outlineIndices = new Int16Array(2 * this.numRows + 2 * this.numColumns),
                k = 0;

            for (var c = 0; c < this.numColumns; c++) {
                outlineIndices[k++] = c;
            }

            for (var r = 1; r < this.numRows; r++) {
                outlineIndices[k++] = (r + 1) * this.numColumns - 1;
            }

            for (c = this.numRows * this.numColumns - 2; c >= (this.numRows - 1) * this.numColumns; c--) {
                outlineIndices[k++] = c;
            }

            for (r = this.numRows - 2; r >= 0; r--) {
                outlineIndices[k++] = r * this.numColumns;
            }

            this.outlineIndices = outlineIndices; // indices are independent of elevation or globe
            currentData.refreshOutlineIndices = true;
        };

        GeographicMesh.prototype.computeNormals = function (currentData) {
            var normalsBuffer = new Float32Array(currentData.meshPoints.length),
                indices = this.meshIndices,
                vertices = currentData.meshPoints,
                normals = [],
                triPoints = [new Vec3(0, 0, 0), new Vec3(0, 0, 0), new Vec3(0, 0, 0)],
                k;

            // For each triangle, compute its normal assign it to each participating index.
            for (var i = 0; i < indices.length; i += 3) {
                for (var j = 0; j < 3; j++) {
                    k = indices[i + j];
                    triPoints[j].set(vertices[3 * k], vertices[3 * k + 1], vertices[3 * k + 2]);
                }

                var n = Vec3.computeTriangleNormal(triPoints[0], triPoints[1], triPoints[2]);

                for (j = 0; j < 3; j++) {
                    k = indices[i + j];
                    if (!normals[k]) {
                        normals[k] = [];
                    }

                    normals[k].push(n);
                }
            }

            // Average the normals associated with each index and add the result to the normals buffer.
            n = new Vec3(0, 0, 0);
            for (i = 0; i < normals.length; i++) {
                if (normals[i]) {
                    Vec3.average(normals[i], n);
                    n.normalize();
                    normalsBuffer[i * 3] = n[0];
                    normalsBuffer[i * 3 + 1] = n[1];
                    normalsBuffer[i * 3 + 2] = n[2];
                } else {
                    normalsBuffer[i * 3] = 0;
                    normalsBuffer[i * 3 + 1] = 0;
                    normalsBuffer[i * 3 + 2] = 0;
                }
            }

            currentData.normals = normalsBuffer;
            currentData.refreshNormalsBuffer = true;
        };

        // Overridden from AbstractShape base class.
        GeographicMesh.prototype.doRenderOrdered = function (dc) {
            var gl = dc.currentGlContext,
                program = dc.currentProgram,
                currentData = this.currentData,
                hasTexture = !!this.activeAttributes.imageSource,
                vboId, opacity, color, pickColor, textureBound;

            if (dc.pickingMode) {
                pickColor = dc.uniquePickColor();
            }

            // Load the vertex data since both the interior and outline use it.

            if (!currentData.pointsVboCacheKey) {
                currentData.pointsVboCacheKey = dc.gpuResourceCache.generateCacheKey();
            }

            vboId = dc.gpuResourceCache.resourceForKey(currentData.pointsVboCacheKey);
            if (!vboId) {
                vboId = gl.createBuffer();
                dc.gpuResourceCache.putResource(currentData.pointsVboCacheKey, vboId,
                    currentData.meshPoints.length * 4);
                currentData.refreshVertexBuffer = true;
            }

            gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, vboId);
            if (currentData.refreshVertexBuffer) {
                gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, currentData.meshPoints,
                    WebGLRenderingContext.STATIC_DRAW);
                dc.frameStatistics.incrementVboLoadCount(1);
                currentData.refreshVertexBuffer = false;
            }

            gl.vertexAttribPointer(program.vertexPointLocation, 3, WebGLRenderingContext.FLOAT, false, 0, 0);

            program.loadTextureEnabled(gl, false);

            // Draw the mesh if the interior requested.
            if (this.activeAttributes.drawInterior) {
                var applyLighting = !dc.pickingMode && currentData.normals && this.activeAttributes.applyLighting;

                this.applyMvpMatrix(dc);

                if (!currentData.meshIndicesVboCacheKey) {
                    currentData.meshIndicesVboCacheKey = dc.gpuResourceCache.generateCacheKey();
                }

                vboId = dc.gpuResourceCache.resourceForKey(currentData.meshIndicesVboCacheKey);
                if (!vboId) {
                    vboId = gl.createBuffer();
                    dc.gpuResourceCache.putResource(currentData.meshIndicesVboCacheKey, vboId,
                        this.meshIndices.length * 2);
                    currentData.refreshMeshIndices = true;
                }

                gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, vboId);
                if (currentData.refreshMeshIndices) {
                    gl.bufferData(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, this.meshIndices,
                        WebGLRenderingContext.STATIC_DRAW);
                    dc.frameStatistics.incrementVboLoadCount(1);
                    currentData.refreshMeshIndices = false;
                }

                color = this.activeAttributes.interiorColor;
                opacity = color.alpha * dc.currentLayer.opacity;

                // Disable writing the shape's fragments to the depth buffer when the interior is semi-transparent.
                gl.depthMask(opacity >= 1 || dc.pickingMode);
                program.loadColor(gl, dc.pickingMode ? pickColor : color);
                program.loadOpacity(gl, dc.pickingMode ? (opacity > 0 ? 1 : 0) : opacity);

                if (hasTexture && (!dc.pickingMode || !this.pickTransparentImagePixels)) {
                    this.activeTexture = dc.gpuResourceCache.resourceForKey(this.activeAttributes.imageSource);
                    if (!this.activeTexture) {
                        this.activeTexture =
                            dc.gpuResourceCache.retrieveTexture(dc.currentGlContext, this.activeAttributes.imageSource);
                    }

                    textureBound = this.activeTexture && this.activeTexture.bind(dc);
                    if (textureBound) {
                        if (!currentData.texCoordsVboCacheKey) {
                            currentData.texCoordsVboCacheKey = dc.gpuResourceCache.generateCacheKey();
                        }

                        vboId = dc.gpuResourceCache.resourceForKey(currentData.texCoordsVboCacheKey);
                        if (!vboId) {
                            vboId = gl.createBuffer();
                            dc.gpuResourceCache.putResource(currentData.texCoordsVboCacheKey, vboId,
                                this.texCoords.length * 4);
                            currentData.refreshTexCoordBuffer = true;
                        }

                        gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, vboId);
                        if (currentData.refreshTexCoordBuffer) {
                            gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, this.texCoords,
                                WebGLRenderingContext.STATIC_DRAW);
                            dc.frameStatistics.incrementVboLoadCount(1);
                            currentData.refreshTexCoordBuffer = false;
                        }

                        program.loadTextureEnabled(gl, true);
                        gl.enableVertexAttribArray(program.vertexTexCoordLocation);
                        gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, WebGLRenderingContext.FLOAT,
                            false, 0, 0);
                        program.loadTextureUnit(gl, WebGLRenderingContext.TEXTURE0);
                        program.loadModulateColor(gl, dc.pickingMode);
                    }
                }

                // Apply lighting.
                if (applyLighting) {
                    program.loadApplyLighting(gl, true);

                    if (!currentData.normalsVboCacheKey) {
                        currentData.normalsVboCacheKey = dc.gpuResourceCache.generateCacheKey();
                    }

                    vboId = dc.gpuResourceCache.resourceForKey(currentData.normalsVboCacheKey);
                    if (!vboId) {
                        vboId = gl.createBuffer();
                        dc.gpuResourceCache.putResource(currentData.normalsVboCacheKey, vboId,
                            currentData.normals.length * 4);
                        currentData.refreshNormalsBuffer = true;
                    }

                    gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, vboId);
                    if (currentData.refreshNormalsBuffer) {
                        gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, currentData.normals,
                            WebGLRenderingContext.STATIC_DRAW);
                        dc.frameStatistics.incrementVboLoadCount(1);
                        currentData.refreshNormalsBuffer = false;
                    }

                    gl.enableVertexAttribArray(program.normalVectorLocation);
                    gl.vertexAttribPointer(program.normalVectorLocation, 3, WebGLRenderingContext.FLOAT, false, 0, 0);
                }

                gl.drawElements(WebGLRenderingContext.TRIANGLES, this.meshIndices.length,
                    WebGLRenderingContext.UNSIGNED_SHORT, 0);

                if (hasTexture) {
                    gl.disableVertexAttribArray(program.vertexTexCoordLocation);
                }

                if (applyLighting) {
                    program.loadApplyLighting(gl, false);
                    gl.disableVertexAttribArray(program.normalVectorLocation);
                }
            }

            // Draw the outline.
            if (this.activeAttributes.drawOutline) {
                program.loadTextureEnabled(gl, false);
                gl.disableVertexAttribArray(program.vertexTexCoordLocation); // we're not texturing in this clause

                // Make the outline stand out from the interior.
                this.applyMvpMatrixForOutline(dc);

                color = this.activeAttributes.outlineColor;
                opacity = color.alpha * dc.currentLayer.opacity;

                // Disable writing the shape's fragments to the depth buffer when the interior is
                // semi-transparent.
                gl.depthMask(opacity >= 1 || dc.pickingMode);
                program.loadColor(gl, dc.pickingMode ? pickColor : color);
                program.loadOpacity(gl, dc.pickingMode ? 1 : opacity);

                gl.lineWidth(this.activeAttributes.outlineWidth);

                if (!currentData.outlineIndicesVboCacheKey) {
                    currentData.outlineIndicesVboCacheKey = dc.gpuResourceCache.generateCacheKey();
                }

                vboId = dc.gpuResourceCache.resourceForKey(currentData.outlineIndicesVboCacheKey);
                if (!vboId) {
                    vboId = gl.createBuffer();
                    dc.gpuResourceCache.putResource(currentData.outlineIndicesVboCacheKey, vboId,
                        this.outlineIndices.length * 2);
                    currentData.refreshOutlineIndices = true;
                }

                gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, vboId);
                if (currentData.refreshOutlineIndices) {
                    gl.bufferData(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, this.outlineIndices,
                        WebGLRenderingContext.STATIC_DRAW);
                    dc.frameStatistics.incrementVboLoadCount(1);
                    currentData.refreshOutlineIndices = false;
                }

                gl.drawElements(WebGLRenderingContext.LINE_STRIP, this.outlineIndices.length,
                    WebGLRenderingContext.UNSIGNED_SHORT, 0);
            }

            if (dc.pickingMode) {
                var po = new PickedObject(pickColor, this.pickDelegate ? this.pickDelegate : this, null,
                    dc.currentLayer, false);
                dc.resolvePick(po);
            }
        };

        // Overridden from AbstractShape base class.
        GeographicMesh.prototype.beginDrawing = function (dc) {
            var gl = dc.currentGlContext;

            if (this.activeAttributes.drawInterior) {
                gl.disable(WebGLRenderingContext.CULL_FACE);

                dc.findAndBindProgram(BasicTextureProgram);

                var applyLighting = !dc.pickMode && this.currentData.normals && this.activeAttributes.applyLighting;
                if (applyLighting) {
                    dc.currentProgram.loadModelviewInverse(gl, dc.navigatorState.modelviewNormalTransform);
                }
            }

            gl.enableVertexAttribArray(dc.currentProgram.vertexPointLocation);
        };

        // Overridden from AbstractShape base class.
        GeographicMesh.prototype.endDrawing = function (dc) {
            var gl = dc.currentGlContext;

            gl.disableVertexAttribArray(dc.currentProgram.vertexPointLocation);
            gl.depthMask(true);
            gl.lineWidth(1);
            gl.enable(WebGLRenderingContext.CULL_FACE);
        };

        return GeographicMesh;
    }
)
;