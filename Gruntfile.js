/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jsdoc: {
            dist: {
                src: ['src'],
                options: {
                    destination: 'build/dist/api-doc',
                    configure: 'tools/jsdoc.conf.json',
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
                    out: 'build/dist/worldwind.min.js',
                    wrap: {
                        startFile: 'tools/wrap.start',
                        endFile: 'tools/wrap.end'
                    }
                }
            },
            compileDebug: {
                options: {
                    baseUrl: 'src',
                    name: '../tools/almond',
                    include: ['WorldWind'],
                    optimize: 'none',
                    out: 'build/dist/worldwind.js',
                    wrap: {
                        startFile: 'tools/wrap.start',
                        endFile: 'tools/wrap.end'
                    }
                }
            },
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true,
                reporters: ['dots', 'junit', 'html'],
                junitReporter: {
                    outputFile: 'test-results.xml',
                    outputDir: 'build/test-results'
                },
                htmlReporter: {
                    outputFile: 'build/test-results/report.html',
                },
            }
        },

        clean: [
            'build/'
        ],

        copy: {
            main: {
                files: [
                    // Copy all of the files in the examples folder except the current shim which uses the sources files
                    {
                        expand: true,
                        src: ['images/**', 'examples/**', '!examples/WorldWindShim.js', 'README.md', 'LICENSE'],
                        dest: 'build/dist/'
                    },
                    // Copy and rename the deployment WorldWindShim which uses the minified library
                    {
                        expand: true,
                        cwd: 'tools',
                        src: ['WorldWindShim.build.js'],
                        dest: 'build/dist/examples/',
                        rename: function (dest, src) {
                            return dest + src.replace('WorldWindShim.build', 'WorldWindShim');
                        }
                    }
                ]
            }
        },

        zip: {
            images: {
                src: ['images/**'],
                dest: 'build/dist/images.zip'
            },
            dist: {
                cwd: 'build/dist',
                src: ['build/dist/**'],
                dest: 'build/WebWorldWind-Distribution-<%= pkg.version %>.zip'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-zip');

    grunt.registerTask('default', ['clean', 'karma', 'jsdoc', 'requirejs', 'copy', 'zip']);
};
