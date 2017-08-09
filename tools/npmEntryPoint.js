// This file enables the consumption of the production build of the library in a CommonJS interface
// for the purposes of publishing it as a package in Node Package Manager (npm). This is used as a
// workaround since currently (August 2017), scoped packages with an entry point other than
// "index.js" do not work.
module.exports = require('./worldwind.min.js');