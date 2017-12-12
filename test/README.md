# Preparation: Install Karma and Jasmine

If you don't have Node.js, please visit https://nodejs.org/en/download/ and
install the appropriate release for your system.

In a terminal, go to the project folder and run `npm install` to install
the necessary dependencies saved as `devDependencies` in `package.json`.

# How to Run the Tests

## Continuous Testing from the Terminal

In a terminal, go to the project folder and run `karma start karma.conf.js`.
This will start a process, which automatically runs all tests when source
files are changed and saved as long as the process is running.

## Testing from WebStorm

If you use the workspace configuration provided in the source code repository,
you already have a run configuration called "Karma Tests".

Otherwise, running `karma.conf.js` in WebStorm will run the tests only once
unless the re-run option is selected. In this case, all tests are run when
source files are changed similarly to starting Karma from the terminal.

The above-mentioned run configuration can also be created manually with the
following steps:
- Go to Run -> Edit Configurations...
- Click on the '+' button on the top left side (Add New Configuration)
- Select 'Karma' from the menu
- In Configuration file box insert the path of the file `karma.conf.js`
- In Name box insert the name of the configuration (e.g. Karma Tests)
- Save the configuration

## Testing with Other Browsers

By default, the tests run in PhamtomJS. They can be run in other browsers by
changing the list of browsers in `karma.conf.js` to, for example:

`browsers: ['PhantomJS', 'Chrome’]`

Please make sure that you also have the appropriate launchers available in your
node modules, for example:

`npm install karma-chrome-launcher`

## Integration with the Build Process

The tests are automatically run when the project is built using Grunt.

## Test Results

The test results are available in `test/<USED_BROWSER>/test-results.xml`.

# How to Create a Test

Please have a look at the existing tests for reference.

1) Go to the `test` folder and create a new file. Note that the `test` folder
   should maintain the same structure as the `src` folder, so if the module to
   be tested is located in `src/features/`, the related test should be in
   `test/features`.
   
2) Save the file as `<name of the module to be tested>.test.js`

3) The basic structure of the test is the following:
```javascript
    define([ <list of paths of the modules that this module depends on> ],
           function (< list of parameters>) {

     	"use strict";

     	describe("<name of the module to be tested to help you understand what the test is supposed to be>",
               function() {
     	  
        ....

     		it("<description of the expected results of the test, usually it starts with the word 'should'>",
     		function() {
     			expect( ... ).<matcher>(...);

     		})
     	});
     });
```

For more information about the Jasmine Framework used for defining the tests,
please visit: https://jasmine.github.io/2.0/introduction.html
