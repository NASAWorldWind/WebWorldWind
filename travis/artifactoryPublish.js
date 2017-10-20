/**
 * This script deploys the contents of the Web WorldWind npm package to the WorldWind content server at Ames. The
 * content server uses Artifactory for managing the assets.
 *
 * In order for this script to run properly, the desired version and the Ames Artifactory instance (files server) API
 * key should be provided via the environment variables "TRAVIS_TAG" and "FILES_API_KEY".
 *
 * The command 'npm pack' must be run before this script is invoked in order to create the
 * nasaworldwind-worldwind<version>.tgz file.
 */

var crypto = require("crypto");
var fs = require("fs");
var glob = require("glob");
var http = require("https");
var os = require("os");
var path = require("path");
var recursive = require("recursive-readdir");
var tar = require("tar");

var deploymentVersion, // git version tag without "v"
    apiKey, // Artifactory API key for the files content server
    outputDir; // the temporary output directory of the npm pack tarball extraction

/**
 * Initialize environment variables and extract the npm pack tarball. If the appropriate variables are not available,
 * the script will exit. Checks for the tarball and extracts contents to a temporary directory.
 */
var init = function () {

    // initialize the environment variables
    if (!process.env.TRAVIS_BRANCH) {
        console.error("invalid version tag");
        process.exit(101);
    } else {
        if (process.env.TRAVIS_BRANCH.startsWith("v")) {
            deploymentVersion = process.env.TRAVIS_BRANCH.slice(1);
        } else {
            deploymentVersion = process.env.TRAVIS_BRANCH;
        }
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

    outputDir = fs.mkdtempSync(os.tmpdir() + path.sep);
    tar.extract({
        "cwd": outputDir,
        "file": filename[0],
        "sync": true
    });
    // the extracted tarball includes a 'package' directory with all of the contents
    outputDir += path.sep + "package" + path.sep;
};

/**
 * Submits a file to the Artifactory server for deployment. First calculates the checksums and then deploys the file.
 * @param filename the absolute filename and path
 */
var deployFile = function (filename) {

    console.log("Attempting to deploy " + filename);

    var options = generateOptions(filename);
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
 * Submits all of the files (recursively) in the provided directory to the Artifactory server.
 * @param directory
 */
var deployDirectory = function (directory) {
    recursive(directory, function (err, files) {
        if (err) {
            console.error(err);
        }

        for (var i = 0, len = files.length; i < len; i++) {
            deployFile(files[i]);
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
 * Generates a boilerplate object based on the filename provided. This deployment options object is specific to
 * Artifactory and the https node package.
 * @param filename the absolute path and filename of the file
 * @returns {{path: string, method: string, host: string, headers: {X-JFrog-Art-Api: *, X-Checksum-Sha256: *,
 *  X-Checksum-Sha1: *, X-Checksum-Md5: *}}}
 */
var generateOptions = function (filename) {

    var hash = calculateChecksums(filename);
    // convert windows back slashes to forward slashes and change path to be relative
    var normalizedFilename = filename.replace(outputDir, "").replace(/\\/g, "/");

    var options = {
        path: "/artifactory/generic-local/" + deploymentVersion + "/" + normalizedFilename,
        method: "PUT",
        host: "files.worldwind.arc.nasa.gov",
        headers: {
            "X-JFrog-Art-Api": apiKey,
            "X-Checksum-Sha256": hash.sha256,
            "X-Checksum-Sha1": hash.sha1,
            "X-Checksum-Md5": hash.md5
        }
    };

    return options;
};

// Submit the appropriate assets and asset directories
init();
deployDirectory(outputDir);
