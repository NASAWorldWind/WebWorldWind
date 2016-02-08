/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports ColladaNode
 */

define(['./ColladaUtils', '../../geom/Matrix', '../../geom/Vec3'], function (ColladaUtils, Matrix, Vec3) {
    "use strict";

    /**
     * Constructs a ColladaNode
     * @alias ColladaNode
     * @constructor
     * @classdesc Represents a collada node tag.
     */
    var ColladaNode = function () {
        this.id = "";
        this.name = "";
        this.sid = "";
        this.children = [];
        this.materials = [];
        this.mesh = "";
        this.localMatrix = Matrix.fromIdentity();
        this.worldMatrix = Matrix.fromIdentity();
    };

    /**
     * Parses a visual_scene node.
     * Internal. Applications should not call this function.
     * @param {Node} element A visual_scene node.
     * @param {NodeList} iNodes Nodes from library_nodes.
     * @param {Matrix} parentWorldMatrix The transformation matrix of it's parent.
     */
    ColladaNode.prototype.parse = function (element, iNodes, parentWorldMatrix) {

        this.id = element.getAttribute('id');
        this.sid = element.getAttribute('sid');
        this.name = element.getAttribute('name');

        this.children = [];
        this.materials = [];
        this.mesh = "";
        this.localMatrix = Matrix.fromIdentity();
        this.worldMatrix = Matrix.fromIdentity();

        this.setNodeTransforms(element, parentWorldMatrix);

        for (var i = 0; i < element.childNodes.length; i++) {

            var child = element.childNodes[i];

            if (child.nodeType !== 1) {
                continue;
            }

            switch (child.nodeName) {

                case 'node':
                    this.children.push(( new ColladaNode() ).parse(child, iNodes, this.worldMatrix));
                    break;

                case 'instance_geometry':

                    this.mesh = child.getAttribute("url").substr(1);

                    var materials = child.querySelectorAll("instance_material");

                    for (var j = 0; j < materials.length; j++) {

                        var material = materials.item(j);

                        this.materials.push({
                            id: material.getAttribute("target").substr(1),
                            symbol: material.getAttribute("symbol")
                        });
                    }

                    break;

                case 'instance_node':
                    var iNodeId = child.getAttribute('url').substr(1);
                    var iNode = this.getLibraryNode(iNodes, iNodeId);

                    if (iNode) {
                        this.children.push(( new ColladaNode() ).parse(iNode, iNodes, this.worldMatrix));
                    }
                    break;

                default:
                    break;

            }

        }

        return this;

    };

    /**
     * Computes the transformation and normal matrix of a node
     * Internal. Applications should not call this function.
     * @param {Node} element A visual_scene node.
     * @param {Matrix} parentWorldMatrix The transformation matrix of it's parent.
     */
    ColladaNode.prototype.setNodeTransforms = function (element, parentWorldMatrix) {

        var matrix = Matrix.fromIdentity(),
            rotationMatrix = Matrix.fromIdentity(),
            translationMatrix = Matrix.fromIdentity(),
            scaleMatrix = Matrix.fromIdentity();

        if (!parentWorldMatrix) {
            parentWorldMatrix = Matrix.fromIdentity();
        }

        var transforms = [];

        for (var i = 0; i < element.childNodes.length; i++) {

            var child = element.childNodes[i];

            if (child.nodeType !== 1) {
                continue;
            }

            switch (child.nodeName) {

                case 'matrix':
                    var values = ColladaUtils.bufferDataFloat32(child);
                    matrix.copy(values);
                    transforms.push(matrix);
                    break;

                case 'rotate':
                    values = ColladaUtils.bufferDataFloat32(child);
                    rotationMatrix.multiplyByRotation(values[0], values[1], values[2], values[3]);
                    transforms.push(rotationMatrix);
                    break;

                case 'translate':
                    values = ColladaUtils.bufferDataFloat32(child);
                    translationMatrix.multiplyByTranslation(values[0], values[1], values[2]);
                    transforms.push(translationMatrix);
                    break;

                case 'scale':
                    values = ColladaUtils.bufferDataFloat32(child);
                    scaleMatrix.multiplyByScale(values[0], values[1], values[2]);
                    transforms.push(scaleMatrix);
                    break;

                default:
                    break;

            }
        }

        for (i = 0; i < transforms.length; i++) {
            this.localMatrix.multiplyMatrix(transforms[i]);
        }

        this.worldMatrix.setToMultiply(parentWorldMatrix, this.localMatrix);

        this.normalMatrix = Matrix.fromIdentity();

        var rotationAngles = new Vec3(0,0,0);
        this.worldMatrix.extractRotationAngles(rotationAngles);

        this.normalMatrix.multiplyByRotation(-1, 0, 0, rotationAngles[0]);
        this.normalMatrix.multiplyByRotation(0, -1, 0, rotationAngles[1]);
        this.normalMatrix.multiplyByRotation(0, 0, -1, rotationAngles[2]);

    };

    /**
     * Retrieves a node form library_nodes
     * Internal. Applications should not call this function.
     * @param {NodeList} iNodes Nodes from library_nodes
     * @param {String} id The id of the node to retrieve
     */
    ColladaNode.prototype.getLibraryNode = function (iNodes, id) {

        for (var i = 0; i < iNodes.length; i++) {

            var attObj = iNodes[i].attributes.getNamedItem('id');
            if (attObj && attObj.value === id) {
                return iNodes[i];
            }
        }

        return null;
    };

    return ColladaNode;
});