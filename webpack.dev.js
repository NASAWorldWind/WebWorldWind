const path = require('path');

module.exports = {
    "mode": "development",
    entry: './src/WorldWind.js',
    output: {
        filename: 'worldwind.js',
        path: path.resolve(__dirname, 'build/dist'),
        library: 'webworldwind',
        libraryTarget: 'umd'
    }
};