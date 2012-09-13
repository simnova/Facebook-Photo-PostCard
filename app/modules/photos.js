define([
  // Application.
  "app",

  // Libs
  "backbone",

  // Views
  "modules/photos/views"

],

// Map dependencies from above array.
function(app, Backbone, Views) {

  // Create a new module.
  var Photos = app.module();


  Photos.PictureModel = Backbone.Model.extend({
    parse: function(photo){
      // assuming largest photo is first
      var bigPicture = photo.images[0];

      return {
        'id' : photo.id,
        'name' : photo.name,
        'photoUrl' : bigPicture.source,
        'height' : bigPicture.height,
        'width' : bigPicture.width,
        'pictureUrl' : photo.picture,
        'accessToken' : window.FB.getAccessToken()
      };
    }
  });

  Photos.AlbumModel = Backbone.Model.extend({
    parse: function(album){
      return {
        'id' : album.id,
      'name' : album.name,
      'link' : album.link,
      'type' : album.type,
      'count': album.count,
      'coverPhoto' : album.cover_photo,
      'accessToken' : window.FB.getAccessToken()
      };
    },
    showPictures: function(){
      console.log("show pictures");
      app.dispatcher.trigger("showPictures",this.get("id"));
    }
  });

  Photos.Pictures = Backbone.Collection.extend({
    model: Photos.PictureModel,


    //url: "https://graph.facebook.com/me/albums/?access_token=AAABfujrfskkBAIZCXIJ9VTRUZCgiEC1HavoD4WnBgUXKQKYVfq3AXOYgfYvW697T5TGyR4vTgBjIJL0rQZCZAoEbOzbTifysAB5L1n9BzQZDZD",
    parse: function(response) {
      console.log("getting data back:" + response.data.length);

      return response.data;
    }
  });

  Photos.Albums = Backbone.Collection.extend({
    model: Photos.AlbumModel,
    
    parse: function(response) {
      console.log("getting data back:" + response.data.length);

      return _.filter(response.data,function(item){return item.count !== undefined;});
    }
  });


  // Photos Views
  // ------------------

  // Attach the views sub-module into this module
  Photos.Views = Views;

  // Return the module for AMD compliance.
  return Photos;

});
