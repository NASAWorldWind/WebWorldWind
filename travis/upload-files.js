var http = require("https");
var fs = require("fs");

var version;
if (!process.env.TRAVIS_TAG || !process.env.TRAVIS_TAG.startsWith("v")) {
    console.error("invalid version tag");
    process.exit(101);
} else {
    version = process.env.TRAVIS_TAG.slice(1);
}

if (!process.env.FILES_API_KEY) {
    console.error("missing file server api key");
    process.exit(102);
}

/**
 * Sends a file to the server
 * @param filename the local filename of the file to send
 * @param options an object defining the method, hostname, port, path, and headers
 */
var sendFileToServer = function (filename, options) {

    var req = http.request(options, onRequest);
    fs.readFile(filename, function (err, data) {
        if (err) {
            console.log(err);
        }

        req.write(data);
        req.end();
    });
};

/**
 * Sends all of the files from a directory to a server. Recursively traverses the provided starting directory.
 * @param filename the local filename of the directory to start
 */
var sendDirectoryToServer = function (filename) {
    fs.readdir(filename, onReadDirectory(filename).processFiles);
};

/**
 * Creates the boilerplate options given the desired upload path
 * @param filename
 * @returns {{method: string, hostname: string, port: null, path: string, headers: {authorization: *, cache-control: string}}}
 */
var createRequestOptions = function (filename) {

    var options = {
        "method": "PUT",
        "hostname": "files.worldwind.arc.nasa.gov",
        "port": null,
        "path": "/artifactory/generic-local/webworldwind/" + filename,
        "headers": {
            "authorization": process.env.FILES_API_KEY,
            "cache-control": "no-cache"
        }
    };

    return options;
};

/**
 * The callback for the request method. Processes the response from the server and displays the results.
 * @param res
 */
var onRequest = function (res) {
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
 * The callback for reading a directory. Traverses the files provided in the callback and checks if the path is a file
 * or directory.
 * @param baseDirectory
 * @returns {{processFiles: processFiles}}
 */
var onReadDirectory = function (baseDirectory) {
    var directory = baseDirectory;
    return {
        processFiles: function (err, files) {
            if (err) {
                console.error(err);
                return;
            }

            for (var i = 0, len = files.length; i < len; i++) {
                var fullFilename = directory + "/" + files[i];
                fs.stat(fullFilename, onFileStats(fullFilename, "assets/" + version).processFile);
            }
        }
    }
};

/**
 * The callback for determining if a path refers to a file or directory. Process the path depending on type.
 * @param filename
 * @returns {{processFile: processFile}}
 */
var onFileStats = function (filename, uploadPath) {
    var fn = filename;
    var upload = uploadPath;
    return {
        processFile:  function (err, stat) {
            if (err) {
                console.error(err);
                return;
            }

            if (stat.isDirectory()) {
                sendDirectoryToServer(fn);
            } else {
                // This assumes the file to be sent is part of the image assets directory
                sendFileToServer(fn, createRequestOptions(upload + "/" + fn));
            }
        }
    }
};

// Upload desired assets
sendFileToServer("worldwind.min.js", createRequestOptions("worldwind/worldwind-" + version + ".min.js"));
sendFileToServer("worldwind.js", createRequestOptions("worldwind/worldwind-" + version + ".js"));
sendFileToServer("images.zip", createRequestOptions("assets/" + version + "/images.zip"));
sendDirectoryToServer("./images");
