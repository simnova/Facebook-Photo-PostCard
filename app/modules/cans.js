define([

  // Application.
  "app",

  // Libs.
  "backbone",

  // Views.
  "modules/photos/views"

],

// Map dependencies from above array.
function(app, Backbone, Views) {

  // Create a new module.
  var Cans = app.module();

  Cans.SoupCan = Backbone.Model.extend({
    /* --- */
  });

  Cans.SoupCans = Backbone.Collection.extend({
    model: Cans.SoupCan
  });

  // Photos Views
  // ------------------

  // Attach the views sub-module into this module
  Cans.Views = Views;

  // Return the module for AMD compliance.
  return Cans;

});
