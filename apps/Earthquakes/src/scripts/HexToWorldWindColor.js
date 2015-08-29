define([''], function(ww) {


    'use strict';

    function HexToWorldWindColor(hex) {

        var red = parseInt('0x' + hex.charAt(1) + hex.charAt(2)) / 255;
        var blue = parseInt('0x' +hex.charAt(3) + hex.charAt(4)) / 255;
        var green = parseInt('0x' +hex.charAt(5) + hex.charAt(6)) / 255;
        return new WorldWind.Color(red, blue, green);
    }

    return HexToWorldWindColor;

});