/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @exports CompassLayer
 * @version $Id: CompassLayer.js 2978 2015-04-03 22:55:55Z tgaskins $
 */
define([
        '../shapes/Compass',
        '../layer/RenderableLayer'
    ],
    function (Compass,
              RenderableLayer) {
        "use strict";

        /**
         * Constructs a compass layer.
         * @alias CompassLayer
         * @constructor
         * @augments RenderableLayer
         * @classdesc Displays a compass. Compass layers cannot be shared among World Windows. Each World Window if it
         * is to have a compass layer must have its own. See the MultiWindow example for guidance.
         */
        var CompassLayer = function () {
            RenderableLayer.call(this, "Compass");

            this._compass = new Compass(null, null);

            this.addRenderable(this._compass);
        };

        CompassLayer.prototype = Object.create(RenderableLayer.prototype);

        Object.defineProperties(CompassLayer.prototype, {
            /**
             * The compass to display.
             * @type {Compass}
             * @default {@link Compass}
             * @memberof CompassLayer.prototype
             */
            compass: {
                get: function () {
                    return this._compass;
                },
                set: function (compass) {
                    if (compass && compass instanceof Compass) {
                        this.removeAllRenderables();
                        this.addRenderable(compass);
                        this._compass = compass;
                    }
                }
            }
        });

        return CompassLayer;
    });