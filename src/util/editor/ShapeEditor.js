/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @exports ShapeEditor
 */
define([
        '../../shapes/Annotation',
        '../../shapes/AnnotationAttributes',
        '../../error/ArgumentError',
        '../Color',
        '../Font',
        '../Insets',
        '../../geom/Location',
        '../Logger',
        '../../shapes/Placemark',
        '../../shapes/PlacemarkAttributes',
        './PlacemarkEditorFragment',
        '../../geom/Position',
        '../../layer/RenderableLayer',
        '../../shapes/ShapeAttributes',
        './ShapeEditorConstants',
        './SurfaceEllipseEditorFragment',
        './SurfaceCircleEditorFragment',
        '../../shapes/SurfacePolygon',
        './SurfacePolygonEditorFragment',
        './SurfacePolylineEditorFragment',
        './SurfaceRectangleEditorFragment',
        './SurfaceSectorEditorFragment',
        '../../geom/Vec2',
        '../../geom/Vec3'
    ],
    function (Annotation,
              AnnotationAttributes,
              ArgumentError,
              Color,
              Font,
              Insets,
              Location,
              Logger,
              Placemark,
              PlacemarkAttributes,
              PlacemarkEditorFragment,
              Position,
              RenderableLayer,
              ShapeAttributes,
              ShapeEditorConstants,
              SurfaceEllipseEditorFragment,
              SurfaceCircleEditorFragment,
              SurfacePolygon,
              SurfacePolygonEditorFragment,
              SurfacePolylineEditorFragment,
              SurfaceRectangleEditorFragment,
              SurfaceSectorEditorFragment,
              Vec2,
              Vec3) {
        "use strict";

        /**
         * Constructs a new shape editor attached to the specified World Window.
         * @alias ShapeEditor
         * @classdesc Provides a controller for editing shapes. Depending on the type of shape, the following actions
         * are available:
         * <ul>
         *     <li>Edit the location and size of its vertexes using control points;</li>
         *     <li>Rotate the shape using a handle;</li>
         *     <li>Drag the shape on the surface of the globe.</li>
         * </ul>
         * <p>
         * To start editing a shape, pass it to the {@link ShapeEditor#edit} method. To end the edition, call the
         * {@link ShapeEditor#stop} method.
         * <p>
         * Dragging the body of the shape moves the whole shape. Dragging a control point performs the action associated
         * with that control point. The editor provides vertex insertion and removal for SurfacePolygon and
         * SurfacePolyline. Shift-clicking when the cursor is over the shape inserts a control point near the position
         * of the cursor. Ctrl-clicking when the cursor is over a control point removes that particular control point.
         * <p>
         * This editor currently supports all surface shapes except SurfaceImage.
         * @param {WorldWindow} worldWindow The World Window to associate this shape editor controller with.
         * @throws {ArgumentError} If the specified World Window is <code>null</code> or <code>undefined</code>.
         * @constructor
         */
        var ShapeEditor = function (worldWindow) {
            if (!worldWindow) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ShapeEditor", "constructor",
                    "missingWorldWindow"));
            }

            // Documented in defineProperties below.
            this._worldWindow = worldWindow;

            // Documented in defineProperties below.
            this._shape = null;

            // Internal use only.
            // Flags indicating whether the specific action is allowed or not.
            this._allowMove = false;
            this._allowReshape = false;
            this._allowRotate = false;
            this._allowManageControlPoint = false;

            // Documented in defineProperties below.
            this._moveControlPointAttributes = new PlacemarkAttributes(null);
            this._moveControlPointAttributes.imageColor = WorldWind.Color.BLUE;
            this._moveControlPointAttributes.imageScale = 6;

            // Documented in defineProperties below.
            this._resizeControlPointAttributes = new PlacemarkAttributes(null);
            this._resizeControlPointAttributes.imageColor = WorldWind.Color.CYAN;
            this._resizeControlPointAttributes.imageScale = 6;

            // Documented in defineProperties below.
            this._rotateControlPointAttributes = new PlacemarkAttributes(null);
            this._rotateControlPointAttributes.imageColor = WorldWind.Color.GREEN;
            this._rotateControlPointAttributes.imageScale = 6;

            // Documented in defineProperties below.
            this._annotationAttributes = new AnnotationAttributes(null);
            this._annotationAttributes.altitudeMode = WorldWind.CLAMP_TO_GROUND;
            this._annotationAttributes.cornerRadius = 5;
            this._annotationAttributes.backgroundColor = new Color(0.67, 0.67, 0.67, 0.8);
            this._annotationAttributes.leaderGapHeight = 0;
            this._annotationAttributes.drawLeader = false;
            this._annotationAttributes.scale = 1;
            this._annotationAttributes.textAttributes.color = Color.BLACK;
            this._annotationAttributes.textAttributes.font = new Font(10);
            this._annotationAttributes.insets = new Insets(5, 5, 5, 5);

            // Internal use only.
            // The annotation that displays hints during the actions on the shape.
            this.annotation = new WorldWind.Annotation(new WorldWind.Position(0, 0, 0), this._annotationAttributes);

            //Internal use only. Intentionally not documented.
            this.editorFragments = [
                new PlacemarkEditorFragment(),
                new SurfaceCircleEditorFragment(),
                new SurfaceEllipseEditorFragment(),
                new SurfacePolygonEditorFragment(),
                new SurfacePolylineEditorFragment(),
                new SurfaceRectangleEditorFragment(),
                new SurfaceSectorEditorFragment()
            ];

            // Internal use only.
            // The layer that holds the control points created by the editor fragment.
            this.controlPointsLayer = new RenderableLayer("Shape Editor Control Points");

            // Internal use only.
            // The layers that holds the additional accessories created by the editor fragment.
            this.accessoriesLayer = new RenderableLayer("Shape Editor Accessories");
            this.accessoriesLayer.pickEnabled = false;

            // Internal use only.
            // The layer that holds the above-mentioned annotation.
            this.annotationLayer = new RenderableLayer("Shape Editor Annotation");
            this.annotationLayer.pickEnabled = false;
            this.annotationLayer.enabled = false;
            this.annotationLayer.addRenderable(this.annotation);

            // Internal use only.
            // The layer that holds the shadow of the shape during the actions.
            this.shadowShapeLayer = new RenderableLayer("Shape Editor Shadow Shape");
            this.shadowShapeLayer.pickEnabled = false;

            // Internal use only.
            // The editor fragment selected for the shape being edited or null.
            this.activeEditorFragment = null;

            // Internal use only.
            // The type of action being conducted or null.
            this.actionType = null;

            // Internal use only.
            // The control point that triggered the current action or null.
            this.actionControlPoint = null;

            // Internal use only.
            // The lat/lon/alt position that is currently involved with the action or null.
            this.actionControlPosition = null;

            // Internal use only.
            // Flag indicating whether the action should trigger the secondary behavior in the editor fragment.
            this.actionSecondaryBehavior = false;

            // Internal use only.
            // The client X position at the start of the action.
            this.actionStartX = null;

            //Internal use only.
            // The client Y position at the start of the action.
            this.actionStartY = null;

            // Internal use only.
            // The current client X position for the action.
            this.actionCurrentX = null;

            // Internal use only.
            // The current client Y position for the action.
            this.actionCurrentY = null;

            // Internal use only.
            // The original highlight attributes of the shape in order to restore them after the action.
            this.originalHighlightAttributes = new ShapeAttributes(null);
            this.originalPlacemarkHighlightAttributes = new PlacemarkAttributes(null);

            // Internal use only.
            // counters used to detect double click (time measured in ms)
            this._clicked0X = null;
            this._clicked0Y = null;
            this._clicked1X = null;
            this._clicked1Y = null;
            this._click0Time = 0;
            this._click1Time = 0;
            this._dbclickTimeout = 0;
            this._clickDelay = 500;

            // Internal use only.
            // counters used to detect long press event (time measured in ms)
            this._longPressTimeout = 0;
            this._longPressDelay = 1500;


            this._worldWindow.worldWindowController.addGestureListener(this);
        };

        Object.defineProperties(ShapeEditor.prototype, {
            /**
             * The World Window associated with this shape editor.
             * @memberof ShapeEditor.prototype
             * @type {WorldWindow}
             * @readonly
             */
            worldWindow: {
                get: function () {
                    return this._worldWindow;
                }
            },

            /**
             * The shape currently being edited.
             * @memberof ShapeEditor.prototype
             * @type {Object}
             * @readonly
             */
            shape: {
                get: function () {
                    return this._shape;
                }
            },

            /**
             * Attributes used for the control points that move the boundaries of the shape.
             * @memberof ShapeEditor.prototype
             * @type {PlacemarkAttributes}
             */
            moveControlPointAttributes: {
                get: function () {
                    return this._moveControlPointAttributes;
                },
                set: function (value) {
                    this._moveControlPointAttributes = value;
                }
            },

            /**
             * Attributes used for the control points that resize the shape.
             * @memberof ShapeEditor.prototype
             * @type {PlacemarkAttributes}
             */
            resizeControlPointAttributes: {
                get: function () {
                    return this._resizeControlPointAttributes;
                },
                set: function (value) {
                    this._resizeControlPointAttributes = value;
                }
            },

            /**
             * Attributes used for the control points that rotate the shape.
             * @memberof ShapeEditor.prototype
             * @type {PlacemarkAttributes}
             */
            rotateControlPointAttributes: {
                get: function () {
                    return this._rotateControlPointAttributes;
                },
                set: function (value) {
                    this._rotateControlPointAttributes = value;
                }
            },

            /**
             * Attributes used for the annotation that displays hints during the actions on the shape.
             * @memberof ShapeEditor.prototype
             * @type {AnnotationAttributes}
             */
            annotationAttributes: {
                get: function () {
                    return this._annotationAttributes;
                },
                set: function (value) {
                    this._annotationAttributes = value;
                    this.annotation.attributes = value;
                }
            }
        });

        /**
         * Edits the specified shape. Currently, only surface shapes are supported.
         * @param {SurfaceShape} shape The shape to edit.
         * @param {Boolean} move true to enable move action on shape, false to disable move action on shape.
         * @param {Boolean} reshape true to enable reshape action on shape, false to disable reshape action on shape.
         * @param {Boolean} rotate true to enable rotate action on shape, false to disable rotate action on shape.
         * @param {Boolean} manageControlPoint true to enable the action to manage the control points of the shape,
         * false to disable it.
         * @return {Boolean} <code>true</code> if the editor could start the edition of the specified shape; otherwise
         * <code>false</code>.
         */
        ShapeEditor.prototype.edit = function (shape, move, reshape, rotate, manageControlPoint) {
            this.stop();

            this._allowMove = move;
            this._allowReshape = reshape;
            this._allowRotate = rotate;
            this._allowManageControlPoint = manageControlPoint;

            // Look for a fragment that can handle the specified shape
            for (var i = 0, len = this.editorFragments.length; i < len; i++) {
                var editorFragment = this.editorFragments[i];
                if (editorFragment.canHandle(shape)) {
                    this.activeEditorFragment = editorFragment;
                }
            }

            // If we have a fragment for this shape, accept the shape and start the edition
            if (this.activeEditorFragment != null) {
                this._shape = shape;
                this._shape.highlighted = true;
                this.initializeControlElements();
                return true;
            }

            return false;
        };

        /**
         * Stops the current edition activity if any.
         * @return {SurfaceShape} The shape being edited if any; otherwise <code>null</code>.
         */
        ShapeEditor.prototype.stop = function () {
            this.removeControlElements();

            this.activeEditorFragment = null;

            this._allowMove = false;
            this._allowReshape = false;
            this._allowRotate = false;
            this._allowManageControlPoint = false;

            var currentShape = this._shape;
            this._shape = null;

            if (currentShape !== null) {
                currentShape.highlighted = false;
            }

            return currentShape;
        };

        // Internal use only.
        // Called by {@link ShapeEditor#edit} to initialize the control elements used for editing.
        ShapeEditor.prototype.initializeControlElements = function () {
            if (this._worldWindow.indexOfLayer(this.shadowShapeLayer) == -1) {
                this._worldWindow.insertLayer(0, this.shadowShapeLayer);
            }

            if (this._worldWindow.indexOfLayer(this.controlPointsLayer) == -1) {
                this._worldWindow.addLayer(this.controlPointsLayer);
            }

            if (this._worldWindow.indexOfLayer(this.accessoriesLayer) == -1) {
                this._worldWindow.addLayer(this.accessoriesLayer);
            }

            if (this._worldWindow.indexOfLayer(this.annotationLayer) == -1) {
                this._worldWindow.addLayer(this.annotationLayer);
            }

            this.activeEditorFragment.initializeControlElements(
                this._shape,
                this.controlPointsLayer.renderables,
                this.accessoriesLayer.renderables,
                this._resizeControlPointAttributes,
                this._rotateControlPointAttributes,
                this._moveControlPointAttributes
            );

            this.updateControlElements();
        };

        // Internal use only.
        // Called by {@link ShapeEditor#stop} to remove the control elements used for editing.
        ShapeEditor.prototype.removeControlElements = function () {
            this._worldWindow.removeLayer(this.controlPointsLayer);
            this.controlPointsLayer.removeAllRenderables();

            this._worldWindow.removeLayer(this.accessoriesLayer);
            this.accessoriesLayer.removeAllRenderables();

            this._worldWindow.removeLayer(this.shadowShapeLayer);
            this.shadowShapeLayer.removeAllRenderables();

            this._worldWindow.removeLayer(this.annotationLayer);
        };

        // Internal use only.
        // Updates the position of the control elements.
        ShapeEditor.prototype.updateControlElements = function () {
            this.activeEditorFragment.updateControlElements(
                this._shape,
                this._worldWindow.globe,
                this.controlPointsLayer.renderables,
                this.accessoriesLayer.renderables
            );
        };

        // Internal use only.
        // Dispatches the events relevant to the shape editor.
        ShapeEditor.prototype.onGestureEvent = function (event) {
            if(this._shape === null) {
                return;
            }

            // TODO Add support for touch devices

            if (event.type === "pointerup" || event.type === "mouseup") {
                this.handleMouseUp(event);
            } else if (event.type === "pointerdown" || event.type === "mousedown") {
                this.handleMouseDown(event);
            } else if (event.type === "pointermove" || event.type === "mousemove") {
                this.handleMouseMove(event);
            }
        };

        // Internal use only.
        // Triggers an action if the shape below the mouse is the shape being edited or a control point.
        ShapeEditor.prototype.handleMouseDown = function (event) {
            var x = event.clientX,
                y = event.clientY;

            this.actionStartX = x;
            this.actionStartY = y;
            this.actionCurrentX = x;
            this.actionCurrentY = y;

            var mousePoint = this._worldWindow.canvasCoordinates(x, y);
            var pickList = this._worldWindow.pick(mousePoint);
            var terrainObject = pickList.terrainObject();

            if (this._click0Time && !this._click1Time) {
                this._clicked1X = x;
                this._clicked1Y = y;
                this._click1Time = Date.now() - this._click0Time;
            } else {
                this._clicked0X = x;
                this._clicked0Y = y;
                this._click0Time = Date.now();
                this._click1Time = 0;
                clearTimeout(this._dbclickTimeout);
                this._dbclickTimeout = setTimeout(function () {
                        this._click0Time = 0;
                    }, this._clickDelay
                );
            }

            var allowVertex = terrainObject
                && this.actionStartX === this.actionCurrentX
                && this.actionStartY === this.actionCurrentY
                && this._allowManageControlPoint;

            // counter for long-press detection
            clearTimeout(this._longPressTimeout);

            var context = this;


            // The editor provides vertex insertion and removal for SurfacePolygon and SurfacePolyline.
            // Long press when the cursor is over the shape inserts a control point near the position
            // of the cursor.
            this._longPressTimeout = setTimeout(function () {
                    if (allowVertex) {
                        context.activeEditorFragment.addNewVertex(
                            context._shape,
                            context._worldWindow.globe,
                            terrainObject.position
                        );

                        context.updateControlElements();
                        context._worldWindow.redraw();
                    }
                }, this._longPressDelay
            );

            for (var p = 0, len = pickList.objects.length; p < len; p++) {
                var object = pickList.objects[p];

                if (!object.isTerrain) {
                    var userObject = object.userObject;

                    if (userObject === this._shape) {
                        this.beginAction(terrainObject.position, this._allowManageControlPoint);
                        event.preventDefault();
                        break;

                    } else if (this.controlPointsLayer.renderables.indexOf(userObject) !== -1) {
                        this.beginAction(terrainObject.position, this._allowManageControlPoint, userObject);
                        event.preventDefault();
                        break;
                    }
                }
            }
        };

        // Internal use only.
        // Updates the current action if any.
        ShapeEditor.prototype.handleMouseMove = function (event) {

            if (this._click0Time && !this._click1Time) {
                this._clicked1X = event.clientX;
                this._clicked1Y = event.clientY;
            }

            if (!(this._clicked0X === this._clicked1X
                    && this._clicked0Y === this._clicked1Y)) {
                clearTimeout(this._dbclickTimeout);
                this._click0Time = 0;
                this._click1Time = 0;
            }

            clearTimeout(this._longPressTimeout);

            if (this.actionType) {

                var mousePoint = this._worldWindow.canvasCoordinates(event.clientX, event.clientY);
                var terrainObject = this._worldWindow.pickTerrain(mousePoint).terrainObject();

                if (terrainObject) {
                    if (this.actionType === ShapeEditorConstants.DRAG) {
                        if (this._allowMove) {
                            this.drag(event.clientX, event.clientY);
                        } else {
                            Logger.logMessage(Logger.LEVEL_INFO, "ShapeEditor", "handleMouseMove",
                                "Disabled action for selected shape.");
                        }
                    } else {
                        if (this._allowReshape || this._allowRotate) {
                            this.actionSecondaryBehavior = false;
                            this.reshape(terrainObject.position);
                        } else {
                            Logger.logMessage(Logger.LEVEL_INFO, "ShapeEditor", "handleMouseMove",
                                "Disabled action for selected shape.");
                        }
                    }

                    event.preventDefault();
                }
            }
        };

        // Internal use only.
        // Terminates the current action if any; otherwise handles other click responses.
        ShapeEditor.prototype.handleMouseUp = function (event) {
            var mousePoint = this._worldWindow.canvasCoordinates(event.clientX, event.clientY);
            var terrainObject = this._worldWindow.pickTerrain(mousePoint).terrainObject();

            // The editor provides vertex insertion and removal for SurfacePolygon and SurfacePolyline.
            // Double clicking when the cursor is over a control point will remove it.
            if (this.actionType) {
                if (this._click0Time && this._click1Time) {
                    if (this._click1Time <= this._clickDelay) {
                        if (this.actionControlPoint
                            && terrainObject
                            && this._allowManageControlPoint) {
                            this.actionSecondaryBehavior = true;
                            this.reshape(terrainObject.position);
                        }
                    }
                    clearTimeout(this._dbclickTimeout);
                    this._click0Time = 0;
                    this._click1Time = 0;
                }

                this.endAction();
            }

            clearTimeout(this._longPressTimeout);
        };

        // Internal use only.
        ShapeEditor.prototype.beginAction = function (initialPosition, alternateAction, controlPoint) {
            // Define the active transformation
            if (controlPoint) {
                this.actionType = controlPoint.userProperties.purpose;
            } else {
                this.actionType = ShapeEditorConstants.DRAG;
            }

            this.actionControlPoint = controlPoint;
            this.actionControlPosition = initialPosition;
            this.actionSecondaryBehavior = alternateAction;

            var editingAttributes = null;

            // Place a shadow shape at the original location of the shape
            if (this.activeEditorFragment instanceof PlacemarkEditorFragment) {
                this.originalHighlightAttributes = null;
                this.originalPlacemarkHighlightAttributes = this._shape.highlightAttributes;

                editingAttributes = new PlacemarkAttributes(this.originalPlacemarkHighlightAttributes);
                editingAttributes.imageColor.alpha = editingAttributes.imageColor.alpha * 0.7;
            } else {
                this.originalHighlightAttributes = this._shape.highlightAttributes;
                this.originalPlacemarkHighlightAttributes = null;

                editingAttributes = new ShapeAttributes(this.originalHighlightAttributes);
                editingAttributes.interiorColor.alpha = editingAttributes.interiorColor.alpha * 0.7;
                editingAttributes.outlineColor.alpha = editingAttributes.outlineColor.alpha * 0.7;
            }

            this._shape.highlightAttributes = editingAttributes;

            var shadowShape = this.activeEditorFragment.createShadowShape(this._shape);

            if (this.activeEditorFragment instanceof PlacemarkEditorFragment) {
                shadowShape.altitudeMode = WorldWind.CLAMP_TO_GROUND;
                shadowShape.highlightAttributes = new PlacemarkAttributes(this.originalHighlightAttributes);
            } else {
                shadowShape.highlightAttributes = new ShapeAttributes(this.originalHighlightAttributes);
            }

            shadowShape.highlighted = true;

            this.shadowShapeLayer.addRenderable(shadowShape);

            this._worldWindow.redraw();
        };

        // Internal use only.
        ShapeEditor.prototype.endAction = function () {
            this.shadowShapeLayer.removeAllRenderables();

            if (this.activeEditorFragment instanceof PlacemarkEditorFragment) {
                this._shape.highlightAttributes = this.originalPlacemarkHighlightAttributes;
            } else {
                this._shape.highlightAttributes = this.originalHighlightAttributes;
            }

            this.hideAnnotation();

            this.actionControlPoint = null;
            this.actionType = null;
            this.actionControlPosition = null;

            this._worldWindow.redraw();
        };

        // Internal use only.
        ShapeEditor.prototype.reshape = function (newPosition) {
            var purpose = this.actionControlPoint.userProperties.purpose;

            if ((purpose === ShapeEditorConstants.ROTATION && this._allowRotate) ||
                (purpose !== ShapeEditorConstants.ROTATION && this._allowReshape) ||
                (purpose === ShapeEditorConstants.LOCATION && this._allowManageControlPoint && this.actionSecondaryBehavior)) {
                this.activeEditorFragment.reshape(
                    this._shape,
                    this._worldWindow.globe,
                    this.actionControlPoint,
                    newPosition,
                    this.actionControlPosition,
                    this.actionSecondaryBehavior
                );

                this.actionControlPosition = newPosition;

                this.updateControlElements();
                this.updateAnnotation(this.actionControlPoint);

                this._worldWindow.redraw();
            }
        };

        // Internal use only.
        ShapeEditor.prototype.drag = function (clientX, clientY) {
            // Get reference position for the shape that is dragged
            var refPos = this._shape.getReferencePosition();

            // Get point for referenced position
            var refPoint = this._worldWindow.globe.computePointFromPosition(
                refPos.latitude,
                refPos.longitude,
                0,
                new Vec3(0, 0, 0)
            );

            var screenRefPoint = new Vec3(0, 0, 0);
            this._worldWindow.drawContext.project(refPoint, screenRefPoint);

            // Check drag distance
            var dx = clientX - this.actionCurrentX;
            var dy = clientY - this.actionCurrentY;

            // Get the latest position of mouse to calculate drag distance
            this.actionCurrentX = clientX;
            this.actionCurrentY = clientY;

            // Find intersection of the screen coordinates ref-point with globe
            var x = screenRefPoint[0] + dx;
            var y = this._worldWindow.canvas.height - screenRefPoint[1] + dy;

            var ray = this._worldWindow.rayThroughScreenPoint(new Vec2(x, y));

            // Check if the mouse is over the globe and move shape
            var intersection = new Vec3(0, 0, 0);
            if (this._worldWindow.globe.intersectsLine(ray, intersection)) {
                var p = new Position(0, 0, 0);
                this._worldWindow.globe.computePositionFromPoint(intersection[0], intersection[1], intersection[2], p);
                this._shape.moveTo(this._worldWindow.globe, new Location(p.latitude, p.longitude));
            }

            // Update control points and shape annotation
            this.updateControlElements();
            this.updateShapeAnnotation();

            this._worldWindow.redraw();
        };

        // Internal use only.
        ShapeEditor.prototype.updateAnnotation = function (controlPoint) {
            this.annotationLayer.enabled = true;

            this.annotation.position = new Position(
                controlPoint.position.latitude,
                controlPoint.position.longitude,
                0
            );

            var annotationText;
            if (controlPoint.userProperties.size !== undefined) {
                annotationText = this.formatLength(controlPoint.userProperties.size);
            } else if (controlPoint.userProperties.rotation !== undefined) {
                annotationText = this.formatRotation(controlPoint.userProperties.rotation);
            } else {
                annotationText = this.formatLatitude(controlPoint.position.latitude)
                    + " "
                    + this.formatLongitude(controlPoint.position.longitude);
            }
            this.annotation.text = annotationText;
        };

        // Internal use only.
        ShapeEditor.prototype.hideAnnotation = function (controlPoint) {
            this.annotationLayer.enabled = false;
        };

        // Internal use only.
        ShapeEditor.prototype.updateShapeAnnotation = function () {
            var center = this.activeEditorFragment.getShapeCenter(this._shape, this._worldWindow.globe);

            var temporaryMarker = new Placemark(
                new Position(center.latitude, center.longitude, 0),
                null
            );

            this.updateAnnotation(temporaryMarker);
        };

        // Internal use only.
        ShapeEditor.prototype.formatLatitude = function (number) {
            var suffix = number < 0 ? "\u00b0S" : "\u00b0N";
            return Math.abs(number).toFixed(4) + suffix;
        };

        // Internal use only.
        ShapeEditor.prototype.formatLongitude = function (number) {
            var suffix = number < 0 ? "\u00b0W" : "\u00b0E";
            return Math.abs(number).toFixed(4) + suffix;
        };

        // Internal use only.
        ShapeEditor.prototype.formatLength = function (number) {
            var suffix = " km";
            return Math.abs(number / 1000.0).toFixed(3) + suffix;
        };

        // Internal use only.
        ShapeEditor.prototype.formatRotation = function (rotation) {
            return rotation.toFixed(4) + "°";
        };

        return ShapeEditor;
    }
);