/**
 * This shim is used to switch between the individual files of WorldWind source and the minified library. It is
 * not required for the use of WorldWind.
 */
define(['../src/WorldWind'], function (WorldWind) {
   "use strict";

   return WorldWind;
});
