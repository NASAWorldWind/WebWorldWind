define([
        '../shaders/BasicProgram',
        '../util/Color',
        '../geom/Matrix',
        '../render/Renderable'
    ],
    function (BasicProgram, Color, Matrix, Renderable){

    var SurfaceOrtho = function () {
        Renderable.call(this);

        this.color = new Color(0, 1, 0, 1);

        this.scratchMatrix = new Matrix();
    };

    SurfaceOrtho.prototype = Object.create(Renderable.prototype);

    SurfaceOrtho.prototype.render = function (dc) {
        // render all the vertices as points???
        var gl = dc.currentGlContext, program, vertexLocation, mvpLocation, colorLocation, terrainTiles, terrainTile, i,
            len, vbo, vboCacheKey, gpuResourceCache = dc.gpuResourceCache;

        program = dc.findAndBindProgram(BasicProgram);

        mvpLocation = gl.getUniformLocation(program.programId, "mvpMatrix");
        vertexLocation = gl.getAttribLocation(program.programId, "vertexPoint");
        colorLocation = gl.getUniformLocation(program.programId, "color");

        program.loadColor(gl, this.color, colorLocation);

        gl.enableVertexAttribArray(vertexLocation);

        terrainTiles = dc.terrain.surfaceGeometry;

        for (i = 0, len = terrainTiles.length; i < len; i++) {
            terrainTile = terrainTiles[i];

            this.scratchMatrix.setToMultiply(dc.modelviewProjection, terrainTile.transformationMatrix);
            program.loadUniformMatrix(gl, this.scratchMatrix, mvpLocation);

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

            gl.vertexAttribPointer(this.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);

            gl.drawArrays(gl.POINTS, 0, terrainTile.points.length / 3);
        }
    };

    return SurfaceOrtho;
});
