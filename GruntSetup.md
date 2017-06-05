This file explains how to install and run Grunt for building Web World Wind artifacts.
On OS X and Linux you will need to run the given commands as root (using sudo). On Windows, you can run them as given.

The below 3 installations are per-machine:

1) Install Node (https://nodejs.org/download/)
  Download and install the appropriate installation file.

2) Install r.js (http://requirejs.org/docs/node.html)
  `npm install -g requirejs`

3) Install grunt-cli (http://gruntjs.com/getting-started)
  `npm update`
  `npm install -g grunt-cli`

The below installations are per-project — must be performed with each new full-project checkout - with `cwd` as the project folder:

1) Install requirejs plugin (https://jaketrent.com/post/run-requirejs-with-gruntjs/)
  `npm install grunt-contrib-requirejs`

2) Install jsdoc 3.3.0 plugin (https://github.com/krampstudio/grunt-jsdoc)
  `npm install grunt-jsdoc`

3) Install compress plugin (https://github.com/gruntjs/grunt-contrib-compress)
  `npm install grunt-contrib-compress`

You should now be able to run Grunt:
`grunt jsdoc`
`grunt requirejs`
`grunt compress`
To run all tasks, just run grunt without any arguments.
