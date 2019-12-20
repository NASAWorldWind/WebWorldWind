const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    "mode": "development",
    entry: './src/WorldWind.js',
    plugins: [
        // Clean the /build/dist folder before building
        new CleanWebpackPlugin(),
        // Make Webpack to load these libraries as globals in the window object.
        new webpack.ProvidePlugin({
            libtess: 'libtess',
            proj4: 'proj4',
        })
    ],
    output: {
        filename: 'worldwind.js',
        path: path.resolve(__dirname, 'build/dist'),
        library: '@nasaworldwind/worldwind',
        libraryTarget: 'umd'
    }
};