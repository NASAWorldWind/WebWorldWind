This file explains how to build the Web WorldWind artifacts.

- Install Node (https://nodejs.org/download/)
  Download and install the appropriate installation file. The build is known to work with v6.9.2 (LTS).

- Install the dependencies
  `npm install`

Then you can use the commands below to build artifacts.

- Build all artifacts (worldwind.js, worldwind.min.js):
  `npm run build`

- Only run the tests:
    `npm run test`
  
- Only generate the documentation:
    `npm run doc`
    
- Automatically run the tests when a file changes:
    `npm run test:watch`
