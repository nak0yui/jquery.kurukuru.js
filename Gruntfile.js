/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('jquery.kurukuru.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> ' +
        '<%= pkg.homepage ? pkg.homepage : "" %> ' +
        'Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>; ' +
        'Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n'
    },
    concat: {
      dist: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          'dist/<%= pkg.name %>.js': ['src/<%= pkg.srcname %>.js']
        }
      }
    },
    uglify: {
      dist: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
        }
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<%= jshint.files %>',
      tasks: ['jshint', 'qunit']
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

};
