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
        this.model.showPictures();
      },
      // Provide data to the template
//      serialize: function() {
//        return this.model.toJSON();
//      }

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
//      serialize: function() {
//        return this.model.toJSON();
//      }

    });


    Views.Cropper = Backbone.View.extend({

      tagName: "div",
      template: "photos/cropper",
      events: {
        
      },
      afterRender :function(){
        var view = this;
        $('#jcrop_target').Jcrop({
          onChange: view.showPreview,
          onSelect: view.showPreview,
          aspectRatio: 1
        });
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

      // Provide data to the template
//      serialize: function() {
//        return this.model.toJSON();
//      }

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
            serialize: item.toJSON(),
            model: item
          }));
        },this);
        if(manage != undefined)  {
        //  return manage(this).render();
        }
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
           serialize: item,
           model : item,
         })).render();
       }, this);

        this.collection.on("change", function() {
            console.log('changing collection');
         this.render();
        }, this);
      },
    });

    Views.Albums = Backbone.View.extend({

      tagName:"ul",
      ablumScroller : undefined,


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
        if(manage != undefined)  {
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
          this.insertView(new Views.Item({
           serialize: item,
           model : item,
         })).render();
       }, this);

        this.collection.on("change", function() {
            console.log('changing collection');
         this.render();
        }, this);
      },

    });

    return Views;
  }
);