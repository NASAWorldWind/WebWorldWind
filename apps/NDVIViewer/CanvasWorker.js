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

// Set RGBA values for a pixel
function setPixel(imageData, x, y, r, g, b, a) {
    var index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}

// Set ImageData for the canvas
function setImageData(dataArray, imageData, colorPaletteArray, regionName, filename, noDataValue) {
    var newDataArray = [];
    for (var rowNo = 0; rowNo < dataArray.length; rowNo++) {
        var col = dataArray[rowNo].trim().split(' ');
        if (col.length > 1) {
            for (var colNo = 0; colNo < col.length; colNo++) {
                newDataArray.push(col[colNo]);
                var r, g, b, a;
                if (col[colNo] === noDataValue || col[colNo] === 255) {
                    r = colorPaletteArray[2] * 255;
                    g = colorPaletteArray[3] * 255;
                    b = colorPaletteArray[4] * 255;
                    a = colorPaletteArray[5] * 255;
                    setPixel(imageData, colNo, rowNo, r, g, b, a);
                }
                else {
                    for (var k = 0; k < colorPaletteArray.length; k += 6) {
                        if (col[colNo] >= colorPaletteArray[k] && col[colNo] <= colorPaletteArray[k + 1]) {
                            r = colorPaletteArray[k + 2] * 255;
                            g = colorPaletteArray[k + 3] * 255;
                            b = colorPaletteArray[k + 4] * 255;
                            a = colorPaletteArray[k + 5] * 255;
                            setPixel(imageData, colNo, rowNo, r, g, b, a);
                            break;
                        }
                    }
                }
            }
        }
    }

    self.postMessage(
        {
            'imageData': imageData,
            'regionName': regionName,
            'filename': filename,
            'dataArray': newDataArray
        });

    imageData = null;
}

self.onmessage = function (e) {
    var imageData = e.data.imageData;
    var dataArray = e.data.dataArray;
    var colorPaletteArray = e.data.colorPaletteArray;
    var regionName = e.data.regionName;
    var filename = e.data.filename;
    var noDataValue = e.data.noDataValue;
    setImageData(dataArray, imageData, colorPaletteArray, regionName, filename, noDataValue);
};