'use strict';
var path = require('path');

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        config: {
            app: 'src',
            stage: '.tmp',
            dist: 'build'
        },
        env: {
            local: { ENV: 'local' },
            mock: { ENV: 'mock' },
            dev: { ENV: 'development' },
            test: { ENV: 'test' },
            stage: { ENV: 'stage' },
            demo: { ENV: 'mock' },
            prod: { ENV: 'production' }
        },
        preprocess: {
            index: {
                src: '<%= config.app %>/index.html.template',
                dest: '<%= config.app %>/index.html'
            }
        },
        watch: {
            scss: {
                files: ['<%= config.app %>/core/styles/**/*.{scss,sass}', '<%= config.app %>/submodule/**/*.{scss,sass}'],
                tasks: ['compass:dev']
            },
            index: {
                files: ['<%= config.app %>/index.html.template'],
                tasks: ['preprocess']
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            watch: {
                tasks: ['watch:scss', 'watch:index']
            }
        },
        clean: {
            options: {
                dot: true
            },
            stage: {
                files: [
                    {
                        src: [
                            '<%= config.stage%>'
                        ]
                    }
                ]
            }
        },
        compass: {
            prod: {
                options: {
                    debugInfo: false,
                    outputStyle: 'compressed'
                }
            },
            dev: {
                options: {
                    debugInfo: true,
                    outputStyle: 'expanded'
                }
            }
        },
        copy: {
            toDist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.app %>',
                        dest: '<%= config.dist %>',
                        src: [
                            'index.html',
                            'app/**/*.html',
                            'core/**/*.html',
                            'vendor/**/*',
                            'assets/**/*'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.stage %>',
                        dest: '<%= config.dist %>',
                        src: ['assets/**/*']
                    }
                ]
            }
        },
        express: {
            all: {
                options: {
                    port: 9000,
                    bases: './src',
                    server: './server.js'
                }
            }
        },
        uglify: {
            options: {
                mangle: {
                    except: [] // should not be here, need to find a better solution
                }
            }
        },
        karma: {
            unit: {
                configFile: 'config/karma-unit.conf.js',
                singleRun: true
            },
            e2e: {
                configFile: 'config/karma-e2e.conf.js',
                singleRun: true
            }
        },
        useminPrepare: {
            html: '<%= config.app %>/index.html',
            options: {
                dest: '<%= config.stage%>'
            }
        },
        usemin: {
            html: '<%= config.app %>/index.html',
            options: {
                dest: '<%= config.stage%>'
            }
        },
        ngAnnotate: {
            buildjs: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.stage%>/concat/assets/js/',
                        src: 'build.js',
                        dest: '<%= config.stage%>/concat/assets/js/'
                    }
                ]
            }
        }
    });

    grunt.registerTask('server', [
        'preprocess',
        'compass:dev',
        'express',
        'concurrent:watch'
    ]);

    grunt.registerTask('build', [
        'compass:dev',
        'preprocess',
        'useminPrepare',
        'concat:generated',
        'ngAnnotate',
        'cssmin:generated',
        'uglify:generated',
        'usemin',
        'copy:toDist',
        'clean:stage'
    ]);

    grunt.registerTask('develop.local', [
        'env:local',
        'server'
    ]);

    grunt.registerTask('develop.mock', [
        'env:mock',
        'server'
    ]);

    grunt.registerTask('build.local', [
        'env:local',
        'build'
    ]);

    grunt.registerTask('build.dev', [
        'env:dev',
        'build'
    ]);

    grunt.registerTask('build.test', [
        'env:test',
        'build'
    ]);

    grunt.registerTask('build.stage', [
        'env:stage',
        'build'
    ]);

    grunt.registerTask('build.demo', [
        'env:demo',
        'build'
    ]);

    grunt.registerTask('build.prod', [
        'env:prod',
        'build'
    ]);
};
