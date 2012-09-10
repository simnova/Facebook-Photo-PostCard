define([
  // Application.
  "app",

  // Modules.
  "modules/photos"
],

function(app,Photos) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index"
    },

    index: function() {
      // Create a new fb photos module
      var albums = new Photos.Albums(); 
      var pictures = new Photos.Pictures(); 
      var pictureModel = new Photos.PictureModel();

      app.useLayout("main").setViews({

        ".albums": new Photos.Views.Albums({
          collection: albums
        }),

        ".pictures": new Photos.Views.Pictures({
          collection: pictures
        }),

        ".cropper": new Photos.Views.Cropper({ 
          model : pictureModel  
        })

      }).render();

    window.FacebookAPI.done(function(){

      window.FB.Event.subscribe('auth.login', function (response) {
        console.log("user logged in");
        albums.url = "https://graph.facebook.com/me/albums/?access_token=" + window.FB.getAccessToken();
        albums.fetch();
      });

    });


      
      window.renderFB(document.getElementById('#main'));

      
    }
  });

  return Router;

});
