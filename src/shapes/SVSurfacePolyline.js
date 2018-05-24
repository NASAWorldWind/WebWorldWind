define([
        '../render/Renderable',
        '../shaders/SVSurfacePolylineProgram',
        '../geom/Vec3'
    ],
    function (Renderable, SVSurfacePolylineProgram, Vec3) {
        "use strict";

        var SVSurfacePolyline = function (locations, attributes) {
            Renderable.call(this);

            this.locations = locations;

            this.attributes = attributes;

            this.vertexArray = null;

            this.elementArray = null;

            this.program = null;

            this.vboCacheKey = null;

            this.eboCacheKey = null;
        };

        SVSurfacePolyline.prototype = Object.create(Renderable.prototype);

        SVSurfacePolyline.cacheIdCounter = 0;

        SVSurfacePolyline.prototype.reset = function () {
            this.vertexArray = null;
            this.elementArray = null;
        };

        SVSurfacePolyline.prototype.render = function (dc) {
            if (!this.enabled) {
                return;
            }

            if (this.mustGenerateGeometry()) {
                this.assembleGeometry(dc);
            }

            dc.addSurfaceRenderable(this);
        };

        SVSurfacePolyline.prototype.mustGenerateGeometry = function () {
            return !this.vertexArray;
        };

        SVSurfacePolyline.prototype.assembleGeometry = function (dc) {
            this.assembleVertexArray(dc);
            this.assembleElementArray(dc);
        };

        SVSurfacePolyline.prototype.assembleVertexArray = function (dc) {
            var cubes = this.locations.length - 1;
            this.vertexArray = new Float32Array((8 * 6) * cubes);
            var endPoint = new Vec3(), startPoint = new Vec3(), normal = new Vec3(), loc, upperLimit, idx = 0;

            upperLimit = this.calculateVolumeHeight(dc) + 20000;

            for (var i = 1; i <= cubes; i++) {

                loc = this.locations[i - 1];
                dc.globe.computePointFromPosition(loc.latitude, loc.longitude, upperLimit, startPoint);
                loc = this.locations[i];
                dc.globe.computePointFromPosition(loc.latitude, loc.longitude, upperLimit, endPoint);
                normal.copy(startPoint).normalize();
                endPoint.normalize();
                normal.cross(endPoint).normalize();

                this.vertexArray[idx++] = startPoint[0]; // 0
                this.vertexArray[idx++] = startPoint[1];
                this.vertexArray[idx++] = startPoint[2];
                this.vertexArray[idx++] = normal[0];
                this.vertexArray[idx++] = normal[1];
                this.vertexArray[idx++] = normal[2];
                this.vertexArray[idx++] = startPoint[0]; // 1
                this.vertexArray[idx++] = startPoint[1];
                this.vertexArray[idx++] = startPoint[2];
                this.vertexArray[idx++] = -normal[0];
                this.vertexArray[idx++] = -normal[1];
                this.vertexArray[idx++] = -normal[2];

                loc = this.locations[i];
                dc.globe.computePointFromPosition(loc.latitude, loc.longitude, upperLimit, endPoint);
                this.vertexArray[idx++] = endPoint[0]; // 2
                this.vertexArray[idx++] = endPoint[1];
                this.vertexArray[idx++] = endPoint[2];
                this.vertexArray[idx++] = normal[0];
                this.vertexArray[idx++] = normal[1];
                this.vertexArray[idx++] = normal[2];
                this.vertexArray[idx++] = endPoint[0]; // 3
                this.vertexArray[idx++] = endPoint[1];
                this.vertexArray[idx++] = endPoint[2];
                this.vertexArray[idx++] = -normal[0];
                this.vertexArray[idx++] = -normal[1];
                this.vertexArray[idx++] = -normal[2];

                loc = this.locations[i - 1];
                dc.globe.computePointFromPosition(loc.latitude, loc.longitude, -20000, startPoint);
                this.vertexArray[idx++] = startPoint[0]; // 4
                this.vertexArray[idx++] = startPoint[1];
                this.vertexArray[idx++] = startPoint[2];
                this.vertexArray[idx++] = normal[0];
                this.vertexArray[idx++] = normal[1];
                this.vertexArray[idx++] = normal[2];
                this.vertexArray[idx++] = startPoint[0]; // 5
                this.vertexArray[idx++] = startPoint[1];
                this.vertexArray[idx++] = startPoint[2];
                this.vertexArray[idx++] = -normal[0];
                this.vertexArray[idx++] = -normal[1];
                this.vertexArray[idx++] = -normal[2];

                loc = this.locations[i];
                dc.globe.computePointFromPosition(loc.latitude, loc.longitude, -20000, endPoint);
                this.vertexArray[idx++] = endPoint[0]; // 6
                this.vertexArray[idx++] = endPoint[1];
                this.vertexArray[idx++] = endPoint[2];
                this.vertexArray[idx++] = normal[0];
                this.vertexArray[idx++] = normal[1];
                this.vertexArray[idx++] = normal[2];
                this.vertexArray[idx++] = endPoint[0]; // 7
                this.vertexArray[idx++] = endPoint[1];
                this.vertexArray[idx++] = endPoint[2];
                this.vertexArray[idx++] = -normal[0];
                this.vertexArray[idx++] = -normal[1];
                this.vertexArray[idx++] = -normal[2];
            }
        };

        SVSurfacePolyline.prototype.assembleElementArray = function (dc) {
            var cubes = this.locations.length - 1, baseIdx = 0, idx = 0, i;
            this.elementArray = new Int16Array((36 + 37) * cubes);

            for (i = 0; i < cubes; i++) {

                // Volume Triangles
                // top
                this.elementArray[idx++] = baseIdx;
                this.elementArray[idx++] = baseIdx + 1;
                this.elementArray[idx++] = baseIdx + 3;
                this.elementArray[idx++] = baseIdx + 3;
                this.elementArray[idx++] = baseIdx + 2;
                this.elementArray[idx++] = baseIdx;
                // bottom
                this.elementArray[idx++] = baseIdx + 7;
                this.elementArray[idx++] = baseIdx + 5;
                this.elementArray[idx++] = baseIdx + 4;
                this.elementArray[idx++] = baseIdx + 4;
                this.elementArray[idx++] = baseIdx + 6;
                this.elementArray[idx++] = baseIdx + 7;
                // positive offset side
                this.elementArray[idx++] = baseIdx + 6;
                this.elementArray[idx++] = baseIdx + 4;
                this.elementArray[idx++] = baseIdx;
                this.elementArray[idx++] = baseIdx;
                this.elementArray[idx++] = baseIdx + 2;
                this.elementArray[idx++] = baseIdx + 6;
                // negative offset side
                this.elementArray[idx++] = baseIdx + 1;
                this.elementArray[idx++] = baseIdx + 5;
                this.elementArray[idx++] = baseIdx + 7;
                this.elementArray[idx++] = baseIdx + 7;
                this.elementArray[idx++] = baseIdx + 3;
                this.elementArray[idx++] = baseIdx + 1;
                // start cap
                this.elementArray[idx++] = baseIdx + 1;
                this.elementArray[idx++] = baseIdx;
                this.elementArray[idx++] = baseIdx + 4;
                this.elementArray[idx++] = baseIdx + 4;
                this.elementArray[idx++] = baseIdx + 5;
                this.elementArray[idx++] = baseIdx + 1;
                // end cap
                this.elementArray[idx++] = baseIdx + 2;
                this.elementArray[idx++] = baseIdx + 3;
                this.elementArray[idx++] = baseIdx + 7;
                this.elementArray[idx++] = baseIdx + 7;
                this.elementArray[idx++] = baseIdx + 6;
                this.elementArray[idx++] = baseIdx + 2;
                // increment base
                baseIdx += 8;
            }

            baseIdx = 0;
            for (i = 0; i < cubes; i++) {
                // Volume Outline
                this.elementArray[idx++] = baseIdx;
                this.elementArray[idx++] = baseIdx + 1;
                this.elementArray[idx++] = baseIdx + 3;
                this.elementArray[idx++] = baseIdx;
                this.elementArray[idx++] = baseIdx + 2;
                this.elementArray[idx++] = baseIdx + 3;
                this.elementArray[idx++] = baseIdx;
                this.elementArray[idx++] = baseIdx + 4;
                this.elementArray[idx++] = baseIdx + 5;
                this.elementArray[idx++] = baseIdx + 7;
                this.elementArray[idx++] = baseIdx + 4;
                this.elementArray[idx++] = baseIdx + 6;
                this.elementArray[idx++] = baseIdx + 7;
                this.elementArray[idx++] = baseIdx + 6;
                this.elementArray[idx++] = baseIdx + 4;
                this.elementArray[idx++] = baseIdx;
                this.elementArray[idx++] = baseIdx + 6;
                this.elementArray[idx++] = baseIdx + 2;
                this.elementArray[idx++] = baseIdx;
                this.elementArray[idx++] = baseIdx + 1;
                this.elementArray[idx++] = baseIdx + 5;
                this.elementArray[idx++] = baseIdx + 7;
                this.elementArray[idx++] = baseIdx + 1;
                this.elementArray[idx++] = baseIdx + 3;
                this.elementArray[idx++] = baseIdx + 7;
                this.elementArray[idx++] = baseIdx + 3;
                this.elementArray[idx++] = baseIdx + 2;
                this.elementArray[idx++] = baseIdx + 7;
                this.elementArray[idx++] = baseIdx + 6;
                this.elementArray[idx++] = baseIdx + 2;
                this.elementArray[idx++] = baseIdx;
                this.elementArray[idx++] = baseIdx + 4;
                this.elementArray[idx++] = baseIdx + 1;
                this.elementArray[idx++] = baseIdx;
                this.elementArray[idx++] = baseIdx + 4;
                this.elementArray[idx++] = baseIdx + 5;
                this.elementArray[idx++] = baseIdx + 1;
                // increment base
                baseIdx += 8;
            }
        };

        SVSurfacePolyline.prototype.calculateNearestDistanceToCamera = function (dc) {
            // determine nearest distance to camera which will define the width
            var distance = Number.MAX_VALUE, point = new Vec3(), loc;
            for (var i = 0, len = this.locations.length; i < len; i++) {
                loc = this.locations[i];
                dc.globe.computePointFromLocation(loc.latitude, loc.longitude, point);

                distance = Math.min(distance, point.distanceTo(dc.eyePoint));
            }

            return distance;
        };

        SVSurfacePolyline.prototype.renderSurface = function (dc) {
            // determine the necessary spacing based on distance
            var nearestDistance = this.calculateNearestDistanceToCamera(dc);
            // TODO transformation to maintain constant screen size, not this proportional guess
            var offset = nearestDistance / 500;

            var gl = dc.currentGlContext, vboId, eboId, refreshVbo, refreshEbo;
            gl.enable(gl.DEPTH_TEST);
            if (!this.program) {
                this.program = new SVSurfacePolylineProgram(gl);
            }

            dc.bindProgram(this.program);

            this.program.loadModelviewProjection(gl, dc.modelviewProjection);
            this.program.loadColor(gl, this.attributes.outlineColor);
            this.program.loadOffsetScale(gl, offset);

            // Vertex Buffer
            if (!this.vboCacheKey) {
                this.vboCacheKey = "SVSurfacePolylineVBOCache" + SVSurfacePolyline.cacheIdCounter++;
            }

            vboId = dc.gpuResourceCache.resourceForKey(this.vboCacheKey);
            if (!vboId) {
                vboId = gl.createBuffer();
                dc.gpuResourceCache.putResource(this.vboCacheKey, vboId, this.vertexArray.length * 4);
                refreshVbo = true;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, vboId);
            if (refreshVbo) {
                gl.bufferData(gl.ARRAY_BUFFER, this.vertexArray, gl.STATIC_DRAW);
                dc.frameStatistics.incrementVboLoadCount(1);
            }

            // Element Buffer
            if (!this.eboCacheKey) {
                this.eboCacheKey = "SVSurfacePolylineEBOCache" + SVSurfacePolyline.cacheIdCounter++;
            }

            eboId = dc.gpuResourceCache.resourceForKey(this.eboCacheKey);
            if (!eboId) {
                eboId = gl.createBuffer();
                dc.gpuResourceCache.putResource(this.eboCacheKey, eboId, this.elementArray.length * 2);
                refreshEbo = true;
            }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eboId);
            if (refreshEbo) {
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.elementArray, gl.STATIC_DRAW);
                dc.frameStatistics.incrementVboLoadCount(1);
            }

            gl.enableVertexAttribArray(this.program.posLocation);
            gl.enableVertexAttribArray(this.program.offsetDirectionLocation);

            gl.vertexAttribPointer(this.program.posLocation, 3, gl.FLOAT, false, 6 * 4, 0);
            gl.vertexAttribPointer(this.program.offsetDirectionLocation, 3, gl.FLOAT, false, 6 * 4, 3 * 4);

            gl.colorMask(false, false, false, false);
            gl.depthMask(false);
            gl.enable(gl.STENCIL_TEST);
            gl.clear(gl.STENCIL_BUFFER_BIT);

            gl.cullFace(gl.FRONT);
            gl.stencilFunc(gl.ALWAYS, 0, 255);
            gl.stencilOp(gl.INCR, gl.INCR, gl.KEEP);

            this.drawShadowVolume(dc);

            gl.cullFace(gl.BACK);
            gl.stencilOp(gl.DECR, gl.DECR, gl.KEEP);

            this.drawShadowVolume(dc);

            gl.colorMask(true, true, true, true);
            gl.depthMask(true);
            gl.stencilFunc(gl.NOTEQUAL, 0, 255);
            gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE);

            this.drawShadowVolume(dc);

            gl.disable(gl.STENCIL_TEST);

            this.drawDiagnosticShadowVolume(dc);

            gl.disableVertexAttribArray(this.program.posLocation);
            gl.disableVertexAttribArray(this.program.offsetDirectionLocation);

        };

        SVSurfacePolyline.prototype.drawShadowVolume = function (dc) {
            var gl = dc.currentGlContext;
            var elements = 36 * (this.locations.length - 1);
            gl.drawElements(gl.TRIANGLES, elements, gl.UNSIGNED_SHORT, 0);
        };

        SVSurfacePolyline.prototype.drawDiagnosticShadowVolume = function (dc) {
            var gl = dc.currentGlContext;
            var elements = 37 * (this.locations.length - 1);
            var offset = 2 /*unsigned short size*/ * (36 * (this.locations.length - 1));
            this.program.loadColor(gl, WorldWind.Color.RED);
            gl.drawElements(gl.LINE_STRIP, elements, gl.UNSIGNED_SHORT, offset);
        };

        SVSurfacePolyline.prototype.calculateVolumeHeight = function (dc) {
            var maxAngle = -Number.MAX_VALUE, points = [], i, j, len = this.locations.length, loc, p, m, pointOne,
                pointTwo, angle, scratch = new Vec3(), c;

            for (i = 0; i < len; i++) {
                loc = this.locations[i];
                p = dc.globe.computePointFromLocation(loc.latitude, loc.longitude, new Vec3());
                m = p.magnitude();
                points.push({
                    vec: p,
                    mag: m
                });
            }

            for (i = 0; i < len; i++) {
                pointOne = points[i];
                for (j = 0; j < len; j++) {
                    if (i !== j) {
                        scratch.copy(pointOne.vec);
                        pointTwo = points[j];
                        angle = Math.acos(scratch.dot(pointTwo.vec) / (pointOne.mag * pointTwo.mag));
                        maxAngle = Math.max(maxAngle, angle);
                    }
                }
            }

            c = Math.sin(Math.PI / 2 - maxAngle / 2) * WorldWind.EARTH_RADIUS / Math.sin(Math.PI / 2);

            return WorldWind.EARTH_RADIUS - c;
        };

        return SVSurfacePolyline;
    });
