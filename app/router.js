define([
  // Application.
  "app",
  // Modules.
  "modules/photos",
  "jqueryUi"

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

      }).render().done(function(){
        $("#tabs").tabs();

        $("#tabs").bind('tabsshow', function(event, ui) {
          if(ui.tab.hash === "#tabs-photos"){

            // There is a better apporoach to this, but this is working for now..
            // Since the tab may not be visible the iScroll doesn't work properly, so that is why this is here.
            app.layout.views[".albums"].render();
            app.layout.views[".pictures"].render();
          }
        });

      });



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
