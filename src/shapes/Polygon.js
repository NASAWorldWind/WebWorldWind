/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports Polygon
 * @version $Id: Polygon.js 3345 2015-07-28 20:28:35Z dcollins $
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
        '../util/libtess'
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
              Vec3,
              libtessDummy) {
        "use strict";

        /**
         * Constructs a Polygon.
         * @alias Polygon
         * @constructor
         * @augments AbstractShape
         * @classdesc Represents a 3D polygon. The polygon may be extruded to the ground to form a prism. It may have
         * multiple boundaries defining empty portions. See also {@link SurfacePolygon}.
         * <p>
         *     Altitudes within the polygon's positions are interpreted according to the polygon's altitude mode, which
         *     can be one of the following:
         * <ul>
         *     <li>[WorldWind.ABSOLUTE]{@link WorldWind#ABSOLUTE}</li>
         *     <li>[WorldWind.RELATIVE_TO_GROUND]{@link WorldWind#RELATIVE_TO_GROUND}</li>
         *     <li>[WorldWind.CLAMP_TO_GROUND]{@link WorldWind#CLAMP_TO_GROUND}</li>
         * </ul>
         * If the latter, the polygon positions' altitudes are ignored. (If the polygon should be draped onto the
         * terrain, you might want to use {@link SurfacePolygon} instead.)
         * <p>
         *     Polygons have separate attributes for normal display and highlighted display. They use the interior and
         *     outline attributes of {@link ShapeAttributes}. If those attributes identify an image, that image is
         *     applied to the polygon.
         * <p>
         *     A polygon displays as a vertical prism if its [extrude]{@link Polygon#extrude} property is true. A
         *     curtain is formed around its boundaries and extends from the polygon's edges to the ground.
         * <p>
         *     A polygon can be textured, including its extruded boundaries. The textures are specified via the
         *     [imageSource]{@link ShapeAttributes#imageSource} property of the polygon's attributes. If that
         *     property is a single string or {@link ImageSource}, then it identifies the image source for the
         *     polygon's texture. If that property is an array of strings, {@link ImageSource}s or a combination of
         *     those, then the first entry in the array specifies the polygon's image source and subsequent entries
         *     specify the image sources of the polygon's extruded boundaries. If the array contains two entries, the
         *     first is the polygon's image source and the second is the common image source for all extruded
         *     boundaries. If the array contains more than two entries, then the first entry is the polygon's image
         *     source and each subsequent entry is the image source for consecutive extruded boundary segments. A null
         *     value for any entry indicates that no texture is applied for the corresponding polygon or extruded edge
         *     segment. If fewer image sources are specified then there are boundary segments, the last image source
         *     specified is applied to the remaining segments. Texture coordinates for the polygon's texture are
         *     specified via this polygon's [textureCoordinates]{@link Polygon#textureCoordinates} property. Texture
         *     coordinates for extruded boundary segments are implicitly defined to fit the full texture to each
         *     boundary segment.
         * <p>
         *     When displayed on a 2D globe, this polygon displays as a {@link SurfacePolygon} if its
         *     [useSurfaceShapeFor2D]{@link AbstractShape#useSurfaceShapeFor2D} property is true.
         *
         * @param {Position[][] | Position[]} boundaries A two-dimensional array containing the polygon boundaries.
         * Each entry of the array specifies the vertices of one boundary.
         * This argument may also be a simple array of positions,
         * in which case the polygon is assumed to have only one boundary.
         * Each boundary is considered implicitly closed, so the last position of the boundary need not and should not
         * duplicate the first position of the boundary.
         * @param {ShapeAttributes} attributes The attributes to associate with this polygon. May be null, in which case
         * default attributes are associated.
         *
         * @throws {ArgumentError} If the specified boundaries array is null or undefined.
         */
        var Polygon = function (boundaries, attributes) {
            if (!boundaries) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "Polygon", "constructor", "missingBoundaries"));
            }

            AbstractShape.call(this, attributes);

            if (boundaries.length > 0 && boundaries[0].latitude) {
                boundaries = [boundaries];
                this._boundariesSpecifiedSimply = true;
            }

            // Private. Documentation is with the defined property below and the constructor description above.
            this._boundaries = boundaries;

            this._textureCoordinates = null;

            this.referencePosition = this.determineReferencePosition(this._boundaries);

            this._extrude = false;

            this.scratchPoint = new Vec3(0, 0, 0); // scratch variable
        };

        Polygon.prototype = Object.create(AbstractShape.prototype);

        Object.defineProperties(Polygon.prototype, {
            /**
             * This polygon's boundaries. A two-dimensional array containing the polygon boundaries. Each entry of the
             * array specifies the vertices of one boundary. This property may also be a simple
             * array of positions, in which case the polygon is assumed to have only one boundary.
             * @type {Position[][] | Position[]}
             * @memberof Polygon.prototype
             */
            boundaries: {
                get: function () {
                    return this._boundariesSpecifiedSimply ? this._boundaries[0] : this._boundaries;
                },
                set: function (boundaries) {
                    if (!boundaries) {
                        throw new ArgumentError(
                            Logger.logMessage(Logger.LEVEL_SEVERE, "Polygon", "boundaries", "missingBoundaries"));
                    }

                    if (boundaries.length > 0 && boundaries[0].latitude) {
                        boundaries = [boundaries];
                        this._boundariesSpecifiedSimply = true;
                    }

                    this._boundaries = boundaries;
                    this.referencePosition = this.determineReferencePosition(this._boundaries);
                    this.reset();
                }
            },

            /**
             * This polygon's texture coordinates if this polygon is to be textured. A texture coordinate must be
             * provided for each boundary position. The texture coordinates are specified as a two-dimensional array,
             * each entry of which specifies the texture coordinates for one boundary. Each texture coordinate is a
             * {@link Vec2} containing the s and t coordinates.
             * @type {Vec2[][]}
             * @default null
             * @memberof Polygon.prototype
             */
            textureCoordinates: {
                get: function () {
                    return this._textureCoordinates;
                },
                set: function (value) {
                    this._textureCoordinates = value;
                    this.reset();
                }
            },

            /**
             * Specifies whether to extrude this polygon to the ground by drawing a filled interior from the polygon
             * to the terrain. The filled interior uses this polygon's interior attributes.
             * @type {Boolean}
             * @default false
             * @memberof Polygon.prototype
             */
            extrude: {
                get: function () {
                    return this._extrude;
                },
                set: function (extrude) {
                    this._extrude = extrude;
                    this.reset();
                }
            }
        });

        // Intentionally not documented.
        Polygon.prototype.determineReferencePosition = function (boundaries) {
            // Assign the first position as the reference position.
            return (boundaries.length > 0 && boundaries[0].length > 2) ? boundaries[0][0] : null;
        };

        // Internal. Determines whether this shape's geometry must be re-computed.
        Polygon.prototype.mustGenerateGeometry = function (dc) {
            if (!this.currentData.boundaryPoints) {
                return true;
            }

            if (this.currentData.drawInterior !== this.activeAttributes.drawInterior) {
                return true;
            }

            if (this.altitudeMode === WorldWind.ABSOLUTE) {
                return false;
            }

            return this.currentData.isExpired
        };

        // Internal. Indicates whether this polygon should be textured.
        Polygon.prototype.hasCapTexture = function () {
            return this.textureCoordinates && this.capImageSource();
        };

        // Internal. Determines source of this polygon's cap texture. See the class description above for the policy.
        Polygon.prototype.capImageSource = function () {
            if (!this.activeAttributes.imageSource) {
                return null;
            }

            if ((typeof this.activeAttributes.imageSource) === "string"
                || this.activeAttributes.imageSource instanceof ImageSource) {
                return this.activeAttributes.imageSource;
            }

            if (Array.isArray(this.activeAttributes.imageSource)
                && this.activeAttributes.imageSource[0]
                && (typeof this.activeAttributes.imageSource[0] === "string"
                || this.activeAttributes.imageSource instanceof ImageSource)) {
                return this.activeAttributes.imageSource[0];
            }

            return null;
        };

        // Internal. Indicates whether this polygon has side textures defined.
        Polygon.prototype.hasSideTextures = function () {
            return this.activeAttributes.imageSource &&
                Array.isArray(this.activeAttributes.imageSource)
                && this.activeAttributes.imageSource.length > 1;
        };

        // Internal. Determines the side texture for a specified side. See the class description above for the policy.
        Polygon.prototype.sideImageSource = function (side) {
            if (side === 0 || this.activeAttributes.imageSource.length === 2) {
                return this.activeAttributes.imageSource[1];
            }

            var numSideTextures = this.activeAttributes.imageSource.length - 1;
            side = Math.min(side + 1, numSideTextures);
            return this.activeAttributes.imageSource[side];
        };

        Polygon.prototype.createSurfaceShape = function () {
            return new SurfacePolygon(this.boundaries, null);
        };

        // Overridden from AbstractShape base class.
        Polygon.prototype.doMakeOrderedRenderable = function (dc) {
            // A null reference position is a signal that there are no boundaries to render.
            if (!this.referencePosition) {
                return null;
            }

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

            // Close the boundaries.
            var fullBoundaries = [];
            for (var b = 0; b < this._boundaries.length; b++) {
                fullBoundaries[b] = this._boundaries[b].slice(0); // clones the array
                fullBoundaries[b].push(this._boundaries[b][0]); // appends the first position to the boundary
            }

            // Convert the geographic coordinates to the Cartesian coordinates that will be rendered.
            var boundaryPoints = this.computeBoundaryPoints(dc, fullBoundaries);

            // Tessellate the polygon if its interior is to be drawn.
            if (this.activeAttributes.drawInterior) {
                var capVertices = this.tessellatePolygon(dc, boundaryPoints);
                if (capVertices) {
                    // Must copy the vertices to a typed array. (Can't use typed array to begin with because its size
                    // is unknown prior to tessellation.)
                    currentData.capTriangles = new Float32Array(capVertices.length);
                    for (var i = 0, len = capVertices.length; i < len; i++) {
                        currentData.capTriangles[i] = capVertices[i];
                    }
                }
            }

            currentData.boundaryPoints = boundaryPoints;
            currentData.drawInterior = this.activeAttributes.drawInterior; // remember for validation
            this.resetExpiration(currentData);
            currentData.refreshBuffers = true; // causes VBOs to be reloaded

            // Create the extent from the Cartesian points. Those points are relative to this path's reference point,
            // so translate the computed extent to the reference point.
            if (!currentData.extent) {
                currentData.extent = new BoundingBox();
            }
            if (boundaryPoints.length === 1) {
                currentData.extent.setToPoints(boundaryPoints[0]);
            } else {
                var allPoints = [];
                for (b = 0; b < boundaryPoints.length; b++) {
                    for (var p = 0; p < boundaryPoints[b].length; p++) {
                        allPoints.push(boundaryPoints[b][p]);
                    }
                }
                currentData.extent.setToPoints(allPoints);
            }
            currentData.extent.translate(currentData.referencePoint);

            return this;
        };

        // Private. Intentionally not documented.
        Polygon.prototype.computeBoundaryPoints = function (dc, boundaries) {
            var eyeDistSquared = Number.MAX_VALUE,
                eyePoint = dc.navigatorState.eyePoint,
                boundaryPoints = [],
                stride = this._extrude ? 6 : 3,
                pt = new Vec3(0, 0, 0),
                numBoundaryPoints, pos, k, dSquared;

            for (var b = 0; b < boundaries.length; b++) {
                numBoundaryPoints = (this._extrude ? 2 : 1) * boundaries[b].length;
                boundaryPoints[b] = new Float32Array(numBoundaryPoints * 3);

                for (var i = 0, len = boundaries[b].length; i < len; i++) {
                    pos = boundaries[b][i];

                    dc.surfacePointForMode(pos.latitude, pos.longitude, pos.altitude, this.altitudeMode, pt);

                    dSquared = pt.distanceToSquared(eyePoint);
                    if (dSquared < eyeDistSquared) {
                        eyeDistSquared = dSquared;
                    }

                    pt.subtract(this.currentData.referencePoint);

                    k = stride * i;
                    boundaryPoints[b][k] = pt[0];
                    boundaryPoints[b][k + 1] = pt[1];
                    boundaryPoints[b][k + 2] = pt[2];

                    if (this._extrude) {
                        dc.surfacePointForMode(pos.latitude, pos.longitude, 0, WorldWind.CLAMP_TO_GROUND, pt);

                        dSquared = pt.distanceToSquared(eyePoint);
                        if (dSquared < eyeDistSquared) {
                            eyeDistSquared = dSquared;
                        }

                        pt.subtract(this.currentData.referencePoint);

                        boundaryPoints[b][k + 3] = pt[0];
                        boundaryPoints[b][k + 4] = pt[1];
                        boundaryPoints[b][k + 5] = pt[2];
                    }
                }
            }

            this.currentData.eyeDistance = Math.sqrt(eyeDistSquared);

            return boundaryPoints;
        };

        Polygon.prototype.tessellatePolygon = function (dc, boundaryPoints) {
            var triangles = [], // the output list of triangles
                error = 0,
                stride = this._extrude ? 6 : 3,
                includeTextureCoordinates = this.hasCapTexture(),
                coords, normal;

            if (!this.polygonTessellator) {
                this.polygonTessellator = new libtess.GluTesselator();

                this.polygonTessellator.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA,
                    function (data, tris) {
                        tris[tris.length] = data[0];
                        tris[tris.length] = data[1];
                        tris[tris.length] = data[2];

                        if (includeTextureCoordinates) {
                            tris[tris.length] = data[3];
                            tris[tris.length] = data[4];
                        }
                    });

                this.polygonTessellator.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE,
                    function (coords, data, weight) {
                        var newCoords = [coords[0], coords[1], coords[2]];

                        if (includeTextureCoordinates) {
                            for (var i = 3; i <= 4; i++) {
                                var value = 0;
                                for (var w = 0; w < 4; w++) {
                                    if (weight[w] > 0) {
                                        value += weight[w] * data[w][i];
                                    }
                                }

                                newCoords[i] = value;
                            }
                        }

                        return newCoords;
                    });

                this.polygonTessellator.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR,
                    function (errno) {
                        error = errno;
                        Logger.logMessage(Logger.LEVEL_WARNING, "Polygon", "tessellatePolygon",
                            "Tessellation error " + errno + ".");
                    });
            }

            // Compute a normal vector for the polygon.
            normal = Vec3.computeBufferNormal(boundaryPoints[0], stride);
            if (!normal) {
                normal = new Vec3(0, 0, 0);
                // The first boundary is colinear. Fall back to the surface normal.
                dc.globe.surfaceNormalAtLocation(this.referencePosition.latitude, this.referencePosition.longitude,
                    normal);
            }
            this.polygonTessellator.gluTessNormal(normal[0], normal[1], normal[2]);

            // Tessellate the polygon.
            this.polygonTessellator.gluTessBeginPolygon(triangles);
            for (var b = 0; b < boundaryPoints.length; b++) {
                var t = 0;
                this.polygonTessellator.gluTessBeginContour();
                var contour = boundaryPoints[b];
                for (var c = 0; c < contour.length; c += stride) {
                    coords = [contour[c], contour[c + 1], contour[c + 2]];
                    if (includeTextureCoordinates) {
                        if (t < this.textureCoordinates[b].length) {
                            coords[3] = this.textureCoordinates[b][t][0];
                            coords[4] = this.textureCoordinates[b][t][1];
                        } else {
                            coords[3] = this.textureCoordinates[b][0][0];
                            coords[4] = this.textureCoordinates[b][1][1];
                        }
                        ++t;
                    }
                    this.polygonTessellator.gluTessVertex(coords, coords);
                }
                this.polygonTessellator.gluTessEndContour();
            }
            this.polygonTessellator.gluTessEndPolygon();

            return error === 0 ? triangles : null;
        };

        // Private. Intentionally not documented.
        Polygon.prototype.mustDrawVerticals = function (dc) {
            return this._extrude
                && this.activeAttributes.drawOutline
                && this.activeAttributes.drawVerticals
                && this.altitudeMode !== WorldWind.CLAMP_TO_GROUND;
        };

        // Overridden from AbstractShape base class.
        Polygon.prototype.doRenderOrdered = function (dc) {
            var gl = dc.currentGlContext,
                program = dc.currentProgram,
                currentData = this.currentData,
                refreshBuffers = currentData.refreshBuffers,
                hasCapTexture = this.hasCapTexture(),
                hasSideTextures = this.hasSideTextures(),
                numBoundaryPoints, vboId, opacity, color, pickColor, stride, nPts, textureBound;

            if (dc.pickingMode) {
                pickColor = dc.uniquePickColor();
            }

            // Assume no cap or side textures.
            program.loadTextureEnabled(gl, false);

            // Draw the cap if the interior requested and we were able to tessellate the polygon.
            if (this.activeAttributes.drawInterior && currentData.capTriangles && currentData.capTriangles.length > 0) {
                this.applyMvpMatrix(dc);

                if (!currentData.capVboCacheKey) {
                    currentData.capVboCacheKey = dc.gpuResourceCache.generateCacheKey();
                }

                vboId = dc.gpuResourceCache.resourceForKey(currentData.capVboCacheKey);
                if (!vboId) {
                    vboId = gl.createBuffer();
                    dc.gpuResourceCache.putResource(currentData.capVboCacheKey, vboId,
                        currentData.capTriangles.length * 4);
                    refreshBuffers = true;
                }

                gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, vboId);
                if (refreshBuffers) {
                    gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, currentData.capTriangles,
                        WebGLRenderingContext.STATIC_DRAW);
                    dc.frameStatistics.incrementVboLoadCount(1);
                }

                color = this.activeAttributes.interiorColor;
                opacity = color.alpha * dc.currentLayer.opacity;
                // Disable writing the shape's fragments to the depth buffer when the interior is semi-transparent.
                gl.depthMask(opacity >= 1 || dc.pickingMode);
                program.loadColor(gl, dc.pickingMode ? pickColor : color);
                program.loadOpacity(gl, dc.pickingMode ? (opacity > 0 ? 1 : 0) : opacity);

                stride = hasCapTexture ? 20 : 12;

                if (hasCapTexture && !dc.pickingMode) {
                    this.activeTexture = dc.gpuResourceCache.resourceForKey(this.capImageSource());
                    if (!this.activeTexture) {
                        this.activeTexture =
                            dc.gpuResourceCache.retrieveTexture(dc.currentGlContext, this.capImageSource());
                    }

                    textureBound = this.activeTexture && this.activeTexture.bind(dc);
                    if (textureBound) {
                        program.loadTextureEnabled(gl, true);
                        gl.enableVertexAttribArray(program.vertexTexCoordLocation);
                        gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, WebGLRenderingContext.FLOAT,
                            false, stride, 12);
                        program.loadTextureUnit(gl, WebGLRenderingContext.TEXTURE0);
                        program.loadModulateColor(gl, dc.pickingMode);
                    }
                }

                gl.vertexAttribPointer(program.vertexPointLocation, 3, WebGLRenderingContext.FLOAT, false, stride, 0);
                gl.drawArrays(WebGLRenderingContext.TRIANGLES, 0, 4 * (currentData.capTriangles.length / stride));
            }

            // Draw the un-textured extruded boundaries and/or the outline.
            if ((this._extrude && this.activeAttributes.drawInterior) || this.activeAttributes.drawOutline) {
                if (!currentData.boundaryVboCacheKeys) {
                    this.currentData.boundaryVboCacheKeys = [];
                }

                program.loadTextureEnabled(gl, false);
                gl.disableVertexAttribArray(program.vertexTexCoordLocation); // we're not texturing in this clause

                for (var b = 0; b < currentData.boundaryPoints.length; b++) { // for each boundary
                    // The sides and outline use the same vertices, those of the individual boundaries.
                    // Set up that data here for common use below.

                    numBoundaryPoints = currentData.boundaryPoints[b].length / 3;

                    if (!currentData.boundaryVboCacheKeys[b]) {
                        currentData.boundaryVboCacheKeys[b] = dc.gpuResourceCache.generateCacheKey();
                    }

                    vboId = dc.gpuResourceCache.resourceForKey(currentData.boundaryVboCacheKeys[b]);
                    if (!vboId) {
                        vboId = gl.createBuffer();
                        dc.gpuResourceCache.putResource(currentData.boundaryVboCacheKeys[b], vboId, numBoundaryPoints * 12);
                        refreshBuffers = true;
                    }

                    // Bind and if necessary fill the VBO. We fill the VBO here rather than in doMakeOrderedRenderable
                    // so that there's no possibility of the VBO being ejected from the cache between the time it's
                    // filled and the time it's used.
                    gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, vboId);
                    if (refreshBuffers) {
                        gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, currentData.boundaryPoints[b],
                            WebGLRenderingContext.STATIC_DRAW);
                        dc.frameStatistics.incrementVboLoadCount(1);
                    }

                    // Draw the extruded boundary.
                    if (this.activeAttributes.drawInterior && this._extrude && (!hasSideTextures || dc.pickingMode)) {
                        this.applyMvpMatrix(dc);

                        color = this.activeAttributes.interiorColor;
                        opacity = color.alpha * dc.currentLayer.opacity;
                        // Disable writing the shape's fragments to the depth buffer when the interior is
                        // semi-transparent.
                        gl.depthMask(opacity >= 1 || dc.pickingMode);
                        program.loadColor(gl, dc.pickingMode ? pickColor : color);
                        program.loadOpacity(gl, dc.pickingMode ? (opacity > 0 ? 1 : 0) : opacity);

                        // Draw the extruded boundary as one tri-strip.
                        gl.vertexAttribPointer(program.vertexPointLocation, 3, WebGLRenderingContext.FLOAT, false, 0, 0);
                        gl.drawArrays(WebGLRenderingContext.TRIANGLE_STRIP, 0, numBoundaryPoints);
                    }

                    // Draw the outline for this boundary.
                    if (this.activeAttributes.drawOutline) {
                        // Make the outline stand out from the interior.
                        this.applyMvpMatrixForOutline(dc);
                        program.loadTextureEnabled(gl, false);

                        color = this.activeAttributes.outlineColor;
                        opacity = color.alpha * dc.currentLayer.opacity;
                        // Disable writing the shape's fragments to the depth buffer when the interior is
                        // semi-transparent.
                        gl.depthMask(opacity >= 1 || dc.pickingMode);
                        program.loadColor(gl, dc.pickingMode ? pickColor : color);
                        program.loadOpacity(gl, dc.pickingMode ? 1 : opacity);

                        gl.lineWidth(this.activeAttributes.outlineWidth);

                        if (this._extrude) {
                            stride = 24;
                            nPts = numBoundaryPoints / 2;
                        } else {
                            stride = 12;
                            nPts = numBoundaryPoints;
                        }

                        gl.vertexAttribPointer(program.vertexPointLocation, 3, WebGLRenderingContext.FLOAT, false,
                            stride, 0);
                        gl.drawArrays(WebGLRenderingContext.LINE_STRIP, 0, nPts);

                        if (this.mustDrawVerticals(dc)) {
                            gl.vertexAttribPointer(program.vertexPointLocation, 3, WebGLRenderingContext.FLOAT, false,
                                0, 0);
                            gl.drawArrays(WebGLRenderingContext.LINES, 0, numBoundaryPoints - 2);
                        }
                    }
                }
                currentData.refreshBuffers = false;

                // If the extruded boundaries are textured, draw them here. This is a separate block because the
                // operation must create its own vertex VBO in order to include texture coordinates. It can't simply
                // use the previously computed boundary-points VBO.
                if (hasSideTextures && this.activeAttributes.drawInterior && this._extrude && !dc.pickingMode) {
                    this.applyMvpMatrix(dc);

                    color = this.activeAttributes.interiorColor;
                    opacity = color.alpha * dc.currentLayer.opacity;
                    gl.depthMask(opacity >= 1 || dc.pickingMode);
                    program.loadColor(gl, dc.pickingMode ? pickColor : color);
                    program.loadOpacity(gl, dc.pickingMode ? (opacity > 0 ? 1 : 0) : opacity);

                    // Create and bind a temporary VBO to hold the boundary vertices and texture coordinates.
                    gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, gl.createBuffer());
                    var boundaryVertices = new Float32Array(4 * 5); // 4 vertices of x, y, z, s, t

                    for (b = 0; b < currentData.boundaryPoints.length; b++) { // for each boundary
                        numBoundaryPoints = currentData.boundaryPoints[b].length / 3;
                        var numSides = (currentData.boundaryPoints[b].length) / 6 - 1,
                            boundaryPoints = currentData.boundaryPoints[b];

                        for (var side = 0; side < numSides; side++) {
                            var sideImageSource = this.sideImageSource(side),
                                sideTexture = dc.gpuResourceCache.resourceForKey(sideImageSource);

                            if (sideImageSource && !sideTexture) {
                                sideTexture = dc.gpuResourceCache.retrieveTexture(dc.currentGlContext, sideImageSource);
                            }

                            textureBound = sideTexture && sideTexture.bind(dc);
                            if (textureBound) {
                                program.loadTextureEnabled(gl, true);
                                program.loadTextureUnit(gl, WebGLRenderingContext.TEXTURE0);
                                gl.enableVertexAttribArray(program.vertexTexCoordLocation);
                            } else {
                                program.loadTextureEnabled(gl, false);
                                gl.disableVertexAttribArray(program.vertexTexCoordLocation);
                            }

                            // Make a 4-vertex tri-strip from consecutive boundary segments.

                            boundaryVertices[0] = boundaryPoints[side * 6];
                            boundaryVertices[1] = boundaryPoints[side * 6 + 1];
                            boundaryVertices[2] = boundaryPoints[side * 6 + 2];
                            boundaryVertices[3] = 0; // upper left texture coordinates
                            boundaryVertices[4] = 1;

                            boundaryVertices[5] = boundaryPoints[side * 6 + 3];
                            boundaryVertices[6] = boundaryPoints[side * 6 + 4];
                            boundaryVertices[7] = boundaryPoints[side * 6 + 5];
                            boundaryVertices[8] = 0; // lower left texture coordinates
                            boundaryVertices[9] = 0;

                            boundaryVertices[10] = boundaryPoints[side * 6 + 6];
                            boundaryVertices[11] = boundaryPoints[side * 6 + 7];
                            boundaryVertices[12] = boundaryPoints[side * 6 + 8];
                            boundaryVertices[13] = 1; // upper right texture coordinates
                            boundaryVertices[14] = 1;

                            boundaryVertices[15] = boundaryPoints[side * 6 + 9];
                            boundaryVertices[16] = boundaryPoints[side * 6 + 10];
                            boundaryVertices[17] = boundaryPoints[side * 6 + 11];
                            boundaryVertices[18] = 1; // lower right texture coordinates
                            boundaryVertices[19] = 0;

                            gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, boundaryVertices,
                                WebGLRenderingContext.STATIC_DRAW);
                            dc.frameStatistics.incrementVboLoadCount(1);

                            gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, WebGLRenderingContext.FLOAT,
                                false, 20, 12);
                            gl.vertexAttribPointer(program.vertexPointLocation, 3, WebGLRenderingContext.FLOAT,
                                false, 20, 0);
                            gl.drawArrays(WebGLRenderingContext.TRIANGLE_STRIP, 0, 4);
                        }
                    }
                }
            }

            if (dc.pickingMode) {
                var po = new PickedObject(pickColor, this.pickDelegate ? this.pickDelegate : this, null,
                    dc.currentLayer, false);
                dc.resolvePick(po);
            }
        };

        // Overridden from AbstractShape base class.
        Polygon.prototype.beginDrawing = function (dc) {
            var gl = dc.currentGlContext;

            if (this.activeAttributes.drawInterior) {
                gl.disable(WebGLRenderingContext.CULL_FACE);
            }

            dc.findAndBindProgram(BasicTextureProgram);
            gl.enableVertexAttribArray(dc.currentProgram.vertexPointLocation);
        };

        // Overridden from AbstractShape base class.
        Polygon.prototype.endDrawing = function (dc) {
            var gl = dc.currentGlContext;

            gl.disableVertexAttribArray(dc.currentProgram.vertexPointLocation);
            gl.depthMask(true);
            gl.lineWidth(1);
            gl.enable(WebGLRenderingContext.CULL_FACE);
        };

        return Polygon;
    }
)
;