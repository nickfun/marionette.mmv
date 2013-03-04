module.exports = function(grunt) {
	grunt.initConfig( {
		pkg: grunt.file.readJSON('package.json'),
		// paths
		path_source: 'src/',
		path_dest:	'build/',
		
		// tasks
		uglify: {
		}

		coffee: {
			src: 'app.coffee',
			dest: 'app.js'
		}
	});

	// import the modules
	grunt.loadNpmTasks('grunt-coffee');

	// default task
	grunt.registerTask('default', ['coffee']);
});
