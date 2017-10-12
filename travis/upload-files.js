var http = require("https");
var fs = require("fs");

var minifiedFileOptions = {
    "method": "PUT",
    "hostname": "files.worldwind.arc.nasa.gov",
    "port": null,
    "path": "/artifactory/generic-local/webworldwind/worldwind/worldwind-" + process.env.TRAVIS_TAG.slice(1) + ".min.js",
    "headers": {
        "authorization": process.env.FILES_API_KEY,
        "cache-control": "no-cache"
    }
};

var debugFileOptions = {
    "method": "PUT",
    "hostname": "files.worldwind.arc.nasa.gov",
    "port": null,
    "path": "/artifactory/generic-local/webworldwind/worldwind/worldwind-" + process.env.TRAVIS_TAG.slice(1) + ".js",
    "headers": {
        "authorization": process.env.FILES_API_KEY,
        "cache-control": "no-cache"
    }
};

/**
 * A simple request callback which concatenates the response and logs to the console.
 * @param res
 */
var requestCallback = function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
    });
};

/**
 * Reads a file from disk and submits it content hosting service.
 * @param filename
 * @param options
 */
var pushRequestToServer = function (filename, options) {
    var req = http.request(options, requestCallback);
    fs.readFile(filename, function (err, data) {
        if (err) {
            console.log(err);
        }

        req.write(data);
        req.end();
    });
};

// Submitting files to the content hosting service
pushRequestToServer("worldwind.min.js", minifiedFileOptions);
pushRequestToServer("worldwind.js", debugFileOptions);
