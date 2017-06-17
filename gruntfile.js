module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= pkg.license %> */\n'
		},

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
					livereload: false,
				},
			},
		},
	
		//  Minify JS
		uglify: {
			options: {
				banner: '<%= meta.banner %>',
				report: 'gzip'
			},
		my_target: {
			files: {
				'min/canvas-grid-master.min.js': [
					'js/main.js',
					'js/functions.js',
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