define([
        '../geom/Matrix',
        '../shaders/OrthoProgram',
        '../geom/Position',
        '../render/Renderable',
        '../render/Texture'
    ],
    function (Matrix, OrthoProgram, Position, Renderable, Texture){

    var SurfaceOrtho = function (location, image) {
        Renderable.call(this);

        this.position = new Position(location.latitude, location.longitude, 0);

        this.image = image;

        this.texture = null;

        this.scratchMatrix = new Matrix();

        this.surfaceImageModelViewMatrix = new Matrix();

        this.orthoProjectionMatrix = new Matrix();
    };

    SurfaceOrtho.prototype = Object.create(Renderable.prototype);

    SurfaceOrtho.prototype.render = function (dc) {
        var gl = dc.currentGlContext, terrain = dc.terrain, program, terrainTiles = dc.terrain.surfaceGeometry,
            terrainTile, i, len;

        if (!this.image) {
            return;
        }

        if (!this.texture) {
            // TODO add to gpu resource cache
            this.texture = new Texture(gl, this.image, gl.CLAMP_TO_EDGE);
        }

        this.orthoProjectionMatrix.setToOrthographicProjection(
            -WorldWind.EARTH_RADIUS * 0.25,
            WorldWind.EARTH_RADIUS * 0.25,
            -WorldWind.EARTH_RADIUS * 0.25,
            WorldWind.EARTH_RADIUS * 0.25,
            1,
            -1
        );

        program = dc.findAndBindProgram(OrthoProgram);
        program.loadTextureUnit(gl, gl.TEXTURE0);
        this.texture.bind(dc);

        len = terrainTiles.length;

        terrain.beginRendering(dc);

        for (i = 0; i < len; i++) {
            terrainTile = terrainTiles[i];

            if (!terrainTile || !terrainTile.transformationMatrix) {
                continue;
            }

            this.surfaceImageModelViewMatrix.setToIdentity();
            this.surfaceImageModelViewMatrix.multiplyByLookAtModelview(this.position, 0, 0, 0, 0, dc.globe);
            this.scratchMatrix.setToMultiply(this.orthoProjectionMatrix, this.surfaceImageModelViewMatrix);
            this.scratchMatrix.multiplyMatrix(terrainTile.transformationMatrix);
            program.loadTextureMatrix(gl, this.scratchMatrix);

            terrain.beginRenderingTile(dc, terrainTile);
            terrain.renderTile(dc, terrainTile);
            terrain.endRenderingTile(dc, terrainTile);

        }

        terrain.endRendering(dc);
    };

    return SurfaceOrtho;
});
