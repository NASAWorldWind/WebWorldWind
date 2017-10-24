/**
 * This script deploys the contents of the source directory to the WorldWind content server at Ames. The
 * content server uses Artifactory for managing the assets.
 *
 * Provide the Artifactory API key, directory of assets to upload, and root deployment path on the Artifactory instance.
 */

var crypto = require("crypto");
var fs = require("fs");
var http = require("https");
var os = require("os");
var path = require("path");
var recursive = require("recursive-readdir");

// the Artifactory instance API key
var apiKey;

/**
 * Submits all of the files (recursively) in the provided source directory to the Artifactory server.
 * @param sourceDirectory the directory containing files to deploy to the Artifactory instance
 * @param destinationPath the root target path for the assets
 */
var deployDirectory = function (sourceDirectory, destinationPath) {
    recursive(sourceDirectory, function (err, files) {
        if (err) {
            console.error(err);
        }

        for (var i = 0, len = files.length; i < len; i++) {
            // remove the root directory path from the file path
            var normalizedFilepath = path.normalize(files[i]).replace(path.normalize(sourceDirectory), "");
            // format the path to conform to Artifactory path requirements
            var normalizedPath = path.posix.join(destinationPath, normalizedFilepath);
            deployFile(files[i], normalizedPath);
        }
    });
};

/**
 * Deploys a file to the Artifactory server. Calculates the checksums and then deploys the file to the provided
 * destination path. If there is an unsuccessfuly deployment (as defined by a non-201 HTTP status code) the script will
 * exit.
 * @param file the file path of the asset to deploy
 * @param destinationPath the fully defined target deployment path on the Artifactory instance
 */
var deployFile = function (file, destinationPath) {

    var options = generateOptions(file, destinationPath);
    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            if (res.statusCode !== 201) {
                var body = Buffer.concat(chunks);
                console.error(body.toString());
                process.exit(1);
            }
        });
    });
    fs.readFile(file, function (err, data) {
        if (err) {
            console.error(err);
        }

        req.write(data);
        req.end();
    });
};

/**
 * Generates the options object for the http package. Includes custom headers for deployment to an Artifactory instance.
 * @param file the file path of the asset
 * @param destinationPath the complete target deployment path on the Artifactory instance
 * @returns {{path: *, method: string, host: string, headers: {X-JFrog-Art-Api: *, X-Checksum-Sha256: *, X-Checksum-Sha1: *, X-Checksum-Md5: *}}}
 */
var generateOptions = function (file, destinationPath) {

    var hash = calculateChecksums(file);

    var options = {
        path: destinationPath,
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
        process.exit(1);
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

// Initialize environment variables. If the appropriate variables are not available, the script will exit.
if (process.argv.length < 5) {
    console.error("insufficient arguments");
    process.exit(1);
} else {
    apiKey = process.argv[2];
    var sourcePath = process.argv[3];
    var destinationPath = process.argv[4];

    // Submit the appropriate assets and asset directories
    deployDirectory(sourcePath, destinationPath);
}
