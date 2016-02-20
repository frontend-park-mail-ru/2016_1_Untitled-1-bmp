module.exports = function (grunt) {

  grunt.initConfig({
    sass: {
      // https://www.npmjs.com/package/grunt-sass
      dev: {
        options: {
          outputStyle: 'expanded',
          sourcemap: false
        },
        files: {
          'dist/css/main.css': 'assets/sass/main.scss'
        }
      },
      prod: {
        options: {
          outputStyle: 'compressed',
          sourcemap: false
        },
        files: {
          'dist/css/main.css': 'assets/sass/main.scss'
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
          dest: 'dist/js/tmpl'
        }],
        options: {
          template: function (data) {
            return grunt.template.process(
              'var <%= name %>Tmpl = <%= contents %> ;',
              {data: data}
            );
          }
        }
      }
    },

    watch: {
      // https://www.npmjs.com/package/grunt-contrib-watch
      fest: {
        files: ['templates/*.xml'],
        tasks: ['fest'],
        options: {
          interrupt: true,
          atBegin: true
        }
      },
      sass: {
        files: ['assets/sass/**/*'],
        tasks: ['sass:dev'],
        options: {
          interrupt: true,
          atBegin: true
        }
      },
      copy: {
        files: ['assets/fonts/**/*'],
        tasks: ['copy:fonts'],
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
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-fest');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('dev', ['concurrent:dev']);
  grunt.registerTask('prod', ['fest', 'sass:prod', 'copy:fonts']);
  grunt.registerTask('default', ['dev']);
};
