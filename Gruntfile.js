module.exports = function(grunt) {
    "use strict";

    var pkg = grunt.file.readJSON("package.json");
    var banner = "/*\nPicoGL.js v<%= pkg.version %> \n\n<%= licence %>*/\n";

    grunt.initConfig({
        pkg: pkg,
        licence: grunt.file.read("LICENSE"),
        packageName: "picogl",
        VERSION: pkg.version,
        uglify: {
            options: {
                banner: banner
            },
            src: {
                src: "build/<%= packageName %>.js",
                dest: "build/<%= packageName %>.min.js"
            }
        },
        jshint: {
            options: {
                eqeqeq: true,
                undef: true,
                unused: true,
                strict: true,
                indent: 4,
                immed: true,
                latedef: "nofunc",
                newcap: true,
                nonew: true,
                trailing: true
            },
            grunt: {
                options: {
                    node: true
                },
                src: "Gruntfile.js"
            },
            picogl: {
                options: {
                    browser: true,
                    devel: true,
                    browserify: true,
                    globals: {
                        PicoGL: true
                    }
                },
                src: "src/*.js"
            }
        },
        browserify: {
            src: {
                src: [ "src/picogl.js" ],
                dest: "build/<%= packageName %>.js"
            },
            options: {
                banner: banner,
                transform: [
                    [   "browserify-replace", {
                            replace: [
                                { from: "%%VERSION%%", to: "<%= VERSION %>" }
                            ]
                        }
                    ]
                ]
            },
        },
        jsdoc : {
            src : {
                src: "src/*.js",
                dest: "docs"
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-jsdoc");

    grunt.registerTask("lint", ["jshint"]);
    grunt.registerTask("build", ["jshint", "browserify", "uglify"]);
    grunt.registerTask("default", ["build"]);
};
