/**
 * Created by Matthew on 8/10/2015.
 */
/*
* This module controls the behavior of each HUD assocated with an application.
 * Any application that uses the Hudmaker should use this module to manage them when called by the canvas.
 */

define(['HUDMaker'],
    function (HUDMaker) {
        var ApplicationHUDManager = function () {
            var self = this;
            this._displays = {}
        };

        ApplicationHUDManager.prototype.closeAll = function () {
            var self = this;
            for (var key in self._displays) {
                if (self._displays.hasOwnProperty(key)) {
                    var obj = self._displays[key];
                    if (obj instanceof HUDMaker){
                        obj.close()
                    }
                }
            }
        };

        ApplicationHUDManager.prototype.fadeAll = function () {
            var self = this;
            for (var key in self._displays) {
                if (self._displays.hasOwnProperty(key)) {
                    var obj = self._displays[key];
                    if (obj instanceof HUDMaker){
                        obj.DIV.fadeOut(10)
                    }
                }
            }
        };

        ApplicationHUDManager.prototype.unFadeAll = function () {
            var self = this;
            for (var key in self._displays) {
                if (self._displays.hasOwnProperty(key)) {
                    var obj = self._displays[key];
                    if (obj instanceof HUDMaker){
                        obj.DIV.fadeIn(10)
                    }
                }
            }
        };



        ApplicationHUDManager.prototype.subscribeHUD = function (hud) {
            if (!hud.HUDManager){
                hud.HUDManager = this;
            }
            this._displays[hud.ID] = hud
        };

        ApplicationHUDManager.prototype.unsubscribeHUD = function (hud) {
            if (hud.HUDManager){
                delete hud.HUDManager
            }
            delete this._displays[hud.ID]
        };

        return ApplicationHUDManager
    }
);