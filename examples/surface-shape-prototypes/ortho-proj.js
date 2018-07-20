var onLoad = function (evt) {
    
    // initialize WorldWind
    var wwd = new WorldWind.WorldWindow('globe');
    var bmngOneImageLayer = new WorldWind.BMNGOneImageLayer();
    bmngOneImageLayer.minActiveAltitude = 0;
    wwd.addLayer(bmngOneImageLayer);
    wwd.addLayer(new WorldWind.ShowTessellationLayer());
    var orthoLayer = new WorldWind.RenderableLayer("Orthographic Projection Surface Image Layer");
    wwd.addLayer(orthoLayer);

    // shader source for the program which draws the surface image onto the terrain
    var vertexShaderSource = `
        attribute vec4 vertexPoint;
        uniform mat4 mvpMatrix;
        uniform mat4 texCoordMatrix;
        varying vec2 texCoord;
        void main() {
            gl_Position = mvpMatrix * vertexPoint;
            texCoord = (texCoordMatrix * vertexPoint).st;
            // transform from clip coordinates to texture coordinates
            texCoord.s = (texCoord.s + 1.0) * 0.5;
            texCoord.t = (texCoord.t + 1.0) * 0.5;
        }
    `;

    var fragmentShaderSource = `
        precision mediump float;
        uniform sampler2D textureSampler;
        varying vec2 texCoord;
        void main() {
            gl_FragColor = texture2D(textureSampler, texCoord);
        }
    `;
 
    // ad-hoc renderable for the orthographic projected surface image
    var orthoProjRenderable = {
        displayName: "Orthographic Projected Surface",
        enabled: true,
        imageSource: "star.jpg",
        vbo: null,
        framebuffer: null,
        orthoProgram: null,
        orthoMatrix: new WorldWind.Matrix(),
        locations: [
            new WorldWind.Location(40, -100),
            new WorldWind.Location(30, -105),
            new WorldWind.Location(30, -95)
        ],
        points: null,
        verts: null,

        render: function (dc) {

            // convert the geographic locations to cartesian points and build a vertex array with texture coordinates
            this.assembleGeometry(dc);
        
            // configure ortho projection matrix for the current view
            this.configureOrthoMatrix(dc);
            
            // project the surface image and shape into the orthographic plane, returns true or false depending on if
            // the desired texture is ready
            if (this.transformImage(dc)) {

                // sample the projected image from the terrain (e.g. draw to terrain)
                this.drawSurfaceImage(dc);
            } 
        },

        configureOrthoMatrix: function (dc) {
            var i, minx = Number.MAX_VALUE, miny = Number.MAX_VALUE, minz = Number.MAX_VALUE, maxx = -Number.MAX_VALUE,
                maxy = -Number.MAX_VALUE, maxz = -Number.MAX_VALUE, scratchPoint = new WorldWind.Vec3(), altitudeScale, tiltScale,
                resolutionScale, left, right, bottom, top, near, far;

            // set the look at matrix to calculate the bounds of the ortho projection by determining the cartesian bounds of the 
            // boundary points transformed from the current view position
            this.orthoMatrix.setToIdentity();
            this.orthoMatrix.multiplyByLookAtModelview(dc.eyePosition, 0, 0, 0, 0, dc.globe);
            for (i = 0; i < this.points.length; i++) {
                scratchPoint.copy(this.points[i]);
                scratchPoint.multiplyByMatrix(this.orthoMatrix);
                minx = Math.min(minx, scratchPoint[0]);
                maxx = Math.max(maxx, scratchPoint[0]);
                miny = Math.min(miny, scratchPoint[1]);
                maxy = Math.max(maxy, scratchPoint[1]);
                minz = Math.min(minz, scratchPoint[2]);
                maxz = Math.max(maxz, scratchPoint[2]);
            }

            // determine the scaling/zoom of the projected image which will be sampled
            altitudeScale = dc.eyePosition.altitude / 1e6;
            tiltScale = 1 - Math.sin(dc.navigator.tilt * Math.PI / 180);
            resolutionScale = WorldWind.WWMath.clamp(altitudeScale / tiltScale, 0.01, 1);

            // set the orthographic projection matrix with the bounds calculated above and the calculated resolution scale
            left = minx * resolutionScale;
            right = maxx * resolutionScale;
            bottom = miny * resolutionScale;
            top = maxy * resolutionScale;
            near = -WorldWind.EARTH_RADIUS * 5;
            far = WorldWind.EARTH_RADIUS * 5;
            
            // set the orthographic projection matrix
            // Row 1
            this.orthoMatrix[0] = 2 / (right - left);
            this.orthoMatrix[1] = 0;
            this.orthoMatrix[2] = 0;
            this.orthoMatrix[3] = - (right + left) / (right - left);
            // Row 2
            this.orthoMatrix[4] = 0;
            this.orthoMatrix[5] = 2 / (top - bottom);
            this.orthoMatrix[6] = 0;
            this.orthoMatrix[7] = - (top + bottom) / (top - bottom);
            // Row 3
            this.orthoMatrix[8] = 0;
            this.orthoMatrix[9] = 0;
            this.orthoMatrix[10] = -2 / (far - near);
            this.orthoMatrix[11] = - (far + near) / (far - near);
            // Row 4
            this.orthoMatrix[12] = 0;
            this.orthoMatrix[13] = 0;
            this.orthoMatrix[14] = 0;
            this.orthoMatrix[15] = 1;

            // apply the look at transform for the current camera position
            this.orthoMatrix.multiplyByLookAtModelview(dc.eyePosition, 0, 0, 0, 0, dc.globe);
        },

        transformImage: function (dc) {
            var gl = dc.currentGlContext, textureSize = 1024, program, texture;
            
            // setup the framebuffer whose texture is the target of the orthographic projection transformation
            if (!this.framebuffer) {
                this.framebuffer = new WorldWind.FramebufferTexture(gl, textureSize, textureSize, false);
                // this overrides the default bind behavior to fix an error in WW library
                this.framebuffer.bind = function (dc) {
                    var gl = dc.currentGlContext;

                    if (this.texture) {
                        gl.bindTexture(gl.TEXTURE_2D, this.texture);
                    }

                    return !!this.texture;
                }
            }
            dc.bindFramebuffer(this.framebuffer);
            gl.viewport(0, 0, textureSize, textureSize);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            // use the basic texture program to project and transform the desired surface image
            program = dc.findAndBindProgram(WorldWind.BasicTextureProgram);
            program.loadModelviewProjection(gl, this.orthoMatrix);
            program.loadTextureMatrix(gl, WorldWind.Matrix.fromIdentity()); // keep vertex array specified coordinates
            program.loadTextureEnabled(gl, true);
            program.loadColor(gl, WorldWind.Color.WHITE);
            program.loadOpacity(gl, 1);
            program.loadTextureUnit(gl, gl.TEXTURE0);

            // load the texture to transform
            texture = dc.gpuResourceCache.resourceForKey(this.imageSource);
            if (!texture) {
                dc.gpuResourceCache.retrieveTexture(gl, this.imageSource);
                return false;
            }
            gl.activeTexture(gl.TEXTURE0);
            texture.bind(dc);

            this.bindBuffers(dc, program);

            // transform the texture to the orthographic plane
            gl.disable(gl.CULL_FACE);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            gl.enable(gl.CULL_FACE);

            gl.disableVertexAttribArray(program.vertexPointLocation);
            gl.disableVertexAttribArray(program.vertexTexCoordLocation);

            // reinstate the original framebuffer state
            dc.bindFramebuffer(null);
            gl.viewport(0, 0, dc.viewport.width, dc.viewport.height);
            gl.clearColor(1, 1, 1, 1);

            return true;
        },

        drawSurfaceImage: function (dc) {
            var gl = dc.currentGlContext, terrain = dc.terrain, terrainTiles = dc.terrain.surfaceGeometry,
                terrainTile, i, len, scratchMatrix = new WorldWind.Matrix(), program;

            if (!terrainTiles) {
                return;
            }

            program = this.bindOrthoProgram(dc);

            gl.enable(gl.DEPTH_TEST);

            // draw the terrain with texture coordinates which map to the framebuffer texture
            this.framebuffer.bind(dc); // binds the framebuffers texture, not the framebuffer
            gl.activeTexture(gl.TEXTURE0);
            gl.uniform1i(program.textureUnitLocation, 0);

            len = terrainTiles.length;

            terrain.beginRendering(dc);

            for (i = 0; i < len; i++) {
                terrainTile = terrainTiles[i];

                if (!terrainTile || !terrainTile.transformationMatrix) {
                    continue;
                }

                scratchMatrix.setToMultiply(this.orthoMatrix, terrainTile.transformationMatrix);
                program.loadUniformMatrix(gl, scratchMatrix, program.texCoordMatrixLocation);

                terrain.beginRenderingTile(dc, terrainTile);
                terrain.renderTile(dc, terrainTile);
                terrain.endRenderingTile(dc, terrainTile);

            }

            terrain.endRendering(dc);
        },

        bindOrthoProgram: function (dc) {
            var gl = dc.currentGlContext;

            if (!this.orthoProgram) {
                this.orthoProgram = this.createOrthoProgram(dc);
            }

            gl.useProgram(this.orthoProgram.programId);

            dc.currentProgram = this.orthoProgram;

            return this.orthoProgram;
        },

        bindBuffers: function (dc, program) {
            var gl = dc.currentGlContext;

            // configure the vertex buffer
            if (!this.vbo) {
                this.vbo = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
                gl.bufferData(gl.ARRAY_BUFFER, this.verts, gl.STATIC_DRAW);
            } else {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
            }

            gl.enableVertexAttribArray(program.vertexPointLocation);
            gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 5 * 4, 0);

            gl.enableVertexAttribArray(program.vertexTexCoordLocation);
            gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, gl.FLOAT, false, 5 * 4, 3 * 4);
        },

        createOrthoProgram: function (dc) {
            var gl = dc.currentGlContext, program, bindings = ["vertexPoint"];

            program = new WorldWind.GpuProgram(gl, vertexShaderSource, fragmentShaderSource, bindings);
            gl.useProgram(program.programId);

            program.vertexPointLocation = gl.getAttribLocation(program.programId, "vertexPoint");
            program.mvpLocation = gl.getUniformLocation(program.programId, "mvpMatrix");
            program.texCoordMatrixLocation = gl.getUniformLocation(program.programId, "texCoordMatrix");
            program.textureUnitLocation = gl.getUniformLocation(program.programId, "textureSampler");

            // anticipated function called by the terrain tessellator
            program.loadModelviewProjection = function (gl, matrix) {
                program.loadUniformMatrix(gl, matrix, program.mvpLocation);
            }

            gl.useProgram(null);

            return program;
        },

        assembleGeometry: function (dc) {
            var i, idx = 0, loc;

            // compute the cartesian points of the geographic triangle
            if (!this.points) {
                this.points = [];
                for (i = 0; i < this.locations.length; i++) {
                    loc = this.locations[i];
                    this.points.push(dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 0, new WorldWind.Vec3()));
                }
            }

            // generate the vertex array with texture coordinates to show the bottom pizza slice of the image
            if (!this.verts) {
                this.verts = new Float32Array(this.locations.length * (3 /* components of a vertex */ + 2 /* components of a texture coord */));
                this.verts[idx++] = this.points[0][0];
                this.verts[idx++] = this.points[0][1];
                this.verts[idx++] = this.points[0][2];
                this.verts[idx++] = 0.5;
                this.verts[idx++] = 0.5;
                this.verts[idx++] = this.points[1][0];
                this.verts[idx++] = this.points[1][1];
                this.verts[idx++] = this.points[1][2];
                this.verts[idx++] = 0;
                this.verts[idx++] = 0;
                this.verts[idx++] = this.points[2][0];
                this.verts[idx++] = this.points[2][1];
                this.verts[idx++] = this.points[2][2];
                this.verts[idx++] = 1;
                this.verts[idx++] = 0;
            }
        }
    };

    orthoLayer.addRenderable(orthoProjRenderable);
};

window.addEventListener('load', onLoad);
