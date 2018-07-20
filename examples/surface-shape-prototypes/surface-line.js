var onLoad = function (evt) {
    
    // initialize WorldWind
    var wwd = new WorldWind.WorldWindow('globe');
    var bmngOneImageLayer = new WorldWind.BMNGOneImageLayer();
    bmngOneImageLayer.minActiveAltitude = 0;
    wwd.addLayer(bmngOneImageLayer);
    wwd.addLayer(new WorldWind.ShowTessellationLayer());
    var lineLayer = new WorldWind.RenderableLayer("Line Layer");
    wwd.addLayer(lineLayer);

    var vertexShaderSource = `
        attribute vec4 vertexPoint;
        attribute vec3 offsetVector;
        uniform mat4 mvpMatrix;
        uniform float offsetWidth;
        uniform vec3 eyePoint;
        uniform float eyeAltitude;
        uniform float pixelSizeFactor;
        uniform float pixelSizeOffset;
        void main() {
            // the following calculations determine the width of a line in a best effort at constant size in screen space
            float distance = max(0.01, min(length(eyePoint - vertexPoint.xyz), eyeAltitude));
            float pixelSize = offsetWidth * (pixelSizeFactor * distance + pixelSizeOffset);
            vec3 offset = offsetVector * pixelSize;
            gl_Position = mvpMatrix * (vertexPoint + vec4(offset, 0.0));
            gl_Position.z = min(gl_Position.z, gl_Position.w); // prevent frustum culling of back of shadow volume
        }
    `;

    var fragmentShaderSource = `
        precision mediump float;
        uniform vec4 color;
        void main() {
            gl_FragColor = color;
        }
    `;

    // ad-hoc renderable for the shadow volume line
    var lineRenderable = {
        displayName: "Volume Outline",
        enabled: true,
        vbo: null,
        ebo: null,
        program: null,
        locations: [
            new WorldWind.Location(40, -100),
            new WorldWind.Location(30, -95)
        ],

        render: function (dc) {
        
            // configure the WebGL state to accomodate shadow volume stencil
            this.beginStenciling(dc);
            
            // prep the stencil for determining the surface fragments intersected by the volume
            this.prepareStencil(dc);
            
            // draw the volume to populate the stencil
            this.drawVolume(dc);

            // enable the stencil and configure it to only allow drawing on intersected fragments
            this.applyStencil(dc);

            // draw the volume again, this time to color the surface fragments
            this.drawVolume(dc);

            // restore the initial WebGL state
            this.endStenciling(dc);

            // uncomment code below to display the volume as a wireframe
            // dc.currentGlContext.disable(dc.currentGlContext.DEPTH_TEST);
            // this.drawVolume(dc, dc.currentGlContext.LINE_STRIP);
            // dc.currentGlContext.enable(dc.currentGlContext.DEPTH_TEST);
        },

        beginStenciling: function (dc) {
            var gl = dc.currentGlContext;

            gl.depthMask(false);
            gl.enable(gl.STENCIL_TEST);
            gl.disable(gl.CULL_FACE); // the WebGL stencil is two-sided, allowing for different computations for front and back faces
        },

        prepareStencil: function (dc) {
            var gl = dc.currentGlContext;

            gl.clear(gl.STENCIL_BUFFER_BIT);
            gl.stencilFunc(gl.ALWAYS, 0, 255);
            gl.enable(gl.DEPTH_TEST);
            gl.colorMask(false, false, false, false);

            // z-fail
            gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.DECR_WRAP, gl.KEEP);
            gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.INCR_WRAP, gl.KEEP);
        },

        applyStencil: function (dc) {
            var gl = dc.currentGlContext;

            // Enable the scene drawing
            gl.colorMask(true, true, true, true);

            // Apply the stencil test to drawing
            gl.stencilFunc(gl.NOTEQUAL, 0, 255);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.ZERO); // reset stencil to zero after successful fragment modification

            gl.disable(gl.DEPTH_TEST);
        },

        endStenciling: function (dc) {
            var gl = dc.currentGlContext;

            gl.disable(gl.STENCIL_TEST);
            gl.enable(gl.DEPTH_TEST);
            gl.depthMask(true);
        },

        drawVolume: function (dc, mode) {
            var gl = dc.currentGlContext;

            this.bindProgram(dc);

            // populate the program uniforms to enable line width scaling
            this.program.loadUniformMatrix(gl, dc.modelviewProjection, this.program.mvpLocation);
            this.program.loadUniformColor(gl, WorldWind.Color.RED, this.program.colorLocation);
            gl.uniform1f(this.program.offsetWidthLocation, 10);
            gl.uniform3f(this.program.eyePointLocation, dc.eyePoint[0], dc.eyePoint[1], dc.eyePoint[2]);
            gl.uniform1f(this.program.eyeAltitudeLocation, dc.eyePosition.altitude);
            gl.uniform1f(this.program.pixelSizeFactor, dc.pixelSizeFactor);
            gl.uniform1f(this.program.pixelSizeOffset, dc.pixelSizeOffset);

            this.bindBuffers(dc);

            // draw the edges of the polygon
            gl.drawElements(mode || gl.TRIANGLES, 6 /* sides/top/bottom/caps */ * 2 /* triangles per face */ * 3 /* vertices per triangle */, gl.UNSIGNED_SHORT, 0);

            // reinstate gl state
            gl.disableVertexAttribArray(this.program.vertexPointLocation);
            gl.disableVertexAttribArray(this.program.offsetVectorLocation);
            dc.findAndBindProgram(WorldWind.BasicTextureProgram);
        },

        bindProgram: function (dc) {
            var gl = dc.currentGlContext, p;

            // initialize the shader programs
            if (!this.program) {
                this.program = new WorldWind.GpuProgram(gl, vertexShaderSource, fragmentShaderSource, ["vertexPoint", "offsetVector"]);
                gl.useProgram(this.program.programId);
                p = this.program.programId;
                this.program.vertexPointLocation = gl.getAttribLocation(p, "vertexPoint");
                this.program.offsetVectorLocation = gl.getAttribLocation(p, "offsetVector");
                this.program.colorLocation = gl.getUniformLocation(p, "color");
                this.program.mvpLocation = gl.getUniformLocation(p, "mvpMatrix");
                this.program.offsetWidthLocation = gl.getUniformLocation(p, "offsetWidth");
                this.program.eyePointLocation = gl.getUniformLocation(p, "eyePoint");
                this.program.eyeAltitudeLocation = gl.getUniformLocation(p, "eyeAltitude");
                this.program.pixelSizeOffset = gl.getUniformLocation(p, "pixelSizeOffset");
                this.program.pixelSizeFactor = gl.getUniformLocation(p, "pixelSizeFactor");
            } else {
                gl.useProgram(this.program.programId);
            }
        },

        bindBuffers: function (dc) {
            var gl = dc.currentGlContext, ebo, vbo, points, elements;

            // configure the vertex buffer
            if (!this.vbo) {
                points = this.assembleVertices(dc);
                this.vbo = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
                gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
            } else {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
            }

            gl.enableVertexAttribArray(this.program.vertexPointLocation);
            gl.vertexAttribPointer(this.program.vertexPointLocation, 3, gl.FLOAT, false, 6 * 4, 0);

            gl.enableVertexAttribArray(this.program.offsetVectorLocation);
            gl.vertexAttribPointer(this.program.offsetVectorLocation, 3, gl.FLOAT, false, 6 * 4, 3 * 4);

            // configure the element buffer
            if (!this.ebo) {
                elements = this.assembleElements(dc);
                this.ebo = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elements, gl.STATIC_DRAW);
            } else {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
            }
        },

        assembleVertices: function (dc) {
            var points = new Float32Array(2 /* number of locations */ * (4 /* 4 verts per location */ + 4 /* normal vecs per location*/) 
                * 3 /* components per vertex/normal */ ), startPointTop = new WorldWind.Vec3(),  startPointBottom = new WorldWind.Vec3(), 
                endPointTop = new WorldWind.Vec3(), endPointBottom = new WorldWind.Vec3(), surfaceNormal = new WorldWind.Vec3(), 
                pointingVec = new WorldWind.Vec3(), lineNormal = new WorldWind.Vec3(), loc, idx = 0;

            loc = this.locations[0];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 1e6, startPointTop);
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, -1e6, startPointBottom);
            loc = this.locations[1];
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 1e6, endPointTop);
            dc.globe.computePointFromPosition(loc.latitude, loc.longitude, -1e6, endPointBottom);
            // calculate the normal at the midpoint of the line segment
            dc.globe.surfaceNormalAtLocation(
                (this.locations[0].latitude + this.locations[1].latitude) / 2,
                (this.locations[0].longitude + this.locations[1].longitude) / 2,
                surfaceNormal
            );
            pointingVec.copy(endPointTop);
            pointingVec.subtract(startPointTop);
            pointingVec.normalize();
            lineNormal.copy(surfaceNormal);
            lineNormal.cross(pointingVec).normalize();

            // build the buffer with all of the vertex and normal information
            // 0
            points[idx++] = startPointTop[0];
            points[idx++] = startPointTop[1];
            points[idx++] = startPointTop[2];
            points[idx++] = lineNormal[0];
            points[idx++] = lineNormal[1];
            points[idx++] = lineNormal[2];
            // 1
            points[idx++] = startPointTop[0];
            points[idx++] = startPointTop[1];
            points[idx++] = startPointTop[2];
            points[idx++] = -lineNormal[0];
            points[idx++] = -lineNormal[1];
            points[idx++] = -lineNormal[2];
            // 2
            points[idx++] = startPointBottom[0];
            points[idx++] = startPointBottom[1];
            points[idx++] = startPointBottom[2];
            points[idx++] = lineNormal[0];
            points[idx++] = lineNormal[1];
            points[idx++] = lineNormal[2];
            // 3
            points[idx++] = startPointBottom[0];
            points[idx++] = startPointBottom[1];
            points[idx++] = startPointBottom[2];
            points[idx++] = -lineNormal[0];
            points[idx++] = -lineNormal[1];
            points[idx++] = -lineNormal[2];
            // 4
            points[idx++] = endPointTop[0];
            points[idx++] = endPointTop[1];
            points[idx++] = endPointTop[2];
            points[idx++] = lineNormal[0];
            points[idx++] = lineNormal[1];
            points[idx++] = lineNormal[2];
            // 5
            points[idx++] = endPointTop[0];
            points[idx++] = endPointTop[1];
            points[idx++] = endPointTop[2];
            points[idx++] = -lineNormal[0];
            points[idx++] = -lineNormal[1];
            points[idx++] = -lineNormal[2];
            // 6
            points[idx++] = endPointBottom[0];
            points[idx++] = endPointBottom[1];
            points[idx++] = endPointBottom[2];
            points[idx++] = lineNormal[0];
            points[idx++] = lineNormal[1];
            points[idx++] = lineNormal[2];
            // 7
            points[idx++] = endPointBottom[0];
            points[idx++] = endPointBottom[1];
            points[idx++] = endPointBottom[2];
            points[idx++] = -lineNormal[0];
            points[idx++] = -lineNormal[1];
            points[idx++] = -lineNormal[2];

            return points;
        },

        assembleElements: function (dc) {
            var elements = new Int16Array(6 /* sides/top/bottom/caps */ * 2 /* triangles per face */ * 3 /* vertices per triangle */), idx = 0;

            // front cap
            elements[idx++] = 0;
            elements[idx++] = 2;
            elements[idx++] = 3;
            elements[idx++] = 3;
            elements[idx++] = 1;
            elements[idx++] = 0;
            // positive side
            elements[idx++] = 0;
            elements[idx++] = 4;
            elements[idx++] = 6;
            elements[idx++] = 6;
            elements[idx++] = 2;
            elements[idx++] = 0;
            // back cap
            elements[idx++] = 4;
            elements[idx++] = 5;
            elements[idx++] = 7;
            elements[idx++] = 7;
            elements[idx++] = 6;
            elements[idx++] = 4;
            // negative side
            elements[idx++] = 5;
            elements[idx++] = 1;
            elements[idx++] = 3;
            elements[idx++] = 3;
            elements[idx++] = 7;
            elements[idx++] = 5;
            // top
            elements[idx++] = 0;
            elements[idx++] = 1;
            elements[idx++] = 5;
            elements[idx++] = 5;
            elements[idx++] = 4;
            elements[idx++] = 0;
            // bottom
            elements[idx++] = 3;
            elements[idx++] = 2;
            elements[idx++] = 6;
            elements[idx++] = 6;
            elements[idx++] = 7;
            elements[idx++] = 3;

            return elements;
        }
    };

    lineLayer.addRenderable(lineRenderable);
};

window.addEventListener('load', onLoad);
