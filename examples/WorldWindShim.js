/**
 * This shim is used to switch between the individual WorldWind source files and the minified single file library for
 * the WorldWind module. Switching allows locally developed examples to run from the individual WorldWind source files
 * and hosted examples to use the faster to download minified library. A shim is not required for the use of WorldWind.
 * The minified library (worldwind.min.js) is recommended for use in deployed applications.
 */
// Run 'npm run build-webpack' to generate alternate Webpack-bundled library
// then uncomment line below and comment the next line to test examples.
// define(['../build/dist/WorldWindWebpack'], function (WorldWind) {
define(['../src/WorldWind'], function (WorldWind) {
   "use strict";

   return WorldWind;
});
