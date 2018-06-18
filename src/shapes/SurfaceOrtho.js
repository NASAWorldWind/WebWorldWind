define([
        '../util/Color',
        '../geom/Matrix',
        '../shaders/OrthoProgram',
        '../render/Renderable',
        '../render/Texture',
        '../geom/Vec3'
    ],
    function (Color, Matrix, OrthoProgram, Renderable, Texture, Vec3){

    var SurfaceOrtho = function (location, distance, image) {
        Renderable.call(this);

        this.location = location;

        this.distance = 0;

        this.image = image;

        this.texture = null;

        this.scratchMatrix = new Matrix();

        this.modelViewMatrix = new Matrix();

        this.orthoProjectionMatrix = new Matrix();
    };

    SurfaceOrtho.prototype = Object.create(Renderable.prototype);

    SurfaceOrtho.prototype.setLookAt = function (dc, terrainTile) {
        this.modelViewMatrix.setToIdentity();
        this.modelViewMatrix.multiplyByLookAtModelview(this.location, this.distance, 0, 0, 0, dc.globe);
    };

    SurfaceOrtho.prototype.render = function (dc) {
        var gl = dc.currentGlContext, program, terrainTiles, terrainTile, i, len, vbo, vboCacheKey, ebo, eboCacheKey,
            gpuResourceCache = dc.gpuResourceCache;

        if (!this.image) {
            return;
        }

        if (!this.texture) {
            // TODO add to gpu resource cache
            this.texture = new Texture(gl, this.image, gl.CLAMP_TO_EDGE);
        }

        this.orthoProjectionMatrix.setToOrthographicProjection(-WorldWind.EARTH_RADIUS * 0.25, WorldWind.EARTH_RADIUS * 0.25, -WorldWind.EARTH_RADIUS * 0.25, WorldWind.EARTH_RADIUS * 0.25, 1, -1);

        program = dc.findAndBindProgram(OrthoProgram);
        program.loadTextureUnit(gl, gl.TEXTURE0);
        this.texture.bind(dc);

        gl.enableVertexAttribArray(program.vertexPointLocation);

        terrainTiles = dc.terrain.surfaceGeometry;

        for (i = 0, len = terrainTiles.length; i < len; i++) {
            terrainTile = terrainTiles[i];

            if (!terrainTile || !terrainTile.transformationMatrix) {
                continue;
            }

            // calculate and load the vertex points mvp matrix, transformed to account for the rtc coordinate
            // definition of a terrain tile
            this.scratchMatrix.setToMultiply(dc.modelviewProjection, terrainTile.transformationMatrix);
            program.loadModelviewProjection(gl, this.scratchMatrix);

            // calculate and load the image projection mvp matrix, similarly transformed to account fo the rtc
            // coordinate of a terrain tile
            this.modelViewMatrix.setToIdentity();
            this.modelViewMatrix.multiplyByLookAtModelview(this.location, this.distance, 0, 0, 0, dc.globe);
            this.scratchMatrix.setToMultiply(this.orthoProjectionMatrix, this.modelViewMatrix);
            this.scratchMatrix.multiplyMatrix(terrainTile.transformationMatrix);
            program.loadTextureMatrix(gl, this.scratchMatrix);

            vboCacheKey = dc.globeStateKey + terrainTile.tileKey;
            vbo = gpuResourceCache.resourceForKey(vboCacheKey);
            if (!vbo) {
                vbo = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
                gl.bufferData(gl.ARRAY_BUFFER, terrainTile.points, gl.STATIC_DRAW);
                dc.frameStatistics.incrementVboLoadCount(1);
                gpuResourceCache.putResource(vboCacheKey, vbo, terrainTile.points.length * 4);
                terrainTile.pointsVboStateKey = terrainTile.pointsStateKey;
            }
            else if (terrainTile.pointsVboStateKey !== terrainTile.pointsStateKey) {
                gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, terrainTile.points);
                terrainTile.pointsVboStateKey = terrainTile.pointsStateKey;
            }
            else {
                dc.currentGlContext.bindBuffer(gl.ARRAY_BUFFER, vbo);
            }

            eboCacheKey = dc.globe.tessellator.indicesVboCacheKey;
            ebo = gpuResourceCache.resourceForKey(eboCacheKey);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);

            gl.vertexAttribPointer(this.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);

            // gl.drawArrays(gl.POINTS, 0, terrainTile.points.length / 3);
            gl.drawElements(gl.TRIANGLE_STRIP, dc.globe.tessellator.numBaseIndices, gl.UNSIGNED_SHORT, dc.globe.tessellator.baseIndicesOffset * 2);
        }

        gl.disableVertexAttribArray(program.vertexPointLocation);
    };

    return SurfaceOrtho;
});
