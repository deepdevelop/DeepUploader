module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        esnext: true
      },
      all: ['Gruntfile.js', 'src/**/*.js']
    },

    babel: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'dist/qiniu-uploader.js': 'src/qiniu-uploader.js'
        }
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'dist/qiniu-uploader.js',
        dest: 'dist/qiniu-uploader.min.js'
      }
    },

    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/**/*.js'],
        tasks: ['build'],
        options: {
          debounceDelay: 250,
        },
      },
    },
  });

  grunt.registerTask('build', ['jshint', 'babel', 'uglify']);
  grunt.registerTask('default', ['build']);

  grunt.loadNpmTasks('grunt-contrib-watch');
};