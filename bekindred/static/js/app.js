"use strict";angular.module("beKindred",["ngAnimate","ngCookies","ngTouch","ngSanitize","ngResource","ngDraggable","ya.nouislider","angucomplete-alt"]).config(function(){}).value("noUiSliderConfig",{step:1}),angular.module("beKindred").directive("ngEnter",function(){return function(e,o,n){o.bind("keydown keypress",function(o){13===o.which&&(e.$apply(function(){e.$eval(n.ngEnter)}),o.preventDefault())})}}),angular.module("beKindred").factory("GoalsFactory",["$resource",function(e){return e("/api/v1/goals/:goalId/:param",{goalId:"@goalId"},{query:{method:"GET",isArray:!1,cache:!1}})}]).factory("MessagesFactory",["$resource",function(e){return e("/api/v1/messages/:messageId/:param",{messageId:"@messageId"},{query:{method:"GET",isArray:!1,cache:!1}})}]).factory("PhotosFactory",["$resource",function(e){return e("/api/v1/photo/:photoId/:param",{photoId:"@photoId"},{query:{method:"GET",isArray:!1,cache:!1},save:{method:"POST"}})}]),angular.module("beKindred").controller("MainCtrl",function(){}),angular.module("beKindred").controller("PhotosController",["$scope","PhotosFactory",function(e,o){e.photos=[{order:0,photo:"http://graph.facebook.com/100008382799410/picture?type=large"},{order:1,photo:"http://www.american.edu/uploads/profiles/large/chris_palmer_profile_11.jpg"},{order:2,photo:"http://organicthemes.com/demo/profile/files/2012/12/profile_img.png"},{order:3,photo:"http://www.uwmbionlp.org/uwmbionlp/images/thumb5.jpg"},{order:4,photo:"http://darylgoodrich.com/wp-content/uploads/2011/08/person.jpg"},{order:5,photo:"http://sxsw.com/sites/default/files/news/image/Neil-deGrasse-Tyson-body.jpg"}],e.onDropComplete=function(n,t){var r=e.photos[n],a=e.photos.indexOf(t);e.photos[n]=t,e.photos[n].order=n,e.photos[a]=r,e.photos[a].order=a,o.save({format:"json",objects:e.photos},function(e){console.log("photos order saved"),console.log(e)},function(e){console.log("photos order not saved"),console.log(e)})}}]),angular.module("beKindred").controller("FilterController",["$scope",function(e){e.distanceValue=50,e.distanceOptions={range:{min:1,max:1e4}},e.ageValues=[25,60],e.ageOptions={range:{min:18,max:115}},e.keywords=[],e.removeKeyword=function(o){e.keywords.splice(o,1)},e.addKeyword=function(o){""!==o&&(e.keywords.push(o),e.newKeyword="")}}]),angular.module("beKindred").controller("GoalsController",["$scope","GoalsFactory",function(e,o){e.goals=[],e.getGoals=function(n){o.query({query:n}).$promise.then(function(o){e.goals=o.goals})}}]).controller("MessagesController",["$scope","MessagesFactory","$timeout",function(e,o,n){e.messages=[{left:!0,content:"Hey, my name is Sasa! I'd like to help you to learn front end development",time:new Date},{left:!1,content:"Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?",time:new Date}],e.q="",e.getMessages=function(){o.query({q:e.q}).$promise.then(function(o){e.messages=o.messages})},e.submit=function(){angular.element("#myform").submit()},e.sendMessage=function(){angular.element("#sendform").submit()},e.getRandomInt=function(e,o){return Math.floor(Math.random()*(o-e+1))+e},e.sendNewMessage=function(){var o={};o={left:e.getRandomInt(0,1),content:e.newmessage,time:new Date},e.messages.push(o),e.newmessage="",n(function(){var e=angular.element(".conversation-content")[0].scrollHeight;console.log(e),angular.element(".conversation-content").animate({scrollTop:e},1500)},100)}}]);