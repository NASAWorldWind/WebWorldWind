/*
 * Copyright 2015-2018 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
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
 * @exports StatsDisplayLayer
 */
define(['../../src/WorldWind'
    ],
    function (WorldWind) {
        "use strict";

        var StatsDisplayLayer = function (worldWindow) {
            WorldWind.Layer.call(this, "Stats");

            this.wwd = worldWindow;
            this.pickEnabled = false;
            this.statistics = [];
            this.textAttrs = new WorldWind.TextAttributes(null);
            this.textAttrs.color = WorldWind.Color.YELLOW;
            this.textHeight=24;
            this.labelWidth=128;
            this.dataWidth=64;
            this.textX=this.labelWidth;
            this.textY=this.textHeight;
        };

        StatsDisplayLayer.prototype = Object.create(WorldWind.Layer.prototype);

        StatsDisplayLayer.prototype.addStatistic = function (label, valueFunction) {
            var statLabel = new WorldWind.ScreenText(new WorldWind.Offset(WorldWind.OFFSET_PIXELS, this.textX/2, WorldWind.OFFSET_INSET_PIXELS, this.textY), label);
            statLabel.attributes = this.textAttrs;
            var statObject={label: statLabel};
            if (valueFunction) {
                var statText=new WorldWind.ScreenText(new WorldWind.Offset(WorldWind.OFFSET_PIXELS, this.textX+this.dataWidth/2, WorldWind.OFFSET_INSET_PIXELS, this.textY), " ");
                statText.attributes = this.textAttrs;
                statObject.statText=statText;
                statObject.statFunction=valueFunction;
            }
            this.statistics.push(statObject);
            this.textY+=this.textHeight;
        };

        StatsDisplayLayer.prototype.addLabel = function (label) {
            this.addStatistic(label,null);
        };

        // Documented in superclass.
        StatsDisplayLayer.prototype.doRender = function (dc) {
            for (var i = 0, n = this.statistics.length; i < n; i++) {
                var stat = this.statistics[i];
                stat.label.render(dc);
                if (stat.statText) {
                    stat.statText.text=stat.statFunction();
                    stat.statText.render(dc);
                }
            }

            // var terrainPos = this.terrainPosition,
            //     eyePos = dc.eyePosition,
            //     canvasWidth = dc.currentGlContext.canvas.clientWidth,
            //     x, y, yUnitsScreen, yUnitsText, hideEyeAlt;
            //
            // if (canvasWidth > 650) { // large canvas, align the text with bottom center
            //     x = (canvasWidth / 2) - 50;
            //     y = 5;
            //     yUnitsScreen = WorldWind.OFFSET_PIXELS;
            //     yUnitsText = 0;
            // } else if (canvasWidth > 400) { // medium canvas, align the text in the top left
            //     x = 60;
            //     y = 5;
            //     yUnitsScreen = WorldWind.OFFSET_INSET_PIXELS;
            //     yUnitsText = 1;
            // } else { // small canvas, suppress the eye altitude, align the text in the top left and suppress eye alt
            //     x = 60;
            //     y = 5;
            //     yUnitsScreen = WorldWind.OFFSET_INSET_PIXELS;
            //     yUnitsText = 1;
            //     hideEyeAlt = true;
            // }
            //
            // // TODO can we control terrain position visibility with Text's targetVisibility?
            // this.latText.text = terrainPos ? this.formatLatitude(terrainPos.latitude) : null;
            // this.latText.screenOffset = new WorldWind.Offset(WorldWind.OFFSET_PIXELS, x, yUnitsScreen, y);
            // this.latText.attributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, yUnitsText);
            // this.latText.render(dc);
            //
            // x += 70;
            // this.lonText.text = terrainPos ? this.formatLongitude(terrainPos.longitude) : null;
            // this.lonText.screenOffset = new WorldWind.Offset(WorldWind.OFFSET_PIXELS, x, yUnitsScreen, y);
            // this.lonText.attributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, yUnitsText);
            // this.lonText.render(dc);
            //
            // if (!dc.globe.is2D()) {
            //     x += 70;
            //     this.elevText.text = terrainPos ? this.formatAltitude(terrainPos.altitude, "m") : null;
            //     this.elevText.screenOffset = new WorldWind.Offset(WorldWind.OFFSET_PIXELS, x, yUnitsScreen, y);
            //     this.elevText.attributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 1, WorldWind.OFFSET_FRACTION, yUnitsText);
            //     this.elevText.render(dc);
            // }
            //
            // // TODO can we control eye altitude visibility with Text's targetVisibility?
            // if (!hideEyeAlt) {
            //     x += 40;
            //     this.eyeText.text = "Eye  " + this.formatAltitude(eyePos.altitude, eyePos.altitude < 1000 ? "m" : "km");
            //     this.eyeText.screenOffset = new WorldWind.Offset(WorldWind.OFFSET_PIXELS, x, yUnitsScreen, y);
            //     this.eyeText.attributes.offset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, yUnitsText);
            //     this.eyeText.render(dc);
            // }

            this.inCurrentFrame = true;
        };

        return StatsDisplayLayer;
    });