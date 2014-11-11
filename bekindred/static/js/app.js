"use strict";angular.module("beKindred",["ngAnimate","ngCookies","ngTouch","ngSanitize","ngResource","ui.sortable","ya.nouislider","angucomplete-alt"]).config(function(){}).value("noUiSliderConfig",{step:1}),angular.module("beKindred").directive("ngEnter",function(){return function(e,o,n){o.bind("keydown keypress",function(o){13===o.which&&(e.$apply(function(){e.$eval(n.ngEnter)}),o.preventDefault())})}}),angular.module("beKindred").factory("GoalsFactory",["$resource",function(e){return e("/api/v1/goals/:goalId/:param",{goalId:"@goalId"},{query:{method:"GET",isArray:!1,cache:!1}})}]).factory("MessagesFactory",["$resource",function(e){return e("/api/v1/messages/:messageId/:param",{messageId:"@messageId"},{query:{method:"GET",isArray:!1,cache:!1}})}]).factory("PhotosFactory",["$resource",function(e){return e("/api/v1/photo/:photoId/:param",{photoId:"@photoId"},{query:{method:"GET",isArray:!1,cache:!1}})}]),angular.module("beKindred").controller("MainCtrl",function(){}),angular.module("beKindred").controller("PhotosController",["$scope","PhotosFactory",function(e,o){e.photos=[],e.sortableOptions={stop:function(){for(var o in e.photos)e.photos[o].order=o;console.log(e.photos)}},e.getPhotos=function(){o.query({format:"json"}).$promise.then(function(o){e.photos=o.objects})},e.getPhotos()}]),angular.module("beKindred").controller("FilterController",["$scope",function(e){e.distanceValue=50,e.distanceOptions={range:{min:1,max:1e4}},e.ageValues=[25,60],e.ageOptions={range:{min:18,max:115}},e.keywords=[],e.removeKeyword=function(o){e.keywords.splice(o,1)},e.addKeyword=function(o){""!==o&&(e.keywords.push(o),e.newKeyword="")}}]),angular.module("beKindred").controller("GoalsController",["$scope","GoalsFactory",function(e,o){e.goals=[{name:"Learn to play tennis"},{name:"Learn to play piano"},{name:"Learn to play guitar"},{name:"Learn to play football"},{name:"Learn to play basketball"},{name:"Learn to play squash"},{name:"Learn to code django"},{name:"Learn to code laravel"},{name:"Learn to code python"},{name:"Find a running partner"},{name:"Hire a cat sitter"},{name:"Move my 500 lb sofa"}],e.getGoals=function(n){o.query({query:n}).$promise.then(function(o){e.goals=o.goals})}}]).controller("MessagesController",["$scope","MessagesFactory","$timeout",function(e,o,n){e.messages=[{left:!0,content:"Hey, my name is Sasa! I'd like to help you to learn front end development",time:new Date},{left:!1,content:"Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?",time:new Date},{left:!1,content:"Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?",time:new Date},{left:!1,content:"Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?",time:new Date},{left:!1,content:"Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?",time:new Date},{left:!1,content:"Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?",time:new Date},{left:!1,content:"Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?",time:new Date},{left:!1,content:"Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?",time:new Date},{left:!1,content:"Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?",time:new Date},{left:!1,content:"Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?",time:new Date},{left:!1,content:"Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?",time:new Date},{left:!1,content:"Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?",time:new Date},{left:!1,content:"Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?",time:new Date},{left:!1,content:"Thanks for the offer! Yes, I would like to learn in. When are you available to teach me?",time:new Date}],e.q="",e.getMessages=function(){o.query({q:e.q}).$promise.then(function(o){e.messages=o.messages})},e.submit=function(){angular.element("#myform").submit()},e.sendMessage=function(){angular.element("#sendform").submit()},e.getRandomInt=function(e,o){return Math.floor(Math.random()*(o-e+1))+e},e.sendNewMessage=function(){var o={};o={left:e.getRandomInt(0,1),content:e.newmessage,time:new Date},e.messages.push(o),e.newmessage="",n(function(){var e=angular.element(".conversation-content")[0].scrollHeight;console.log(e),angular.element(".conversation-content").animate({scrollTop:e},1500)},100)}}]);