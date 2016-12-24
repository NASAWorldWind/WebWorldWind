/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
requirejs([
        '../src/WorldWind',
        './LayerManager'],
    function (ww,
              LayerManager) {

        // Tell World Wind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the World Window.
        var wwd = new WorldWind.WorldWindow("canvasOne");
        var layerManger;

        // Add imagery layers
        var layers = [
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }

        var dataJsonUrl = './data/analyticalSurfaces.json';
        var colorPaletteArray = [
            0.0,25.5,0.701,0.921,1.0, 1.0,
            25.5,51.0,1.0000,1.0000,0.9412, 1.0,
            51.0,76.5,1.0000,1.0000,0.8980, 1.0,
            76.5,102.0,0.9686,0.9882,0.7255, 1.0,
            102.0,127.5,0.8510,0.9412,0.6392, 1.0,
            127.5,153.0,0.6784,0.8667,0.5569, 1.0,
            153.0,175.5,0.2549,0.6706,0.3647, 1.0,
            175.5,204.0,0.1373,0.5176,0.2627, 1.0,
            204.0,229.5,0.0000,0.3529,0.1608, 1.0,
            229.5,255.0,0.0000,0.2706,0.1608, 1.0
        ];

        var sceneCounter = 0,
            loadingCounter = 0,
            analyticalSurfaceObjectArray = [],
            surfaceLayerArrayGlobal = [],
            isFirstSceneDraw = false,
            analyticalSurfaceDataObject;

        getDataJSON(dataJsonUrl);

        function getDataJSON(url) {
            var xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            xhr.onreadystatechange = (function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        analyticalSurfaceDataObject = JSON.parse(xhr.response);

                        $( "#scene-date" ).val(getStringDateFormat(analyticalSurfaceDataObject[0].filenameList[0]));

                        //console.log(analyticalSurfaceDataObject);
                        //show globe after loading first scene of each region (synchronous)
                        for(var i=0; i < analyticalSurfaceDataObject.length; i++) {
                            analyticalSurfaceDataObject[i].paragraphId = "p" + analyticalSurfaceDataObject[i].regionName;
                            analyticalSurfaceDataObject[i].loadingStatus = 0;
                            addLoadingStatusParagraph(
                                analyticalSurfaceDataObject[i].paragraphId,
                                analyticalSurfaceDataObject[i].regionName,
                                analyticalSurfaceDataObject[i].loadingStatus,
                                analyticalSurfaceDataObject[i].filenameList.length

                            );
                            getNDVIData(
                                analyticalSurfaceDataObject[i].url,
                                analyticalSurfaceDataObject[i].regionName,
                                analyticalSurfaceDataObject[i].filenameList[0],
                                true);
                        }
                    }
                    else {
                        console.log('retrieve failed');
                    }
                }
            });

            xhr.onerror = function () {
                console.log('error');
            };

            xhr.ontimeout = function () {
                console.log('timeout');
            };

            xhr.send(null);
        };

        function addLoadingStatusParagraph(paragraphId, regionName, loadingStatus, totalNoOfScenes){
            var newParagraph = document.createElement('p');
            newParagraph.setAttribute("id", paragraphId)
            newParagraph.textContent = "Loading " + regionName + ": " + loadingStatus + "/" + totalNoOfScenes;
            document.getElementById("surfacesStatus").appendChild(newParagraph);
        }

        function updateLoadingStatus(paragraphId, regionName, loadingStatus, totalNoOfScenes){
            $("#" + paragraphId).text("Loading " + regionName + ": " + loadingStatus + "/" + totalNoOfScenes);
        }

        function getNDVIData(url, regionName, filename, isFirstScene) {
            var url = url + filename;
            var xhr = new XMLHttpRequest();
            if (isFirstScene){
                xhr.open("GET", url, false);
            }
            else{
                xhr.open("GET", url, true);
            }

            xhr.onreadystatechange = (function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var dataArray = xhr.response.split('\n');

                        if (analyticalSurfaceObjectArray.filter(
                                function(e) {
                                    return e.regionName === regionName}
                            ).length === 0)
                        {
                            // Parse ESRI Grid file
                            var ncols = Number(dataArray.shift().replace(/  +/g, ' ').split(' ')[1]);
                            var nrows =  Number(dataArray.shift().replace(/  +/g, ' ').split(' ')[1]);
                            var xllcorner = Number(dataArray.shift().replace(/  +/g, ' ').split(' ')[1]);
                            var yllcorner = Number(dataArray.shift().replace(/  +/g, ' ').split(' ')[1]);
                            var cellsize = Number(dataArray.shift().replace(/  +/g, ' ').split(' ')[1]);
                            var ytlcorner = Number(yllcorner + nrows * cellsize);
                            var NODATA_value = dataArray.shift().replace(/  +/g, ' ').split(' ')[1];

                            // Create 2d context for images
                            var canvas = document.createElement("canvas");
                            canvas.width = ncols;
                            canvas.height = nrows;
                            var context2d = canvas.getContext("2d");
                            var imageData = context2d.createImageData(canvas.width, canvas.height);

                            analyticalSurfaceObjectArray.push(
                                {
                                    "regionName" : regionName,
                                    "width" : ncols,
                                    "height" : nrows,
                                    "referenceX" : xllcorner,
                                    "referenceY" : ytlcorner,
                                    "cellSize" : cellsize,
                                    "noDataValue" : NODATA_value,
                                    "imageList" : [
                                        {
                                            "filename" : filename,
                                            "dataArray" : dataArray,
                                            "imageData" : imageData
                                        }],
                                    "canvas" : canvas,
                                    "context2d" : context2d,
                                    "loadingStatus:" : 0
                                }
                            );

                            getImage(
                                dataArray,
                                regionName,
                                filename,
                                context2d,
                                imageData,
                                NODATA_value);
                        }
                        else
                        {
                            dataArray.splice(0, 6);

                            var index =  getIndexOfObjectsArrayByAttribute(
                                analyticalSurfaceObjectArray,
                                "regionName",
                                regionName);

                            var imageData = analyticalSurfaceObjectArray[index].context2d.createImageData(
                                analyticalSurfaceObjectArray[index].canvas.width,
                                analyticalSurfaceObjectArray[index].canvas.height);

                            analyticalSurfaceObjectArray[index].imageList.push(
                                {
                                    "filename" : filename,
                                    "dataArray" : dataArray,
                                    "imageData" : imageData
                                }
                            );

                            getImage(
                                dataArray,
                                regionName,
                                filename,
                                analyticalSurfaceObjectArray[index].context2d,
                                analyticalSurfaceObjectArray[index].imageList[
                                analyticalSurfaceObjectArray[index].imageList.length - 1].imageData,
                                analyticalSurfaceObjectArray[index].noDataValue);

                            analyticalSurfaceObjectArray[index].imageList.sort(compareFilename);
                        }
                    }
                    else {
                        console.log('retrieve failed');
                    }
                }
            });

            xhr.onerror = function () {
                console.log('error');
            };

            xhr.ontimeout = function () {
                console.log('timeout');
            };

            xhr.send(null);
        };

        function compareFilename(a,b) {
            if (a.filename < b.filename)
                return -1;
            if (a.filename > b.filename)
                return 1;
            return 0;
        }

        function createAnalyticalSurfaceLayer(analyticalSurfaceArray) {
            var surfaceLayerArray = [];
            for (var i = 0; i < analyticalSurfaceArray.length; i++){
                var analyticalSurfaceLayer = new WorldWind.RenderableLayer();
                analyticalSurfaceLayer.displayName = analyticalSurfaceArray[i].regionName;

                var surfaceImage = new WorldWind.SurfaceImage(
                    new WorldWind.Sector(
                        analyticalSurfaceArray[i].referenceY - analyticalSurfaceArray[i].height *
                        analyticalSurfaceArray[i].cellSize,
                        analyticalSurfaceArray[i].referenceY,
                        analyticalSurfaceArray[i].referenceX,
                        analyticalSurfaceArray[i].referenceX + analyticalSurfaceArray[i].width *
                        analyticalSurfaceArray[i].cellSize),
                    new WorldWind.ImageSource(analyticalSurfaceArray[i].canvas)
                );
                surfaceImage.displayName = analyticalSurfaceArray[i].regionName;
                analyticalSurfaceLayer.addRenderable(surfaceImage);
                surfaceLayerArray.push(analyticalSurfaceLayer);
            }
            return surfaceLayerArray;
        }

        function doGetNDVIDataAsync(j, k){
            setTimeout(function() {
                getNDVIData(
                    analyticalSurfaceDataObject[j].url,
                    analyticalSurfaceDataObject[j].regionName,
                    analyticalSurfaceDataObject[j].filenameList[k],
                    false);
            }, loadingCounter++ * 1000);
        }

        function getImage(dataArray, regionName, filename, context2d, imageData, noDataValue) {
            var worker = new Worker('CanvasWorker.js');

            worker.onmessage = function(e) {

                sceneCounter++;

                var regionIndex = getIndexOfObjectsArrayByAttribute(
                    analyticalSurfaceObjectArray,
                    "regionName",
                    regionName);
                var filenameIndex = getIndexOfObjectsArrayByAttribute(
                    analyticalSurfaceObjectArray[regionIndex].imageList,
                    "filename",
                    filename);
                analyticalSurfaceObjectArray[regionIndex].imageList[filenameIndex].imageData = e.data.imageData;
                analyticalSurfaceObjectArray[regionIndex].imageList[filenameIndex].dataArray = e.data.dataArray;

                analyticalSurfaceDataObject[regionIndex].loadingStatus++;

                //$( "#scene-slider" ).slider(
                //    "option",
                //    "max",
                //    analyticalSurfaceDataObject[regionIndex].loadingStatus - 1);

                updateLoadingStatus(
                    analyticalSurfaceDataObject[regionIndex].paragraphId,
                    analyticalSurfaceDataObject[regionIndex].regionName,
                    analyticalSurfaceDataObject[regionIndex].loadingStatus,
                    analyticalSurfaceDataObject[regionIndex].filenameList.length
                );

                if (sceneCounter === analyticalSurfaceDataObject.length && !isFirstSceneDraw){
                    context2d.putImageData(e.data.imageData, 0, 0);

                    surfaceLayerArrayGlobal = createAnalyticalSurfaceLayer(analyticalSurfaceObjectArray);

                    //add regions to select control
                    for(var i=0; i< surfaceLayerArrayGlobal.length; i++){
                        $('#select-region').append($('<option>', {
                            value: surfaceLayerArrayGlobal[i].displayName,
                            text: surfaceLayerArrayGlobal[i].displayName
                        }));
                        wwd.addLayer(surfaceLayerArrayGlobal[i]);
                    }

                    layerManger = new LayerManager(wwd);
                    layerManger.goToAnimator.goTo(new WorldWind.Position(41.77, 12.77, 40000));
                    isFirstSceneDraw = true;

                    //start load async other scenes
                    for(var j = 0; j < analyticalSurfaceDataObject.length; j++){
                        for(var k = 1; k < analyticalSurfaceDataObject[j].filenameList.length; k++){
                            doGetNDVIDataAsync(j, k);
                        }
                    }
                }else if (sceneCounter < analyticalSurfaceDataObject.length && !isFirstSceneDraw){
                    context2d.putImageData(e.data.imageData, 0, 0);
                }
            };

            worker.onerror = function(e) {
                alert('Error: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);
            };

            //start the worker
            worker.postMessage({
                'imageData': imageData,
                'dataArray': dataArray,
                'colorPaletteArray': colorPaletteArray,
                'regionName' : regionName,
                'filename' : filename,
                'noDataValue' : noDataValue
            });
        }

        function getStringDateFormat(filename){
            var dataField = filename.split("_")[4];
            return dataField.substring(0,4) + "/" + dataField.substring(4,6) + "/" + dataField.substring(6,8);
        }

        function changeTransparencyValue(value){
            for (var i=0; i < wwd.layers.length; i++ ){
                if (wwd.layers[i].displayName === ($( "#select-region" ).val())) {
                    for(var j=0; j < wwd.layers[i].renderables.length; j++){
                        wwd.layers[i].renderables[j].opacity = value;
                    }
                }
            }
            $( "#transparency" ).val( value );
        }

        function getIndexOfObjectsArrayByAttribute(array, attribute, attributeValue){
            return array.map(function(e) { return e[attribute]; }).indexOf(attributeValue);
        }

        function changeParamValues(value){
            for (var i=0; i < wwd.layers.length; i++ ){
                if (wwd.layers[i].displayName === ($( "#select-region" ).val())) {
                    var regionIndex = getIndexOfObjectsArrayByAttribute(
                        analyticalSurfaceObjectArray,
                        "regionName",
                        wwd.layers[i].displayName);
                    analyticalSurfaceObjectArray[regionIndex].context2d.putImageData(
                        analyticalSurfaceObjectArray[regionIndex].imageList[value].imageData,
                        0,
                        0);
                    wwd.layers[i].renderables[0].imageSource = new WorldWind.ImageSource(
                        analyticalSurfaceObjectArray[regionIndex].canvas);

                    var filename = analyticalSurfaceObjectArray[regionIndex].imageList[value].filename;
                    $( "#scene-date" ).val( getStringDateFormat(filename));

                    wwd.redraw();
                    break;
                }
            }
        }

        // The common pick-handling function.
        var handlePick = function (o) {
            // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
            // the mouse or tap location.
            var x = o.clientX,
                y = o.clientY;

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            var pickPoint = wwd.canvasCoordinates(x, y);
            var pickList = wwd.pick(pickPoint);

            if (pickList.objects.length > 0) {
                for (var p = 0; p < pickList.objects.length; p++) {
                    if (pickList.objects[p].userObject instanceof WorldWind.SurfaceImage) {
                        if (pickList.objects[p].userObject.displayName === ($( "#select-region" ).val())){
                            var index = getIndexOfObjectsArrayByAttribute(
                                analyticalSurfaceObjectArray,
                                "regionName",
                                pickList.objects[p].userObject.displayName);
                            var refLat = analyticalSurfaceObjectArray[index].referenceY;
                            var refLong = analyticalSurfaceObjectArray[index].referenceX;
                            var resolution = analyticalSurfaceObjectArray[index].cellSize;
                            var numColumns = analyticalSurfaceObjectArray[index].width;

                            var terrainObject = wwd.pickTerrain(pickPoint).terrainObject();
                            var pickLat = terrainObject.position.latitude;
                            var pickLong = terrainObject.position.longitude;

                            var deltaY = refLat - pickLat;
                            var deltaX = pickLong - refLong;

                            var colNo = Math.round(deltaX / resolution);
                            var rowNo = Math.round(deltaY / resolution);

                            var indexParam = rowNo * numColumns + colNo;

                            var data = [];
                            var xLabels = [];

                            for(var i=0; i < analyticalSurfaceObjectArray[index].imageList.length;i++ ){
                                if (analyticalSurfaceObjectArray[index].imageList[i].dataArray[indexParam] ===
                                    analyticalSurfaceObjectArray[index].noDataValue){
                                    data.push(0);
                                }
                                else{
                                    data.push(analyticalSurfaceObjectArray[index].imageList[i].dataArray[indexParam]);
                                }
                                xLabels.push(
                                    getStringDateFormat(analyticalSurfaceObjectArray[index].imageList[i].filename));
                            }

                            var m = [10, 60, 80, 60]; // margins
                            var w = 1000 - m[1] - m[3]; // width
                            var h = 300 - m[0] - m[2]; // height

                            var step = w / data.length;

                            var domainArray = [];
                            for (var i = 0; i < data.length; i ++){
                                domainArray.push(i * step);
                            }

                            var x = d3.scale.ordinal()
                                .domain(xLabels).range(domainArray);
                            var y = d3.scale.linear().domain([0, 255]).range([h, 0]);

                            var line = d3.svg.line()
                                .x(function(d,i) {
                                    return x(i);
                                })
                                .y(function(d) {
                                    return y(d);
                                });

                            d3.select("svg").remove();

                            var svg = d3.select("#graph").append("svg")
                                .attr("width", w + m[1] + m[3])
                                .attr("height", h + m[0] + m[2])
                                .append("svg:g")
                                .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

                            var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);

                            svg.append("svg:g")
                                .attr("class", "x axis")
                                .attr("transform", "translate(0," + h + ")")
                                .call(xAxis)
                                .selectAll("text")
                                .style("text-anchor", "end")
                                .attr("dx", "-.8em")
                                .attr("dy", ".15em")
                                .attr("transform", "rotate(-65)" );;

                            var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
                            svg.append("svg:g")
                                .attr("class", "y axis")
                                .attr("transform", "translate(-25,0)")
                                .call(yAxisLeft);

                            svg.append("svg:path").attr("d", line(data));
                        }
                    }
                }
            }
        };

        // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
        wwd.addEventListener("click", handlePick);

        // Listen for taps on mobile devices and highlight the placemarks that the user taps.
        var tapRecognizer = new WorldWind.TapRecognizer(wwd, handlePick);

        $( "#scene-slider" ).slider({
            orientation: "horizontal",
            range: "min",
            min: 0,
            max: 12,
            value: 0,
            slide: function( event, ui ) {
                changeParamValues(ui.value);
            }
        });

        $( "#transparency-slider" ).slider({
            orientation: "horizontal",
            range: "min",
            min: 0.0,
            max: 1.0,
            step: 0.01,
            value: 1.0,
            slide: function( event, ui ) {
                changeTransparencyValue(ui.value);
            }
        });
        $( "#transparency" ).val( 1.0 );

        $( "#select-region" ).change(function() {
            var str = "";
            $( "select option:selected" ).each(function() {
                str += $( this ).text();
            });

            if (str === "Sicily"){
                layerManger.goToAnimator.goTo(new WorldWind.Position(37.51, 14.00, 400000));
            }else if (str === "Rome"){
                layerManger.goToAnimator.goTo(new WorldWind.Position(41.77, 12.77, 40000));
            }

            for (var i=0; i < analyticalSurfaceObjectArray.length; i++){
                if (analyticalSurfaceObjectArray[i].regionName === str){
                    $( "#scene-slider" ).slider("option", "max", analyticalSurfaceObjectArray[i].imageList.length - 1);
                    break;
                }
            }
        });
    });