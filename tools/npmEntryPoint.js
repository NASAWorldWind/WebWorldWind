// This file enables the consumption of the production build of the library in a CommonJS interface
// for the purposes of publishing it as a package in Node Package Manager (npm). Grunt copies this
// file to the root folder of the project and
// Currently (August 2017), scoped packages with an entry point other than "index.js" do not work.
module.exports = require('./worldwind.min.js');