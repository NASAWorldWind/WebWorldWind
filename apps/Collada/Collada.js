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

require(['../../src/WorldWind', '../util/ProjectionMenu'], function (ww, ProjectionMenu) {
    "use strict";

    var modelsCombo = document.getElementById('model-list');
    var modelSelectorButton = document.getElementById('button-value');

    var sliderScale = $("#sliderScale");
    var sliderRotateX = $("#sliderRotateX");
    var sliderRotateY = $("#sliderRotateY");
    var sliderRotateZ = $("#sliderRotateZ");

    var spanScale = $('#scaleSpan');
    var spanRotateX = $("#spanRotateX");
    var spanRotateY = $("#spanRotateY");
    var spanRotateZ = $("#spanRotateZ");

    sliderScale.slider({
        min: 0,
        max: 5000,
        value: 10,
        slide: function (event, ui) {
            if (modelScene) {
                spanScale.html(ui.value);
                modelScene.scale = ui.value;
                wwd.redraw();
            }
        }
    });

    sliderRotateX.slider({
        min: 0,
        max: 360,
        value: 0,
        slide: function (event, ui) {
            if (modelScene) {
                spanRotateX.html(ui.value);
                modelScene.xRotation = ui.value;
                wwd.redraw();
            }
        }
    });
    sliderRotateY.slider({
        min: 0,
        max: 360,
        value: 0,
        slide: function (event, ui) {
            if (modelScene) {
                spanRotateY.html(ui.value);
                modelScene.yRotation = ui.value;
                wwd.redraw();
            }
        }
    });
    sliderRotateZ.slider({
        min: 0,
        max: 360,
        value: 0,
        slide: function (event, ui) {
            if (modelScene) {
                spanRotateZ.html(ui.value);
                modelScene.zRotation = ui.value;
                wwd.redraw();
            }
        }
    });

    WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

    var wwd = new WorldWind.WorldWindow("canvasOne");

    new ProjectionMenu(wwd);

    var layers = [
        {layer: new WorldWind.BMNGLayer(), enabled: true},
        {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
        {layer: new WorldWind.BingAerialLayer(null), enabled: false},
        {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: false},
        {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
        {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
        {layer: new WorldWind.CompassLayer(), enabled: true, hide: true},
        {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true, hide: true},
        {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true, hide: true}
    ];

    for (var l = 0; l < layers.length; l++) {
        layers[l].layer.enabled = layers[l].enabled;
        layers[l].layer.hide = layers[l].hide;
        wwd.addLayer(layers[l].layer);
    }

    var modelLayer = new WorldWind.RenderableLayer("model");
    wwd.addLayer(modelLayer);

    var position = new WorldWind.Position(45, -100, 1000e3);
    var colladaLoader = new WorldWind.ColladaLoader(position);

    var modelScene;

    var colladaModels = [
        {
            displayName: 'box',
            fileName: 'box.dae',
            path: 'box',
            initialScale: 500000,
            maxScale: 1000000,
            doubleSided: false,
            computedNormals: false,
            useTexturePaths: true
        },
        {
            displayName: 'duck',
            fileName: 'duck.dae',
            path: 'duck',
            initialScale: 5000,
            maxScale: 10000,
            doubleSided: false,
            computedNormals: false,
            useTexturePaths: true
        },
        {
            displayName: 'cylinderEngine',
            fileName: '2_cylinder_engine.dae',
            path: '2_cylinder_engine',
            initialScale: 5000,
            maxScale: 10000,
            doubleSided: false,
            computedNormals: false,
            useTexturePaths: true
        },
        {
            displayName: 'reciprocatingSaw',
            fileName: 'Reciprocating_Saw.dae',
            path: 'Reciprocating_Saw',
            initialScale: 5000,
            maxScale: 10000,
            doubleSided: false,
            computedNormals: false,
            useTexturePaths: true
        },
        {
            displayName: 'gearbox',
            fileName: 'gearbox_assy.dae',
            path: 'gearbox_assy',
            initialScale: 10000,
            maxScale: 20000,
            doubleSided: false,
            computedNormals: false,
            useTexturePaths: true
        },
        {
            displayName: 'buggy',
            fileName: 'buggy.dae',
            path: 'buggy',
            initialScale: 5000,
            maxScale: 10000,
            doubleSided: false,
            computedNormals: false,
            useTexturePaths: true
        },
        {
            displayName: 'kmlBuilding',
            fileName: 'CU Macky.dae',
            path: 'kmlBuilding',
            initialScale: 500,
            maxScale: 1000,
            doubleSided: false,
            computedNormals: false,
            useTexturePaths: false
        },
        {
            displayName: 'bad normals double sided',
            fileName: 'bad_normals.dae',
            path: 'bad_normals',
            initialScale: 20000,
            maxScale: 40000,
            doubleSided: true,
            computedNormals: false,
            useTexturePaths: false
        },
        {
            displayName: 'bad normals computed normals',
            fileName: 'bad_normals.dae',
            path: 'bad_normals',
            initialScale: 20000,
            maxScale: 40000,
            doubleSided: false,
            computedNormals: true,
            useTexturePaths: false
        }
    ];

    createCombo();

    function createCombo() {
        for (var i = 0; i < colladaModels.length; i++) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = "#";
            a.text = colladaModels[i].displayName;
            a.onclick = selectModel;
            li.appendChild(a);
            modelsCombo.appendChild(li);
        }
    }

    function selectModel(event) {

        modelSelectorButton.innerHTML = this.text;

        var pos = colladaModels.map(function (model) {
            return model.displayName;
        }).indexOf(this.text);
        var model = colladaModels[pos];

        colladaLoader.init({dirPath: './Collada/collada_models/' + model.path + '/'});
        colladaLoader.load(model.fileName, function (scene) {

            console.log('scene', scene);

            if (scene) {
                scene.scale = model.initialScale;
                scene.altitudeMode = WorldWind.ABSOLUTE;
                scene.useTexturePaths = model.useTexturePaths;
                scene.doubleSided = model.doubleSided;
                scene.computedNormals = model.computedNormals;
                modelLayer.removeAllRenderables();
                modelLayer.addRenderable(scene);

                modelScene = scene;

                sliderScale.slider("option", "max", model.maxScale);
                sliderScale.slider("option", "value", model.initialScale);
                spanScale.html(model.initialScale);

                wwd.redraw();
            }

        });
    }

});
