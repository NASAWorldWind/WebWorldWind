define([
    '../shaders/GpuProgram'
], function (GpuProgram) {

    var SurfaceShapeProgram = function (gl) {
        var vertexShaderSource =
            "attribute vec4 vertexPoint;\n" +
            "attribute vec4 vertexTexCoord;\n" +
            "attribute vec3 offsetVector;\n" +
            "uniform mat4 mvpMatrix;\n" +
            "uniform mat4 texCoordMatrix;\n" +
            "uniform float offsetWidth;\n" +
            "uniform vec3 eyePoint;\n" +
            "uniform float eyeAltitude;\n" +
            "uniform float pixelSizeFactor;\n" +
            "uniform float pixelSizeOffset;\n" +
            "uniform bool isVertexLookup;\n" +
            "varying vec2 texCoord;\n" +
            "void main() {\n" +
            // the following calculations determine the width of an outline in a best effort at constant size in screen space
            "   float distance = max(0.01, min(length(eyePoint - vertexPoint.xyz), eyeAltitude));\n" +
            "   float pixelSize = offsetWidth * (pixelSizeFactor * distance + pixelSizeOffset);\n" +
            "   gl_Position = mvpMatrix * (vertexPoint + vec4(offsetVector * pixelSize, 1.0));\n" +
            "   if (isVertexLookup) {\n" +
            "       texCoord = (texCoordMatrix * vertexPoint).st;\n" +
            "   } else {\n" +
            "       texCoord = (texCoordMatrix * vertexTexCoord).st;\n" +
            "   }\n" +
            "}",

        fragmentShaderSource =
            "precision mediump float;\n" +
            "uniform vec4 color;\n" +
            "uniform sampler2D textureSampler;\n" +
            "varying vec2 texCoord;\n" +
            "void main() {\n" +
            // "   if (texCoord.s >= 0.0 && texCoord.s <= 1.0 && texCoord.t >= 0.0 && texCoord.t <= 1.0) {\n" +
            "       gl_FragColor = color * texture2D(textureSampler, texCoord);\n" +
            // "   } else {\n" +
            // "       gl_FragColor = color;\n" +
            // "   }" +
            "}";

        var bindings = ["vertexPoint", "vertexTexCoord", "offsetVector"];

        // Call to the superclass, which performs shader program compiling and linking.
        GpuProgram.call(this, gl, vertexShaderSource, fragmentShaderSource, bindings);

        /**
         * The WebGL location for this program's 'vertexPoint' attribute.
         * @type {Number}
         * @readonly
         */
        this.vertexPointLocation = this.attributeLocation(gl, "vertexPoint");

        /**
         * The WebGL location for this program's 'vertexTexCoord' attribute.
         * @type {Number}
         * @readonly
         */
        this.vertexTexCoordLocation = this.attributeLocation(gl, "vertexTexCoord");

        /**
         * The WebGL location for this program's 'normalVector' attribute.
         * @type {Number}
         * @readonly
         */
        this.offsetVectorLocation = this.attributeLocation(gl, "offsetVector");

        /**
         * The WebGL location for this program's 'mvpMatrix' uniform.
         * @type {WebGLUniformLocation}
         * @readonly
         */
        this.mvpMatrixLocation = this.uniformLocation(gl, "mvpMatrix");

        this.texCoordMatrixLocation = this.uniformLocation(gl, "texCoordMatrix");

        /**
         * The WebGL location for this program's 'color' uniform.
         * @type {WebGLUniformLocation}
         * @readonly
         */
        this.colorLocation = this.uniformLocation(gl, "color");

        this.offsetWidthLocation = this.uniformLocation(gl, "offsetWidth");

        /**
         * The WebGL location for this program's 'textureSampler' uniform.
         * @type {WebGLUniformLocation}
         * @readonly
         */
        this.textureUnitLocation = this.uniformLocation(gl, "textureSampler");

        this.eyePointLocation = this.uniformLocation(gl, "eyePoint");

        this.eyeAltitudeLocation = this.uniformLocation(gl, "eyeAltitude");

        this.pixelSizeFactorLocation = this.uniformLocation(gl, "pixelSizeFactor");

        this.pixelSizeOffsetLocation = this.uniformLocation(gl, "pixelSizeOffset");

        this.isVertexLookupLocation = this.uniformLocation(gl, "isVertexLookup");
    };

    SurfaceShapeProgram.prototype = Object.create(GpuProgram.prototype);

    SurfaceShapeProgram.key = "WorldWindGpuSurfaceShapeProgram";

    SurfaceShapeProgram.prototype.loadUniformFloat = function (gl, value, location) {
        gl.uniform1f(location, value);
    };

    SurfaceShapeProgram.prototype.loadUniformTextureUnit = function (gl, unit) {
        gl.uniform1i(this.textureUnitLocation, unit - gl.TEXTURE0);
    };

    SurfaceShapeProgram.prototype.loadModelviewProjection = function (gl, matrix) {
        this.loadUniformMatrix(gl, matrix, this.mvpMatrixLocation);
    };

    SurfaceShapeProgram.prototype.loadUniformBoolean = function (gl, enable, location) {
        gl.uniform1i(location, enable ? 1 : 0);
    };

    return SurfaceShapeProgram;
});