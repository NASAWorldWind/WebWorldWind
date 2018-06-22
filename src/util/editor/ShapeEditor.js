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
        './ShapeEditorConstants',
        '../../shapes/SurfaceEllipse',
        './SurfaceEllipseEditorFragment',
        '../../shapes/SurfaceCircle',
        './SurfaceCircleEditorFragment',
        '../../shapes/SurfacePolygon',
        './SurfacePolygonEditorFragment',
        '../../shapes/SurfacePolyline',
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
              ShapeEditorConstants,
              SurfaceEllipse,
              SurfaceEllipseEditorFragment,
              SurfaceCircle,
              SurfaceCircleEditorFragment,
              SurfacePolygon,
              SurfacePolygonEditorFragment,
              SurfacePolyline,
              SurfacePolylineEditorFragment,
              SurfaceRectangle,
              SurfaceRectangleEditorFragment,
              SurfaceShape,
              Vec2,
              Vec3) { // FIXME Remove unnecessary items from this list
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

            this._worldWindow = worldWindow;

            this._shape = null;

            this._moveControlPointAttributes = new PlacemarkAttributes(null);
            this._moveControlPointAttributes.imageColor = WorldWind.Color.BLUE;
            this._moveControlPointAttributes.imageScale = 6;

            this._resizeControlPointAttributes = new PlacemarkAttributes(null);
            this._resizeControlPointAttributes.imageColor = WorldWind.Color.CYAN;
            this._resizeControlPointAttributes.imageScale = 6;

            this._rotateControlPointAttributes = new PlacemarkAttributes(null);
            this._rotateControlPointAttributes.imageColor = WorldWind.Color.GREEN;
            this._rotateControlPointAttributes.imageScale = 6;

            this._annotationAttributes = new AnnotationAttributes(null);
            this._annotationAttributes.altitudeMode = WorldWind.CLAMP_TO_GROUND;
            this._annotationAttributes.cornerRadius = 5;
            this._annotationAttributes.backgroundColor = new Color(0.67, 0.67, 0.67, 0.8);
            this._annotationAttributes._leaderGapHeight = 0;
            this._annotationAttributes.drawLeader = false;
            this._annotationAttributes.scale = 1;
            this._annotationAttributes._textAttributes.color = Color.BLACK;
            this._annotationAttributes._textAttributes.font = new Font(10);
            this._annotationAttributes.insets = new Insets(5, 5, 5, 5);

            //Internal use only. Intentionally not documented.
            this.annotation = new WorldWind.Annotation(new WorldWind.Position(0, 0, 0), this._annotationAttributes);

            //Internal use only. Intentionally not documented.
            this.editorFragments = [
                new SurfaceCircleEditorFragment(),
                new SurfaceEllipseEditorFragment(),
                new SurfacePolygonEditorFragment(),
                new SurfacePolylineEditorFragment(),
                new SurfaceRectangleEditorFragment()
            ];

            //Internal use only. Intentionally not documented.
            this.controlPointsLayer = new RenderableLayer("Shape Editor Control Points");

            //Internal use only. Intentionally not documented.
            this.accessoriesLayer = new RenderableLayer("Shape Editor Accessories");
            this.accessoriesLayer.pickEnabled = false;

            //Internal use only. Intentionally not documented.
            this.annotationLayer = new RenderableLayer("Shape Editor Annotation");
            this.annotationLayer.pickEnabled = false;
            this.annotationLayer.enabled = false;
            this.annotationLayer.addRenderable(this.annotation);

            //Internal use only. Intentionally not documented.
            this.shadowShapeLayer = new RenderableLayer("Shape Editor Shadow Shape");
            this.shadowShapeLayer.pickEnabled = false;

            //Internal use only. Intentionally not documented.
            this.activeEditorFragment = null;

            //Internal use only. Intentionally not documented.
            this.actionType = null;

            //Internal use only. Intentionally not documented.
            this.actionControlPoint = null;

            //Internal use only. Intentionally not documented.
            this.actionControlPosition = null;

            //Internal use only. Intentionally not documented.
            this.actionSecondaryBehavior = false;

            //Internal use only. Intentionally not documented.
            this.actionStartX = null;

            //Internal use only. Intentionally not documented.
            this.actionStartY = null;

            //Internal use only. Intentionally not documented.
            this.actionCurrentX = null;

            //Internal use only. Intentionally not documented.
            this.actionCurrentY = null;

            //Internal use only. Intentionally not documented.
            this.originalHighlightAttributes = new ShapeAttributes(null);

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
             * Attribuets used for the control points that move the boundaries of the shape.
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
             * Attributes used for the annotation.
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
         * @return {Boolean} <code>true</code> if the editor could start the edition of the specified shape; otherwise
         * <code>false</code>.
         */
        ShapeEditor.prototype.edit = function (shape) {
            this.stop();

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

            var currentShape = this._shape;
            this._shape = null;
            return currentShape;
        };

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

        //Internal use only. Intentionally not documented.
        ShapeEditor.prototype.onGestureEvent = function (event) {
            if(this._shape === null) {
                return;
            }

            if (event.type === "pointerup" || event.type === "mouseup") {
                this.handleMouseUp(event);
            } else if (event.type === "pointerdown" || event.type === "mousedown") {
                this.handleMouseDown(event);
            } else if (event.type === "pointermove" || event.type === "mousemove") {
                this.handleMouseMove(event);
            }
        };

        //Internal use only. Intentionally not documented.
        ShapeEditor.prototype.handleMouseDown = function (event) {
            var x = event.clientX,
                y = event.clientY;

            this.actionStartX = x;
            this.actionStartY = y;
            this.actionCurrentX = x;
            this.actionCurrentY = y;

            var mousePoint = this._worldWindow.canvasCoordinates(x, y);
            var pickList = this._worldWindow.pick(mousePoint);

            for (var p = 0, len = pickList.objects.length; p < len; p++) {
                var object = pickList.objects[p];

                if (!object.isTerrain) {
                    var userObject = object.userObject;
                    var terrainObject = pickList.terrainObject();

                    if (userObject === this._shape) {
                        this.beginAction(terrainObject.position, event.altKey);
                        event.preventDefault();
                        break;

                    } else if (userObject instanceof Placemark && userObject.userProperties.isControlPoint) {
                        this.beginAction(terrainObject.position, event.altKey, userObject);
                        event.preventDefault();
                        break;
                    }
                }
            }
        };

        // Internal use only. Intentionally not documented.
        ShapeEditor.prototype.handleMouseMove = function (event) {
            if (this.actionType) {

                var mousePoint = this._worldWindow.canvasCoordinates(event.clientX, event.clientY);
                var terrainObject = this._worldWindow.pickTerrain(mousePoint).terrainObject();

                if (terrainObject) {
                    if (this.actionType === ShapeEditorConstants.DRAG) {
                        this.drag(event.clientX, event.clientY);

                    } else {
                        this.reshape(terrainObject.position);
                    }

                    event.preventDefault();
                }
            }
        };

        //Internal use only. Intentionally not documented.
        ShapeEditor.prototype.handleMouseUp = function (event) {
            var x = event.clientX,
                y = event.clientY;

            if (this.actionType) {
                if (this.actionControlPoint) {
                    if (event.altKey) { // FIXME What is this for?
                        var mousePoint = this._worldWindow.canvasCoordinates(event.clientX, event.clientY);
                        var terrainObject;

                        if (this._worldWindow.viewport.containsPoint(mousePoint)) {
                            terrainObject = this._worldWindow.pickTerrain(mousePoint).terrainObject();
                        }

                        if (terrainObject) {
                            this.reshape(terrainObject.position);
                        }
                    }
                }

                this.endAction();

            } else {
                var pickList = this._worldWindow.pick(this._worldWindow.canvasCoordinates(x, y));
                if (pickList.objects.length > 0) {
                    for (var p = 0, len = pickList.objects.length; p < len; p++) {
                        if (!pickList.objects[p].isTerrain) {
                            if (this.actionStartX === this.actionCurrentX &&
                                this.actionStartY === this.actionCurrentY) { // FIXME Is this check needed?
                                if (event.shiftKey) {
                                    var mousePoint = this._worldWindow.canvasCoordinates(event.clientX, event.clientY);
                                    var terrainObject;

                                    if (this._worldWindow.viewport.containsPoint(mousePoint)) {
                                        terrainObject = this._worldWindow.pickTerrain(mousePoint).terrainObject();
                                    }

                                    if (terrainObject) {
                                        this.addNewControlPoint(terrainObject.position, 0, this._shape.boundaries);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

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

            // Place a shadow shape at the original location of the shape
            this.originalHighlightAttributes = this._shape.highlightAttributes;

            var editingAttributes = new ShapeAttributes(this.originalHighlightAttributes);
            editingAttributes.interiorColor.alpha = editingAttributes.interiorColor.alpha * 0.7;

            var shadowShape = this.activeEditorFragment.createShadowShape(this._shape);
            shadowShape.highlightAttributes = new ShapeAttributes(this.originalHighlightAttributes);
            shadowShape.highlighted = true;

            this.shadowShapeLayer.addRenderable(shadowShape);

            this._worldWindow.redraw();
        };

        ShapeEditor.prototype.endAction = function () {
            this.shadowShapeLayer.removeAllRenderables();

            this._shape.highlightAttributes = this.originalHighlightAttributes;
            
            this.hideAnnotation();

            this.actionControlPoint = null;
            this.actionType = null;
            this.actionControlPosition = null;

            this._worldWindow.redraw();
        };

        ShapeEditor.prototype.reshape = function (newPosition) {
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
        };

        ShapeEditor.prototype.drag = function (clientX, clientY) {
            // FIXME To be reviewed
            var refPos = this._shape.getReferencePosition();

            var refPoint = this._worldWindow.globe.computePointFromPosition(
                refPos.latitude,
                refPos.longitude,
                0,
                new Vec3(0, 0, 0)
            );

            var screenRefPoint = new Vec3(0, 0, 0);
            this._worldWindow.drawContext.project(refPoint, screenRefPoint);

            var dx = clientX - this.actionCurrentX;
            var dy = clientY - this.actionCurrentY;

            this.actionCurrentX = clientX;
            this.actionCurrentY = clientY;

            // Find intersection of the screen coordinates ref-point with globe
            var x = screenRefPoint[0] + dx;
            var y = this._worldWindow.canvas.height - screenRefPoint[1] + dy;

            var ray = this._worldWindow.rayThroughScreenPoint(new Vec2(x, y));

            var intersection = new Vec3(0, 0, 0);
            if (this._worldWindow.globe.intersectsLine(ray, intersection)) {
                var p = new Position(0, 0, 0);
                this._worldWindow.globe.computePositionFromPoint(intersection[0], intersection[1],
                    intersection[2], p);
                this._shape.moveTo(this._worldWindow.globe, new WorldWind.Location(p.latitude, p.longitude));
            }

            this.updateControlElements();
            this.updateShapeAnnotation();

            this._worldWindow.redraw();
        };

        ShapeEditor.prototype.updateControlElements = function () {
            this.activeEditorFragment.updateControlElements(
                this._shape,
                this._worldWindow.globe,
                this.controlPointsLayer.renderables,
                this.accessoriesLayer.renderables
            );
        };

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
            }
            else if (controlPoint.userProperties.rotation !== undefined) {
                annotationText = this.formatRotation(controlPoint.userProperties.rotation);
            }
            else {
                annotationText = this.formatLatitude(controlPoint.position.latitude)
                    + " "
                    + this.formatLongitude(controlPoint.position.longitude);
            }
            this.annotation.text = annotationText;
        };

        ShapeEditor.prototype.hideAnnotation = function (controlPoint) {
            this.annotationLayer.enabled = false;
        };

        ShapeEditor.prototype.updateShapeAnnotation = function () {
            var center = this.activeEditorFragment.getShapeCenter(this._shape);

            if (center !== null) {
                var dummyMarker = new Placemark(
                    new Position(center.latitude, center.longitude, 0),
                    null
                );
                dummyMarker.userProperties.isControlPoint = true;
                dummyMarker.userProperties.id = 0;
                dummyMarker.userProperties.purpose = ShapeEditor.ANNOTATION;
                this.updateAnnotation(dummyMarker);

            } else {
                this.hideAnnotation();
            }
        };

        ShapeEditor.prototype.formatLatitude = function (number) {
            var suffix = number < 0 ? "\u00b0S" : "\u00b0N";
            return Math.abs(number).toFixed(4) + suffix;
        };

        ShapeEditor.prototype.formatLongitude = function (number) {
            var suffix = number < 0 ? "\u00b0W" : "\u00b0E";
            return Math.abs(number).toFixed(4) + suffix;
        };

        ShapeEditor.prototype.formatLength = function (number) {
            var suffix = " km";
            return Math.abs(number / 1000.0).toFixed(3) + suffix;
        };

        ShapeEditor.prototype.formatRotation = function (rotation) {
            return rotation.toFixed(4) + "°";
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
        ShapeEditor.prototype.addNewControlPoint = function (terrainPosition, altitude, locations) {
            var globe = this._worldWindow.globe;

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
                if (!(this._shape instanceof SurfacePolygon ) && i == locations.length) {
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

                var pointB = this._worldWindow.globe.computePointFromPosition(
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
                var nearestLocation = this._worldWindow.globe.computePositionFromPoint(
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
                this._shape.boundaries = locations;
                this.updateControlElements();
            }
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

        return ShapeEditor;
    }
);