define([
  "app",

  //Libs
  "backbone",
  "iScroll",
  "jquery",
  "jcrop"
  ],
  function(app,Backbone,iScroll,$){
    var Views = {};

    Views.Album = Backbone.View.extend({

      tagName: "li",

      template: "photos/album",
      
      events: {
        "click .album" : "toggleShowPictures"
      },

      toggleShowPictures: function(){
        this.$el.toggleClass("selected"); // highlight selected album

        if(this.$el.hasClass("selected")){
          this.model.showPictures();
        }else{
          app.dispatcher.trigger("hidePictures",this.model.get("id"));
        }
        
      },
      // Provide data to the template
      serialize: function() {
        return this.model.toJSON();
      }

    });


    Views.Picture = Backbone.View.extend({

      tagName: "li",
      template: "photos/picture",

      events: {
        "click .picture" : "toggleShowCropper"
      },

      toggleShowCropper: function(){
        console.log("show cropper");
        app.dispatcher.trigger("showCropper",this.model);
      },

      // Provide data to the template
      serialize: function() {
        return this.model.toJSON();
      }

    });


    Views.Preview = Backbone.View.extend({
      tagName: "div",
      template: "photos/preview",

      events: {
        "click .saveImage" : "saveImage"
      },

      saveImage: function() {
        var view = this;
        if(view.cropArea === undefined){
          alert("You must select an area of the image.");
          return;
        }
        console.log(view.cropArea);
      },

      showPreview: function(){
        var coords = this.model.get("coords");
        var rx = 100 / coords.w;
        var ry = 100 / coords.h;

        $('#crop_preview').css({
          width: Math.round(rx * 500) + 'px',
          height: Math.round(ry * 370) + 'px',
          marginLeft: '-' + Math.round(rx * coords.x) + 'px',
          marginTop: '-' + Math.round(ry * coords.y) + 'px'
        });
      },

      initialize: function() {
        this.model.on("change", function() {
          this.render();
        }, this);

        app.dispatcher.on("updatePreview",function(cropModel){
          this.model.set(cropModel.attributes);
        },this);
      },

      serialize: function() {
        return this.model.toJSON();
      }

    });


    Views.Cropper = Backbone.View.extend({

      tagName: "div",
      template: "photos/cropper",
      cropArea: undefined,
      cropObj : undefined,

      events: {
        "click .saveImage" : "saveImage"
      },

      saveImage: function() {
        var view = this;
        if(view.cropArea === undefined){
          alert("You must select an area of the image.");
          return;
        }
        console.log(view.cropArea);
      },

      afterRender: function() {
        var view = this;
        cropObj = $('#jcrop_target').Jcrop({
          onChange: view.showPreview,
          onSelect: function(coords){view.cropSelect(view,coords);},
          aspectRatio: 1
        });
      },

      cropSelect: function(view,coords) {
        view.cropArea = coords;
        this.model.set("coords",coords);
        app.dispatcher.trigger("updatePreview",this.model);        
        view.showPreview(coords);
      },

      showPreview: function(coords){
        var rx = 100 / coords.w;
        var ry = 100 / coords.h;

        $('#jcrop_preview').css({
          width: Math.round(rx * 500) + 'px',
          height: Math.round(ry * 370) + 'px',
          marginLeft: '-' + Math.round(rx * coords.x) + 'px',
          marginTop: '-' + Math.round(ry * coords.y) + 'px'
        });
      },

      initialize: function() {
        this.model.on("change", function() {
          this.render();
        }, this);

        app.dispatcher.on("showCropper",function(photoModel){
          this.model.set(photoModel.attributes);
        },this);
      },

      serialize: function() {
        return this.model.toJSON();
      }


    });

    Views.Pictures = Backbone.View.extend({

      tagName:"ul",
      photoScroller : undefined,

      beforeRender: function(){
        console.log("render photos");
        console.log("collection count: " + this.collection.length);
        this.collection.each(function(item){
          console.log("adding view for item id:" + item.id);
          this.insertView(new Views.Picture({
            serialize: item.toJSON(),
            model: item
          }));
        },this);
      },
      
      afterRender: function(){
        console.log("picutres after render");
        if(this.photoScroller === undefined){
          this.photoScroller = new iScroll('pictureList', { hScrollbar: false, hScroll: false }); 
          var scroller = this.photoScroller;
          setTimeout(function () {
            scroller.refresh();
          }, 0);
        }else{
          var scroller = this.photoScroller;
          setTimeout(function () {
            scroller.refresh();
          }, 0);
        }
      },

      serialize: function(){
        return this.collection.toJSON();
      },

      initialize: function() {

        app.dispatcher.on("hidePictures",function(albumId){
          console.log("hiding pictures");
          this.collection.remove(this.collection.models.filter(function(model){return model.get("albumId") === albumId}));
          this.render();
        },this);

        app.dispatcher.on("showPictures",function(morePictures){
          this.collection.add(morePictures.models);
          this.afterRender();
         // this.collection.url = 'https://graph.facebook.com/'+ albumId+ '/photos/?access_token=' + window.FB.getAccessToken();
         // this.collection.fetch();

        },this);

        this.collection.on("reset", function() {
            console.log('resetting collection');
          this.render();
        }, this);

        this.collection.on("add", function(item) {
          console.log("adding item view: " + item.id);
          this.insertView(new Views.Picture({
           model : item
         })).render();
        }, this);

        this.collection.on("change", function() {
            console.log('changing collection');
         this.render();
        }, this);
      }

    });


    /**
    * Views.Albums - Albums
    *
    * @class Views.Albums
    */
    Views.Albums = Backbone.View.extend({

      tagName:"ul",
      ablumScroller : undefined,

      serialize: function(){
        return this.collection.toJSON();
      },

      beforeRender: function(){
        console.log("render albums");
        console.log("collection count: " + this.collection.length);
        this.collection.each(function(item){
          console.log("adding view for item id:" + item.id);
          this.insertView(new Views.Album({
            //serialize: item.toJSON(),
            model: item
          }));
        },this);
      },

      afterRender: function(){
        if(this.ablumScroller === undefined){
          this.ablumScroller = new iScroll('albumList', { hScrollbar: false, hScroll: false });
        }else{
          var scroller = this.ablumScroller;
          setTimeout(function () {
            scroller.refresh();
          }, 0);          
        }
      },

      initialize: function() {
        this.collection.on("reset", function() {
            console.log('resetting collection');
          this.render();
        }, this);

        this.collection.on("add", function(item) {
          console.log("adding item view: " + item.id);
          this.insertView(new Views.Album({
           serialize: item,
           model : item
         })).render();
       }, this);

        this.collection.on("change", function() {
            console.log('changing collection');
         this.render();
        }, this);
      }

    });

    return Views;
  }
);