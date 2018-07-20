var onLoad = function (evt) {
    
    // initialize WorldWind
    var wwd = new WorldWind.WorldWindow('globe');
    wwd.addLayer(new WorldWind.BMNGOneImageLayer());
    wwd.addLayer(new WorldWind.ShowTessellationLayer());
    var volumeLayer = new WorldWind.RenderableLayer("Volume Layer");
    wwd.addLayer(volumeLayer);

    // ad-hoc renderable for the volume outline
    var volumeOutlineRenderable = {
        displayName: "Volume Outline",
        enabled: true,
        vbo: null,
        ebo: null,
        locations: [
            new WorldWind.Location(40, -100),
            new WorldWind.Location(30, -105),
            new WorldWind.Location(30, -95)
        ],

        render: function (dc) {
            var gl = dc.currentGlContext, program;

            // configure the program
            program = dc.findAndBindProgram(WorldWind.BasicProgram);
            program.loadColor(gl, new WorldWind.Color(1, 0, 0, 1));
            program.loadModelviewProjection(gl, dc.modelviewProjection);

            // bind the vertex and element buffers
            this.bindBuffers(dc);

            // draw the edges of the polygon
            gl.drawElements(gl.LINE_STRIP, 14, gl.UNSIGNED_SHORT, 0);

            // reinstate gl state
            gl.disableVertexAttribArray(program.vertexPointLocation);
        },

        bindBuffers: function (dc) {
            var gl = dc.currentGlContext, program = dc.currentProgram, points, elements;

            // configure the vertex buffer
            if (!this.vbo) {
                points = this.assembleVertices(dc);
                this.vbo = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
                gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
            } else {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
            }

            gl.enableVertexAttribArray(program.vertexPointLocation);
            gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 3 * 4, 0);

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
            var elements = new Int16Array(14), idx = 0;

            // sides
            elements[idx++] = 0;
            elements[idx++] = 1;
            elements[idx++] = 2;
            elements[idx++] = 3;
            elements[idx++] = 4;
            elements[idx++] = 5;
            // top
            elements[idx++] = 0;
            elements[idx++] = 2;
            elements[idx++] = 4;
            elements[idx++] = 0;
            // bottom
            elements[idx++] = 1;
            elements[idx++] = 3;
            elements[idx++] = 5;
            elements[idx++] = 1;

            return elements;
        }
    };

    volumeLayer.addRenderable(volumeOutlineRenderable);
};

window.addEventListener('load', onLoad);
