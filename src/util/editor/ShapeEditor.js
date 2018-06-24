/*
 * Copyright 2015-2018 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
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
        '../../geom/Angle',
        '../../shapes/Annotation',
        '../../shapes/AnnotationAttributes',
        '../../error/ArgumentError',
        '../Color',
        '../Font',
        '../Insets',
        '../../geom/Location',
        '../Logger',
        '../../shapes/Path',
        '../../shapes/Placemark',
        '../../shapes/PlacemarkAttributes',
        '../../geom/Position',
        '../../layer/RenderableLayer',
        '../../shapes/ShapeAttributes',
        '../../shapes/SurfaceEllipse',
        './SurfaceEllipseEditorFragment',
        './SurfaceCircleEditorFragment',
        '../../shapes/SurfacePolygon',
        './SurfacePolygonEditorFragment',
        './SurfacePolylineEditorFragment',
        '../../shapes/SurfaceRectangle',
        './SurfaceRectangleEditorFragment',
        '../../shapes/SurfaceShape',
        '../../geom/Vec2',
        '../../geom/Vec3'
    ],
    function (Angle,
              Annotation,
              AnnotationAttributes,
              ArgumentError,
              Color,
              Font,
              Insets,
              Location,
              Logger,
              Path,
              Placemark,
              PlacemarkAttributes,
              Position,
              RenderableLayer,
              ShapeAttributes,
              SurfaceEllipse,
              SurfaceEllipseEditorFragment,
              SurfaceCircleEditorFragment,
              SurfacePolygon,
              SurfacePolygonEditorFragment,
              SurfacePolylineEditorFragment,
              SurfaceRectangle,
              SurfaceRectangleEditorFragment,
              SurfaceShape,
              Vec2,
              Vec3) {
        "use strict";

        /**
         * @alias ShapeEditor
         * @constructor
         * @classdesc Provides a user interface for editing a shape and performs editing. Depending on the shape type,
         * the shape is shown with control points for vertex locations and size. All shapes are shown with a handle that
         * provides rotation.
         * <p/>
         * Drag on the shape's body moves the whole shape. Drag on a control point performs the action
         * associated with that control point. The editor provides vertex insertion and removal for SurfacePolygon and
         * SurfacePolyline. Shift-click when the cursor is over the shape inserts a control
         * point at the cursor's position. Alt-click when the cursor is over a control point removes that control point.
         * <p/>
         * This editor supports all surface shapes except SurfaceImage.
         * @param {WorldWindow} worldWindow The World Window to associate this shape editor controller with.
         * @throws {ArgumentError} If the specified world window is null or undefined.
         */
        var ShapeEditor = function (worldWindow) {
            if (!worldWindow) {
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ShapeEditor", "constructor",
                    "missingWorldWindow"));
            }

            /**
             * The World Window associated with the shape editor controller.
             * @type {WorldWindow}
             */
            this.worldWindow = worldWindow;

            /**
             * The shape associated with the editor.
             * @type {Object}
             */
            this.shape = null;

            /**
             * The layer holding the editor's control points.
             * @type {RenderableLayer}
             */
            this.controlPointLayer = new RenderableLayer();

            /**
             * The layer holding the rotation line.
             * @type {RenderableLayer}
             */
            this.accessoryLayer = new RenderableLayer();
            this.accessoryLayer.pickEnabled = false;

            /**
             * The layer holding the control point's annotation.
             * @type {RenderableLayer}
             */
            this.annotationLayer = new RenderableLayer();
            this.annotationLayer.pickEnabled = false;

            /**
             * The layer holding a shadow copy of the shape while the shape is being moved or sized.
             * @type {RenderableLayer}
             */
            this.shadowLayer = new RenderableLayer();
            this.shadowLayer.pickEnabled = false;

            /**
             * The control point annotation.
             * @type {Annotation}
             */
            this.annotation = null;

            /**
             * Indicates whether the editor is ready for editing.
             * @type {boolean}
             */
            this.armed = false;

            /**
             * Indicates whether the editor is in the midst of an editing operation.
             * @type {boolean}
             */
            this.active = false;

            /**
             * The terrain position associated with the cursor during the just previous drag event.
             * @type {Position}
             */
            this.previousPosition = null;

            /**
             * The placemark associated with the current sizing operation.
             * @type {Placemark}
             */
            this.currentSizingMarker = null;

            /**
             * The attributes associated with the shape when the editor is constructed. These are swapped out during
             * editing operations in order to make the shape semi-transparent.
             * @type {ShapeAttributes}
             */
            this.originalAttributes = new ShapeAttributes(null);

            /**
             * The highlight attributes associated with the shape when the editor is constructed. These are swapped out
             * during editing operations in order to make the shape semi-transparent.
             * @type {ShapeAttributes}
             */
            this.originalHighlightAttributes = new ShapeAttributes(null);

            /**
             * Attributes used to represent shape vertices.
             * @type {PlacemarkAttributes}
             */
            this.locationControlPointAttributes = new PlacemarkAttributes(null);

            /**
             * Attributes used to represent shape size.
             * @type {PlacemarkAttributes}
             */
            this.sizeControlPointAttributes = new PlacemarkAttributes(null);

            /**
             * Attributes used to represent shape rotation.
             * @type {PlacemarkAttributes}
             */
            this.angleControlPointAttributes = new PlacemarkAttributes(null);

            this.makeControlPointAttributes();

            this.makeAnnotation();

            //Internal use only. Intentionally not documented.
            this.isDragging = false;

            //Internal use only. Intentionally not documented.
            this.startX = null;

            //Internal use only. Intentionally not documented.
            this.startY = null;

            //Internal use only. Intentionally not documented.
            this.lastX = null;

            //Internal use only. Intentionally not documented.
            this.lastY = null;

            //Internal use only. Intentionally not documented.
            this.currentEvent = null;

            //Internal use only. Intentionally not documented.
            this.activeEditorFragment = null;

            this.editorFragments = [
                new SurfaceCircleEditorFragment(),
                new SurfaceEllipseEditorFragment(),
                new SurfacePolygonEditorFragment(),
                new SurfacePolylineEditorFragment(),
                new SurfaceRectangleEditorFragment()
            ];

            this.worldWindow.worldWindowController.addGestureListener(this);
        };

        //Internal use only. Intentionally not documented.
        ShapeEditor.prototype.handleMouseMove = function (event) {
            var shapeEditor = this;

            if(this.shape === null)
                return;

            if (shapeEditor.isDragging === false) {
                return;
            }

            var mousePoint = shapeEditor.worldWindow.canvasCoordinates(event.clientX, event.clientY);
            var terrainObject;

            if (shapeEditor.worldWindow.viewport.containsPoint(mousePoint)) {
                terrainObject = shapeEditor.worldWindow.pickTerrain(mousePoint).terrainObject();
            }

            if (!terrainObject) {
                return;
            }

            if (shapeEditor.currentSizingMarker instanceof Placemark &&
                shapeEditor.currentSizingMarker.userProperties.isControlPoint) {
                shapeEditor.reshapeShape(terrainObject);
                shapeEditor.updateControlPoints();
            }
            else if (shapeEditor.shape instanceof SurfaceShape) {
                shapeEditor.dragWholeShape(event);
                shapeEditor.updateControlPoints();
                shapeEditor.updateShapeAnnotation();
            }

            event.preventDefault();
        };

        //Internal use only. Intentionally not documented.
        ShapeEditor.prototype.handleMouseDown = function (event) {
            var shapeEditor = this;

            if(this.shape === null)
                return;

            shapeEditor.currentEvent = event;

            var x = event.clientX,
                y = event.clientY;

            shapeEditor.startX = x;
            shapeEditor.startY = y;
            shapeEditor.lastX = x;
            shapeEditor.lastY = y;

            var pickList = shapeEditor.worldWindow.pick(shapeEditor.worldWindow.canvasCoordinates(x, y));

            if (pickList.objects.length > 0) {
                for (var p = 0; p < pickList.objects.length; p++) {
                    if (!pickList.objects[p].isTerrain) {
                        if (shapeEditor.shape && pickList.objects[p].userObject === shapeEditor.shape) {
                            event.preventDefault();
                            shapeEditor.isDragging = true;
                            shapeEditor.originalAttributes = shapeEditor.shape.attributes;
                            shapeEditor.originalHighlightAttributes = shapeEditor.shape.highlightAttributes;
                            shapeEditor.makeShadowShape();

                            //set previous position
                            shapeEditor.setPreviousPosition(event);
                        }
                        else if (pickList.objects[p].userObject instanceof Placemark &&
                            pickList.objects[p].userObject.userProperties.isControlPoint) {
                            event.preventDefault();
                            shapeEditor.currentSizingMarker = pickList.objects[p].userObject;
                            shapeEditor.isDragging = true;
                            shapeEditor.originalAttributes = shapeEditor.shape.attributes;
                            shapeEditor.originalHighlightAttributes = shapeEditor.shape.highlightAttributes;
                            shapeEditor.makeShadowShape();

                            //set previous position
                            shapeEditor.setPreviousPosition(event);
                        }
                    }
                }
            }
        };

        //Internal use only. Intentionally not documented.
        ShapeEditor.prototype.handleMouseUp = function (event) {
            var shapeEditor = this;

            if(this.shape === null)
                return;

            var x = event.clientX,
                y = event.clientY;

            if (shapeEditor.shape && shapeEditor.shadowLayer.renderables.length > 0) {
                shapeEditor.removeShadowShape();
                shapeEditor.updateAnnotation(null);
            }

            if (shapeEditor.currentSizingMarker instanceof Placemark &&
                shapeEditor.currentSizingMarker.userProperties.isControlPoint) {
                if (event.altKey) {
                    var mousePoint = shapeEditor.worldWindow.canvasCoordinates(event.clientX, event.clientY);
                    var terrainObject;

                    if (shapeEditor.worldWindow.viewport.containsPoint(mousePoint)) {
                        terrainObject = shapeEditor.worldWindow.pickTerrain(mousePoint).terrainObject();
                    }

                    if (terrainObject) {
                        shapeEditor.reshapeShape(terrainObject);
                        shapeEditor.updateControlPoints();
                        shapeEditor.updateAnnotation(null);
                    }
                }
                shapeEditor.isDragging = false;
                shapeEditor.currentSizingMarker = null;
                return;
            }

            var redrawRequired = false;

            var pickList = shapeEditor.worldWindow.pick(shapeEditor.worldWindow.canvasCoordinates(x, y));
            if (pickList.objects.length > 0) {
                for (var p = 0; p < pickList.objects.length; p++) {
                    if (!pickList.objects[p].isTerrain) {
                        if (shapeEditor.startX === shapeEditor.lastX &&
                            shapeEditor.startY === shapeEditor.lastY) {
                            if (event.shiftKey) {
                                var mousePoint = shapeEditor.worldWindow.canvasCoordinates(event.clientX,
                                    event.clientY);
                                var terrainObject;

                                if (shapeEditor.worldWindow.viewport.containsPoint(mousePoint)) {
                                    terrainObject = shapeEditor.worldWindow.pickTerrain(mousePoint)
                                        .terrainObject();
                                }

                                if (terrainObject) {
                                    shapeEditor.addNearestLocation(terrainObject.position, 0,
                                        shapeEditor.shape.boundaries);
                                }
                            }
                        }

                        redrawRequired = true;
                        break;
                    }
                }
            }

            shapeEditor.isDragging = false;
            shapeEditor.currentSizingMarker = null;

            // Update the window if we changed anything.
            if (redrawRequired) {
                shapeEditor.worldWindow.redraw();
            }
        };

        //Internal use only. Intentionally not documented.
        ShapeEditor.prototype.onGestureEvent = function (event) {
            if (!this.armed) {
                return;
            }

            try {
                if (event.type === "pointerup" || event.type === "mouseup") {
                    this.handleMouseUp(event);
                } else if (event.type === "pointerdown" || event.type === "mousedown") {
                    this.handleMouseDown(event);
                } else if (event.type === "pointermove" || event.type === "mousemove") {
                    this.handleMouseMove(event);
                }
            } catch (error) {
                console.log(error); // FIXME Remove this
                Logger.logMessage(Logger.LEVEL_SEVERE, "ShapeEditor", "handleEvent",
                    "Error handling event.\n" + error.toString());
            }
        };

        /**
         * Remove the control points.
         */
        ShapeEditor.prototype.removeControlPoints = function () {
            this.controlPointLayer.removeAllRenderables();
        };

        /**
         * Creates and returns the stationary shape displayed during editing operations.
         * @returns {SurfaceShape} The new shadow shape created, or null if the shape type is not recognized.
         */
        ShapeEditor.prototype.doMakeShadowShape = function () {
            return this.activeEditorFragment.createShadowShape(this.shape);
        };

        /**
         * Creates the shape that will remain at the same location and is the same size as the shape to be edited.
         */
        ShapeEditor.prototype.makeShadowShape = function () {
            var shadowShape = this.doMakeShadowShape();
            if (shadowShape == null) {
                return;
            }

            var editingAttributes = new ShapeAttributes(this.originalHighlightAttributes);

            if (editingAttributes.interiorColor.alpha === 1) {
                editingAttributes.interiorColor.alpha = 0.7;
            }

            this.shape.highlightAttributes = editingAttributes;

            shadowShape.highlighted = true;
            shadowShape.highlightAttributes = new ShapeAttributes(this.originalHighlightAttributes);

            this.shadowLayer.addRenderable(shadowShape);
            this.worldWindow.redraw();
        };

        /**
         * Remove the shadow shape.
         */
        ShapeEditor.prototype.removeShadowShape = function () {
            this.shadowLayer.removeAllRenderables();

            // Restore the original highlight attributes.
            this.shape.highlightAttributes = this.originalHighlightAttributes;

            this.worldWindow.redraw();
        };

        /**
         * Set up the Annotation.
         */
        ShapeEditor.prototype.makeAnnotation = function () {
            var annotationAttributes = new AnnotationAttributes(null);
            annotationAttributes.altitudeMode = WorldWind.CLAMP_TO_GROUND;
            annotationAttributes.cornerRadius = 5;
            annotationAttributes.backgroundColor = new Color(0.67, 0.67, 0.67, 0.8);
            annotationAttributes._leaderGapHeight = 0;
            annotationAttributes.drawLeader = false;
            annotationAttributes.scale = 1;
            annotationAttributes._textAttributes.color = Color.BLACK;
            annotationAttributes._textAttributes.font = new Font(10);
            annotationAttributes.insets = new Insets(5, 5, 5, 5);

            this.annotation = new WorldWind.Annotation(
                new WorldWind.Position(0, 0, 0), annotationAttributes);
            this.annotation.text = "";
            this.annotationLayer.addRenderable(this.annotation);
            this.annotationLayer.enabled = false;
        };

        /**
         * Updates the annotation indicating the edited shape's center. If the  shape has no designated center, this
         * method prevents the annotation from displaying.
         */
        ShapeEditor.prototype.updateShapeAnnotation = function () {
            var center = this.getShapeCenter();

            if (center != null) {
                var dummyMarker = new Placemark(
                    new Position(center.latitude, center.longitude, 0),
                    null);
                dummyMarker.userProperties.isControlPoint = true;
                dummyMarker.userProperties.id = 0;
                dummyMarker.userProperties.purpose = ShapeEditor.ANNOTATION;
                this.updateAnnotation(dummyMarker);
            }
            else {
                this.updateAnnotation(null);
            }
        };

        /**
         * Remove the annotation.
         */
        ShapeEditor.prototype.removeAnnotation = function () {
            this.annotationLayer.removeAllRenderables();
        };

        ShapeEditor.prototype.makeControlPointAttributes = function () {
            this.locationControlPointAttributes.imageColor = WorldWind.Color.BLUE;
            this.locationControlPointAttributes.imageScale = 6;

            this.sizeControlPointAttributes.imageColor = WorldWind.Color.CYAN;
            this.sizeControlPointAttributes.imageScale = 6;

            this.angleControlPointAttributes.imageColor = WorldWind.Color.GREEN;
            this.angleControlPointAttributes.imageScale = 6;
        };

        /**
         * Enables the ShapeEditor for the specified shape.
         * @param {SurfaceShape} shape The shape that will be edited.
         * @throws {ArgumentError} If the specified shape is null or not an instance of SurfaceShape.
         */
        ShapeEditor.prototype.edit = function (shape) {
            this.activeEditorFragment = null;
            for (var i = 0; i < this.editorFragments.length; i++) {
                if (this.editorFragments[i].canEdit(shape)) {
                    this.activeEditorFragment = this.editorFragments[i];
                }
            }

            if (this.activeEditorFragment != null) {
                this.shape = shape;
                this.enable();
                this.armed = true;
            } else {
                this.stop();
                throw new ArgumentError(Logger.logMessage(Logger.LEVEL_SEVERE, "ShapeEditor", "edit",
                    "missingShape"));
            }
        };

        /**
         * Stops the editing action and cleans up the allocated resources.
         */
        ShapeEditor.prototype.stop = function () {
            this.disable();
            this.shape = null;
            this.armed = false;
        };

        /**
         * Called by {@link ShapeEditor#edit} to enable resources used for editing.
         */
        ShapeEditor.prototype.enable = function () {
            if (this.worldWindow.indexOfLayer(this.controlPointLayer) == -1) {
                this.worldWindow.addLayer(this.controlPointLayer);
            }

            if (this.worldWindow.indexOfLayer(this.accessoryLayer) == -1) {
                this.worldWindow.addLayer(this.accessoryLayer);
            }
            this.makeAccessory();

            if (this.worldWindow.indexOfLayer(this.annotationLayer) == -1) {
                this.worldWindow.addLayer(this.annotationLayer);
            }

            if (this.worldWindow.indexOfLayer(this.shadowLayer) == -1) {
                this.worldWindow.insertLayer(0, this.shadowLayer);
            }

            this.updateControlPoints();
        };

        /**
         * Called by {@link ShapeEditor#stop} to remove resources no longer needed after editing.
         */
        ShapeEditor.prototype.disable = function () {
            this.removeControlPoints();
            this.worldWindow.removeLayer(this.controlPointLayer);

            this.removeAccessory();
            this.worldWindow.removeLayer(this.accessoryLayer);

            this.worldWindow.removeLayer(this.annotationLayer);

            this.worldWindow.removeLayer(this.shadowLayer);
        };

        //Internal use only. Intentionally not documented.
        ShapeEditor.prototype.formatLatitude = function (number) {
            var suffix = number < 0 ? "\u00b0S" : "\u00b0N";
            return Math.abs(number).toFixed(4) + suffix;
        };

        //Internal use only. Intentionally not documented.
        ShapeEditor.prototype.formatLongitude = function (number) {
            var suffix = number < 0 ? "\u00b0W" : "\u00b0E";
            return Math.abs(number).toFixed(4) + suffix;
        };

        //Internal use only. Intentionally not documented.
        ShapeEditor.prototype.formatLength = function (number) {
            var suffix = " km";
            return Math.abs(number / 1000.0).toFixed(3) + suffix;
        };

        //Internal use only. Intentionally not documented.
        ShapeEditor.prototype.formatRotation = function (rotation) {
            return rotation.toFixed(4) + "°";
        };

        ShapeEditor.prototype.updateControlPoints = function () {
            this.activeEditorFragment.updateControlPoints(
                this.shape,
                this.worldWindow.globe,
                this.controlPointLayer.renderables,
                this.accessoryLayer.renderables,
                this.sizeControlPointAttributes,
                this.angleControlPointAttributes,
                this.locationControlPointAttributes
            );
        };

        /**
         * Set up the Path for the rotation line.
         */
        ShapeEditor.prototype.makeAccessory = function () {
            var pathPositions = [];
            pathPositions.push(new Position(0, 0, 0));
            pathPositions.push(new Position(0, 0, 0));
            var rotationLine = new Path(pathPositions, null);
            rotationLine.altitudeMode = WorldWind.CLAMP_TO_GROUND;
            rotationLine.followTerrain = true;

            var pathAttributes = new ShapeAttributes(null);
            pathAttributes.outlineColor = Color.GREEN;
            pathAttributes.outlineWidth = 2;
            rotationLine.attributes = pathAttributes;

            this.accessoryLayer.addRenderable(rotationLine);
        };

        /**
         * Remove the orientation line.
         */
        ShapeEditor.prototype.removeAccessory = function () {
            this.accessoryLayer.removeAllRenderables();
        };

        /**
         * Moves the entire shape according to a specified event.
         * @param {Event} event
         */
        ShapeEditor.prototype.dragWholeShape = function (event) {
            var refPos = this.shape.getReferencePosition();
            if (refPos === null) {
                return;
            }

            var refPoint = new Vec3(0, 0, 0);
            this.worldWindow.globe.computePointFromPosition(refPos.latitude, refPos.longitude, 0,
                refPoint);

            var screenRefPoint = new Vec3(0, 0, 0);
            this.worldWindow.drawContext.project(refPoint, screenRefPoint);

            // Compute screen-coord delta since last event.
            var dx = event.clientX - this.lastX;
            var dy = event.clientY - this.lastY;

            this.lastX = event.clientX;
            this.lastY = event.clientY;

            // Find intersection of screen coord ref-point with globe.
            var x = screenRefPoint[0] + dx;
            var y = this.worldWindow.canvas.height - screenRefPoint[1] + dy;

            var ray = this.worldWindow.rayThroughScreenPoint(new Vec2(x, y));

            var intersection = new Vec3(0, 0, 0);
            if (this.worldWindow.globe.intersectsLine(ray, intersection)) {
                var p = new Position(0, 0, 0);
                this.worldWindow.globe.computePositionFromPoint(intersection[0], intersection[1],
                    intersection[2], p);
                this.shape.moveTo(this.worldWindow.globe, new WorldWind.Location(p.latitude, p.longitude));
            }
        };

        /**
         * Modifies the shape's locations, size or rotation. This method is called when a control point is dragged.
         *
         * @param {PickedObject} terrainObject The terrain object.
         */
        ShapeEditor.prototype.reshapeShape = function (terrainObject) {
            if (!this.previousPosition) {
                this.previousPosition = terrainObject.position;
                return;
            }

            this.doReshapeShape(this.currentSizingMarker, terrainObject.position);

            this.previousPosition = terrainObject.position;
        };

        /**
         * Called by {@link ShapeEditor#reshapeShape} to perform the actual shape modification.
         * Subclasses should override this method if they provide editing for shapes other than those supported by
         * the basic editor.
         *
         * @param {Placemark} controlPoint The control point selected.
         * @param {Position} terrainPosition The terrain position under the cursor.
         */
        ShapeEditor.prototype.doReshapeShape = function (controlPoint, terrainPosition) {
            if (!controlPoint) {
                return;
            }
            this.activeEditorFragment.reshape(
                this.shape,
                this.worldWindow.globe,
                controlPoint,
                terrainPosition,
                this.previousPosition,
                this.currentEvent
            );
            this.updateAnnotation(controlPoint);
            this.currentSizingMarker.position = terrainPosition;
            this.worldWindow.redraw();
        };

        /**
         *
         * @returns {Location} The shape's center location, or null if the shape has no designated center.
         */
        ShapeEditor.prototype.getShapeCenter = function () {
            var center = null;

            if (this.shape instanceof SurfaceEllipse || this.shape instanceof SurfaceRectangle) {
                center = this.shape.center;
            }

            return center;
        };

        /**
         * Updates the annotation associated with a specified control point.
         * @param {Placemark} controlPoint The control point.
         */
        ShapeEditor.prototype.updateAnnotation = function (controlPoint) {
            if (!controlPoint) {
                this.annotationLayer.enabled = false;
                return;
            }

            this.annotationLayer.enabled = true;
            this.annotation.position = new Position(
                controlPoint.position.latitude,
                controlPoint.position.longitude,
                0
            );

            var annotationText;
            if (controlPoint.userProperties.size !== undefined) {
                annotationText = this.formatLength(controlPoint.userProperties.size);
            }
            else if (controlPoint.userProperties.rotation !== undefined) {
                annotationText = this.formatRotation(controlPoint.userProperties.rotation);
            }
            else {
                annotationText = this.formatLatitude(controlPoint.position.latitude) + " " +
                    this.formatLongitude(controlPoint.position.longitude);
            }

            this.annotation.text = annotationText;
        };

        /**
         * Computes the point on a specified line segment that is nearest a specified point.
         *
         * @param {Vec3} p1 The line's first point.
         * @param {Vec3} p2 The line's second point.
         * @param {Vec3} point The point for which to determine a nearest point on the line segment.
         * @returns {Vec3} The nearest point on the line segment.
         */
        ShapeEditor.prototype.nearestPointOnSegment = function (p1, p2, point) {
            var segment = p2.subtract(p1);

            var segmentCopy = new Vec3(0, 0, 0);
            segmentCopy.copy(segment);
            var dir = segmentCopy.normalize();

            var dot = point.subtract(p1).dot(dir);
            if (dot < 0.0) {
                return p1;
            }
            else if (dot > segment.magnitude()) {
                return p2;
            }
            else {
                return Vec3.fromLine(p1, dot, dir); // FIXME This is broken
            }
        };

        /**
         * Inserts the location nearest to a specified position on an edge of a specified list of locations into the
         * appropriate place in that list.
         * @param {Position} terrainPosition The position to find a nearest point for.
         * @param {Number} altitude The altitude to use when determining the nearest point. Can be approximate and is
         * not necessarily the altitude of the terrain position.
         * @param {Location[]} locations The list of locations. This list is modified by this method to contain the new
         * location on an edge nearest the specified terrain position.
         */
        ShapeEditor.prototype.addNearestLocation = function (terrainPosition, altitude, locations) {
            var globe = this.worldWindow.globe;

            // Find the nearest edge to the picked point and insert a new position on that edge.
            var pointPicked = globe.computePointFromPosition(
                terrainPosition.latitude,
                terrainPosition.longitude,
                altitude,
                new Vec3(0, 0, 0)
            );

            var nearestPoint = null;
            var nearestSegmentIndex = 0;
            var nearestDistance = Number.MAX_VALUE;
            for (var i = 1; i <= locations.length; i++) // <= is intentional, to handle the closing segment
            {
                // Skip the closing segment if the shape is not a polygon.
                if (!(this.shape instanceof SurfacePolygon ) && i == locations.length) {
                    continue;
                }

                var locationA = locations[i - 1];
                var locationB = locations[i == locations.length ? 0 : i];

                var pointA = globe.computePointFromPosition(
                    locationA.latitude,
                    locationA.longitude,
                    altitude,
                    new Vec3(0, 0, 0)
                );

                var pointB = this.worldWindow.globe.computePointFromPosition(
                    locationB.latitude,
                    locationB.longitude,
                    altitude,
                    new Vec3(0, 0, 0)
                );

                var pointOnEdge = this.nearestPointOnSegment(pointA, pointB, new Vec3(pointPicked[0], pointPicked[1], pointPicked[2]));

                var distance = pointOnEdge.distanceTo(pointPicked);
                if (distance < nearestDistance) {
                    nearestPoint = pointOnEdge;
                    nearestSegmentIndex = i;
                    nearestDistance = distance;
                }
            }

            if (nearestPoint) {
                // Compute the location of the nearest point and add it to the shape.
                var nearestLocation = this.worldWindow.globe.computePositionFromPoint(
                    nearestPoint[0],
                    nearestPoint[1],
                    nearestPoint[2],
                    new Position(0, 0, 0)
                );

                if (nearestSegmentIndex == locations.length)
                    locations.push(nearestLocation);
                else
                    locations.splice(nearestSegmentIndex, 0, nearestLocation);

                this.removeControlPoints();
                this.shape.boundaries = locations;
                this.updateControlPoints();
            }
        };

        ShapeEditor.prototype.setPreviousPosition = function (event) {
            var mousePoint = this.worldWindow.canvasCoordinates(event.clientX,
                event.clientY);
            if (this.worldWindow.viewport.containsPoint(mousePoint)) {
                var terrainObject = this.worldWindow.pickTerrain(mousePoint).terrainObject();
                if (terrainObject) {
                    this.previousPosition = new Position(
                        terrainObject.position.latitude,
                        terrainObject.position.longitude,
                        terrainObject.position.altitude
                    );
                }
            }
        };

        return ShapeEditor;
    }
);