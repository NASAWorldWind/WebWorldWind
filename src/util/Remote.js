/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
define([
    '../error/ArgumentError',
    './Logger',
    './Promise'
], function (
    ArgumentError,
    Logger,
    Promise
) {
    "use strict";
    var Remote = function(options) {
        // Returns promise.
        if(options.ajax) {
            return this.ajax(options.url, options);
        } else if(options.zip) {
            options.responseType = options.responseType || "arraybuffer";
            return this.ajax(options.url, options);
        } else {
            throw new ArgumentError(
                Logger.logMessage(Logger.LEVEL_SEVERE, "RemoteDocument", "constructor",
                    "Invalid option for retrieval specified. Use either ajax or zip option.")
            );
        }
    };

    Remote.prototype.ajax = function(url, options) {
        // Return promise.
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.open("GET", url, true);
            if (options.responseType) {
                xhr.responseType = options.responseType;
            }
            xhr.onreadystatechange = (function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var text = this.responseText;
                        resolve(text);
                    }
                    else {
                        Logger.log(Logger.LEVEL_WARNING,
                            "KmlFile retrieval failed (" + xhr.statusText + "): " + url);
                    }
                }
            });

            xhr.onerror = (function () {
                Logger.log(Logger.LEVEL_WARNING, "Remote file retrieval failed: " + url);

                reject();
            }).bind(this);

            xhr.ontimeout = (function () {
                Logger.log(Logger.LEVEL_WARNING, "Remote file retrieval timed out: " + url);

                reject();
            }).bind(this);

            xhr.send(null);
        });
    };

    return Remote;
});