/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */

require(['../src/WorldWind', './LayerManager'], function (ww, LayerManager) {
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

    var computeBbox;

    sliderScale.slider({
        min: 0,
        max: 5000,
        value: 10,
        slide: function (event, ui) {
            spanScale.html(ui.value);
            modelScene.setScale(ui.value);
            if (computeBbox) {
                modelScene.computeBoundingBox();
            }
            wwd.redraw();
        }
    });

    sliderRotateX.slider({
        min: 0,
        max: 360,
        value: 0,
        slide: function (event, ui) {
            spanRotateX.html(ui.value);
            modelScene.setRotationX(ui.value);
            if (computeBbox) {
                modelScene.computeBoundingBox();
            }
            wwd.redraw();
        }
    });
    sliderRotateY.slider({
        min: 0,
        max: 360,
        value: 0,
        slide: function (event, ui) {
            spanRotateY.html(ui.value);
            modelScene.setRotationY(ui.value);
            if (computeBbox) {
                modelScene.computeBoundingBox();
            }
            wwd.redraw();
        }
    });
    sliderRotateZ.slider({
        min: 0,
        max: 360,
        value: 0,
        slide: function (event, ui) {
            spanRotateZ.html(ui.value);
            modelScene.setRotationZ(ui.value);
            if (computeBbox) {
                modelScene.computeBoundingBox();
            }
            wwd.redraw();
        }
    });

    WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

    var wwd = new WorldWind.WorldWindow("canvasOne");

    var layers = [
        {layer: new WorldWind.BMNGLayer(), enabled: true},
        {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
        {layer: new WorldWind.BingAerialLayer(null), enabled: false},
        {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: false},
        {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
        {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
        {layer: new WorldWind.CompassLayer(), enabled: true},
        {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
        {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
    ];

    for (var l = 0; l < layers.length; l++) {
        layers[l].layer.enabled = layers[l].enabled;
        wwd.addLayer(layers[l].layer);
    }

    // Create a layer manager for controlling layer visibility.
    var layerManger = new LayerManager(wwd);

    var modelLayer = new WorldWind.RenderableLayer("model");
    wwd.addLayer(modelLayer);
    var position = new WorldWind.Position(45, -100, 1000e3);
    var modelScene = new WorldWind.Scene(position);

    var colladaModels = [
        {
            displayName: 'box',
            fileName: 'box.dae',
            path: 'box',
            initialScale: 500000,
            maxScale: 1000000,
            localTransform: true
        },
        {
            displayName: 'boxWithoutIndices',
            fileName: 'boxWithoutIndices.dae',
            path: 'boxWithoutIndices',
            initialScale: 500000,
            maxScale: 1000000,
            localTransform: true
        },
        {
            displayName: 'boxTextured',
            fileName: 'CesiumTexturedBoxTest.dae',
            path: 'boxTextured',
            initialScale: 500000,
            maxScale: 1000000,
            localTransform: true
        },
        {
            displayName: 'boxSemantics',
            fileName: 'boxSemantics.dae',
            path: 'boxSemantics',
            initialScale: 500000,
            maxScale: 1000000,
            localTransform: true
        },
        {
            displayName: 'duck',
            fileName: 'duck.dae',
            path: 'duck',
            initialScale: 5000,
            maxScale: 10000,
            localTransform: true
        },
        {
            displayName: 'cylinderEngine',
            fileName: '2_cylinder_engine.dae',
            path: '2_cylinder_engine',
            initialScale: 5000,
            maxScale: 10000,
            localTransform: true
        },
        {
            displayName: 'reciprocatingSaw',
            fileName: 'Reciprocating_Saw.dae',
            path: 'Reciprocating_Saw',
            initialScale: 5000,
            maxScale: 10000,
            localTransform: true
        },
        {
            displayName: 'gearbox',
            fileName: 'gearbox_assy.dae',
            path: 'gearbox_assy',
            initialScale: 10000,
            maxScale: 20000,
            localTransform: true
        },
        {
            displayName: 'buggy',
            fileName: 'buggy.dae',
            path: 'buggy',
            initialScale: 5000,
            maxScale: 10000,
            localTransform: true
        },
        {
            displayName: 'boxAnimated',
            fileName: 'boxAnimated.dae',
            path: 'boxAnimated',
            initialScale: 500000,
            maxScale: 1000000,
            localTransform: true
        },
        {
            displayName: 'cesiumMilkTruck',
            fileName: 'CesiumMilkTruck.dae',
            path: 'CesiumMilkTruck',
            initialScale: 500000,
            maxScale: 1000000,
            localTransform: true
        },
        {
            displayName: 'kmlBuilding',
            fileName: 'CU Macky.dae',
            path: 'kmlBuilding',
            initialScale: 500,
            maxScale: 1000,
            localTransform: true
        },
        {
            displayName: 'S1-A simple',
            fileName: 'sentinel1.dae',
            path: 's1a_simple',
            initialScale: 2000,
            maxScale: 1000000,
            localTransform: false
        },
        {
            displayName: 'S2-A simple',
            fileName: 'satellite_2_blender_center1.dae',
            path: 's2a_simple',
            initialScale: 5000000,
            maxScale: 10000000,
            localTransform: true
        },
        {
            displayName: 'S3-A simple',
            fileName: 'sentinel_3_no_textures.dae',
            path: 's3a_simple',
            initialScale:  500000,
            maxScale: 10000000,
            localTransform: true
        },
        {
            displayName: 'S1-A complex',
            fileName: 'Sentinel1ver12.dae',
            path: 's1a_complex',
            initialScale: 300000,
            maxScale: 1000000,
            localTransform: true
        },
        {
            displayName: 'S2-A complex',
            fileName: 'sentinel_2.dae',
            path: 's2a_complex',
            initialScale: 500000,
            maxScale: 1000000,
            localTransform: true
        },
        {
            displayName: 'S3-A complex',
            fileName: 'sentinel_3.dae',
            path: 's3a_complex',
            initialScale: 500000,
            maxScale: 1000000,
            localTransform: true
        },
        {
            displayName: 'S1-A other',
            fileName: 'sentinel1.dae',
            path: 's1a_other',
            initialScale: 500000,
            maxScale: 1000000,
            localTransform: true
        },
        {
            displayName: 'S2-A other',
            fileName: 'Sentinel2.dae',
            path: 's2a_other',
            initialScale: 500000,
            maxScale: 1000000,
            localTransform: true
        },
    ];

    var colladaLoader = new WorldWind.ColladaLoader();

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

        colladaLoader.init({filePath: './collada_models/' + model.path + '/'});
        colladaLoader.load(model.fileName, function (sceneData) {

            console.log('sceneData', sceneData);

            modelScene.add(sceneData);
            modelScene.setScale(model.initialScale);
            modelScene.useLocalTransforms(model.localTransform);

            modelLayer.addRenderable(modelScene);

            sliderScale.slider("option", "max", model.maxScale);
            sliderScale.slider("option", "value", model.initialScale);
            spanScale.html(model.initialScale);

        });
    }

});
