const fs = require('fs');
const path = require('path');

// Path to the project root from the script's location
const projectRoot = path.resolve(__dirname, '..');

function getVersionFromPackageJson() {
    try {
        const packageJsonPath = path.join(projectRoot, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        console.log(`Version number in package.json is: ${packageJson.version}`);
        return packageJson.version;
    } catch (error) {
        console.error(`An error occurred while reading or parsing package.json: ${error.message}`);
        process.exit(1);
    }
}

function getVersionFromJsFile(filePath) {
    try {
        const jsFilePath = path.join(projectRoot, filePath);
        const jsFileContent = fs.readFileSync(jsFilePath, 'utf8');
        const regex = /VERSION:\s*"([^"]+)"/;
        const match = regex.exec(jsFileContent);
        if (!match) {
            console.error(`Version number not found in ${filePath}`);
            process.exit(1);
        }
        console.log(`Version number in ${filePath} is: ${match[1]}`);
        return match[1];
    } catch (error) {
        console.error(`An error occurred while reading ${filePath}: ${error.message}`);
        process.exit(1);
    }
}

function compareVersions(version1, version2) {
    if (version1 === version2) {
        console.log('Version numbers are consistent between package.json and WorldWind.js');
    } else {
        console.error(`ERROR: Version numbers do not match between package.json and WorldWind.js`);
        process.exit(1);
    }
}

const packageVersion = getVersionFromPackageJson();
const jsWorldWindVersion = getVersionFromJsFile('src/WorldWind.js');
compareVersions(packageVersion, jsWorldWindVersion);