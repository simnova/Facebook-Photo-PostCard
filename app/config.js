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
    lodash: "../assets/js/libs/lodash",
    backbone: "../assets/js/libs/backbone",
    facebookApi: "../assets/js/libs/facebookApi",
    appConfigs: "../assets/js/libs/appConfigs",

    // JQuery Plugings
    jqueryUi: "../assets/js/libs/jquery-ui-1.8.23.custom.min",
    jqueryColor: "../assets/js/libs/jquery.color",
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

    jqueryUi: {
      deps: ["jquery"]
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
