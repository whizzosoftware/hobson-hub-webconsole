'use strict';
var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 9000;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'lodash'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-require');
    grunt.loadNpmTasks('grunt-string-replace');

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },
            livereload: {
                options: {
                    livereload: grunt.option('livereloadport') || LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                    'test/spec/**/*.js'
                ]
            },
            test: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.js', 'test/spec/**/*.js'],
                tasks: ['test:true']
            },
            scss: {
                files: ['<%= yeoman.app %>/scss/{,*/}*.scss'],
                tasks: ['sass']
            }
        },
        connect: {
            options: {
                port: grunt.option('port') || SERVER_PORT,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            proxies: [{
                context: '/api',
                host: 'localhost',
                port: 8182,
                https: false,
                changeOrigin: false
            }],
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            require('grunt-connect-proxy/lib/utils').proxyRequest,
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            },
            test: {
                path: 'http://localhost:<%= connect.test.options.port %>'
            }
        },
        clean: {
            dist: ['.tmp', '<%= yeoman.dist %>/*'],
            server: '.tmp'
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    loadPath: [
                        'app/bower_components/foundation/scss', 
                        'app/bower_components/toastr',
                        'app/bower_components/fontawesome/scss',
                        'app/bower_components/chartist/dist/scss',
                        'app/bower_components/datetimepicker',
                        'app/bower_components/jquery-colpick/css'
                    ]
                },
                files: {
                    'app/css/main.css': 'app/scss/style.scss'
                }
            }
        },
        uglify: {
            options: {
                mangle: false,
                preserveComments: false,
            },
            my_target: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/js',
                    src: '**/*.js',
                    dest: '<%= yeoman.dist %>/www/js'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>/www',
                    src: [
                        'css/*.*',
                        'img/**/*.*',
                        'templates/**/*.*',
                    ]
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/fontawesome',
                    src: 'fonts/*',
                    dest: '<%= yeoman.dist %>/www'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/webfont-opensans/fonts',
                    src: ['opensans-regular-webfont.woff', 'opensans-light-webfont.woff'],
                    dest: '<%= yeoman.dist %>/www/fonts/'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/datetimepicker',
                    src: 'jquery.datetimepicker.css',
                    dest: '<%= yeoman.dist %>/www/css'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/jquery-colpick/css',
                    src: 'colpick.css',
                    dest: '<%= yeoman.dist %>/www/css'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/almond',
                    src: 'almond.js',
                    dest: '<%= yeoman.dist %>/www/js/almond'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/requirejs',
                    src: 'require.js',
                    dest: '<%= yeoman.dist %>/www/js/requirejs'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/requirejs-i18n',
                    src: 'i18n.js',
                    dest: '<%= yeoman.dist %>/www/js/requirejs-i18n'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/requirejs-text',
                    src: 'text.js',
                    dest: '<%= yeoman.dist %>/www/js/requirejs-text'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/backbone',
                    src: 'backbone.js',
                    dest: '<%= yeoman.dist %>/www/js/backbone'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/backbone.validation/dist',
                    src: 'backbone-validation-amd.js',
                    dest: '<%= yeoman.dist %>/www/js/backbone.validation/dist'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/backbone.stickit',
                    src: 'backbone.stickit.js',
                    dest: '<%= yeoman.dist %>/www/js/backbone.stickit'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/chartist/dist',
                    src: 'chartist.min.js*',
                    dest: '<%= yeoman.dist %>/www/js/chartist/dist'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/chartist-plugin-tooltip/dist',
                    src: 'chartist-plugin-tooltip.min.js',
                    dest: '<%= yeoman.dist %>/www/js/chartist-plugin-tooltip/dist'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/cookies-js/dist',
                    src: 'cookies.min.js',
                    dest: '<%= yeoman.dist %>/www/js/cookies-js/dist'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/jquery-bridget',
                    src: 'jquery.bridget.js',
                    dest: '<%= yeoman.dist %>/www/js/jquery-bridget'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/jquery-colpick/js',
                    src: 'colpick.js',
                    dest: '<%= yeoman.dist %>/www/js/jquery-colpick/js'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/sidr',
                    src: 'colpick.js',
                    dest: '<%= yeoman.dist %>/www/js/sidr'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/datetimepicker',
                    src: 'jquery.datetimepicker.js',
                    dest: '<%= yeoman.dist %>/www/js/datetimepicker'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/moment/min',
                    src: 'moment.min.js',
                    dest: '<%= yeoman.dist %>/www/js/moment/min'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/masonry/dist',
                    src: 'masonry.pkgd.min.js',
                    dest: '<%= yeoman.dist %>/www/js/masonry/dist'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/rrule/lib',
                    src: '*.js',
                    dest: '<%= yeoman.dist %>/www/js/rrule/lib'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/sidr',
                    src: 'jquery.sidr.min.js',
                    dest: '<%= yeoman.dist %>/www/js/sidr'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/toastr',
                    src: 'toastr.min.js',
                    dest: '<%= yeoman.dist %>/www/js/toastr'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/foundation/js',
                    src: '**/*',
                    dest: '<%= yeoman.dist %>/www/js/foundation/js'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/underscore',
                    src: 'underscore-min.js',
                    dest: '<%= yeoman.dist %>/www/js/underscore'
                }, {
                    expand: true,
                    cwd: '<%= yeoman.app %>/bower_components/jquery/dist',
                    src: 'jquery.min.js',
                    dest: '<%= yeoman.dist %>/www/js/jquery/dist'
                }]
            }
        },
        'string-replace': {
            dist: {
                files: {
                    '<%= yeoman.dist %>/www/index.html': '<%= yeoman.app %>/index.html'
                },
                options: {
                    replacements: [{
                        pattern: 'bower_components/datetimepicker',
                        replacement: 'css'
                    }, {
                        pattern: 'bower_components/jquery-colpick/css',
                        replacement: 'css'
                    }, {
                        pattern: 'bower_components/requirejs',
                        replacement: 'js/requirejs'
                    }, 
                    // {
                    //     pattern: '<script data-main="js/config" src="js/requirejs/require.js"></script>',
                    //     replacement: '<script src="js/default.js"></script>'
                    // }
                    ]
                }
            }, 
            dist2: {
                files: {
                    '<%= yeoman.dist %>/www/js/config.js': '<%= yeoman.app %>/js/config.js'
                },
                options: {
                    replacements: [{
                        pattern: /bower_components/g,
                        replacement: 'js'
                    }]
                }
            }
        },
        requirejs: {
            options: {
                baseUrl: '<%= yeoman.dist %>/www/js',
                config: ['config.js'],
                name: 'main',
                require: 'requirejs/require',
                almond: 'almond/almond',
                out: '<%= yeoman.dist %>/www/js/default.js',
            },
            prod: {
                options: {
                    build: true
                }
            }
        },
        jasmine: {
          test: {
            src: ['app/**/*.js', '!app/js/config.js'],
            options: {
              specs: 'test/*Spec.js',
              helpers: 'test/*Helper.js',
              template: require('grunt-template-jasmine-requirejs'),
              templateOptions: {
                requireConfigFile: 'app/js/config.js',
                requireConfig: {
                  baseUrl: 'app/'
                }
              }
            }
          }
        },
        karma: {
          karma: {
            configFile: 'karma.conf.js'
          }
        }
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve' + (target ? ':' + target : '')]);
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open:server', 'connect:dist:keepalive']);
        }

        if (target === 'test') {
            return grunt.task.run([
                'clean:server',
                'connect:test',
                'open:test',
                'watch'
            ]);
        }

        grunt.task.run([
            'clean:server',
            'configureProxies:server',
            'connect:livereload',
            'open:server',
            'watch'
        ]);
    });

    grunt.registerTask('test', function (isConnected) {
        isConnected = Boolean(isConnected);
        var testTasks = [
                'clean:server',
                'connect:test',
                'karma'
            ];

        if(!isConnected) {
            return grunt.task.run(testTasks);
        } else {
            // already connected so not going to connect again, remove the connect:test task
            testTasks.splice(testTasks.indexOf('connect:test'), 1);
            return grunt.task.run(testTasks);
        }
    });

    grunt.registerTask('build', [
        'clean:dist',
        'sass',
        'copy',
        'uglify',
        'string-replace'
    ]);

    grunt.registerTask('default', [
        'test',
        'build'
    ]);
};
