var onLoad = function (evt) {
    
    // initialize WorldWind
    var wwd = new WorldWind.WorldWindow('globe');
    var bmngOneImageLayer = new WorldWind.BMNGOneImageLayer();
    bmngOneImageLayer.minActiveAltitude = 0;
    wwd.addLayer(bmngOneImageLayer);
    wwd.addLayer(new WorldWind.ShowTessellationLayer());
    var volumeLayer = new WorldWind.RenderableLayer("Volume Layer");
    wwd.addLayer(volumeLayer);

    var vertexShaderSource = `
        attribute vec4 vertexPoint;
        uniform mat4 mvpMatrix;
        void main() {
            gl_Position = mvpMatrix * vertexPoint;
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

    // ad-hoc renderable for the shadow volume surface shape
    var volumeOutlineRenderable = {
        displayName: "Volume Outline",
        enabled: true,
        vbo: null,
        ebo: null,
        program: null,
        locations: [
            new WorldWind.Location(40, -100),
            new WorldWind.Location(30, -105),
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

        drawVolume: function (dc) {
            var gl = dc.currentGlContext;

            // configure the program
            this.bindProgram(dc);
            this.program.loadUniformColor(gl, new WorldWind.Color(1, 0, 0, 1), this.program.colorLocation);
            this.program.loadUniformMatrix(gl, dc.modelviewProjection, this.program.mvpLocation);

            // bind the vertex and element buffers
            this.bindBuffers(dc);

            // draw the edges of the polygon
            gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_SHORT, 0);

            // reinstate gl state
            gl.disableVertexAttribArray(this.program.vertexPointLocation);
        },

        bindProgram: function (dc) {
            var gl = dc.currentGlContext, p;

            // initialize the shader programs
            if (!this.program) {
                this.program = new WorldWind.GpuProgram(gl, vertexShaderSource, fragmentShaderSource, ["vertexPoint"]);
                gl.useProgram(this.program.programId);
                p = this.program.programId;
                this.program.vertexPointLocation = gl.getAttribLocation(p, "vertexPoint");
                this.program.colorLocation = gl.getUniformLocation(p, "color");
                this.program.mvpLocation = gl.getUniformLocation(p, "mvpMatrix");
            } else {
                gl.useProgram(this.program.programId);
            }
        },

        bindBuffers: function (dc) {
            var gl = dc.currentGlContext, points, elements;

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
            gl.vertexAttribPointer(this.program.vertexPointLocation, 3, gl.FLOAT, false, 3 * 4, 0);

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
            var points = new Float32Array(this.locations.length * 3 * 2), point = new WorldWind.Vec3(), loc, i, idx = 0;

            for (i = 0; i < this.locations.length; i++) {
                loc = this.locations[i];
                // top first
                dc.globe.computePointFromPosition(loc.latitude, loc.longitude, 1e6, point);
                points[idx++] = point[0];
                points[idx++] = point[1];
                points[idx++] = point[2];
                dc.globe.computePointFromPosition(loc.latitude, loc.longitude, -1e6, point);
                points[idx++] = point[0];
                points[idx++] = point[1];
                points[idx++] = point[2];
            }

            return points;
        },

        assembleElements: function (dc) {
            var elements = new Int16Array(3 /* sides */ * 2 /* triangles per side */ * 3 /* vertices per triangle */ 
                + 2 /* top and bottom */ * 3 /* vertices per triangle */), idx = 0;

            // sides
            elements[idx++] = 0;
            elements[idx++] = 2;
            elements[idx++] = 1;
            elements[idx++] = 3;
            elements[idx++] = 1;
            elements[idx++] = 2;

            elements[idx++] = 2;
            elements[idx++] = 4;
            elements[idx++] = 3;
            elements[idx++] = 5;
            elements[idx++] = 3;
            elements[idx++] = 4;

            elements[idx++] = 4;
            elements[idx++] = 0;
            elements[idx++] = 5;
            elements[idx++] = 1;
            elements[idx++] = 5;
            elements[idx++] = 0;

            // top
            elements[idx++] = 0;
            elements[idx++] = 4;
            elements[idx++] = 2;

            // bottom
            elements[idx++] = 1;
            elements[idx++] = 3;
            elements[idx++] = 5;

            return elements;
        }
    };

    volumeLayer.addRenderable(volumeOutlineRenderable);
};

window.addEventListener('load', onLoad);
