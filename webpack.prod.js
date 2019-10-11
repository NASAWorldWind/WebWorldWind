const path = require('path');

module.exports = {
    "mode": "production",
    entry: './src/WorldWind.js',
    output: {
        filename: 'worldwind.min.js',
        path: path.resolve(__dirname, 'build/dist'),
        library: 'webworldwind',
        libraryTarget: 'umd'
    }
};