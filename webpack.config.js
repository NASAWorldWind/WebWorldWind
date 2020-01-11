const path = require('path');

module.exports = {
    "mode": "development",
    entry: './src/WorldWind.js',
    plugins: [

    ],
    output: {
        filename: 'WorldwindWebpack.js',
        path: path.resolve(__dirname, 'build/dist'),
        library: '@nasaworldwind/worldwind',
        libraryTarget: 'umd'
    }
};