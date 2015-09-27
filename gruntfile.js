module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
	  
	less: {
      styles: {
        files: {
          'min/app.min.css': ["css/reset.css","less/style.less"]
        }
      }
    },

    autoprefixer: {
      styles: {
        files: {
          'min/app.min.css': 'min/app.min.css'
        }
      }
    },

    clean: {
      styles: ['min/app.min.css']
    },

    watch: {
      scripts: {
        files: ['**/*.less', '**/*.js', 'gruntfile.js'],
        tasks: ['uglify','less'],
        options: {
          spawn: false,
          livereload: true,
        },
      },
    },

    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
	  'min/app.min.js': ['js/grid.js', 'js/easing.js'],
	  
        }
      }
    }
  });


  // load grunt modules
  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', ['build', 'watch']);
  
  grunt.registerTask('build', ['styles', 'uglify']);
  grunt.registerTask('styles', ['less:styles', 'autoprefixer:styles', 'clean:styles']);

};