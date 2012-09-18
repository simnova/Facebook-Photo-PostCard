define([
  "app",

  //Libs
  "backbone",
  "iScroll",
  "jquery"
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
        this.model.showPictures();
        this.$el.toggleClass("selected");
      }
      // Provide data to the template
      serialize: function() {
        return this.model.toJSON();
      }

    });

    Views.Preview = Backbone.View.extend({

      tagName: "li",
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
      }

      // Provide data to the template
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
          onChange: function(coords){view.cropSelect(view,coords);},
          onSelect: function(coords){view.cropSelect(view,coords);},
          aspectRatio: 1
        });
      },

      cropSelect: function(view,coords) {
        view.cropArea = coords;
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
      //  return this.model.toJSON();
      }

    });

    Views.Pictures = Backbone.View.extend({


      tagName:"ul",
      photoScroller : undefined,
      beforeRender: function(manage){
        console.log("render photos");
        console.log("collection count: " + this.collection.length);
        this.collection.each(function(item){
          console.log("adding view for item id:" + item.id);
          this.insertView(new Views.Picture({
          //  serialize: item.toJSON(),
            model: item
          }));
        },this);
        if(manage !== undefined)  {
        //  return manage(this).render();
        }
      },
      serialize : function(){
        return this.collection;
      },

      afterRender :function(){
        photoScroller = new iScroll('pictureList', { hScrollbar: false, hScroll: false });
        setTimeout(function () {
          photoScroller.refresh();
        }, 0);

      },

      initialize: function() {
        app.dispatcher.on("showPictures",function(albumId){
          this.collection.url = 'https://graph.facebook.com/'+ albumId+ '/photos/?access_token=' + window.FB.getAccessToken();
          this.collection.fetch();

        },this);
 //       var view = this;//

        this.collection.on("reset", function() {
            console.log('resetting collection');
          this.render();
        }, this);

        this.collection.on("add", function(item) {
          console.log("adding item view: " + item.id);
          this.insertView(new Views.Picture({
         //  serialize: item,
           model : item
         })).render();
        }, this);

        this.collection.on("change", function() {
          console.log('changing collection');
          this.render();
        }, this);
      }
    });

    Views.Albums = Backbone.View.extend({

      tagName:"ul",
      ablumScroller : undefined,


      serialize : function(){
        return this.collection;
      },
      beforeRender: function(manage){
        console.log("render albums");
        console.log("collection count: " + this.collection.length);
        this.collection.each(function(item){
          console.log("adding view for item id:" + item.id);
          this.insertView(new Views.Album({
            serialize: item.toJSON(),
            model: item
          }));
        },this);
        if(manage !== undefined)  {
        //  return manage(this).render();
        }
      },
      afterRender :function(){
        ablumScroller = new iScroll('albumList', { hScrollbar: false, hScroll: false });

      },

      initialize: function() {
 //       var view = this;//

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