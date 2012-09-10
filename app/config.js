// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file.
  deps: ["main"],

  paths: {
    // JavaScript folders.
    libs: "../assets/js/libs",
    plugins: "../assets/js/plugins",
    vendor: "../assets/vendor",

    // Libraries.
    jquery: "../assets/js/libs/jquery",
    jqueryColor: "../assets/js/libs/jquery.color",
    lodash: "../assets/js/libs/lodash",
    backbone: "../assets/js/libs/backbone",
    facebookApi: "../assets/js/libs/facebookApi",
    appConfigs: "../assets/js/libs/appConfigs",


    iScroll: "../assets/js/libs/iscroll",
    jcrop: "../assets/js/libs/jquery.Jcrop"
  },

  shim: {
    // Backbone library depends on lodash and jQuery.
    backbone: {
      deps: ["lodash", "jquery"],
      exports: "Backbone"
    },

    facebookApi: {
      deps: ["jquery","appConfigs"]
    },

    jqueryColor: {
      deps: ["jquery"]
    },

    jcrop: {
      deps: ["jquery","jqueryColor"]
    },

    iScroll: {
      exports: "iScroll"
    },

    // Backbone.LayoutManager depends on Backbone.
    "plugins/backbone.layoutmanager": ["backbone"]
  }

});
