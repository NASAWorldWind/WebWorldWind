/*
 * Copyright (C) 2015 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports ScreenCreditController
 * @version $Id: ScreenCreditController.js 3345 2015-07-28 20:28:35Z dcollins $
 */
define([
        '../error/ArgumentError',
        '../shaders/BasicTextureProgram',
        '../util/Color',
        '../util/Font',
        '../util/Logger',
        '../geom/Matrix',
        '../util/Offset',
        '../pick/PickedObject',
        '../render/Renderable',
        '../geom/Vec3',
        '../util/WWMath'
    ],
    function (ArgumentError,
              BasicTextureProgram,
              Color,
              Font,
              Logger,
              Matrix,
              Offset,
              PickedObject,
              Renderable,
              Vec3,
              WWMath) {
        "use strict";

        /**
         * Constructs a screen credit controller.
         * @alias ScreenCreditController
         * @constructor
         * @classdesc Collects and displays screen credits.
         */
        var ScreenCreditController = function () {
            // Internal. Intentionally not documented.
            this.imageUrls = [];

            // Internal. Intentionally not documented.
            this.stringCredits = [];

            // Internal. Intentionally not documented.
            this.imageCreditSize = 64;

            // Internal. Intentionally not documented.
            this.margin = 5;

            // Internal. Intentionally not documented.
            this.opacity = 0.5;

            // Internal. Intentionally not documented.
            this.creditFont = new Font(14);
        };

        // Internal use only. Intentionally not documented.
        ScreenCreditController.scratchMatrix = Matrix.fromIdentity(); // scratch variable
        ScreenCreditController.imageTransform = Matrix.fromIdentity(); // scratch variable
        ScreenCreditController.texCoordMatrix = Matrix.fromIdentity(); // scratch variable

        /**
         * Clears all credits from this controller.
         */
        ScreenCreditController.prototype.clear = function () {
            this.imageUrls = [];
            this.stringCredits = [];
        };

        /**
         * Adds an image credit to this controller.
         * @param {String} imageUrl The URL of the image to display in the credits area.
         * @throws {ArgumentError} If the specified URL is null or undefined.
         */
        ScreenCreditController.prototype.addImageCredit = function (imageUrl) {
            if (!imageUrl) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ScreenCreditController", "addImageCredit", "missingUrl"));
            }

            if (this.imageUrls.indexOf(imageUrl) === -1) {
                this.imageUrls.push(imageUrl);
            }
        };

        /**
         * Adds a string credit to this controller.
         * @param {String} stringCredit The string to display in the credits area.
         * @param (Color} color The color with which to draw the string.
         * @throws {ArgumentError} If either the specified string or color is null or undefined.
         */
        ScreenCreditController.prototype.addStringCredit = function (stringCredit, color) {
            if (!stringCredit) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ScreenCreditController", "addStringCredit", "missingText"));
            }

            if (!color) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ScreenCreditController", "addStringCredit", "missingColor"));
            }

            if (this.stringCredits.indexOf(stringCredit) === -1) {
                this.stringCredits.push({
                    text: stringCredit,
                    color: color || Color.WHITE
                });
            }
        };

        // Internal use only. Intentionally not documented.
        ScreenCreditController.prototype.drawCredits = function (dc) {
            // Check to see if there's anything to draw.
            if ((this.imageUrls.length === 0 && this.stringCredits.length === 0)) {
                return;
            }

            // Picking not provided.
            if (dc.pickingMode) {
                return;
            }

            // Want to draw only once per frame.
            if (dc.timestamp == this.lastFrameTimestamp) {
                return;
            }
            this.lastFrameTimestamp = dc.timestamp;

            this.beginDrawingCredits(dc);

            // Draw the image credits in a row along the bottom of the window from right to left.
            var imageX = dc.navigatorState.viewport.width - (this.margin + this.imageCreditSize),
                imageHeight, maxImageHeight = 0;

            for (var i = 0; i < this.imageUrls.length; i++) {
                imageHeight = this.drawImageCredit(dc, this.imageUrls[i], imageX, this.margin);
                if (imageHeight > 0) {
                    imageX -= (this.margin + this.imageCreditSize);
                    maxImageHeight = WWMath.max(imageHeight, maxImageHeight);
                }
            }

            // Draw the string credits above the image credits and progressing from bottom to top.
            var stringY = maxImageHeight + this.margin;
            for (var j = 0; j < this.stringCredits.length; j++) {
                this.drawStringCredit(dc, this.stringCredits[j], stringY);
                stringY += this.margin + 15; // margin + string height
            }

            this.endDrawingCredits(dc);
        };

        // Internal use only. Intentionally not documented.
        ScreenCreditController.prototype.beginDrawingCredits = function (dc) {
            var gl = dc.currentGlContext,
                program;

            dc.findAndBindProgram(BasicTextureProgram);

            // Configure GL to use the draw context's unit quad VBOs for both model coordinates and texture coordinates.
            // Most browsers can share the same buffer for vertex and texture coordinates, but Internet Explorer requires
            // that they be in separate buffers, so the code below uses the 3D buffer for vertex coords and the 2D
            // buffer for texture coords.
            program = dc.currentProgram;
            gl.bindBuffer(gl.ARRAY_BUFFER, dc.unitQuadBuffer3());
            gl.vertexAttribPointer(program.vertexPointLocation, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, dc.unitQuadBuffer());
            gl.vertexAttribPointer(program.vertexTexCoordLocation, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(program.vertexPointLocation);
            gl.enableVertexAttribArray(program.vertexTexCoordLocation);

            // Tell the program which texture unit to use.
            program.loadTextureUnit(gl, gl.TEXTURE0);
            program.loadModulateColor(gl, false);

            // Turn off depth testing.
            // tag, 6/17/15: It's not clear why this call was here. It was carried over from WWJ.
            //gl.disable(WebGLRenderingContext.DEPTH_TEST);
        };

        // Internal use only. Intentionally not documented.
        ScreenCreditController.prototype.endDrawingCredits = function (dc) {
            var gl = dc.currentGlContext,
                program = dc.currentProgram;

            // Clear the vertex attribute state.
            gl.disableVertexAttribArray(program.vertexPointLocation);
            gl.disableVertexAttribArray(program.vertexTexCoordLocation);

            // Clear GL bindings.
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindTexture(gl.TEXTURE_2D, null);

            // Re-enable depth testing.
            gl.enable(gl.DEPTH_TEST);
        };

        // Internal use only. Intentionally not documented.
        ScreenCreditController.prototype.drawImageCredit = function (dc, creditUrl, x, y) {
            var imageWidth, imageHeight, scale, activeTexture, gl, program;

            activeTexture = dc.gpuResourceCache.resourceForKey(creditUrl);
            if (!activeTexture) {
                dc.gpuResourceCache.retrieveTexture(dc.currentGlContext, creditUrl);
                return 0;
            }

            // Scale the image to fit within a constrained size.
            imageWidth = activeTexture.imageWidth;
            imageHeight = activeTexture.imageHeight;
            if (imageWidth <= this.imageCreditSize && this.imageHeight <= this.imageCreditSize) {
                scale = 1;
            } else if (imageWidth >= imageHeight) {
                scale = this.imageCreditSize / imageWidth;
            } else {
                scale = this.imageCreditSize / imageHeight;
            }

            ScreenCreditController.imageTransform.setTranslation(x, y, 0);
            ScreenCreditController.imageTransform.setScale(scale * imageWidth, scale * imageHeight, 1);

            gl = dc.currentGlContext;
            program = dc.currentProgram;

            // Compute and specify the MVP matrix.
            ScreenCreditController.scratchMatrix.copy(dc.screenProjection);
            ScreenCreditController.scratchMatrix.multiplyMatrix(ScreenCreditController.imageTransform);
            program.loadModelviewProjection(gl, ScreenCreditController.scratchMatrix);

            program.loadTextureEnabled(gl, true);
            program.loadColor(gl, Color.WHITE);
            program.loadOpacity(gl, this.opacity);

            ScreenCreditController.texCoordMatrix.setToIdentity();
            ScreenCreditController.texCoordMatrix.multiplyByTextureTransform(activeTexture);
            program.loadTextureMatrix(gl, ScreenCreditController.texCoordMatrix);

            if (activeTexture.bind(dc)) { // returns false if active texture cannot be bound
                // Draw the image quad.
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            }

            return imageHeight;
        };

        // Internal use only. Intentionally not documented.
        ScreenCreditController.prototype.drawStringCredit = function (dc, credit, y) {
            var imageWidth, imageHeight, activeTexture, textureKey, gl, program, x;

            textureKey = credit.text + this.creditFont.toString();
            activeTexture = dc.gpuResourceCache.resourceForKey(textureKey);
            if (!activeTexture) {
                activeTexture = dc.textSupport.createTexture(dc, credit.text, this.creditFont, false);
                dc.gpuResourceCache.putResource(textureKey, activeTexture, activeTexture.size);
            }

            imageWidth = activeTexture.imageWidth;
            imageHeight = activeTexture.imageHeight;

            x = dc.navigatorState.viewport.width - (imageWidth + this.margin);
            ScreenCreditController.imageTransform.setTranslation(x, y, 0);
            ScreenCreditController.imageTransform.setScale(imageWidth, imageHeight, 1);

            gl = dc.currentGlContext;
            program = dc.currentProgram;

            // Compute and specify the MVP matrix.
            ScreenCreditController.scratchMatrix.copy(dc.screenProjection);
            ScreenCreditController.scratchMatrix.multiplyMatrix(ScreenCreditController.imageTransform);
            program.loadModelviewProjection(gl, ScreenCreditController.scratchMatrix);

            program.loadTextureEnabled(gl, true);
            program.loadColor(gl, credit.color);
            program.loadOpacity(gl, this.opacity);

            ScreenCreditController.texCoordMatrix.setToIdentity();
            ScreenCreditController.texCoordMatrix.multiplyByTextureTransform(activeTexture);
            program.loadTextureMatrix(gl, ScreenCreditController.texCoordMatrix);

            if (activeTexture.bind(dc)) { // returns false if active texture cannot be bound
                // Draw the image quad.
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            }

            return true;
        };

        return ScreenCreditController;
    });