requirejs(['./WorldWindShim'],
    function (WorldWind) {

    var generateVertexArray = function () {
        var delta = 10, vertices = [], radius = 1, i, j, lat, lon, x, y, z;

        for (i = 0; i <= 36; i++) {
            lon = delta * i;
            for (j = 0; j <= 9; j++) {
                lat = delta * j;

                x = radius * Math.sin(lat * Math.PI / 180) * Math.cos(lon * Math.PI / 180);
                y = radius * Math.sin(lat * Math.PI / 180) * Math.sin(lon * Math.PI / 180);
                z = radius * Math.cos(lat * Math.PI / 180);
                // simulate terrain
                // z += Math.random() * 0.15;

                vertices.push(x);
                vertices.push(y);
                vertices.push(z);

                if (lon < 90) {
                    vertices.push(1);
                    vertices.push(0);
                    vertices.push(0);
                } else if (lon < 180) {
                    vertices.push(0);
                    vertices.push(1);
                    vertices.push(0);
                } else if (lon < 270) {
                    vertices.push(0);
                    vertices.push(0);
                    vertices.push(1);
                } else {
                    vertices.push(1);
                    vertices.push(1);
                    vertices.push(1);
                }
            }
        }

        return new Float32Array(vertices);
    };

    var generateElementArray = function () {
        var elements = [], offset;

        for (i = 0; i < 36; i++) {
            offset = i * 10;
            for (j = 0; j < 9; j++) {
                // triangle one
                elements.push(offset + j);
                elements.push(offset + (j + 1));
                elements.push(offset + (j + 10));
                // triangle two
                elements.push(offset + (j + 11));
                elements.push(offset + (j + 10));
                elements.push(offset + (j + 1));
            }
        }

        return new Int16Array(elements);
    };

    var fromViewLookAt = function (eye, center, up) {
        var iEye = new WorldWind.Vec3(eye[0], eye[1], eye[2]), iCenter = new WorldWind.Vec3(center[0], center[1], center[2]),
            iUp = new WorldWind.Vec3(up[0], up[1], up[2]), forward = new WorldWind.Vec3(center[0], center[1], center[2]),
            s, u, mAxes, mEye;

        forward.subtract(iEye).normalize();

        s = new WorldWind.Vec3(forward[0], forward[1], forward[2]);
        s.cross(iUp).normalize();

        if (s.magnitude() <= 1e-6) {
            console.error("singularity or something dude...");
            return null;
        }

        u = new WorldWind.Vec3(s[0], s[1], s[2]);
        u.cross(forward).normalize();

        mAxes = new WorldWind.Matrix(
            s[0], s[1], s[2], 0.0,
            u[0], u[1], u[2], 0.0,
            -forward[0], -forward[1], -forward[2], 0.0,
            0.0, 0.0, 0.0, 1.0
        );
        mEye = new WorldWind.Matrix();
        mEye.setToTranslation(-eye[0], -eye[1], -eye[2]);

        return mAxes.multiplyMatrix(mEye);
    };

    var createOrthoProjectionMatrix = function (distance) {
        var nearRect = WorldWind.WWMath.perspectiveFrustumRectangle(800, 800, distance),
            left = nearRect.getMinX(),
            right = nearRect.getMaxX(),
            bottom = nearRect.getMinY(),
            top = nearRect.getMaxY();
        var near = 0.01;
        var far = 6;
        var tx = - (right + left) / (right - left);
        var ty = - (top + bottom) / (top - bottom);
        var tz = - (far + near) / (far - near);

        return new WorldWind.Matrix(
            2 / (right - left), 0, 0, tx,
            0, 2 / (top - bottom), 0, ty,
            0, 0, -2 / (far - near), tz,
            0, 0, 0, 1
        );
    };

    var canvas = document.getElementById("globe");
    var gl = canvas.getContext('webgl');
    var vertexShaderSource = document.getElementById("vertex-shader").innerText;
    var fragmentShaderSource = document.getElementById("fragment-shader").innerText;
    var azimuthSlider = document.getElementById("azimuth-slider");
    var tiltSlider = document.getElementById("tilt-slider");
    var rangeSlider = document.getElementById("range-slider");
    var orthgraphicCheckbox = document.getElementById("orthographic-checkbox");
        var imageTiltSlider = document.getElementById("image-tilt-slider");
        var imageRotationSlider = document.getElementById("image-rotation-slider");
    var program;
    var sceneMvpLocation;
    var textureMvpLocation;
    var vertexLocation;
    var vertexArray = generateVertexArray();
    var colorLocation;
    var vertexBuffer;
    var elementBuffer;
    var textureLocation;
    var textureId;
    var elements = generateElementArray();
    var sceneMvp = new WorldWind.Matrix();
    var textureMvp = new WorldWind.Matrix();
    var cameraPosition = new WorldWind.Vec3(0, 0, 5);
    var center = new WorldWind.Vec3(0, 0, 0);
        var surfaceCanvas = document.createElement("canvas");
        surfaceCanvas.setAttribute("height", 128);
        surfaceCanvas.setAttribute("width", 128);
        var ctx = surfaceCanvas.getContext("2d");
        ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
        ctx.fillRect(0, 0, 64, 64);
        ctx.fillStyle = "rgba(150, 150, 150, 0.5)";
        ctx.fillRect(64, 0, 64, 64);
        ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
        ctx.fillRect(0, 64, 64, 64);
        ctx.fillStyle = "rgba(50, 50, 50, 0.5)";
        ctx.fillRect(64, 64, 64, 64);
        ctx.strokeStyle = "rgba(0, 0, 0, 1)";
        ctx.strokeRect(8, 8, 112, 112);
        ctx.strokeRect(16, 16, 96, 96);
        document.body.appendChild(surfaceCanvas);
        var texture = new WorldWind.Texture(gl, surfaceCanvas);

    var resetGl = function () {
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.clear(gl.DEPTH_BUFFER_BIT);
    };

    var loadShader = function (gl, type, source) {
        var shader = gl.createShader(type);

        // Send the source to the shader object

        gl.shaderSource(shader, source);

        // Compile the shader program

        gl.compileShader(shader);

        // See if it compiled successfully

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    };

    var initShaderProgram = function (gl, vsSource, fsSource) {
        var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
        var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

        // Create the shader program

        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        // If creating the shader program failed, alert

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    };

    // initialize and setup gl context
    var setupGl = function () {
        gl.clearColor(0, 0, 0, 1);
        program = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
        sceneMvpLocation = gl.getUniformLocation(program, "sceneMvp");
        textureMvpLocation = gl.getUniformLocation(program, "textureMvp");
        textureLocation = gl.getUniformLocation(program, "textureSampler");
        vertexLocation = gl.getAttribLocation(program, "vertex");
        colorLocation = gl.getAttribLocation(program, "color");
    };

    var setupSceneMvp = function () {
        var azimuth = azimuthSlider.value / 10;
        var tilt = tiltSlider.value / 10;
        var range = rangeSlider.value / 100;

        cameraPosition[0] = Math.sin(tilt * Math.PI / 180) * Math.cos(azimuth * Math.PI / 180) * range;
        cameraPosition[1] = Math.sin(tilt * Math.PI / 180) * Math.sin(azimuth * Math.PI / 180) * range;
        cameraPosition[2] = Math.cos(tilt * Math.PI / 180) * range;

        var sceneModelView = fromViewLookAt(cameraPosition, center, new WorldWind.Vec3(0, 0, 1));
        var sceneProjection;
        if (orthgraphicCheckbox.checked) {
            sceneProjection = createOrthoProjectionMatrix(cameraPosition.magnitude());
        } else {
            sceneProjection = new WorldWind.Matrix().setToPerspectiveProjection(800, 700, 0.01, 6);
        }
        sceneMvp.setToMultiply(sceneProjection, sceneModelView);
    };

    var setupTextureMvp = function () {
        var x = Math.sin(imageTiltSlider.value / 10 * Math.PI / 180) * 2;
        var z = Math.cos(imageTiltSlider.value / 10 * Math.PI / 180) * 2;
        var texturePosition = new WorldWind.Vec3(x, 0, z);

        var y = Math.sin(imageRotationSlider.value / 10 * Math.PI / 180) * 2;
        z = Math.cos(imageRotationSlider.value / 10 * Math.PI / 180) * 2;

        var textureModelView = fromViewLookAt(texturePosition, center, new WorldWind.Vec3(0, y, z));
        var sceneProjection = createOrthoProjectionMatrix(texturePosition.magnitude());
        textureMvp.setToMultiply(sceneProjection, textureModelView);
    };

    var drawWireframeGlobe = function () {
        if (!vertexBuffer) {
            vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);


        gl.useProgram(program);

        var columnMajorArray = sceneMvp.columnMajorComponents(new Float32Array(16));
        gl.uniformMatrix4fv(sceneMvpLocation, false, columnMajorArray);

        gl.enableVertexAttribArray(vertexLocation);
        gl.enableVertexAttribArray(colorLocation);

        gl.vertexAttribPointer(vertexLocation, 3, gl.FLOAT, false, 6 * 4, 0);
        gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 3 * 4);

        gl.drawArrays(gl.LINE_STRIP, 0, vertexArray.length / 6);
    };

    var drawGlobe = function () {
        if (!vertexBuffer) {
            vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        if (!elementBuffer) {
            elementBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elements, gl.STATIC_DRAW);
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);

        texture.bind({
            currentGlContext: gl, frameStatistics: {
                incrementTextureLoadCount: function (n) {
                }
            }
        });

        gl.useProgram(program);

        var columnMajorArray = sceneMvp.columnMajorComponents(new Float32Array(16));
        gl.uniformMatrix4fv(sceneMvpLocation, false, columnMajorArray);
        columnMajorArray = textureMvp.columnMajorComponents(new Float32Array(16));
        gl.uniformMatrix4fv(textureMvpLocation, false, columnMajorArray);
        gl.uniform1i(textureLocation, 0);

        gl.enableVertexAttribArray(vertexLocation);
        gl.enableVertexAttribArray(colorLocation);

        gl.vertexAttribPointer(vertexLocation, 3, gl.FLOAT, false, 6 * 4, 0);
        gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 6 * 4, 3 * 4);

        gl.drawElements(gl.TRIANGLES, elements.length, gl.UNSIGNED_SHORT, 0);
    };

    setupGl();

    setInterval(function () {
        resetGl();
        setupSceneMvp();
        setupTextureMvp();
        if (texture) {
            drawGlobe();
        }
        drawWireframeGlobe();
    }, 30);

    });