/**
 * Created by Florin on 29-Nov-15.
 */

requirejs(['../src/WorldWind',
		'./LayerManager'],
	function (ww,
			  LayerManager) {
		"use strict";

		var bboxBtn = $("#bbox");

		var sliderY = $("#sliderY");
		var sliderZ = $("#sliderZ");

		var sliderRotateXBox = $("#sliderRotateXBox");
		var sliderRotateYBox = $("#sliderRotateYBox");
		var sliderRotateZBox = $("#sliderRotateZBox");

		var sliderRotateXDuck = $("#sliderRotateXDuck");
		var sliderRotateYDuck = $("#sliderRotateYDuck");
		var sliderRotateZDuck = $("#sliderRotateZDuck");

		var sliderScaleEngine = $('#sliderScaleEngine');
		var sliderRotateXEngine = $('#sliderRotateXEngine');
		var sliderRotateYEngine = $('#sliderRotateYEngine');
		var sliderRotateZEngine = $('#sliderRotateZEngine');

		var scaleSpanBox = $("#scaleSpanBox");
		var scaleSpanDuck = $("#scaleSpanDuck");
		var scaleSpanEngine = $('#scaleSpanEngine');

		var spanRotateXBox = $("#spanRotateXBox");
		var spanRotateYBox = $("#spanRotateYBox");
		var spanRotateZBox = $("#spanRotateZBox");

		var spanRotateXDuck = $("#spanRotateXDuck");
		var spanRotateYDuck = $("#spanRotateYDuck");
		var spanRotateZDuck = $("#spanRotateZDuck");

		var spanRotateXEngine = $('#spanRotateXEngine');
		var spanRotateYEngine = $('#spanRotateYEngine');
		var spanRotateZEngine = $('#spanRotateZEngine');

		var xValue, yValue, zValue;
		var boxSceneScale = 500000;
		var duckSceneScale = 5000;
		var engineScale = 2000;

        var computeBbox = false;

		bboxBtn.on('click',function(event){
			if (this.checked) {

                computeBbox = true;

				boxScene.computeBoundingBox();
				duckScene.computeBoundingBox();
				engineScene.computeBoundingBox();

				bboxLayer.addRenderable(boxScene.boundingBox);
				bboxLayer.addRenderable(duckScene.boundingBox);
				bboxLayer.addRenderable(engineScene.boundingBox);
			}
			else {
                computeBbox = false;
				bboxLayer.removeAllRenderables();
			}
		});

		sliderY.slider({
			min: 0,
			max: 1000,
			value: boxSceneScale / 1000,
			slide: function( event, ui ) {
				yValue = ui.value * 1000;
				scaleSpanBox.html(yValue.toLocaleString());
				boxScene.setScale(yValue);
                if (computeBbox){
                    boxScene.computeBoundingBox();
                }
				wwd.redraw();
			}
		});
		sliderZ.slider({
			min: 0,
			max: 10000,
			value: duckSceneScale,
			slide: function( event, ui ) {
				zValue = ui.value;
				scaleSpanDuck.html(zValue.toLocaleString());
				duckScene.setScale(zValue);
                if (computeBbox){
                    duckScene.computeBoundingBox();
                }
				wwd.redraw();
			}
		});

		sliderRotateXBox.slider({
			min:0,
			max:360,
			value:0,
			slide: function(event, ui){
				spanRotateXBox.html(ui.value);
				boxScene.setRotationX(ui.value);
                if (computeBbox){
                    boxScene.computeBoundingBox();
                }
				wwd.redraw();
			}
		});
		sliderRotateYBox.slider({
			min:0,
			max:360,
			value:0,
			slide: function(event, ui){
				spanRotateYBox.html(ui.value);
				boxScene.setRotationY(ui.value);
                if (computeBbox){
                    boxScene.computeBoundingBox();
                }
				wwd.redraw();
			}
		});
		sliderRotateZBox.slider({
			min:0,
			max:360,
			value:0,
			slide: function(event, ui){
				spanRotateZBox.html(ui.value);
				boxScene.setRotationZ(ui.value);
                if (computeBbox){
                    boxScene.computeBoundingBox();
                }
				wwd.redraw();
			}
		});

		sliderRotateXDuck.slider({
			min:0,
			max:360,
			value:0,
			slide: function(event,ui){
				spanRotateXDuck.html(ui.value);
				duckScene.setRotationX(ui.value);
                if (computeBbox){
                    duckScene.computeBoundingBox();
                }
				wwd.redraw();
			}
		});
		sliderRotateYDuck.slider({
			min:0,
			max:360,
			value:0,
			slide: function(event,ui){
				spanRotateYDuck.html(ui.value);
				duckScene.setRotationY(ui.value);
                if (computeBbox){
                    duckScene.computeBoundingBox();
                }
				wwd.redraw();
			}
		});
		sliderRotateZDuck.slider({
			min:0,
			max:360,
			value:0,
			slide: function(event,ui){
				spanRotateZDuck.html(ui.value);
				duckScene.setRotationZ(ui.value);
                if (computeBbox){
                    duckScene.computeBoundingBox();
                }
				wwd.redraw();
			}
		});

		sliderScaleEngine.slider({
			min:0,
			max:2000,
			value:engineScale,
			slide: function(event,ui){
				scaleSpanEngine.html(ui.value.toLocaleString());
				engineScene.setScale(ui.value);
                if (computeBbox){
                    engineScene.computeBoundingBox();
                }
				wwd.redraw();
			}
		});
		sliderRotateXEngine.slider({
			min:0,
			max:360,
			value:0,
			slide: function(event, ui){
				spanRotateXEngine.html(ui.value);
				engineScene.setRotationX(ui.value);
                if (computeBbox){
                    engineScene.computeBoundingBox();
                }
				wwd.redraw();
			}
		});
		sliderRotateYEngine.slider({
			min:0,
			max:360,
			value:0,
			slide: function(event, ui){
				spanRotateYEngine.html(ui.value);
				engineScene.setRotationY(ui.value);
                if (computeBbox){
                    engineScene.computeBoundingBox();
                }
				wwd.redraw();
			}
		});
		sliderRotateZEngine.slider({
			min:0,
			max:360,
			value:0,
			slide: function(event, ui){
				spanRotateZEngine.html(ui.value);
				engineScene.setRotationZ(ui.value);
                if (computeBbox){
                    engineScene.computeBoundingBox();
                }
				wwd.redraw();
			}
		});

		scaleSpanBox.html(boxSceneScale.toLocaleString());
		scaleSpanDuck.html(duckSceneScale.toLocaleString());
		scaleSpanEngine.html(engineScale.toLocaleString());

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

		var bboxLayer = new WorldWind.RenderableLayer("bboxLayer");
		wwd.addLayer(bboxLayer);

		var boxLayer = new WorldWind.RenderableLayer("box");
		wwd.addLayer(boxLayer);
		var position = new WorldWind.Position(45, -100, 1000e3);
		var boxScene = new WorldWind.Scene(position);
		boxScene.setScale(boxSceneScale);

		var colladaLoader = new WorldWind.ColladaLoader();
		colladaLoader.init({filePath: './data/'});
		colladaLoader.load('box.dae', function (sceneData) {
			console.log('box', sceneData);
			boxScene.add(sceneData);
			boxLayer.addRenderable(boxScene);
		});

		var placemarkLayer = new WorldWind.RenderableLayer("placemark");
		wwd.addLayer(placemarkLayer);

		var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

		placemarkAttributes.imageScale = 1;
		placemarkAttributes.imageOffset = new WorldWind.Offset(
				WorldWind.OFFSET_FRACTION, 0.3,
				WorldWind.OFFSET_FRACTION, 0.0);
		placemarkAttributes.imageColor = WorldWind.Color.WHITE;
		placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
				WorldWind.OFFSET_FRACTION, 0.5,
				WorldWind.OFFSET_FRACTION, 1.0);
		placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
		placemarkAttributes.drawLeaderLine = false;
		placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;
		placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/pushpins/" + "plain-blue.png";

		var placemark = new WorldWind.Placemark(position, true, null);
		placemark.label = "Placemark " + "\n"
				+ "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n"
				+ "Lon " + placemark.position.longitude.toPrecision(5).toString();
		placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
		placemark.attributes = placemarkAttributes;

		var highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
		highlightAttributes.imageScale = 1.2;
		placemark.highlightAttributes = highlightAttributes;

		placemarkLayer.addRenderable(placemark);


		var duckLayer = new WorldWind.RenderableLayer("duck");
		wwd.addLayer(duckLayer);
		var position1 = new WorldWind.Position(20, -100, 1000e3);
		var duckScene = new WorldWind.Scene(position1);
		duckScene.setScale(duckSceneScale);
		//duckScene.setRotationZ(6);

		var colladaLoader2 = new WorldWind.ColladaLoader();
        colladaLoader2.init({filePath: './data/'});
        colladaLoader2.load('duck.dae', function (sceneData) {
			console.log('duck', sceneData);
			duckScene.add(sceneData);
			duckLayer.addRenderable(duckScene);
		});

		var placemark1 = new WorldWind.Placemark(position1, true, null);
		placemark1.label = "Placemark " + "\n"
			+ "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n"
			+ "Lon " + placemark.position.longitude.toPrecision(5).toString();
		placemark1.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
		placemark1.attributes = placemarkAttributes;
		placemark1.highlightAttributes = highlightAttributes;

		placemarkLayer.addRenderable(placemark1);

		var engineLayer = new WorldWind.RenderableLayer("satellite");
		wwd.addLayer(engineLayer);
		var position3 = new WorldWind.Position(0, -100, 1000e3);
		var engineScene = new WorldWind.Scene(position3);
		engineScene.setScale(engineScale);
		var colladaLoader3 = new WorldWind.ColladaLoader();
		colladaLoader3.init({filePath: './data/'});
		colladaLoader3.load('2_cylinder_engine.dae', function (sceneData) {
			console.log('engine', sceneData);
			engineScene.add(sceneData);
			engineLayer.addRenderable(engineScene);
		});

		var placemark2 = new WorldWind.Placemark(position3, true, null);
		placemark2.label = "Placemark " + "\n"
				+ "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n"
				+ "Lon " + placemark.position.longitude.toPrecision(5).toString();
		placemark2.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
		placemark2.attributes = placemarkAttributes;
		placemark2.highlightAttributes = highlightAttributes;

		placemarkLayer.addRenderable(placemark2);

	});