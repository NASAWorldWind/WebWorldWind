/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports ColladaLoader
 */

define(['../../geom/Matrix'], function (Matrix) {
    "use strict";

    /**
     * Constructs a ColladaLoader
     * @alias ColladaLoader
     * @classdesc Represents a Collada Loader. Fetches and parses a collada document and returns the
     * necessary information to render the collada model.
     * @param {Object} config Configuration options for the loader.
     */
    var ColladaLoader = function (config) {

        //the path to the collada file
        this.filePath = '/';

        this.init(config);
    };

    /**
     * Initialization of the ColladaLoader
     * @param {Object} config Configuration options for the loader.
     */
    ColladaLoader.prototype.init = function (config) {
        if (config) {
            this.filePath = config.filePath || '/';
        }

        //the scene structure
        this.scene = {
            type: "SceneTree",
            filePath: this.filePath,
            images: {},
            metadata: {},
            materials: {},
            meshes: {},
            root: {children: []}
        };

        //the collada xml document
        this.xmlDoc = null;

        //a map of the nodes and their id's
        this.nodesById = {};

        //a map of the geometries
        this.geometriesFound = {};
    };

    /**
     * Fetches and parses a collada file
     * @param {String} url The url to the collada .dae file.
     * @param {Function} cb A callback function to call with the result when the parsing is done.
     */
    ColladaLoader.prototype.load = function (url, cb) {
        this.fetchFile(url, function (data) {
            if (!data) {
                cb(null);
            }
            else {
                cb(this.parse(data));
            }
        }.bind(this));
    };

    /**
     * Parses a collada file
     * @param {XML} data The raw XML data of the collada file.
     */
    ColladaLoader.prototype.parse = function (data) {

        this.init();

        var parser = new DOMParser();
        this.xmlDoc = parser.parseFromString(data, "text/xml");

        var asset = this.xmlDoc.getElementsByTagName("asset")[0];
        if (asset) {
            this.parseAsset(asset);
        }

        var xmlCollada = this.xmlDoc.querySelector("COLLADA");
        if (xmlCollada) {
            this.scene.metadata.daeVersion = xmlCollada.getAttribute("version");
        }

        //the collection of nodes
        var visualScene = this.xmlDoc.getElementsByTagName("visual_scene").item(0);
        if (!visualScene) {
            console.error('no visual_scene found');
            return this.scene;
        }
        var nodes = visualScene.childNodes;

        //first pass, builds the structure of nodes and sets the transformation matrix of each node
        for (var i = 0; i < nodes.length; i++) {
            if (nodes.item(i).localName != "node") continue;

            var node = this.buildNodeTree(nodes.item(i), 0);
            if (node) {
                this.scene.root.children.push(node);
            }
        }

        //second pass, parses and computes the mesh data needed to render the model
        for (i = 0; i < nodes.length; i++) {
            if (nodes.item(i).localName != "node") continue;

            var nodeId = this.replaceSpace(nodes.item(i).getAttribute("id"));
            var nodeSid = this.replaceSpace(nodes.item(i).getAttribute("sid"));
            node = this.nodesById[nodeId || nodeSid];

            if (node) {
                this.parseNode(nodes.item(i), 0);
            }
        }

        //parses the image library for texture files
        this.parseImages();

        this.nodesById = {};
        this.geometriesFound = {};
        this.xmlDoc = null;

        return this.scene;
    };

    /**
     * Parses the <asset> tag.
     * Internal. Applications should not call this function.
     * @param {Node} asset.
     */
    ColladaLoader.prototype.parseAsset = function (asset) {
        for (var i = 0; i < asset.childNodes.length; i++) {
            var child = asset.childNodes.item(i);
            if (child.nodeType != 1) continue;
            switch (child.localName) {
                case "contributor":
                    var tool = child.querySelector("authoring_tool")[0];
                    if (tool) {
                        this.scene.metadata["authoring_tool"] = tool.textContext;
                    }
                    break;
                case "unit":
                    this.scene.metadata["unit"] = child.getAttribute("name");
                    break;
                default:
                    this.scene.metadata[child.localName] = child.textContent;
                    break;
            }
        }
    };

    /**
     * Builds a node tree branch from a parent node.
     * Internal. Applications should not call this function.
     * @param {Node} xmlNode The parent node to build the tree from.
     * @param {Number} level The level of depth of the node.
     */
    ColladaLoader.prototype.buildNodeTree = function (xmlNode, level) {
        var multiMaterial = false;

        //remove spaces from the id
        var nodeId = this.replaceSpace(xmlNode.getAttribute("id"));
        var nodeSid = this.replaceSpace(xmlNode.getAttribute("sid"));

        if (!nodeId && !nodeSid) {
            console.warn('node does not have an id or sid', xmlNode);
            return null;
        }

        //a check to determine if this node has multiple materials
        var materials = xmlNode.querySelectorAll("instance_material");
        if (materials && materials.length > 1) {
            //console.log('multi material node', nodeId);
            multiMaterial = true;
        }

        var nodeName = xmlNode.getAttribute("name") || '';

        //the node object
        var node = {id: nodeSid || nodeId, children: [], _depth: level, multiMaterial: multiMaterial, name: nodeName};

        //add this node to the node map
        this.nodesById[node.id] = node;

        //compute the transformation matrix of this node
        node.localMatrix = this.setTransformationMatrix(xmlNode);

        //do the same as above for it's children
        for (var i = 0; i < xmlNode.childNodes.length; i++) {
            var xmlChild = xmlNode.childNodes.item(i);
            if (xmlChild.nodeType != 1) continue;

            if (xmlChild.localName == "node") {
                var childNode = this.buildNodeTree(xmlChild, level + 1);
                if (childNode) {
                    node.children.push(childNode);
                }
            }
        }

        return node;
    };

    /**
     * Computes the transformation matrix of a node.
     * Internal. Applications should not call this function.
     * @param {Node} xmlNode.
     */
    ColladaLoader.prototype.setTransformationMatrix = function (xmlNode) {
        var matrix = Matrix.fromIdentity(),
            rotationMatrix = Matrix.fromIdentity(),
            scaleMatrix = Matrix.fromIdentity(),
            translationMatrix = Matrix.fromIdentity(),
            values;

        for (var i = 0; i < xmlNode.childNodes.length; i++) {
            var transform = xmlNode.childNodes.item(i);

            if (transform.localName == "matrix") {
                values = this.bufferDataFloat32(transform);
                //matrix.setToUnitYFlip();
                matrix.copy(values);
                //matrix.setToTransposeOfMatrix(matrix);
                return matrix;
            }

            if (transform.localName == "translate") {
                values = this.bufferDataFloat32(transform);
                translationMatrix.multiplyByTranslation(values[0], values[1], values[2]);
                continue;
            }

            if (transform.localName == "rotate") {
                values = this.bufferDataFloat32(transform);
                rotationMatrix.multiplyByRotation(values[0], values[1], values[2], values[3]);
                continue;
            }

            if (transform.localName == "scale") {
                values = this.bufferDataFloat32(transform);
                scaleMatrix.multiplyByScale(values[0], values[1], values[2]);
            }
        }

        matrix.multiplyMatrix(translationMatrix);
        matrix.multiplyMatrix(rotationMatrix);
        matrix.multiplyMatrix(scaleMatrix);

        return matrix;
    };

    /**
     * Parses a node and computes it's geometry and materials.
     * Internal. Applications should not call this function.
     * @param {Node} xmlNode.
     * @param {Number} level The level of depth of the node.
     */
    ColladaLoader.prototype.parseNode = function (xmlNode, level) {

        //replace the spaces
        var nodeId = this.replaceSpace(xmlNode.getAttribute("id"));
        var nodeSid = this.replaceSpace(xmlNode.getAttribute("sid"));

        if (!nodeId && !nodeSid) {
            console.warn('node does not have an id or sid', xmlNode);
            return null;
        }

        //the node object
        var node = this.nodesById[nodeId || nodeSid];

        //loop through each sub tag
        for (var i = 0; i < xmlNode.childNodes.length; i++) {
            var xmlChild = xmlNode.childNodes.item(i);
            if (xmlChild.nodeType != 1) continue;

            //the node has a child node, so recurse
            if (xmlChild.localName == "node") {
                this.parseNode(xmlChild, level + 1);
                continue;
            }

            //the node has geometry, so process it
            if (xmlChild.localName == "instance_geometry") {
                var url = xmlChild.getAttribute("url");
                var meshId = url.toString().substr(1); //remove the "#" char to get the id of the <geometry> element
                node.mesh = meshId;

                //the mesh map
                this.scene.meshes[meshId] = {
                    name: '',
                    filename: '',
                    buffers: []
                };

                //the node's materials, it can have more than one - multi material node
                //we first process the materials because the mesh will have the same number of materials, so for
                // each material we need to construct a different shape on the same mesh
                var xmlMaterials = xmlChild.querySelectorAll("instance_material");
                if (xmlMaterials) {
                    //loop through each material
                    for (var j = 0; j < xmlMaterials.length; j++) {

                        var xmlMaterial = xmlMaterials.item(j);
                        if (!xmlMaterial) {
                            console.warn("material not found: " + i);
                            continue;
                        }

                        //remove the "#" char to get the id of the <material> element
                        var materialId = xmlMaterial.getAttribute("target").toString().substr(1);

                        // the material symbol links the material specified in the node with the one specified in the
                        // mesh
                        var materialSymbol = xmlMaterial.getAttribute("symbol").toString();

                        //the same material can be used in multiple nodes, so check if we processed it
                        if (!this.scene.materials[materialId]) {

                            //parse and compute this material
                            var material = this.parseMaterial(materialId);

                            if (material) {
                                material.id = materialId;

                                //added it to the scene materials map
                                this.scene.materials[material.id] = material;
                            }
                        }

                        //check if this mesh has been processed
                        if (!this.scene.meshes[url]) {

                            //parse and compute this mesh
                            var meshData = this.parseGeometry(url, j, materialSymbol);
                            if (meshData) {
                                //add it to the scene meshes map
                                meshData.name = meshId;
                                this.scene.meshes[meshId].name = meshData.name;
                                this.scene.meshes[meshId].filename = meshData.filename;
                                this.scene.meshes[meshId].buffers.push({
                                    uvs: meshData.uvs,
                                    normals: meshData.normals,
                                    indices: meshData.indices,
                                    vertices: meshData.vertices,
                                    isClamp: meshData.isClamp,
                                    material: materialId
                                });
                            }
                        }

                        if (!node.materials) {
                            node.materials = [];
                        }

                        //add a reference to the material in the the node
                        node.materials.push(materialId);
                    }
                }
            }
        }
    };

    /**
     * Parses and computes the geometry of a mesh.
     * Internal. Applications should not call this function.
     * @param {String} id The id of an <instance_geometry>.
     * @param {Number} index The index of the shape/material in the mesh.
     * A mesh may have more than one shape (multi material node/mesh).
     */
    ColladaLoader.prototype.parseGeometry = function (id, index, materialSymbol) {
        index = index || 0;

        var __id = id.substr(1); //remove the "#" char to get the id of the <geometry> element

        //IE 11 returns null with getElementById
        var geometry = this.xmlDoc.getElementById(__id) || this.querySelectorById("geometry", __id);

        if (!geometry) {
            console.warn("readGeometry: geometry not found: " + id);
            this.geometriesFound[id] = null;
            return null;
        }

        var xmlMesh = geometry.querySelector("mesh");
        if (!xmlMesh) {
            console.warn("readGeometry: mesh not found in geometry: " + id);
            this.geometriesFound[id] = null;
            return null;
        }

        var sources = {};

        //sources refers to vertices, uvs, normals nodes
        //not all three attributes may be present
        //the source seems to contain only unique vectors
        //eg. a cube would contain only 8 vertices, instead of 24 vertices(4 for each face)
        var xmlSources = xmlMesh.querySelectorAll("source");

        //normals and/or uvs may not be present, so loop thought all the sources
        for (var i = 0; i < xmlSources.length; i++) {
            var xmlSource = xmlSources.item(i);
            if (!xmlSource.querySelector) continue;

            //the element which holds the values of the source
            var float_array = xmlSource.querySelector("float_array");
            if (!float_array) continue;

            //put the values in a Float32Array
            var values = this.bufferDataFloat32(float_array);

            //get the accessor of this source, in order to get the stride - number of components that form a Vector
            var accessor = xmlSource.querySelector("accessor");
            var stride = parseInt(accessor.getAttribute("stride"));

            //add the data to the source object map
            sources[xmlSource.getAttribute("id")] = {stride: stride, data: values};
        }

        //the collada usually changes the semantic of the vertices, so find it and change it in the source map object
        //we need this information when parsing the primitives
        var vertices = xmlMesh.querySelector("vertices input");
        var verticesSource = sources[vertices.getAttribute("source").substr(1)];
        sources[xmlMesh.querySelector("vertices").getAttribute("id")] = verticesSource;

        //the mesh object we are returning with all the data we computed
        var mesh = null;

        //next is parsing the primitives and constructing a shape/buffer with vertices, uvs, normals and indices
        //the order that materials are in the node may differ from the order that materials are in the mesh,
        //so we first find the correct material

        var polygons = xmlMesh.querySelectorAll("polygons");
        if (polygons) {
            for (sh = 0; sh < polygons.length; sh++) {
                var polygon = polygons[sh];
                _materialId = polygon.getAttribute("material");
                if (_materialId === materialSymbol) {
                    mesh = this.parseTriangles(polygon, sources);
                    break;
                }
            }
        }

        if (!mesh) {
            var triangles = xmlMesh.querySelectorAll("triangles");
            if (triangles) {
                for (var sh = 0; sh < triangles.length; sh++){
                    var triangle = triangles[sh];
                    var _materialId = triangle.getAttribute("material");
                    if (_materialId === materialSymbol){
                        mesh = this.parseTriangles(triangle, sources);
                        break;
                    }
                }
            }
        }

        if (!mesh) {
            var polylists = xmlMesh.querySelectorAll("polylist");
            if (polylists) {
                for (sh = 0 ; sh < polylists.length; sh++){
                    var polylist = polylists[sh];
                    _materialId =  polylist.getAttribute("material");
                    if (_materialId === materialSymbol){
                        mesh = this.parsePolylist(polylist, sources);
                        break;
                    }
                }
            }
        }

        if (!mesh) {
            console.log("no polygons or triangles in mesh: " + id);
            this.geometriesFound[id] = null;
            return null;
        }

        mesh.filename = id;
        mesh.type = "Mesh";

        //add the mesh to the geometriesFound map object
        this.geometriesFound[id] = mesh;

        return mesh;
    };

    /**
     * Parses the triangles and polygons primitive and computes the indices, vertices, normals and uvs.
     * Internal. Applications should not call this function.
     * @param {Node} xmlTriangles.
     * @param {Object} sources An object containing the inputs for vertices, normals and uvs.
     */
    ColladaLoader.prototype.parseTriangles = function (xmlTriangles, sources) {

        //a map with the primitive(indexes) sequence we have computed
        var indexMap = {};

        //the indices
        var indicesArray = [];

        //check if this is triangles or polygons
        var triangles = xmlTriangles.localName == "triangles";

        //construct an array with the inputs and sources
        var buffers = this.parseShapeInputs(xmlTriangles, sources);

        //the number of inputs (between 1-3 only vertices are present or uvs/normals are present as well)
        var nrOfInputs = buffers.length;

        //the <p> tag with the values, this tag may not be present
        var primitives = xmlTriangles.querySelector("p");

        var primitiveData = [];
        if (primitives) {
            primitiveData = primitives.textContent.trim().split(" ");
        }

        //the index in the indices array
        var lastIndex = 0;
        var currentIndex = -1;

        //for triangulation
        var firstIndex = -1;
        var prevIndex = -1;

        //we jump by the number of inputs because we have an other loop witch, if needed, goes through all primitives
        // that we jumped
        for (var k = 0, l = primitiveData.length; k < l; k += nrOfInputs) {

            //construct an id for this sequence of primitives
            var vecId = primitiveData.slice(k, k + nrOfInputs).join(" ");

            //hold the current index in case we need for triangulation
            prevIndex = currentIndex;

            //check if we have computed this sequence of primitiveData values
            //if we have just retrieve the index for the indicesArray, no need to compute the inputs again as this will
            // duplicate them (eg. we will end up with duplicated vertices)
            // http://gamedev.stackexchange.com/questions/97505/parsing-blender-exported-collada-file-in-c
            if (indexMap.hasOwnProperty(vecId)) {
                currentIndex = indexMap[vecId];
            }
            else {
                //the structure of the buffers array
                //more documentation in parseShapeInputs method
                //buffers.push([semantic, [], source.stride, source.data, offset, dataSet]);
                for (var j = 0; j < nrOfInputs; j++) {
                    var buffer = buffers[j]; //the buffer of an input
                    var index = parseInt(primitiveData[k + j]); //the primitive value
                    var array = buffer[1]; //empty array in which we put the final values
                    var source = buffer[3]; //the source data values
                    index *= buffer[2]; //multiply the primitive value by the stride

                    //we compute a Vector and put it's values in the empty array
                    //the values are from the index to x stride positions in the source values
                    for (var x = 0; x < buffer[2]; x++) {
                        array.push(source[index + x]);
                    }
                }

                //the index for the indices array
                currentIndex = lastIndex;
                lastIndex += 1;

                //add the index to the index map
                indexMap[vecId] = currentIndex;
            }

            //attempt triangulation of polygons
            //the model should already be triangulated, as this will probably not work for all the shapes
            if (!triangles) {
                if (k == 0) {
                    firstIndex = currentIndex;
                }
                if (k > 2 * nrOfInputs) {
                    indicesArray.push(firstIndex);
                    indicesArray.push(prevIndex);
                }
            }

            //the indices array
            indicesArray.push(currentIndex);
        }

        var mesh = {
            vertices: new Float32Array(buffers[0][1])
        };

        this.transformMeshInfo(mesh, buffers, indicesArray);

        return mesh;
    };

    /**
     * Parses the polylists primitive and computes the indices and vertices.
     * Internal. Applications should not call this function.
     * @param {Node} xmlPolylist.
     * @param {Object} sources An object containing the inputs for vertices, normals and uvs.
     */
    ColladaLoader.prototype.parsePolylist = function (xmlPolylist, sources) {
        var lastIndex = 0;
        var indexMap = {};
        var indicesArray = [];

        var buffers = this.parseShapeInputs(xmlPolylist, sources);

        var xmlVCount = xmlPolylist.querySelector("vcount");
        var vCount = this.bufferDataUInt32(xmlVCount);

        var primitives = xmlPolylist.querySelector("p");
        var primitiveData = [];
        if (primitives) {
            primitiveData = primitives.textContent.trim().split(" ");
        }

        var nrOfInputs = buffers.length;

        var pos = 0;
        for (var i = 0; i < vCount.length; i++) {
            var numVertices = vCount[i];

            var firstIndex = -1;
            var currentIndex = -1;
            var prevIndex = -1;

            for (var k = 0; k < numVertices; k++) {
                /*var vec = primitiveData.subarray(pos, pos + nrOfInputs);
                if (!vec.join) {
                    //for IE 11 and Safari
                    var vecId = Array.prototype.join.call(vec, " ");
                }
                else {
                    vecId = primitiveData.subarray(pos, pos + nrOfInputs).join(" ");
                }*/

                var vecId = primitiveData.slice(pos, pos + nrOfInputs).join(" ");

                prevIndex = currentIndex;
                if (indexMap.hasOwnProperty(vecId)) {
                    currentIndex = indexMap[vecId];
                }
                else {
                    for (var j = 0; j < buffers.length; j++) {
                        var buffer = buffers[j];
                        var index = parseInt(primitiveData[pos + j]);
                        var array = buffer[1];
                        var source = buffer[3];
                        index *= buffer[2];
                        for (var x = 0; x < buffer[2]; x++) {
                            array.push(source[index + x]);
                        }
                    }

                    currentIndex = lastIndex;
                    lastIndex += 1;
                    indexMap[vecId] = currentIndex;
                }

                if (numVertices > 3) {
                    if (k == 0) {
                        firstIndex = currentIndex;
                    }
                    if (k > 2 * nrOfInputs) {
                        indicesArray.push(firstIndex);
                        indicesArray.push(prevIndex);
                    }
                }

                indicesArray.push(currentIndex);
                pos += nrOfInputs;
            }
        }

        var mesh = {
            vertices: new Float32Array(buffers[0][1])
        };

        this.transformMeshInfo(mesh, buffers, indicesArray);

        return mesh;
    };

    /**
     * Parses the shape of a mesh.
     * Internal. Applications should not call this function.
     * @param {Node} shape.
     * @param {Object} sources An object containing the vertices source and stride.
     */
    ColladaLoader.prototype.parseShapeInputs = function (shape, sources) {
        var buffers = [];

        //the input for vertex, normal and uv
        var xmlInputs = shape.querySelectorAll("input");

        for (var i = 0; i < xmlInputs.length; i++) {
            var xmlInput = xmlInputs.item(i);
            if (!xmlInput.getAttribute) continue;

            //the semantic for vertex, normal, uv
            var semantic = xmlInput.getAttribute("semantic").toUpperCase();

            //the source with the stride and values we computed in parseGeometry
            var source = sources[xmlInput.getAttribute("source").substr(1)];

            //the offset for this semantic in the <p> list
            var offset = parseInt(xmlInput.getAttribute("offset"));

            //indicates which inputs should be grouped together as a single set.
            //multiple inputs may share the same semantics.
            var dataSet = 0;
            if (xmlInput.getAttribute("set")) {
                dataSet = parseInt(xmlInput.getAttribute("set"));
            }

            //put all the data in an array
            buffers.push([semantic, [], source.stride, source.data, offset, dataSet]);
        }

        return buffers;
    };

    /**
     * Packs the data in the mesh object.
     * Internal. Applications should not call this function.
     * @param {Object} mesh The mesh that will be returned.
     * @param {Array} buffers An array containing geometry data.
     * @param {Array} indicesArray An array containing the indices.
     */
    ColladaLoader.prototype.transformMeshInfo = function (mesh, buffers, indicesArray) {
        var translator = {
            "normal": "normals",
            "texcoord": "uvs"
        };

        //loop trough the optional inputs, normals and uvs
        for (var i = 1; i < buffers.length; i++) {
            var name = buffers[i][0].toLowerCase(); //the semantic
            var data = buffers[i][1]; //the final data (normals, uvs)
            if (!data.length) continue;

            //changes the key value
            if (translator[name]) {
                name = translator[name];
            }

            //for inputs should be grouped together
            if (mesh[name]) {
                name = name + buffers[i][5];
            }

            mesh[name] = new Float32Array(data);

            //for uvs we need to check if the texture is repeated or clamped
            if (name === 'uvs') {
                mesh.isClamp = this.getTextureType(data);
            }
        }

        if (indicesArray && indicesArray.length) {
            if (mesh.vertices.length > 256 * 256) {
                mesh.indices = new Uint32Array(indicesArray);
            }
            else {
                mesh.indices = new Uint16Array(indicesArray);
            }
        }

        return mesh;
    };

    /**
     * Parses and computes the material of a mesh/node.
     * Internal. Applications should not call this function.
     * @param {String} materialId The url target of an <library_materials>.
     */
    ColladaLoader.prototype.parseMaterial = function (materialId) {

        //the newParam[0].initFrom points to the image of a texture
        //the rest of the attributes point to each other
        var newParam = [
            {sid: "", initFrom: ""},
            {sid: "", source: ""}
        ];

        //get the material from <library_materials>
        var xmlMaterial = this.querySelectorById("library_materials material", materialId);
        if (!xmlMaterial) return null;

        //get the effect instance of this material
        var xmlEffect = xmlMaterial.querySelector("instance_effect");
        if (!xmlEffect) return null;

        //get the effectId of this effect by removing the "#"
        var effectId = xmlEffect.getAttribute("url").substr(1);

        //get the effect from <library_effects>
        var xmlEffects = this.querySelectorById("library_effects effect", effectId);
        if (!xmlEffects) return null;

        //get the newparam values
        var newParams = xmlEffects.querySelectorAll("newparam");
        for (var i = 0; i < newParams.length; i++) {
            try {
                newParam[i].sid = this.replaceSpace(newParams[i].getAttribute("sid"));
            }
            catch(e) {
                console.log('here');
            }
            var initFrom = newParams[i].querySelector("init_from");
            if (initFrom) {
                //this points to the image in <library_images> of the texture
                newParam[0].initFrom = initFrom.textContent.toString();
            }
            var source = newParams[i].querySelector("source");
            if (source) {
                newParam[1].source = source.textContent.toString();
            }
        }

        //get the technique
        var xmlTechnique = xmlEffects.querySelector("technique");
        if (!xmlTechnique) return null;

        var material = {};

        //get the techniqueType, can be one of the four bellow
        var techniqueType = xmlTechnique.querySelector("phong");
        material.techniqueType = 'phong';
        if (!techniqueType) {
            techniqueType = xmlTechnique.querySelector("blinn");
            material.techniqueType = 'blinn';
        }
        if (!techniqueType) {
            techniqueType = xmlTechnique.querySelector("lambert");
            material.techniqueType = 'lambert';
        }
        if (!techniqueType) {
            techniqueType = xmlTechnique.querySelector("constant");
            material.techniqueType = 'constant';
        }
        if (!techniqueType) return null;

        //loop trough all the nodes to get the parameters (eg. diffuse, specular, shininess)
        for (i = 0; i < techniqueType.childNodes.length; ++i) {
            var techniqueParam = techniqueType.childNodes.item(i);

            if (!techniqueParam.localName) continue;

            var paramName = techniqueParam.localName.toString();

            var paramValue = this.getFirstChildElement(techniqueParam);
            if (!paramValue) continue;

            if (paramValue.localName.toString() == "color") {
                material[paramName] = this.bufferDataFloat32(paramValue).subarray(0, 4);
            }
            else if (paramValue.localName.toString() == "float") {
                material[paramName] = this.bufferDataFloat32(paramValue)[0];
            }
            else if (paramValue.localName.toString() == "texture") {
                if (!material.textures) {
                    material.textures = {};
                }
                //var mapId = paramValue.getAttribute("texture");
                //if (!mapId) continue;

                var mapInfo = {mapId: newParam[0].initFrom};
                mapInfo.uvs = paramValue.getAttribute("texcoord");
                material.textures[paramName] = mapInfo;
            }
        }

        material.type = "Material";
        return material;
    };

    /**
     * Parses the images of a collada file.
     * Internal. Applications should not call this function.
     */
    ColladaLoader.prototype.parseImages = function () {
        var xmlImages = this.xmlDoc.querySelector("library_images");
        if (!xmlImages) return null;

        var xmlImagesChilds = xmlImages.childNodes;
        for (var i = 0; i < xmlImagesChilds.length; ++i) {
            var xmlImage = xmlImagesChilds.item(i);
            if (xmlImage.nodeType != 1) continue;

            var initFrom = xmlImage.querySelector("init_from");
            if (initFrom && initFrom.textContent) {
                var filename = this.getFilename(initFrom.textContent);
                var id = xmlImage.getAttribute("id");
                this.scene.images[id] = {
                    filename: filename,
                    map: id,
                    name: xmlImage.getAttribute("name"),
                    path: initFrom.textContent
                };
            }
        }
    };

    /**
     * Fetches a collada file.
     * Internal. Applications should not call this function.
     * @param {String} url The path to the collada file.
     * @param {Function} cb A callback function to call when the collada file loaded.
     */
    ColladaLoader.prototype.fetchFile = function (url, cb) {

        var request = new XMLHttpRequest();

        request.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                if (cb) {
                    cb(this.response);
                }
            }
            else {
                console.error('sever error:', this.status);
            }
        };

        request.onerror = function () {
            console.error('connection error');
        };

        if (url.indexOf("://") == -1) {
            url = this.filePath + url;
        }

        request.open("get", url, true);

        request.send();
    };

    /**
     * Packs geometry data as a Float32Array.
     * Internal. Applications should not call this function.
     * @param {Node} xmlNode.
     */
    ColladaLoader.prototype.bufferDataFloat32 = function (xmlNode) {
        if (!xmlNode) return null;

        var text = xmlNode.textContent;
        text = text.replace(/\n/gi, " ");
        text = text.replace(/\s\s/gi, " ");
        text = text.trim();

        var numbers = text.split(" ");
        var count = xmlNode.getAttribute("count");
        var length = count ? parseInt(count) : numbers.length;
        var bufferData = new Float32Array(length);
        for (var i = 0; i < numbers.length; i++) {
            bufferData[i] = parseFloat(numbers[i]);
        }

        return bufferData;
    };

    /**
     * Packs geometry data as a UInt32Array.
     * Internal. Applications should not call this function.
     * @param {Node} xmlNode.
     */
    ColladaLoader.prototype.bufferDataUInt32 = function (xmlNode) {
        if (!xmlNode) return null;

        var text = xmlNode.textContent;
        text = text.replace(/\n/gi, " ");
        text = text.trim();
        if (text.length == 0) return null;

        var numbers = text.split(" ");
        var bufferData = new Uint32Array(numbers.length);
        for (var k = 0; k < numbers.length; k++)
            bufferData[k] = parseInt(numbers[k]);
        return bufferData;
    };

    /**
     * Replaces the spaces in a string with an "-".
     * Internal. Applications should not call this function.
     * @param {String} str.
     */
    ColladaLoader.prototype.replaceSpace = function (str) {
        if (!str) {
            return "";
        }
        return str.replace(/ /g, "_");
    };

    /**
     * Return the filename without slashes.
     * Internal. Applications should not call this function.
     * @param {String} filename.
     */
    ColladaLoader.prototype.getFilename = function (filename) {
        var pos = filename.lastIndexOf("\\");
        if (pos != -1) {
            filename = filename.substr(pos + 1);
        }

        pos = filename.lastIndexOf("/");
        if (pos != -1) {
            filename = filename.substr(pos + 1);
        }

        return filename;
    };

    /**
     * Finds a node by id.
     * Internal. Applications should not call this function.
     * @param {String} selector The tag to look in.
     * @param {String} id The id to search for.
     */
    ColladaLoader.prototype.querySelectorById = function (selector, id) {
        var nodes = this.xmlDoc.querySelectorAll(selector);
        for (var i = 0; i < nodes.length; i++) {
            var attrId = nodes.item(i).getAttribute("id");
            if (!attrId) continue;
            if (attrId.toString() == id) {
                return nodes.item(i);
            }
        }
        return null;
    };

    /**
     * Returns the first child of a node.
     * Internal. Applications should not call this function.
     * @param {Node} root The tag to look in.
     * @param {String} localName Optional parameter, the name of the child.
     */
    ColladaLoader.prototype.getFirstChildElement = function (root, localName) {
        var childs = root.childNodes;
        for (var i = 0; i < childs.length; ++i) {
            var item = childs.item(i);
            if ((item.localName && !localName) || (localName && localName == item.localName)) {
                return item;
            }
        }
        return null;
    };

    /**
     * Determines the rendering method for a texture.
     * The method can be CLAMP or REPEAT.
     * Internal. Applications should not call this function.
     * @param {Array} uvs The uvs array.
     */
    ColladaLoader.prototype.getTextureType = function (uvs) {
        var clamp = true;

        for (var i = 0, len = uvs.length; i < len; i++) {
            if (uvs[i] < 0 || uvs[i] > 1) {
                clamp = false;
                break;
            }
        }

        return clamp;
    };

    return ColladaLoader;

});