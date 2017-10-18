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
var glob = require("glob");
var http = require("https");
var os = require("os");
var recursive = require("recursive-readdir");
var tar = require("tar");

var version, apiKey, outputDir;

/**
 * Initialize environment variables, if the appropriate variables are not available, the script will exit. Checks for
 * the published tarball and extracts contents to a temporary directory.
 */
var init = function () {

    // initialize the environment variables
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

    // extract the npm pack tarball
    var filename = glob.sync("nasaworldwind-worldwind-*.tgz");
    if (!filename || filename.length !== 1) {
        console.error("npm tarball not found");
        process.exit(103);
    }

    var path = require("path");
    outputDir = fs.mkdtempSync(os.tmpdir() + path.sep);
    console.log(outputDir);
    console.log(filename[0] + path.sep + "package" + path.sep);
    tar.extract({
        "cwd": outputDir,
        "file": filename[0],
        "sync": true
    });
    // the extracted tarball includes a package directory with all of the contents
    outputDir += path.sep + "package" + path.sep;
};

/**
 * Submits a file to the Artifactory server for deployment. First calculates the checksums and deploys via checksum.
 * @param filename the relative filename and path from the root folder
 */
var submitFile = function (filename) {

    console.log("Attempting to calculate checksums on: " + filename);
    var hash = calculateChecksums(filename);
    console.log("Checksums: " + JSON.stringify(hash));

    var options = generateDefaultOptions();
    options.path = "/artifactory/generic-local/" + version + "/" + filename.slice(outputDir.length);
    options.headers["X-Checksum-Sha256"] = hash.sha256;
    options.headers["X-Checksum-Sha1"] = hash.sha1;
    options.headers["X-Checksum-Md5"] = hash.md5;

    deployFile(filename, options);
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
 * Calculates the SHA256, SHA1, and MD5 checksums of the provided file
 * @param filename
 * @returns {{sha256: *, sha1: *, md5: *}} an object with the three hashes
 */
var calculateChecksums = function (filename) {

    var sha256 = crypto.createHash("sha256");
    var sha1 = crypto.createHash("sha1");
    var md5 = crypto.createHash("md5");
    if (!sha256 || !sha1 || !md5) {
        console.error("hash algorithms not supported on this platform");
        process.exit(104);
    }

    sha256.update(fs.readFileSync(filename));
    sha1.update(fs.readFileSync(filename));
    md5.update(fs.readFileSync(filename));

    var hash = {
        "sha256": sha256.digest("hex"),
        "sha1": sha1.digest("hex"),
        "md5": md5.digest("hex")
    };

    return hash;
};

/**
 * Deploys the provided file using the options object.
 * @param filename the relative filename and path from the root folder
 * @param options the options object created for deploying this object
 */
var deployFile = function (filename, options) {

    console.log("Attempting to deploy " + filename);

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
submitDirectory(outputDir);
