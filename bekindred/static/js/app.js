"use strict";angular.module("beKindred",["ngAnimate","ngCookies","ngTouch","ngSanitize","ngResource","ngDraggable","ya.nouislider","angucomplete-alt","underscore","checklist-model"]).config(["$httpProvider","$resourceProvider",function(o,e){o.defaults.headers.patch={"Content-Type":"application/json;charset=utf-8"},e.defaults.stripTrailingSlashes=!1,o.defaults.xsrfCookieName="csrftoken",o.defaults.xsrfHeaderName="X-CSRFToken",o.defaults.headers.post={"Content-Type":"application/json;charset=utf-8"}}]).value("noUiSliderConfig",{step:1}).directive("ngEnter",function(){return function(o,e,t){e.bind("keydown keypress",function(e){13===e.which&&(o.$apply(function(){o.$eval(t.ngEnter)}),e.preventDefault())})}}).directive("endRepeat",["$timeout",function(o){return{restrict:"A",link:function(e){e.$last===!0&&o(function(){e.$emit("ngRepeatFinished")})}}}]),angular.module("beKindred").factory("GoalsFactory",["$resource",function(o){return o("/api/v1/goals/:goalId/:param",{goalId:"@goalId"},{query:{method:"GET",isArray:!1,cache:!1}})}]).factory("MessagesFactory",["$resource",function(o){return o("/api/v1/messages/:messageId/:param",{messageId:"@messageId"},{query:{method:"GET",isArray:!1,cache:!1}})}]).factory("PhotosFactory",["$resource",function(o){return o("/api/v1/photo/:photoId/:param",{photoId:"@photoId"},{query:{method:"GET",isArray:!1,cache:!1},save:{method:"POST"},update:{method:"PATCH"},"delete":{method:"DELETE"}})}]),angular.module("beKindred").controller("MainCtrl",["$scope",function(o){o.repeatN=function(o){return new Array(o)}}]),angular.module("beKindred").controller("PhotosController",["$scope","PhotosFactory","$filter","USER_ID","USER_PHOTO","$cookies","$http",function(o,e,t,n,r){o.apiPhotos=[],o.photos=[{id:0,order:0,photo:""},{id:0,order:1,photo:""},{id:0,order:2,photo:""},{id:0,order:3,photo:""},{id:0,order:4,photo:""},{id:0,order:5,photo:""}],o.photosSlider=[],o.facebookPhotos=[{photo:"http://www.realtimearts.net/data/images/art/46/4640_profile_nilssonpolias.jpg"},{photo:"http://media.cirrusmedia.com.au/LW_Media_Library/594partner-profile-pic-An.jpg"},{photo:"http://www.exchangewire.com/wp-content/uploads/2013/10/Profile-Pic.png"},{photo:"http://fancyholidays.com/wp-content/uploads/2013/02/Andrew_avatar.jpg"},{photo:"https://www.berlinale.de/media/60_jubilaeum_1/starportraits/2011_4/2011-02-10-9358-0662_Jeff_Bridges_IMG_x900.jpg"},{photo:"http://i.telegraph.co.uk/multimedia/archive/02833/ronanfarrow_2833413b.jpg"},{photo:"http://arstechnica.com/wp-content//uploads/authors/ars_profile.jpg"},{photo:"https://pbs.twimg.com/profile_images/1771648774/Sacca_profile_400x400.jpg"}],o.onDropComplete=function(t,n,r){var a=o.photos[t],s=o.photos.indexOf(n);console.log(r),o.photos[t]=n,o.photos[t].order=t,o.photos[s]=a,o.photos[s].order=s,e.update({photoId:o.photos[t].id},{order:o.photos[t].order},function(){console.log("Photo order saved")},function(o){console.log(o)})};var a={id:0,order:0,photo:r};o.getPhotos=function(){e.query({format:"json"}).$promise.then(function(e){o.apiPhotos=e.objects,t("orderBy")(o.photos,"order",!1);for(var n in o.apiPhotos)for(var r in o.photos)o.photos[r].order==o.apiPhotos[n].order&&(o.photos[r].id=o.apiPhotos[n].id,o.photos[r].photo=o.apiPhotos[n].photo);o.photosSlider=o.apiPhotos,o.photosSlider.push(a)})},o.getPhotos(),o.deletePhoto=function(){var t=o.userPhotoDeleteIndex;e.delete({photoId:o.photos[t].id},function(){o.photos[t].photo="",console.log("Photo deleted")},function(o){console.log(o)})},o.createPhoto=function(t){console.log("Creating photo");var r=o.facebookPhotos[t],a={photo:r.photo,order:o.newPhotoIndex,user:"/api/v1/auth/user/"+n+"/"};e.save({},a,function(e){console.log(e),console.log("New photo saved."),o.getPhotos()},function(o){console.log(o)});var s=o.newPhotoIndex;o.photos[s].photo=r.photo,$("#photos_modal").modal("hide")},o.$on("ngRepeatFinished",function(){new Swiper(".swiper-container",{pagination:".pagination",loop:!1,grabCursor:!0,paginationClickable:!0});$("#photos_modal").modal("attach events",".add_photo","show"),$("#deletePhotoModal").modal("attach events",".delete_photo","show"),$(".special.cards .image").dimmer({on:"hover"})})}]),angular.module("beKindred").controller("FilterController",["$scope",function(o){o.distanceValue=50,o.distanceOptions={range:{min:1,max:1e4}},o.gender=[],o.showMessage=!1,o.ageValues=[25,60],o.ageOptions={range:{min:18,max:115}},o.myKeywords=[],o.removeKeyword=function(e){o.myKeywords.splice(e,1)},o.addKeyword=function(e){var t=_.some(o.myKeywords,function(o){return o==e});t?o.showMessage=!0:(o.myKeywords.push(e),o.newKeyword="",o.showMessage=!1)}}]),angular.module("beKindred").controller("GoalsController",["$scope","GoalsFactory",function(o,e){o.goals=[],o.getGoals=function(t){e.query({query:t}).$promise.then(function(e){o.goals=e.goals})}}]).controller("MessagesController",["$scope","MessagesFactory","$timeout",function(o,e,t){o.messages=[{left:!0,content:"Hey, my name is Sasa! I'd like to help you to learn front end development",time:new Date},{left:!1,content:"Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?",time:new Date}],o.q="",o.getMessages=function(){e.query({q:o.q}).$promise.then(function(e){o.messages=e.messages})},o.submit=function(){angular.element("#myform").submit()},o.sendMessage=function(){angular.element("#sendform").submit()},o.getRandomInt=function(o,e){return Math.floor(Math.random()*(e-o+1))+o},o.sendNewMessage=function(){var e={};e={left:o.getRandomInt(0,1),content:o.newmessage,time:new Date},o.messages.push(e),o.newmessage="",t(function(){var o=angular.element(".conversation-content")[0].scrollHeight;console.log(o),angular.element(".conversation-content").animate({scrollTop:o},1500)},100)}}]);