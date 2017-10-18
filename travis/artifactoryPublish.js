/**
 * This script deploys the minified and debug WorldWind javascript libraries as well as the images.zip and images
 * folder to the WorldWind content server at Ames. The content server uses Artifactory for managing the assets and the
 * deployment process for a file is two steps. First, the checksums of a file are calculated. The checksums are
 * provided to the Artifactory instance along with a desired server path for the file. If Artifactory already contains
 * the artifact (as determined by duplicate checksums), the artifact will be copied on the server to the new path. If
 * the server does not find the checksum, this script will then upload the file.
 *
 * In order for this script to run properly, the desired version and the Ames Artifactory instance (files server) API
 * key should be provided via the environment variables "TRAVIS_TAG" and "FILES_API_KEY".
 */

var crypto = require("crypto");
var fs = require("fs");
var http = require("https");
var recursive = require("recursive-readdir");

var version, apiKey;

/**
 * Initialize environment variables, if the appropriate variables are not available, the script will exit.
 */
var init = function () {
    if (!process.env.TRAVIS_TAG || !process.env.TRAVIS_TAG.startsWith("v")) {
        console.error("invalid version tag");
        process.exit(101);
    } else {
        version = process.env.TRAVIS_TAG.slice(1);
    }

    if (!process.env.FILES_API_KEY) {
        console.error("missing file server api key");
        process.exit(102);
    } else {
        apiKey = process.env.FILES_API_KEY;
    }
};

/**
 * Submits a file to the Artifactory server for deployment. First calculates the checksums and deploys via checksum.
 * @param filename the relative filename and path from the root folder
 */
var submitFile = function (filename) {
    calculateChecksums(filename, deployChecksum);
};

/**
 * Submits all of the files (recursively) in the provided directory to the Artifactory server. Each files checksum is
 * first calculated and then submitted.
 * @param directory
 */
var submitDirectory = function (directory) {
    recursive(directory, function (err, files) {
        if (err) {
            console.error(err);
        }

        for (var i = 0, len = files.length; i < len; i++) {
            submitFile(files[i]);
        }
    });
};

/**
 * Calculates the MD5, SHA1, and SHA256 hash hex representations of the provided file.
 * @param filename the relative filename and path from the root folder
 * @param callback the function to be called with the calculated filename and hashes
 */
var calculateChecksums = function (filename, callback) {

    var sha256 = crypto.createHash("sha256");
    var sha1 = crypto.createHash("sha1");
    var md5 = crypto.createHash("md5");
    if (!sha256 || !sha1 || !md5) {
        console.error("hash algorithms not supported on this platform");
        process.exit(103);
    }

    var stream = fs.ReadStream(filename);
    stream.on("data", function (data) {
        sha256.update(data);
        sha1.update(data);
        md5.update(data);
    });
    stream.on("end", function () {
        var hash = {};
        hash.sha256 = sha256.digest("hex");
        hash.sha1 = sha1.digest("hex");
        hash.md5 = md5.digest("hex");
        callback(filename, hash);
    });

};

/**
 * Deploys the provided filename and hash object to the Artifactory server. This deployment only PUTs the checksums to
 * allow Artifactory to move files on the server if duplicates exists instead of a full file upload and deployment.
 * @param filename the relative filename and path from the root folder
 * @param hash the hash object containing all three hash hex values
 */
var deployChecksum = function (filename, hash) {

    console.log("attempting to deploy checksum for file: " + filename);

    var options = generateDefaultOptions();
    options.path = "/artifactory/web/" + version + "/" + filename;
    options.headers["X-Checksum-Deploy"] = true;
    options.headers["X-Checksum-Sha256"] = hash.sha256;
    options.headers["X-Checksum-Sha1"] = hash.sha1;
    options.headers["X-Checksum-Md5"] = hash.md5;

    http.request(options, onResponse(filename, options).processStatusCode).end();
};

/**
 * This closure captures the original filename and options object for processing the response status code. If an
 * Artifactory deploy by checksum file is not already found on the server (a response code other than 201), then this
 * closure will call the deploy file which actually deploys the file to the Artifactory instance.
 * @param filename the relative filename and path from the root folder
 * @param options the options object created for deploying this object
 * @returns {{processStatusCode: processStatusCode}}
 */
var onResponse = function (filename, options) {
    var fn = filename;
    var op = options;

    return {
        processStatusCode: function (response) {
            console.log("processing response for: " + fn + " with response code: " + response.statusCode);

            if (response.statusCode !== 201) {
                console.log("deploying file: " + fn + " due to non 201");
                deployFile(fn, op);
            }
        }
    }
};

/**
 * Deploys the provided file using the options object used for the attempted deploy by checksum operation.
 * @param filename the relative filename and path from the root folder
 * @param options the options object created for deploying this object
 */
var deployFile = function (filename, options) {

    // must remove the header directing to upload via checksum
    delete options.headers["X-Checksum-Deploy"];

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });
    fs.readFile(filename, function (err, data) {
        if (err) {
            console.error(err);
        }

        req.write(data);
        req.end();
    });
};

/**
 * Generates a boilerplate object which should be agumented or modified by deployment operations. This deployment
 * options object is specific to Artifactory and the https node js package.
 * @returns {{method: string, host: string, headers: {X-JFrog-Art-Api: *}}}
 */
var generateDefaultOptions = function () {
    var options = {
        method: "PUT",
        host: "files.worldwind.arc.nasa.gov",
        headers: {
            "X-JFrog-Art-Api": apiKey
        }
    };

    return options;
};

// Submit the appropriate assets and asset directories
init();
submitFile("worldwind.min.js");
submitFile("worldwind.js");
submitFile("images.zip");
submitDirectory("images");
