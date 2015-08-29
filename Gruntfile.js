/*
 * Copyright (C) 2014 United States Government as represented by the Administrator of the
 * National Aeronautics and Space Administration. All Rights Reserved.
 */
/**
 * @version $Id: Gruntfile.js 3107 2015-05-26 18:22:54Z tgaskins $
 */
module.exports = function (grunt) {
    grunt.initConfig({
        jsdoc: {
            dist: {
                src: ['src'],
                options: {
                    destination: 'api-doc',
                    configure: 'config.json',
                    readme: 'README.md',
                    recurse: true
                }
            }
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: 'src',
                    name: '../tools/almond',
                    include: ['WorldWind'],
                    out: 'worldwindlib.js',
                    wrap: {
                        startFile: 'tools/wrap.start',
                        endFile: 'tools/wrap.end'
                    }
                }
            }
        },

        compress: {
            main: {
                options: {
                    archive: 'WebWorldWind.zip'
                },
                files: [
                    {src: [
                        'api-doc/**',
                        'worldwindlib.js',
                        'apps/**',
                        'design-notes/**',
                        'examples/**',
                        'images/**',
                        'performance/**',
                        'src/**',
                        'test/**',
                        'thirdparty/**',
                        'tools/**',
                        'build.js',
                        'Gruntfile.js',
                        'README.md',
                        'HowToCreateAndRunUnitTests.txt',
                        'jsTestDriver.conf',
                        'package.json',
                        'config.json',
                        'layout.tmpl',
                        'GruntSetup.txt',
                        'WebWorldWindDesignAndCodingGuidelines.html'
                    ]}
                ]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('default', ['jsdoc', 'requirejs', 'compress']);
};