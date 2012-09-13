this['JST'] = this['JST'] || {};

this['JST']['app/templates/layouts/main.html'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="fb-login-button" scope="user_photos">Login with Facebook</div> to start\r\n\r\n<div id="postcardapp">\r\n  <div  style="display:inline-block; vertical-align:top">\r\n    <h3>Albums:</h3>\r\n    <div class="albums selectList" id="albumList"></div>\r\n  </div>\r\n\r\n  <div style="display:inline-block; vertical-align:top">\r\n    <h3>Photos:</h3>\r\n    <div class="pictures selectList" id="pictureList"></div>\r\n  </div>\r\n\r\n  <div class="cropper"></div>\r\n\r\n</div>\r\n<footer>\r\n  <p>Sample Facebook Photo App</p>\r\n</footer>';
}
return __p;
};

this['JST']['app/templates/photos/album.html'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="album">\r\n  <div class="thumbnail"><img height="100px" src="https://graph.facebook.com/'+
( coverPhoto )+
'/picture/?access_token='+
( accessToken )+
'"/></div>\r\n  <div class="description">'+
( name )+
'</div>\r\n</div>';
}
return __p;
};

this['JST']['app/templates/photos/cropper.html'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<img src="'+
( photoUrl )+
'" id="jcrop_target" style="max-width:500px;max-height:500px;" />\r\n<div style="width:100px;height:100px;overflow:hidden;margin-left:5px;">\r\n  <img src="'+
( photoUrl )+
'" id="jcrop_preview" />\r\n</div>\r\n\r\n';
}
return __p;
};

this['JST']['app/templates/photos/picture.html'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="picture">\r\n  <div class="thumbnail"><img height="100px" src="'+
( pictureUrl )+
'"/></div>\r\n  <div class="description">'+
( name )+
'</div>\r\n</div>';
}
return __p;
};