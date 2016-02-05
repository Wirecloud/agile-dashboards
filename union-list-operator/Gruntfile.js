/*
 * union-list
 * 
 *
 * Copyright (c) 2016 CoNwet
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {

    'use strict';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        

        
         jshint: {
             options: {
                 jshintrc: true
             },
             all: {
                 files: {
                     src: ['src/js/**/*.js']
                 }
             },
             grunt: {
                 options: {
                     jshintrc: '.jshintrc-node'
                 },
                 files: {
                     src: ['Gruntfile.js']
                 }
             },
             test: {
                 options: {
                     jshintrc: '.jshintrc-jasmine'
                 },
                 files: {
                     src: ['src/test/**/*.js', '!src/test/fixtures/']
                 }
             }
         },

         jscs: {
             widget: {
                 src: 'src/js/**/*.js',
                 options: {
                     config: ".jscsrc"
                 }
             },
             grunt: {
                 src: 'Gruntfile.js',
                 options: {
                     config: ".jscsrc"
                 }
             }
         },

         

        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'src/js', src: '*', dest: 'build/src/js'}
                ]
            }
        },

        strip_code: {
            multiple_files: {
                src: ['build/src/js/**/*.js']
            },
            imports: {
                options: {
                    start_comment: 'import-block',
                    end_comment: 'end-import-block'
                },
                src: ['src/js/*.js']
            }
        },

        compress: {
            widget: {
                options: {
                    mode: 'zip',
                    archive: 'dist/<%= pkg.vendor %>_<%= pkg.name %>_<%= pkg.version %>.wgt'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'src',
                        src: [
                            'DESCRIPTION.md',
                            'css/**/*',
                            'doc/**/*',
                            'images/**/*',
                            'index.html',
                            
                            'config.xml'
                        ]
                    },
                    {
                        expand: true,
                        cwd: 'build/lib',
                        src: [
                            'lib/**/*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: 'build/src',
                        src: [
                            'js/**/*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.',
                        src: [
                            'LICENSE'
                        ]
                    }
                ]
            }
        },

        clean: {
            build: {
                src: ['build']
            },
            temp: {
                src: ['build/src']
            }
        },

        jsbeautifier: {
            files: ["Gruntfile.js"],
            options: {
                js: {
                    spaceAfterAnonFunction: true,
                    endWithNewline: false,
                    jslintHappy: true
                }
            }
        },

        replace: {
            version: {
                overwrite: true,
                src: ['src/config.xml'],
                replacements: [{
                    from: /version=\"[0-9]+\.[0-9]+\.[0-9]+(([ab]|rc)?[0-9]+)?(-dev)?\"/g,
                    to: 'version="<%= pkg.version %>"'
                }]
            }
        },

        jasmine: {
            test:{
                src: ['src/js/*.js', '!src/js/main.js'],
                options: {
                    specs: 'src/test/js/*Spec.js',
                    helpers: ['src/test/helpers/*.js'],
                    vendor: [
                             'node_modules/mock-applicationmashup/lib/vendor/mockMashupPlatform.js',
                             'src/test/vendor/*.js']
                }
            },
            coverage: {
                src: '<%= jasmine.test.src %>',
                options: {
                    helpers: '<%= jasmine.test.options.helpers %>',
                    specs: '<%= jasmine.test.options.specs %>',
                    vendor: '<%= jasmine.test.options.vendor %>',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions : {
                        coverage: 'build/coverage/json/coverage.json',
                        report: [
                            {type: 'html', options: {dir: 'build/coverage/html'}},
                            {type: 'cobertura', options: {dir: 'build/coverage/xml'}},
                            {type: 'text-summary'}
                        ]
                    }
                }
            }
        }
    });

    
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
     grunt.loadNpmTasks('grunt-contrib-jasmine'); // when test?
     grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-strip-code');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    grunt.registerTask('test', [
        
        'jshint',
         'jshint:grunt',
         'jscs',
         'jasmine:coverage'
         
    ]);

    grunt.registerTask('build', [
        'clean:temp',
        
        'copy:main',
        'strip_code',
        'replace:version',
        'compress:widget'
    ]);

    grunt.registerTask('default', [
        'jsbeautifier',
        
        'test',
        'build'
    ]);

    grunt.registerTask('publish', [
        'default'
        
    ]);
};
