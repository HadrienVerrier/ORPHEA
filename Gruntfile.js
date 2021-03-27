module.exports = function (grunt) {
	grunt.initConfig({
		concat: {
			options: {
				separator: ";",
			},
			dist: {
				src: [
					"Js/JQStart.js",
					"Js/tone.js",
					"Js/instruments/drums.js",
					"Js/page.js",
					"Js/player.js",
					"Js/compose.js",
					"Js/JQEnd.js",
				],
				dest: "Dist/built.js",
			},
		},
	});

	grunt.loadNpmTasks("grunt-contrib-concat");

	grunt.registerTask("default", ["concat:dist"]);
};
