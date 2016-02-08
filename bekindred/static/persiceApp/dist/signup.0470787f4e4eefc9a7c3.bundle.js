webpackJsonp([2],{855:function(module,exports,__webpack_require__){(function(__decorate,__metadata){var core_1=__webpack_require__(1),router_1=__webpack_require__(17),signup_interests_component_1=__webpack_require__(859),signup_goals_component_1=__webpack_require__(857),signup_offers_component_1=__webpack_require__(860),signup_connect_component_1=__webpack_require__(856),signup_header_component_1=__webpack_require__(858),interests_service_1=__webpack_require__(93),keywords_service_1=__webpack_require__(64),goals_service_1=__webpack_require__(92),offers_service_1=__webpack_require__(95),userauth_service_1=__webpack_require__(68),onboarding_service_1=__webpack_require__(212),warning_service_1=__webpack_require__(138),view=__webpack_require__(483),SignupComponent=function(){function SignupComponent(router,location,goalsService,offersService,interestsService,userAuthService,onboardingService,warningService){var _this=this;this.goalsService=goalsService,this.offersService=offersService,this.interestsService=interestsService,this.userAuthService=userAuthService,this.onboardingService=onboardingService,this.warningService=warningService,this.page=1,this.cGoa=0,this.cOff=0,this.cInt=0,this.showSkip=!1,this.nextStep="SignupGoals",this.nextTitle="Next",this.is_complete=null,this.notificationMain={body:"",title:"",active:!1,type:""},this.router=router,this.location=location;var subs=null;this.router.subscribe(function(path){subs&&(subs.unsubscribe(),subs=null),_this.myElem1&&(subs=_this.myElem1.counter.subscribe(function(message){_this.onCounterChanged(message),message.count>=3&&_this.warningService.push(!1)})),_this.myElem2&&(subs=_this.myElem2.counter.subscribe(function(message){return _this.onCounterChanged(message)})),_this.myElem3&&(subs=_this.myElem3.counter.subscribe(function(message){return _this.onCounterChanged(message)})),_this.onRouteChanged(path)})}return SignupComponent.prototype.ngOnInit=function(){var _this=this;this.userAuthService.findOneByUri("me").subscribe(function(data){var res=data;_this.cGoa=res.goals.length,_this.cOff=res.offers.length,_this.cInt=res.interests.length,_this.is_complete=res.onboardingflow})},SignupComponent.prototype.ngOnDestroy=function(){},SignupComponent.prototype.onRouteChanged=function(path){switch(path){case"interests":this.page=1,this.showSkip=!1,this.nextStep="SignupGoals",this.nextTitle="Next";break;case"goals":this.page=2,this.showSkip=!0,this.nextStep="SignupOffers",this.nextTitle="Next";break;case"offers":this.page=3,this.showSkip=!0,this.nextStep="SignupConnect",this.nextTitle="Next";break;case"connect":this.page=4,this.showSkip=!0,this.nextStep=null,this.nextTitle="Go!";break;default:this.page=1,this.showSkip=!1,this.nextStep="SignupGoals",this.nextTitle="Next"}},SignupComponent.prototype.next=function(event){if(this.nextStep){switch(this.nextStep){case"SignupGoals":if(this.cInt<3)return void this.warningService.push(!0);this.warningService.push(!1)}this.router.navigate([this.nextStep])}else this.completeOnboarding()},SignupComponent.prototype.skip=function(event){this.nextStep?this.router.navigate([this.nextStep]):this.completeOnboarding()},SignupComponent.prototype.completeOnboarding=function(){null===this.is_complete?this.onboardingService.complete().subscribe(function(data){window.location.href="/crowd/"},function(err){},function(){}):window.location.href="/crowd/"},SignupComponent.prototype.onCounterChanged=function(event){switch(event.type){case"interests":this.cInt=event.count;break;case"goals":this.cGoa=event.count;break;case"offers":this.cOff=event.count}},__decorate([core_1.ViewChild(signup_interests_component_1.SignupInterestsComponent),__metadata("design:type",signup_interests_component_1.SignupInterestsComponent)],SignupComponent.prototype,"myElem1",void 0),__decorate([core_1.ViewChild(signup_goals_component_1.SignupGoalsComponent),__metadata("design:type",signup_goals_component_1.SignupGoalsComponent)],SignupComponent.prototype,"myElem2",void 0),__decorate([core_1.ViewChild(signup_offers_component_1.SignupOffersComponent),__metadata("design:type",signup_offers_component_1.SignupOffersComponent)],SignupComponent.prototype,"myElem3",void 0),SignupComponent=__decorate([core_1.Component({template:view,selector:"persice-signup",directives:[signup_header_component_1.SignupHeaderComponent,router_1.ROUTER_DIRECTIVES],providers:[interests_service_1.InterestsService,goals_service_1.GoalsService,offers_service_1.OffersService,keywords_service_1.KeywordsService,userauth_service_1.UserAuthService,onboarding_service_1.OnboardingService,warning_service_1.WarningService]}),router_1.RouteConfig([{path:"/",redirectTo:["SignupInterests"]},{path:"/interests",component:signup_interests_component_1.SignupInterestsComponent,name:"SignupInterests",data:{page:1}},{path:"/goals",component:signup_goals_component_1.SignupGoalsComponent,name:"SignupGoals",data:{page:2}},{path:"/offers",component:signup_offers_component_1.SignupOffersComponent,name:"SignupOffers",data:{page:3}},{path:"/connect",component:signup_connect_component_1.SignupConnectComponent,name:"SignupConnect",data:{page:4}}]),__metadata("design:paramtypes",[router_1.Router,router_1.Location,goals_service_1.GoalsService,offers_service_1.OffersService,interests_service_1.InterestsService,userauth_service_1.UserAuthService,onboarding_service_1.OnboardingService,warning_service_1.WarningService])],SignupComponent)}();exports.SignupComponent=SignupComponent}).call(exports,__webpack_require__(3),__webpack_require__(4))},483:function(module,exports){module.exports='<div class="signup">\n  <signup-header [nextTitle]="nextTitle" [showSkip]="showSkip" (skip)="skip($event)" (next)="next($event)" [page]="page" [counterInterests]="cInt" [counterOffers]="cOff" [counterGoals]="cGoa"></signup-header>\n  <div class="signup__content">\n    <ul class="signup-pager">\n      <li [ngClass]="{\'signup-pager__curent\': page === 1, \'signup-pager__completed\': page >= 2}">1</li>\n      <li [ngClass]="{\'signup-pager__curent\': page === 2,\'signup-pager__completed\': page >= 3}">2</li>\n      <li [ngClass]="{\'signup-pager__curent\': page === 3, \'signup-pager__completed\': page === 4}">3</li>\n      <li [ngClass]="{\'signup-pager__curent\': page === 4}">4</li>\n    </ul>\n    <router-outlet></router-outlet>\n  </div>\n</div>\n'},856:function(module,exports,__webpack_require__){(function(__decorate,__metadata){var core_1=__webpack_require__(1),userauth_service_1=__webpack_require__(68),view=__webpack_require__(484),SignupConnectComponent=function(){function SignupConnectComponent(service,_ngZone){this.service=service,this._ngZone=_ngZone,this.connectStatus={twitter:{connected:!1,username:"Your twitter account",url:""},linkedin:{connected:!1,username:"Your linkedin account",url:""}}}return SignupConnectComponent.prototype.ngOnInit=function(){var _this=this;this.getConnectStatus(),jQuery(".connect-media").on("persice:refreshConnect",function(e){_this.refreshConnectInfo()})},SignupConnectComponent.prototype.refreshConnectInfo=function(){var _this=this;this.service.findOneByUri("me").subscribe(function(data){_this.getConnectStatus()})},SignupConnectComponent.prototype.getConnectStatus=function(){var _this=this;this._ngZone.run(function(){_this.connectStatus=_this.service.getConnectStatus()})},SignupConnectComponent.prototype.toggle=function(provider){this.connectStatus[provider].connected?this.disconnect(provider):this.connect(provider)},SignupConnectComponent.prototype.connect=function(provider){var w=400,h=300,dualScreenLeft=window.screenLeft,dualScreenTop=window.screenTop,width=window.innerWidth?window.innerWidth:document.documentElement.clientWidth?document.documentElement.clientWidth:screen.width,height=window.innerHeight?window.innerHeight:document.documentElement.clientHeight?document.documentElement.clientHeight:screen.height,left=width/2-w/2+dualScreenLeft,top=height/2-h/2+dualScreenTop,settings="height="+h+",width="+w+",left="+left+",top="+top+",resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=yes,directories=no,status=yes",url="/social/associate/"+provider+"/?next=/goals/close_login_popup/",newWindow=window.open(url,"Connecting your "+provider+" account...",settings);window.focus&&newWindow.focus()},SignupConnectComponent.prototype.disconnect=function(provider){var w=400,h=300,dualScreenLeft=window.screenLeft,dualScreenTop=window.screenTop,width=window.innerWidth?window.innerWidth:document.documentElement.clientWidth?document.documentElement.clientWidth:screen.width,height=window.innerHeight?window.innerHeight:document.documentElement.clientHeight?document.documentElement.clientHeight:screen.height,left=width/2-w/2+dualScreenLeft,top=height/2-h/2+dualScreenTop,settings="height="+h+",width="+w+",left="+left+",top="+top+",resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=yes,directories=no,status=yes",url="/social/disconnect/"+provider+"/?next=/goals/close_login_popup/",newWindow=window.open(url,"Disconnecting your "+provider+" account...",settings);window.focus&&newWindow.focus()},SignupConnectComponent.prototype.openUrl=function(provider){if(this.connectStatus[provider].connected){var win=window.open(this.connectStatus[provider].url,"_blank");win.focus()}},SignupConnectComponent=__decorate([core_1.Component({selector:"signup-connect",template:view}),__metadata("design:paramtypes",[userauth_service_1.UserAuthService,core_1.NgZone])],SignupConnectComponent)}();exports.SignupConnectComponent=SignupConnectComponent}).call(exports,__webpack_require__(3),__webpack_require__(4))},484:function(module,exports){module.exports='<h2 class="signup-step__title mb mt+">Connect your LinkedIn and <br> Twitter accounts</h2>\n<p class="signup-step__subtitle">\n  This will improve your match results within the Persice community.\n  <br>\n  <svg role="img" class="icon">\n    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-lock"></use>\n  </svg> Persice will never share your information or post on your behalf.\n</p>\n<ul class="connect-media">\n  <li>\n    <div (click)="openUrl(\'twitter\')" class="connect-media__url" [ngClass]="{\'connect-media__url--activated\': connectStatus.twitter.connected}">\n      <svg role="img" class="icon icon--large icon--twitter">\n        <use xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-twitter-share"></use>\n      </svg> <span class="connect-media__title connect-media__title--twitter">twitter</span>\n    </div>\n    <p class="connect-media__username" [ngClass]="{\'connect-media__username--activated\': connectStatus.twitter.connected}">{{connectStatus.twitter.username}}</p>\n    <a id="linkedinLink" (click)="toggle(\'twitter\')" [ngClass]="{\'is-active\': connectStatus.twitter.connected}" class="btn btn-1 btn-1--connect btn-1--connect--twitter btn--full btn--connect js-accept">\n      <div class="btn--connect__label">Connect</div>\n      <svg role="img" class="icon">\n        <use xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-success-2"></use>\n      </svg>\n    </a>\n  </li>\n  <li>\n    <div (click)="openUrl(\'linkedin\')" class="connect-media__url" [ngClass]="{\'connect-media__url--activated\': connectStatus.linkedin.connected}">\n      <svg role="img" class="icon icon--large icon--linkedin">\n        <use xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-linkedin-share"></use>\n      </svg> <span class="connect-media__title connect-media__title--linkedin">linkedin</span>\n    </div>\n    <p class="connect-media__username" [ngClass]="{\'connect-media__username--activated\': connectStatus.linkedin.connected}">{{connectStatus.linkedin.username}}</p>\n    <a id="linkedinLink" (click)="toggle(\'linkedin\')" [ngClass]="{\'is-active\': connectStatus.linkedin.connected}" class="btn btn-1 btn-1--connect btn-1--connect--linkedin btn--full btn--connect js-accept">\n      <div class="btn--connect__label">Connect</div>\n      <svg role="img" class="icon">\n        <use xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-success-2"></use>\n      </svg>\n    </a>\n  </li>\n</ul>\n<a class="mr" href="#"></a>\n<a href="#"></a>\n'},857:function(module,exports,__webpack_require__){(function(__decorate,__metadata){var core_1=__webpack_require__(1),lodash_1=__webpack_require__(21),goals_service_1=__webpack_require__(92),loading_component_1=__webpack_require__(18),view=__webpack_require__(485),SignupGoalsComponent=function(){function SignupGoalsComponent(goalsService){this.goalsService=goalsService,this.counter=new core_1.EventEmitter,this.items=[],this.loading=!1,this.isListEmpty=!1,this.limit=12,this.query="",this.next="",this.total_count=0,this.offset=0,this.newGoal="",this.saveLoading=!1}return SignupGoalsComponent.prototype.ngOnInit=function(){this.initializeTokenInput(),this.getList()},SignupGoalsComponent.prototype.ngOnDestroy=function(){jQuery("#goalsInput").typeahead("destroy")},SignupGoalsComponent.prototype.initializeTokenInput=function(){var _this=this,keywordsEngine=new Bloodhound({remote:{url:"/api/v1/subject/?format=json&description__icontains=%QUERY",filter:function(x){return jQuery.map(x.objects,function(item){return item.description})},wildcard:"%QUERY"},datumTokenizer:Bloodhound.tokenizers.whitespace,queryTokenizer:Bloodhound.tokenizers.whitespace});keywordsEngine.initialize(),jQuery("#goalsInput").typeahead({hint:!1,highlight:!0,minLength:2,limit:20},{source:keywordsEngine}),jQuery("#goalsInput").bind("typeahead:select",function(ev,suggestion){_this.saveLoading||(_this.saveLoading=!0,_this.saveGoal(suggestion))})},SignupGoalsComponent.prototype.saveGoal=function(goal){var _this=this;return 0===goal.length||goal.length>100?(this.status="failure",void(this.saveLoading=!1)):void this.goalsService.save(goal).subscribe(function(res){var newItem=res;_this.items.push(newItem),_this.status="success",_this.total_count++,_this.counter.next({type:"goals",count:_this.total_count}),0===_this.total_count?_this.isListEmpty=!0:_this.isListEmpty=!1,_this.newGoal="",jQuery("#goalsInput").typeahead("val",""),_this.saveLoading=!1},function(err){var error=JSON.parse(err._body);"goal"in error&&(_this.status="failure"),_this.saveLoading=!1},function(){})},SignupGoalsComponent.prototype.inputChanged=function(event){13!==event.which?this.status=null:this.addGoal()},SignupGoalsComponent.prototype.addGoal=function(){this.saveLoading||(this.saveLoading=!0,this.saveGoal(this.newGoal))},SignupGoalsComponent.prototype.removeGoal=function(event){var _this=this,idx=lodash_1.findIndex(this.items,event);this.items[idx]&&this.goalsService.delete(event.resource_uri).subscribe(function(res){_this.items.splice(idx,1),_this.total_count--,_this.counter.next({type:"goals",count:_this.total_count}),0===_this.total_count?_this.isListEmpty=!0:_this.isListEmpty=!1})},SignupGoalsComponent.prototype.getList=function(){var _this=this;null!==this.next&&(this.loading=!0,this.goalsService.get(this.next,100).subscribe(function(data){return _this.assignList(data)},function(err){_this.loading=!1},function(){}))},SignupGoalsComponent.prototype.refreshList=function(){document.body.scrollTop=document.documentElement.scrollTop=0,this.items.splice(0,this.items.length),this.isListEmpty=!1,this.next="",this.getList()},SignupGoalsComponent.prototype.assignList=function(data){if(this.loading=!1,this.total_count=data.meta.total_count,this.counter.next({type:"goals",count:this.total_count}),0===this.total_count)return void(this.isListEmpty=!0);if(this.isListEmpty=!1,this.items.length>0)for(var more=data.objects,i=0;i<=more.length-1;i++)this.items.push(more[i]);else this.items=data.objects;this.next=data.meta.next,this.offset=data.meta.offset,null!==this.next?jQuery("#goals").bind("scroll",this.handleScrollEvent.bind(this)):jQuery("#goals").unbind("scroll")},SignupGoalsComponent.prototype.handleScrollEvent=function(event){var scrollOffset=jQuery("#goals").scrollTop()+jQuery("#goals").innerHeight(),threshold=jQuery("#goals")[0].scrollHeight;this.next&&scrollOffset>=threshold&&(this.loading||this.getList())},__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],SignupGoalsComponent.prototype,"counter",void 0),SignupGoalsComponent=__decorate([core_1.Component({selector:"signup-goals",template:view,directives:[loading_component_1.LoadingComponent]}),__metadata("design:paramtypes",[goals_service_1.GoalsService])],SignupGoalsComponent)}();exports.SignupGoalsComponent=SignupGoalsComponent}).call(exports,__webpack_require__(3),__webpack_require__(4))},485:function(module,exports){module.exports='<h2 class="signup-step__title">My goal is to...</h2>\n<div class="search-signup-wrapper">\n  <div class="search search--signup typeahead-search">\n    <div class="search__top">\n      <svg role="img" class="icon">\n        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-search"></use>\n      </svg>\n      <input [(ngModel)]="newGoal" (keyup)="inputChanged($event)" type="text" id="goalsInput" class="search__input typeahead" placeholder="Enter a few goals here">\n      <div class="search__notification search__notification--error" [ngClass]="{\'is-visible\': status === \'failure\'}">\n        <svg role="img" class="icon ">\n          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-failure"></use>\n        </svg>\n      </div>\n      <div class="search__notification search__notification--succes" [ngClass]="{\'is-visible\': status === \'success\'}">\n        <svg role="img" class="icon ">\n          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-success-2"></use>\n        </svg>\n      </div>\n      <button class="btn">\n        <svg role="img" class="icon" (click)="addGoal($event)">\n          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-plus-big"></use>\n        </svg>\n      </button>\n    </div>\n  </div>\n  <div class="search__tags-wrapper text-left" id="goals" [ngClass]="{\'has-signup-empty-state\': isListEmpty}">\n    <span class="search-tag-secondary" *ngFor="#item of items">\n      <a (click)="removeGoal(item)">\n        <svg role="img" class="icon icon--tiny">\n          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-delete"></use>\n        </svg>\n      </a>\n      {{item.subject}}\n    </span>\n    <div class="signup-empty-state" [ngClass]="{\'is-visible\': isListEmpty}">\n      <svg role="img" class="icon signup-empty-state__icon">\n        <use xlink:href="/static/persiceApp/src/assets/icons/icons.svg#no-goals"></use>\n      </svg>\n      <h3 class="signup-empty-state__title">"Goals" are things you want to achieve.</h3>\n      <p class="signup-empty-state__par signup-empty-state__par--prom">For example:</p>\n      <p class="signup-empty-state__par">"Learn how to salsa dance" or\n        <br>"Discover new hiking trails"</p>\n    </div>\n  </div>\n</div>\n'},858:function(module,exports,__webpack_require__){(function(__decorate,__metadata){var core_1=__webpack_require__(1),router_1=__webpack_require__(17),view=__webpack_require__(486),SignupHeaderComponent=function(){function SignupHeaderComponent(){this.next=new core_1.EventEmitter,this.skip=new core_1.EventEmitter}return __decorate([core_1.Input(),__metadata("design:type",Object)],SignupHeaderComponent.prototype,"counterInterests",void 0),__decorate([core_1.Input(),__metadata("design:type",Object)],SignupHeaderComponent.prototype,"counterGoals",void 0),__decorate([core_1.Input(),__metadata("design:type",Object)],SignupHeaderComponent.prototype,"counterOffers",void 0),__decorate([core_1.Input(),__metadata("design:type",Object)],SignupHeaderComponent.prototype,"page",void 0),__decorate([core_1.Input(),__metadata("design:type",Object)],SignupHeaderComponent.prototype,"nextTitle",void 0),__decorate([core_1.Input(),__metadata("design:type",Object)],SignupHeaderComponent.prototype,"showSkip",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],SignupHeaderComponent.prototype,"next",void 0),__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],SignupHeaderComponent.prototype,"skip",void 0),SignupHeaderComponent=__decorate([core_1.Component({selector:"signup-header",template:view,directives:[router_1.ROUTER_DIRECTIVES]}),__metadata("design:paramtypes",[])],SignupHeaderComponent)}();exports.SignupHeaderComponent=SignupHeaderComponent}).call(exports,__webpack_require__(3),__webpack_require__(4))},486:function(module,exports){module.exports='<header class="header-signup">\n  <div class="layout layout--middle">\n    <div class="layout__item 2/3">\n      <div class="layout layout--auto">\n        <div class="layout__item">\n          <div class="header-signup__logo-place">\n            <a class="site-logo" href="/signup">\n              <img alt="#" src="/static/persiceApp/src/assets/images/logo.svg" class="site-logo__mark">\n              <h1 class="site-logo__type">Persice</h1>\n            </a>\n          </div>\n        </div>\n        <div class="layout__item">\n          <ul class="header-signup__steps">\n            <li *ngIf="page >= 1"><a [routerLink]="[\'./SignupInterests\']"><b>{{counterInterests}}</b> interests</a></li>\n            <li *ngIf="page >= 2"><a [routerLink]="[\'./SignupGoals\']"><b>{{counterGoals}}</b> goals</a></li>\n            <li *ngIf="page >= 3"><a [routerLink]="[\'./SignupOffers\']"><b>{{counterOffers}}</b> offers</a></li>\n          </ul>\n        </div>\n      </div>\n    </div>\n    <div class="layout__item 1/3 text-right pr">\n      <a *ngIf="showSkip" (click)="skip.next($event)" class="link--darkgrey mr">Skip</a>\n      <a (click)="next.next($event)" class="btn btn-1 btn-1--green btn-1--medium ">{{nextTitle}}</a>\n    </div>\n  </div>\n</header>\n'},859:function(module,exports,__webpack_require__){(function(__decorate,__metadata){var core_1=__webpack_require__(1),lodash_1=__webpack_require__(21),interests_service_1=__webpack_require__(93),keywords_service_1=__webpack_require__(64),warning_service_1=__webpack_require__(138),loading_component_1=__webpack_require__(18),view=__webpack_require__(487),SignupInterestsComponent=function(){function SignupInterestsComponent(interestsService,keywordsService,warningService){this.interestsService=interestsService,this.keywordsService=keywordsService,this.warningService=warningService,this.counter=new core_1.EventEmitter,this.items=[],this.loading=!1,this.isListEmpty=!1,this.limit=12,this.query="",this.next="",this.total_count=0,this.offset=0,this.newInterest="",this.saveLoading=!1,this.showWarning=!1,this.userInterest=[],this.userInterestCounter=0}return SignupInterestsComponent.prototype.ngOnInit=function(){var _this=this;this.initializeTokenInput(),this.getList(),this.subs&&this.subs.unsubscribe(),this.subs=this.warningService.observer().subscribe(function(event){return _this.showWarning=event})},SignupInterestsComponent.prototype.ngOnDestroy=function(){this.subs&&this.subs.unsubscribe()},SignupInterestsComponent.prototype.initializeTokenInput=function(){var _this=this,keywordsEngine=new Bloodhound({remote:{url:"/api/v1/interest_subject/?format=json&description__icontains=%QUERY",filter:function(x){return jQuery.map(x.objects,function(item){return item.description})},wildcard:"%QUERY"},datumTokenizer:Bloodhound.tokenizers.whitespace,queryTokenizer:Bloodhound.tokenizers.whitespace});keywordsEngine.initialize(),jQuery("#interestsInput").typeahead({hint:!1,highlight:!0,minLength:2,limit:20},{source:keywordsEngine}),jQuery("#interestsInput").bind("typeahead:select",function(ev,suggestion){_this.saveLoading||(_this.saveLoading=!0,_this.saveInterest(suggestion))})},SignupInterestsComponent.prototype.saveInterest=function(interest){var _this=this;if(0===interest.length||interest.length>100)return this.status="failure",void(this.saveLoading=!1);var idx=lodash_1.findIndex(this.items,{description:interest});this.items[idx]?this.items[idx].active?(this.status="failure",this.saveLoading=!1):this.interestsService.save(this.items[idx].description).subscribe(function(res){_this.saveLoading=!1,_this.items[idx].active=!0,_this.items[idx].interest_resource=res.resource_uri,_this.userInterestCounter++,_this.counter.next({type:"interests",count:_this.userInterestCounter}),_this.status="success",_this.newInterest="",jQuery("#interestsInput").typeahead("val","")},function(err){_this.status="failure",_this.saveLoading=!1},function(){}):this.interestsService.save(interest).subscribe(function(res){_this.saveLoading=!1;var newItem=res;newItem.active=!0,newItem.description=res.interest_subject,newItem.interest_resource=res.resource_uri,_this.items.push(newItem),_this.status="success",_this.userInterestCounter++,_this.counter.next({type:"interests",count:_this.userInterestCounter}),_this.newInterest="",jQuery("#interestsInput").typeahead("val",""),_this.refreshList()},function(err){_this.status="failure",_this.saveLoading=!1},function(){})},SignupInterestsComponent.prototype.inputChanged=function(event){13!==event.which?this.status=null:this.addInterest()},SignupInterestsComponent.prototype.addInterest=function(){this.saveLoading||(this.saveLoading=!0,this.saveInterest(this.newInterest))},SignupInterestsComponent.prototype.getList=function(){var _this=this;null!==this.next&&(this.loading=!0,this.interestsService.get("",2e3).mergeMap(function(data){return _this.userInterestCounter=data.meta.total_count,_this.counter.next({type:"interests",count:_this.userInterestCounter}),_this.userInterestCounter>0&&(_this.userInterest=data.objects),_this.keywordsService.get(_this.next,100,_this.newInterest)}).subscribe(function(data){return _this.assignList(data)},function(err){console.log(err),_this.loading=!1},function(){}))},SignupInterestsComponent.prototype.refreshList=function(){document.body.scrollTop=document.documentElement.scrollTop=0,this.items.splice(0,this.items.length),this.isListEmpty=!1,this.next="",this.saveLoading=!1,this.userInterest.splice(0,this.userInterest.length),this.userInterestCounter=0,this.getList()},SignupInterestsComponent.prototype.assignList=function(data){if(this.loading=!1,this.total_count=data.meta.total_count,0===this.total_count)return void(this.isListEmpty=!0);this.isListEmpty=!1;for(var more=data.objects,i=0;i<=more.length-1;i++){more[i].active=!1,more[i].interest_resource=null;for(var j=this.userInterest.length-1;j>=0;j--)more[i].resource_uri===this.userInterest[j].interest&&(more[i].interest_resource=this.userInterest[j].resource_uri,more[i].active=!0);this.items.push(more[i])}this.next=data.meta.next,this.offset=data.meta.offset,null!==this.next?jQuery("#interests").bind("scroll",this.handleScrollEvent.bind(this)):jQuery("#interests").unbind("scroll")},SignupInterestsComponent.prototype.handleScrollEvent=function(event){var scrollOffset=jQuery("#interests").scrollTop()+jQuery("#interests").innerHeight(),threshold=jQuery("#interests")[0].scrollHeight;this.next&&scrollOffset>=threshold&&(this.loading||this.getList())},SignupInterestsComponent.prototype.onInterestClick=function(event){var _this=this;this.status=null;var idx=lodash_1.findIndex(this.items,event);if(this.items[idx])if(this.items[idx].active){var url=this.items[idx].interest_resource;this.interestsService.delete(url).subscribe(function(res){_this.items[idx].active=!1,_this.items[idx].interest_resource=null,_this.userInterestCounter--,_this.counter.next({type:"interests",count:_this.userInterestCounter})},function(err){_this.status="failure"},function(){})}else this.interestsService.save(this.items[idx].description).subscribe(function(res){_this.items[idx].active=!0,_this.items[idx].interest_resource=res.resource_uri,_this.userInterestCounter++,_this.counter.next({type:"interests",count:_this.userInterestCounter})},function(err){_this.status="failure"},function(){})},__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],SignupInterestsComponent.prototype,"counter",void 0),SignupInterestsComponent=__decorate([core_1.Component({selector:"signup-interests",template:view,directives:[loading_component_1.LoadingComponent]}),__metadata("design:paramtypes",[interests_service_1.InterestsService,keywords_service_1.KeywordsService,warning_service_1.WarningService])],SignupInterestsComponent)}();exports.SignupInterestsComponent=SignupInterestsComponent}).call(exports,__webpack_require__(3),__webpack_require__(4))},487:function(module,exports){module.exports='<h2 class="signup-step__title">What interests you?</h2>\n<p class="signup-step__subtitle signup-step__subtitle__warning" *ngIf="showWarning">Please select at least three.</p>\n<div class="search-signup-wrapper">\n  <div class="search search--signup typeahead-search">\n    <div class="search__top" id="interestsSearch">\n      <svg role="img" class="icon ">\n        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-search"></use>\n      </svg>\n      <input [(ngModel)]="newInterest" (keyup)="inputChanged($event)" type="text" class="search__input typeahead" id="interestsInput" placeholder="Enter your interests or search existing">\n      <div class="search__notification search__notification--error" [ngClass]="{\'is-visible\': status === \'failure\'}">\n        <svg role="img" class="icon ">\n          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-failure"></use>\n        </svg>\n      </div>\n      <div class="search__notification search__notification--succes" [ngClass]="{\'is-visible\': status === \'success\'}">\n        <svg role="img" class="icon ">\n          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-success-2"></use>\n        </svg>\n      </div>\n      <button class="btn" (click)="addInterest($event)">\n        <svg role="img" class="icon ">\n          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-plus-big"></use>\n        </svg>\n      </button>\n    </div>\n  </div>\n  <div class="search__tags-wrapper" id="interests">\n    <span (click)="onInterestClick(item)" [ngClass]="{\'is-current\': item.active}" class="search-tag" *ngFor="#item of items">{{item.description}}</span>\n    <loading [status]="loading"></loading>\n  </div>\n</div>\n'},860:function(module,exports,__webpack_require__){(function(__decorate,__metadata){var core_1=__webpack_require__(1),router_1=__webpack_require__(17),lodash_1=__webpack_require__(21),offers_service_1=__webpack_require__(95),loading_component_1=__webpack_require__(18),view=__webpack_require__(488),SignupOffersComponent=function(){function SignupOffersComponent(offersService){this.offersService=offersService,this.counter=new core_1.EventEmitter,this.items=[],this.loading=!1,this.isListEmpty=!1,this.limit=12,this.query="",this.next="",this.total_count=0,this.offset=0,this.newOffer="",this.saveLoading=!1}return SignupOffersComponent.prototype.routerOnActivate=function(next,prev){console.log('Finished navigating from "'+(prev?prev.urlPath:"null")+'" to "'+next.urlPath+'"')},SignupOffersComponent.prototype.ngOnInit=function(){this.initializeTokenInput(),this.getList()},SignupOffersComponent.prototype.ngOnDestroy=function(){jQuery("#offersInput").typeahead("destroy")},SignupOffersComponent.prototype.initializeTokenInput=function(){var _this=this,keywordsEngine=new Bloodhound({remote:{url:"/api/v1/subject/?format=json&description__icontains=%QUERY",filter:function(x){return jQuery.map(x.objects,function(item){return item.description})},wildcard:"%QUERY"},datumTokenizer:Bloodhound.tokenizers.whitespace,queryTokenizer:Bloodhound.tokenizers.whitespace});keywordsEngine.initialize(),jQuery("#offersInput").typeahead({hint:!1,highlight:!0,
minLength:2,limit:20},{source:keywordsEngine}),jQuery("#offersInput").bind("typeahead:select",function(ev,suggestion){_this.saveLoading||(_this.saveLoading=!0,_this.saveOffer(suggestion))})},SignupOffersComponent.prototype.saveOffer=function(offer){var _this=this;return 0===offer.length||offer.length>100?(this.status="failure",void(this.saveLoading=!1)):void this.offersService.save(offer).subscribe(function(res){var newItem=res;_this.items.push(newItem),_this.status="success",_this.total_count++,_this.counter.next({type:"offers",count:_this.total_count}),0===_this.total_count?_this.isListEmpty=!0:_this.isListEmpty=!1,_this.newOffer="",jQuery("#offersInput").typeahead("val",""),_this.saveLoading=!1},function(err){var error=JSON.parse(err._body);"offer"in error&&(_this.status="failure"),_this.saveLoading=!1},function(){})},SignupOffersComponent.prototype.inputChanged=function(event){13!==event.which?this.status=null:this.addOffer()},SignupOffersComponent.prototype.addOffer=function(){this.saveLoading||(this.saveLoading=!0,this.saveOffer(this.newOffer))},SignupOffersComponent.prototype.removeOffer=function(event){var _this=this,idx=lodash_1.findIndex(this.items,event);this.items[idx]&&this.offersService.delete(event.resource_uri).subscribe(function(res){_this.items.splice(idx,1),_this.total_count--,_this.counter.next({type:"offers",count:_this.total_count}),0===_this.total_count?_this.isListEmpty=!0:_this.isListEmpty=!1})},SignupOffersComponent.prototype.getList=function(){var _this=this;null!==this.next&&(this.loading=!0,this.offersService.get(this.next,100).subscribe(function(data){return _this.assignList(data)},function(err){_this.loading=!1},function(){}))},SignupOffersComponent.prototype.refreshList=function(){document.body.scrollTop=document.documentElement.scrollTop=0,this.items.splice(0,this.items.length),this.isListEmpty=!1,this.next="",this.getList()},SignupOffersComponent.prototype.assignList=function(data){if(this.loading=!1,this.total_count=data.meta.total_count,this.counter.next({type:"offers",count:this.total_count}),0===this.total_count)return void(this.isListEmpty=!0);if(this.isListEmpty=!1,this.items.length>0)for(var more=data.objects,i=0;i<=more.length-1;i++)this.items.push(more[i]);else this.items=data.objects;this.next=data.meta.next,this.offset=data.meta.offset,null!==this.next?jQuery("#offers").bind("scroll",this.handleScrollEvent.bind(this)):jQuery("#offers").unbind("scroll")},SignupOffersComponent.prototype.handleScrollEvent=function(event){var scrollOffset=jQuery("#offers").scrollTop()+jQuery("#offers").innerHeight(),threshold=jQuery("#offers")[0].scrollHeight;this.next&&scrollOffset>=threshold&&(this.loading||this.getList())},__decorate([core_1.Output(),__metadata("design:type",core_1.EventEmitter)],SignupOffersComponent.prototype,"counter",void 0),SignupOffersComponent=__decorate([core_1.Component({selector:"signup-offers",template:view,directives:[loading_component_1.LoadingComponent]}),router_1.CanActivate(function(){return!0}),__metadata("design:paramtypes",[offers_service_1.OffersService])],SignupOffersComponent)}();exports.SignupOffersComponent=SignupOffersComponent}).call(exports,__webpack_require__(3),__webpack_require__(4))},488:function(module,exports){module.exports='<h2 class="signup-step__title">I can help people...</h2>\n<div class="search-signup-wrapper">\n  <div class="search search--signup typeahead-search">\n    <div class="search__top">\n      <svg role="img" class="icon">\n        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-search"></use>\n      </svg>\n      <input [(ngModel)]="newOffer" (keyup)="inputChanged($event)" type="text" id="offersInput" class="search__input typeahead" placeholder="Enter a few offers here">\n      <div class="search__notification search__notification--error" [ngClass]="{\'is-visible\': status === \'failure\'}">\n        <svg role="img" class="icon ">\n          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-failure"></use>\n        </svg>\n      </div>\n      <div class="search__notification search__notification--succes" [ngClass]="{\'is-visible\': status === \'success\'}">\n        <svg role="img" class="icon ">\n          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-success-2"></use>\n        </svg>\n      </div>\n      <button class="btn">\n        <svg role="img" class="icon" (click)="addOffer($event)">\n          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-plus-big"></use>\n        </svg>\n      </button>\n    </div>\n  </div>\n  <div class="search__tags-wrapper text-left" id="offers" [ngClass]="{\'has-signup-empty-state\': isListEmpty}">\n    <span class="search-tag-secondary" *ngFor="#item of items">\n      <a (click)="removeOffer(item)">\n        <svg role="img" class="icon icon--tiny">\n          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/static/persiceApp/src/assets/icons/icons.svg#icon-delete"></use>\n        </svg>\n      </a>\n      {{item.subject}}\n    </span>\n    <div class="signup-empty-state" [ngClass]="{\'is-visible\': isListEmpty}">\n      <svg role="img" class="icon signup-empty-state__icon">\n        <use xlink:href="/static/persiceApp/src/assets/icons/icons.svg#no-offers"></use>\n      </svg>\n      <h3 class="signup-empty-state__title">"Offers" are things you can help other people achieve.</h3>\n      <p class="signup-empty-state__par signup-empty-state__par--prom">For example:</p>\n      <p class="signup-empty-state__par">"Practice speaking Spanish"\n        <br>or "Find a tennis partner"</p>\n    </div>\n  </div>\n</div>\n'},0:function(module,exports,__webpack_require__){function main(){return browser_1.bootstrap(signup_component_1.SignupComponent,APP_PROVIDERS).catch(function(err){return console.error(err)})}var core_1=__webpack_require__(1),browser_1=__webpack_require__(236),ENV_PROVIDERS=[];core_1.enableProdMode();var common_1=__webpack_require__(70),router_1=__webpack_require__(17),http_1=__webpack_require__(71),services_1=__webpack_require__(439),http_client_1=__webpack_require__(15),signup_component_1=__webpack_require__(855),UNIVERSAL_PROVIDERS=router_1.ROUTER_PROVIDERS.concat(ENV_PROVIDERS,common_1.FORM_PROVIDERS,http_1.HTTP_PROVIDERS,[http_client_1.HttpClient],services_1.APP_SERVICES_PROVIDERS),PLATFORM_PROVIDERS=[core_1.provide(router_1.LocationStrategy,{useClass:router_1.PathLocationStrategy}),core_1.provide(router_1.APP_BASE_HREF,{useValue:"/signup"}),core_1.provide(router_1.ROUTER_PRIMARY_COMPONENT,{useValue:signup_component_1.SignupComponent})],APP_PROVIDERS=[UNIVERSAL_PROVIDERS,PLATFORM_PROVIDERS];core_1.enableProdMode(),exports.main=main,document.addEventListener("DOMContentLoaded",main)}});
//# sourceMappingURL=signup.0470787f4e4eefc9a7c3.bundle.map