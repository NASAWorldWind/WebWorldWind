/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
/**
 * @exports Compass
 */
define([
    '../error/ArgumentError',
    '../util/Color',
    '../util/Logger',
    '../util/Offset',
    '../shapes/ScreenImage',
    '../shapes/ScreenText',
    '../shapes/TextAttributes'
],
function (ArgumentError,
          Color,
          Logger,
          Offset,
          ScreenImage,
          ScreenText,
          TextAttributes) {
    "use strict";

    /**
     * Constructs a WorldWind logo attribution.
     * @alias WorldWindLogo
     * @constructor
     * @augments ScreenImage
     * @classdesc Displays the official WorldWind logo in the WorldWindow. Its position is specified in WorldWind's configuration.
     * @param {Offset} logoScreenOffset The offset indicating the image's placement on the screen. If null or undefined
     * the compass is placed at the position stated in WorldWind's configuration.
     * Use [the image offset property]{@link ScreenImage#imageOffset} to position the image relative to the
     * screen point.
     * @param {String} imagePath The URL of the image to display. If null or undefined, a default logo image is used.
     */
    var WorldWindLogo = function (logoScreenOffset, imagePath) {

        var sOffset = logoScreenOffset ? logoScreenOffset
            : new Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 1),
            iPath = imagePath ? imagePath : WorldWind.configuration.baseUrl + "images/worldwind-logo.png";

        ScreenImage.call(this, sOffset, iPath);

        // Must set the configured image offset after calling the constructor above.

        if (!logoScreenOffset) {
            this.imageOffset = new Offset(WorldWind.OFFSET_PIXELS, -7, WorldWind.OFFSET_INSET_PIXELS, -7);
        }
        
        // Create version number ScreenText to display it to the right of the logo.

        this.versionTextScreenOffset = new Offset(WorldWind.OFFSET_FRACTION, 0, WorldWind.OFFSET_FRACTION, 1);
        this.versionText = new ScreenText(this.versionTextScreenOffset, WorldWind.VERSION);
        
        // Colors and outline width are configured to match the logo appearance.
        this.versionText.attributes = new TextAttributes(null);
        this.versionText.attributes.color = new Color(0, 0, 0, 0.5);
        this.versionText.attributes.outlineColor = new Color(1, 1, 1, 0.5);
        this.versionText.attributes.outlineWidth = 3;
        this.versionText.attributes.scale = 1;

        // TODO Compute version text offset with respect to the logo instead of the hardcoding it.
        this.versionText.attributes.offset = new Offset(WorldWind.OFFSET_PIXELS, -117, WorldWind.OFFSET_INSET_PIXELS, -10);
    };

    WorldWindLogo.prototype = Object.create(ScreenImage.prototype);

    WorldWindLogo.prototype.render = function (dc) {

        ScreenImage.prototype.render.call(this, dc);
        this.versionText.render(dc);
    };

    return WorldWindLogo;
})
;