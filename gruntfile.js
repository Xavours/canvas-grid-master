module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
	  
	//  Convert SASS files into CSS  
  	sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
            	'css/style.css': 'css/style.scss'
            }
        }
    },

	//  Minify CSS  
    cssmin: {
	  target: {
	    files: {
	      'min/app.min.css': 'css/*.css'
	    }
	  }
	},

    //  Autoprefix CSS  
	autoprefixer: {
      styles: {
        files: {
          'min/app.min.css': 'min/app.min.css'
        }
      }
    },
	
	//  Watch
    watch: {
      scripts: {
        files: ['**/*.scss', '**/*.js', 'gruntfile.js'],
        tasks: ['build'],
        options: {
          spawn: false,
          livereload: 8888,
        },
      },
    },
	
	//  Minify JS
    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
	  'min/canvas-grid-master.min.js': ['js/main.js',
	  					 'js/options.js',
	  					 'js/trigger.js',
	  					 'js/easing.js'],
	  
        }
      }
    },
    
	//  Clean .css and .css.map from sass files
    clean: ["css/*.css.map"]
  });


  // load grunt modules
  require('load-grunt-tasks')(grunt);

  // Default task(s).
  grunt.registerTask('default', ['build', 'watch']);
  
  grunt.registerTask('build', ['styles', 'uglify', 'clean']);
  grunt.registerTask('styles', ['sass', 'cssmin', 'autoprefixer:styles']);

};