module.exports = function (grunt) {

  grunt.initConfig({
    // https://www.npmjs.com/package/grunt-contrib-less
    less: {
      dev: {
        options: {
          paths: ['assets/less']
        },
        files: {
          'dist/css/main.css': 'assets/less/main.less'
        }
      },
      prod: {
        options: {
          paths: ['assets/less'],
          compress: true
        },
        files: {
          'dist/css/main.css': 'assets/less/main.less'
        }
      }
    },

    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({ browsers: ['last 2 versions'] })
        ]
      },
      dev: {
        src: 'dist/css/main.css'
      }
    },

    requirejs: {
      // https://www.npmjs.com/package/grunt-requirejs
      prod: {
        options: {
          baseUrl: 'dist/js',
          mainConfigFile: 'dist/js/config.js',
          include: ['main'],
          out: 'dist/js/main.min.js',
          preserveLicenseComments: false
          /* uncomment to debug */
          // ,optimize: 'uglify2',
          // generateSourceMaps: true
        }
      }
    },

    jade: {
      // https://www.npmjs.com/package/grunt-jade
      dev: {
        files: {
          'dist': 'layouts/**/*.jade'
        },
        options: {
          pretty: true,
          client: false,
          locals: {
            dev: true
          }
        }
      },
      prod: {
        files: {
          'dist': 'layouts/**/*.jade'
        },
        options: {
          client: false,
          locals: {
            dev: false
          }
        }
      }
    },

    copy: {
      // https://www.npmjs.com/package/grunt-contrib-copy
      fonts: {
        cwd: 'assets/fonts',
        src: [ '**' ],
        dest: 'dist/fonts',
        expand: true
      },
      img: {
        cwd: 'assets/img',
        src: [ '**' ],
        dest: 'dist/img',
        expand: true
      },
      js_dev: {
        cwd: 'assets/js',
        src: [ '**' ],
        dest: 'dist/js',
        expand: true
      },
      css: {
        cwd: 'assets/css',
        src: [ '**' ],
        dest: 'dist/css',
        expand: true
      }
    },

    shell: {
      // https://www.npmjs.com/package/grunt-shell
      options: {
        stdout: true,
        stderr: true
      },
      dev: {
        command: 'node server.js'
      }
    },

    fest: {
      // https://www.npmjs.com/package/grunt-fest
      templates: {
        files: [{
          expand: true,
          cwd: 'templates',
          src: '*.xml',
          dest: 'dist/js/templates'
        }],
        options: {
          template: function (data) {
            return grunt.template.process(
              'define(function() { return <%= contents %> ; });',
              {data: data}
            );
          }
        }
      }
    },

    watch: {
      // https://www.npmjs.com/package/grunt-contrib-watch
      fest: {
        files: ['templates/**/*.xml'],
        tasks: ['fest'],
        options: {
          interrupt: true,
          atBegin: true
        }
      },
      jade: {
        files: ['layouts/**/*.jade'],
        tasks: ['jade:dev'],
        options: {
          interrupt: true,
          atBegin: true
        }
      },
      less: {
        files: ['assets/less/**/*'],
        tasks: ['less:dev', 'postcss'],
        options: {
          interrupt: true,
          atBegin: true
        }
      },
      copy_fonts: {
        files: ['assets/fonts/**/*'],
        tasks: ['copy:fonts'],
        options: {
          interrupt: true,
          atBegin: true
        }
      },
      copy_img: {
        files: ['assets/img/**/*'],
        tasks: ['copy:img'],
        options: {
          interrupt: true,
          atBegin: true
        }
      },
      copy_js_dev: {
        files: ['assets/js/**/*'],
        tasks: ['copy:js_dev'],
        options: {
          interrupt: true,
          atBegin: true
        }
      },
      copy_css: {
        files: ['assets/css/**/*'],
        tasks: ['copy:css', 'postcss'],
        options: {
          interrupt: true,
          atBegin: true
        }
      }
    },

    concurrent: {
      // https://www.npmjs.com/package/grunt-concurrent
      dev: {
        tasks: ['shell:dev', 'watch']
      },
      options: {
        logConcurrentOutput: true
      }
    },
  });

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-fest');
  grunt.loadNpmTasks('grunt-jade');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('dev', ['concurrent:dev']);
  grunt.registerTask('prod', ['fest', 'copy:css', 'less:prod', 'copy:fonts', 'copy:img', 'jade:prod', 'requirejs:prod']);
  grunt.registerTask('default', ['dev']);
};
