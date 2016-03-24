webpackJsonp([4,6],{

/***/ 767:
/***/ function(module, exports, __webpack_require__) {

	eval("\"use strict\";\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nvar core_1 = __webpack_require__(3);\r\nvar router_1 = __webpack_require__(37);\r\nvar http_1 = __webpack_require__(91);\r\n/** Components */\r\nvar profile_avatar_component_1 = __webpack_require__(651);\r\nvar profile_about_component_1 = __webpack_require__(650);\r\nvar profile_likes_component_1 = __webpack_require__(654);\r\nvar profile_friends_component_1 = __webpack_require__(652);\r\nvar profile_networks_component_1 = __webpack_require__(655);\r\nvar profile_items_component_1 = __webpack_require__(653);\r\nvar loading_component_1 = __webpack_require__(42);\r\nvar profile_gallery_component_1 = __webpack_require__(768);\r\n/** Directives */\r\nvar dropdown_directive_1 = __webpack_require__(766);\r\nvar remodal_directive_1 = __webpack_require__(649);\r\n/** Services */\r\nvar mutualfriends_service_1 = __webpack_require__(125);\r\nvar photos_service_1 = __webpack_require__(93);\r\nvar religiousviews_service_1 = __webpack_require__(82);\r\nvar politicalviews_service_1 = __webpack_require__(81);\r\nvar connections_counter_service_1 = __webpack_require__(92);\r\n/** Utils */\r\nvar util_1 = __webpack_require__(12);\r\n/** View */\r\nvar view = __webpack_require__(769);\r\nvar ProfileFriendComponent = (function () {\r\n    function ProfileFriendComponent(mutualfriendsService, photosService, religiousviewsService, politicalviewsService, counterService, http) {\r\n        this.mutualfriendsService = mutualfriendsService;\r\n        this.photosService = photosService;\r\n        this.religiousviewsService = religiousviewsService;\r\n        this.politicalviewsService = politicalviewsService;\r\n        this.counterService = counterService;\r\n        this.http = http;\r\n        this.closeprofileEvent = new core_1.EventEmitter;\r\n        this.nextEvent = new core_1.EventEmitter;\r\n        this.previousEvent = new core_1.EventEmitter;\r\n        this.friendsTitle = 'Mutual Connections';\r\n        this.profileType = 'friend';\r\n        this.profileAge = '';\r\n        this.profileGender = '';\r\n        this.profileLocation = '';\r\n        this.profileScore = '';\r\n        this.profileName = '';\r\n        this.profileJob = '';\r\n        this.profileReligiousViews = [];\r\n        this.profilePoliticalViews = [];\r\n        this.profileActiveAgo = '2h ago';\r\n        this.profileDistance = '';\r\n        this.profileAbout = '';\r\n        this.profileAvatar = '';\r\n        this.profilePhotos = [];\r\n        this.profilePhotosCount = 0;\r\n        this.profileKeywords = [];\r\n        this.profileKeywordsCount = 0;\r\n        this.profileInterests = [];\r\n        this.profileGoals = [];\r\n        this.profileOffers = [];\r\n        this.profileInterestsCount = 0;\r\n        this.profileGoalsCount = 0;\r\n        this.profileOffersCount = 0;\r\n        this.profileLikes = [];\r\n        this.profileLikesCount = 0;\r\n        this.profileFriends = {\r\n            mutual_bk_friends: [],\r\n            mutual_bk_friends_count: 0,\r\n            mutual_fb_friends: [],\r\n            mutual_fb_friends_count: 0,\r\n            mutual_linkedin_connections: [],\r\n            mutual_linkedin_connections_count: 0,\r\n            mutual_twitter_followers: [],\r\n            mutual_twitter_followers_count: 0,\r\n            mutual_twitter_friends: [],\r\n            mutual_twitter_friends_count: 0\r\n        };\r\n        this.profileFriendsCount = 0;\r\n        this.profileNetworks = {\r\n            facebook: '',\r\n            twitter: '',\r\n            linkedin: ''\r\n        };\r\n        this.loading = false;\r\n        this.loadingLikes = false;\r\n        this.loadingConnections = false;\r\n        this.loadingPhotos = false;\r\n        this.galleryActive = false;\r\n        this.galleryOptions = JSON.stringify({\r\n            hashTracking: false,\r\n            closeOnOutsideClick: true\r\n        });\r\n    }\r\n    ProfileFriendComponent.prototype.ngOnDestroy = function () {\r\n        jQuery(document).off('closed', '.remodal');\r\n    };\r\n    ProfileFriendComponent.prototype.ngOnInit = function () {\r\n        var _this = this;\r\n        //listen for event when gallery modal is closed\r\n        jQuery(document).on('closed', '.remodal', function (e) {\r\n            _this.galleryActive = false;\r\n        });\r\n        setTimeout(function () {\r\n            jQuery('#userprofile').focus();\r\n            window.scrollTo(0, 0);\r\n        });\r\n    };\r\n    ProfileFriendComponent.prototype.ngOnChanges = function (values) {\r\n        if (values.user && values.user.currentValue) {\r\n            this.assignUser();\r\n        }\r\n    };\r\n    ProfileFriendComponent.prototype.assignUser = function () {\r\n        var _this = this;\r\n        this.galleryActive = false;\r\n        this.loadingConnections = true;\r\n        this.loadingPhotos = true;\r\n        this.loadingLikes = true;\r\n        // if (this.user.updated_at === 'seen') {\r\n        var url = \"/api/v1/new_connections/updated_at/?format=json&friend_id=\" + this.user.id;\r\n        this.http.get(url).map(function (res) { return res.json(); }).subscribe(function (data) {\r\n            _this.counterService.refreshCounter();\r\n        });\r\n        // }\r\n        this.profileId = this.user.id;\r\n        this.profileName = this.user.first_name;\r\n        this.profileAge = this.user.age;\r\n        this.profileGender = this.user.gender === 'm' ? 'Male' : 'Female';\r\n        this.profileDistance = this.user.distance[0] + \" \" + this.user.distance[1];\r\n        this.profileLocation = this.user.lives_in ? this.user.lives_in : '';\r\n        setTimeout(function () {\r\n            _this.profileLikesCount = 0;\r\n            _this.profileLikes = [];\r\n            var likes = _this.user.likes;\r\n            _this.profileLikes = likes;\r\n            _this.profileLikesCount = _this.profileLikes.length;\r\n            _this.loadingLikes = false;\r\n        });\r\n        this.profileJob = this.user.position && this.user.position.job !== null && this.user.position.company !== null ? this.user.position.job + \" at \" + this.user.position.company : '';\r\n        this.profileAvatar = this.user.image;\r\n        this.profileAbout = this.user.about;\r\n        this.profileScore = this.user.score;\r\n        this.profileNetworks.facebook = \"https://www.facebook.com/app_scoped_user_id/\" + this.user.facebook_id;\r\n        this.profileNetworks.linkedin = this.user.linkedin_provider && this.user.linkedin_provider !== null ? this.user.linkedin_provider : '';\r\n        this.profileNetworks.twitter = this.user.twitter_provider && this.user.twitter_provider !== null ? \"https://twitter.com/\" + this.user.twitter_username : '';\r\n        this.profileOffers = util_1.ObjectUtil.transformSorted(this.user.offers[0]);\r\n        this.profileInterests = util_1.ObjectUtil.transformSorted(this.user.interests[0]);\r\n        this.profileGoals = util_1.ObjectUtil.transformSorted(this.user.goals[0]);\r\n        this.profileInterestsCount = util_1.ObjectUtil.count(this.user.interests[0]);\r\n        this.profileOffersCount = util_1.ObjectUtil.count(this.user.offers[0]);\r\n        this.profileGoalsCount = util_1.ObjectUtil.count(this.user.goals[0]);\r\n        this.profileKeywords = this.user.keywords ? this.user.keywords : [];\r\n        this.profileKeywordsCount = this.user.keywords ? this.user.keywords.length : 0;\r\n        this.getMutualFriends(this.user.id);\r\n        this.getPhotos(this.user.id);\r\n        this.getReligiousViews(this.user.id);\r\n        this.getPoliticalViews(this.user.id);\r\n    };\r\n    ProfileFriendComponent.prototype.getMutualFriends = function (id) {\r\n        var _this = this;\r\n        this.mutualfriendsService.get('', 100, id)\r\n            .subscribe(function (data) { return _this.assignMutualFriends(data); });\r\n    };\r\n    ProfileFriendComponent.prototype.getReligiousViews = function (id) {\r\n        var _this = this;\r\n        this.religiousviewsService.getByUser('', 100, id)\r\n            .subscribe(function (data) { return _this.assignReligiousViews(data); });\r\n    };\r\n    ProfileFriendComponent.prototype.getPoliticalViews = function (id) {\r\n        var _this = this;\r\n        this.politicalviewsService.getByUser('', 100, id)\r\n            .subscribe(function (data) { return _this.assignPoliticalViews(data); }, function (err) { return console.log('Error fetching political views'); }, function () { });\r\n    };\r\n    ProfileFriendComponent.prototype.getPhotos = function (id) {\r\n        var _this = this;\r\n        this.photosService.get('', 6, id)\r\n            .subscribe(function (data) { return _this.assignPhotos(data); });\r\n    };\r\n    ProfileFriendComponent.prototype.assignPhotos = function (data) {\r\n        var _this = this;\r\n        this.profilePhotosCount = 0;\r\n        this.profilePhotos = [];\r\n        setTimeout(function () {\r\n            if (data.meta.total_count > 0) {\r\n                _this.profilePhotos = util_1.ListUtil.orderBy(data.objects, ['order'], ['asc']);\r\n                _this.profilePhotosCount = _this.profilePhotos.length;\r\n            }\r\n            _this.loadingPhotos = false;\r\n        });\r\n    };\r\n    ProfileFriendComponent.prototype.assignMutualFriends = function (data) {\r\n        var _this = this;\r\n        this.profileFriendsCount = 0;\r\n        this.profileFriends.mutual_bk_friends = [];\r\n        this.profileFriends.mutual_fb_friends = [];\r\n        this.profileFriends.mutual_linkedin_connections = [];\r\n        this.profileFriends.mutual_twitter_friends = [];\r\n        this.profileFriends.mutual_twitter_followers = [];\r\n        setTimeout(function () {\r\n            if (data.meta.total_count > 0) {\r\n                var items = data.objects[0];\r\n                _this.profileFriendsCount += parseInt(items.mutual_bk_friends_count, 10);\r\n                _this.profileFriendsCount += parseInt(items.mutual_fb_friends_count, 10);\r\n                _this.profileFriendsCount += parseInt(items.mutual_linkedin_connections_count, 10);\r\n                _this.profileFriendsCount += parseInt(items.mutual_twitter_followers_count, 10);\r\n                _this.profileFriendsCount += parseInt(items.mutual_twitter_friends_count, 10);\r\n                _this.profileFriends.mutual_bk_friends = items.mutual_bk_friends;\r\n                _this.profileFriends.mutual_fb_friends = items.mutual_fb_friends;\r\n                _this.profileFriends.mutual_linkedin_connections = items.mutual_linkedin_connections;\r\n                _this.profileFriends.mutual_twitter_friends = items.mutual_twitter_friends;\r\n                _this.profileFriends.mutual_twitter_followers = items.mutual_twitter_followers;\r\n                _this.loadingConnections = false;\r\n            }\r\n        });\r\n    };\r\n    ProfileFriendComponent.prototype.assignReligiousViews = function (data) {\r\n        if (data.meta.total_count > 0) {\r\n            var items = data.objects;\r\n            this.profileReligiousViews = items;\r\n        }\r\n    };\r\n    ProfileFriendComponent.prototype.assignPoliticalViews = function (data) {\r\n        if (data.meta.total_count > 0) {\r\n            var items = data.objects;\r\n            this.profilePoliticalViews = items;\r\n        }\r\n    };\r\n    ProfileFriendComponent.prototype.closeProfile = function (event) {\r\n        this.closeprofileEvent.next(event);\r\n    };\r\n    ProfileFriendComponent.prototype.openMessages = function (event) {\r\n        console.log('open messages');\r\n    };\r\n    ProfileFriendComponent.prototype.eventHandler = function (key) {\r\n        switch (key) {\r\n            case 27:\r\n                this.closeProfile(true);\r\n                break;\r\n            case 37:\r\n                this.previousEvent.next(true);\r\n                break;\r\n            case 39:\r\n                this.nextEvent.next(true);\r\n            default:\r\n                break;\r\n        }\r\n    };\r\n    ProfileFriendComponent.prototype.openGallery = function (event) {\r\n        var remodal = jQuery('[data-remodal-id=modal-gallery]').remodal();\r\n        remodal.open();\r\n        this.galleryActive = true;\r\n    };\r\n    __decorate([\r\n        core_1.Input(), \r\n        __metadata('design:type', Object)\r\n    ], ProfileFriendComponent.prototype, \"user\", void 0);\r\n    __decorate([\r\n        core_1.Input(), \r\n        __metadata('design:type', Object)\r\n    ], ProfileFriendComponent.prototype, \"count\", void 0);\r\n    __decorate([\r\n        core_1.Input(), \r\n        __metadata('design:type', Object)\r\n    ], ProfileFriendComponent.prototype, \"currentIndex\", void 0);\r\n    __decorate([\r\n        core_1.Output(), \r\n        __metadata('design:type', core_1.EventEmitter)\r\n    ], ProfileFriendComponent.prototype, \"closeprofileEvent\", void 0);\r\n    __decorate([\r\n        core_1.Output(), \r\n        __metadata('design:type', core_1.EventEmitter)\r\n    ], ProfileFriendComponent.prototype, \"nextEvent\", void 0);\r\n    __decorate([\r\n        core_1.Output(), \r\n        __metadata('design:type', core_1.EventEmitter)\r\n    ], ProfileFriendComponent.prototype, \"previousEvent\", void 0);\r\n    ProfileFriendComponent = __decorate([\r\n        core_1.Component({\r\n            selector: 'profile-friend',\r\n            template: view,\r\n            directives: [\r\n                profile_avatar_component_1.ProfileAvatarComponent,\r\n                profile_about_component_1.ProfileAboutComponent,\r\n                profile_likes_component_1.ProfileLikesComponent,\r\n                profile_friends_component_1.ProfileFriendsComponent,\r\n                profile_networks_component_1.ProfileNetworksComponent,\r\n                profile_items_component_1.ProfileItemsComponent,\r\n                dropdown_directive_1.DropdownDirective,\r\n                loading_component_1.LoadingComponent,\r\n                profile_gallery_component_1.ProfileGalleryComponent,\r\n                remodal_directive_1.RemodalDirective,\r\n                router_1.ROUTER_DIRECTIVES\r\n            ],\r\n            providers: [\r\n                photos_service_1.PhotosService,\r\n                religiousviews_service_1.ReligiousViewsService\r\n            ]\r\n        }), \r\n        __metadata('design:paramtypes', [mutualfriends_service_1.MutualFriendsService, photos_service_1.PhotosService, religiousviews_service_1.ReligiousViewsService, politicalviews_service_1.PoliticalViewsService, connections_counter_service_1.ConnectionsCounterService, http_1.Http])\r\n    ], ProfileFriendComponent);\r\n    return ProfileFriendComponent;\r\n}());\r\nexports.ProfileFriendComponent = ProfileFriendComponent;\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/awesome-typescript-loader/dist.babel!./~/tslint-loader!./src/app/components/profile/profile_friend.component.ts\n ** module id = 767\n ** module chunks = 4 6\n **/\n//# sourceURL=webpack:///./src/app/components/profile/profile_friend.component.ts?./~/awesome-typescript-loader/dist.babel!./~/tslint-loader");

/***/ },

/***/ 780:
/***/ function(module, exports, __webpack_require__) {

	eval("\"use strict\";\r\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n};\r\nvar __metadata = (this && this.__metadata) || function (k, v) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\r\n};\r\nvar core_1 = __webpack_require__(3);\r\nvar router_1 = __webpack_require__(37);\r\nvar userslist_component_1 = __webpack_require__(779);\r\nvar loading_component_1 = __webpack_require__(42);\r\nvar filter_component_1 = __webpack_require__(770);\r\nvar profile_friend_component_1 = __webpack_require__(767);\r\nvar connections_service_1 = __webpack_require__(127);\r\nvar filter_service_1 = __webpack_require__(62);\r\nvar lodash_1 = __webpack_require__(30);\r\nvar view = __webpack_require__(1168);\r\nvar ConnectionsContainer = (function () {\r\n    function ConnectionsContainer(service, filterService, _router) {\r\n        var _this = this;\r\n        this.service = service;\r\n        this.filterService = filterService;\r\n        this._router = _router;\r\n        this.items = [];\r\n        this.loading = false;\r\n        this.loadingInitial = false;\r\n        this.isListEmpty = false;\r\n        this.limit = 12;\r\n        this.filter = true;\r\n        this.next = '';\r\n        this.total_count = 0;\r\n        this.offset = 0;\r\n        this.profileViewActive = false;\r\n        this.selectedUser = null;\r\n        this.currentIndex = 0;\r\n        this.onRefreshList = lodash_1.debounce(this.refreshList, 300, { 'leading': false, 'trailing': true });\r\n        this.routerInstance = this._router.parent.subscribe(function (next) {\r\n            _this.closeProfile(true);\r\n        });\r\n    }\r\n    ConnectionsContainer.prototype.setLocation = function (loc) {\r\n        window.history.pushState('', '', '/' + loc);\r\n    };\r\n    ConnectionsContainer.prototype.ngAfterViewInit = function () {\r\n        setTimeout(function () {\r\n            window.scrollTo(0, 0);\r\n        });\r\n    };\r\n    ConnectionsContainer.prototype.ngOnInit = function () {\r\n        var _this = this;\r\n        this.total_count = 0;\r\n        this.getList();\r\n        //create new observer and subscribe\r\n        this.filterService.addObserver('connections');\r\n        this.filterService.observer('connections')\r\n            .subscribe(function (data) { return _this.onRefreshList(); }, function (err) { return console.log(err); });\r\n    };\r\n    ConnectionsContainer.prototype.ngOnDestroy = function () {\r\n        this.filterService.observer('connections').unsubscribe();\r\n        this.filterService.removeObserver('connections');\r\n        if (this.serviceInstance) {\r\n            this.serviceInstance.unsubscribe();\r\n        }\r\n        this.routerInstance.unsubscribe();\r\n    };\r\n    ConnectionsContainer.prototype.getList = function () {\r\n        var _this = this;\r\n        if (this.loading) {\r\n            return;\r\n        }\r\n        this.isListEmpty = false;\r\n        if (this.next === null)\r\n            return;\r\n        this.loading = true;\r\n        if (this.next === '') {\r\n            this.loadingInitial = true;\r\n        }\r\n        this.serviceInstance = this.service.get(this.next, this.limit, this.filter)\r\n            .subscribe(function (data) {\r\n            _this.serviceInstance.unsubscribe();\r\n            _this.assignList(data);\r\n        }, function (err) {\r\n            console.log(err);\r\n            _this.loading = false;\r\n            _this.loadingInitial = false;\r\n            _this.serviceInstance.unsubscribe();\r\n        }, function () {\r\n        });\r\n    };\r\n    ConnectionsContainer.prototype.refreshList = function () {\r\n        if (this.serviceInstance) {\r\n            this.serviceInstance.unsubscribe();\r\n        }\r\n        document.body.scrollTop = document.documentElement.scrollTop = 0;\r\n        this.items = [];\r\n        this.total_count = 0;\r\n        this.currentIndex = 0;\r\n        this.isListEmpty = false;\r\n        this.next = '';\r\n        this.getList();\r\n    };\r\n    ConnectionsContainer.prototype.assignList = function (data) {\r\n        this.loading = false;\r\n        this.loadingInitial = false;\r\n        if (data.meta.total_count === 0) {\r\n            this.isListEmpty = true;\r\n            return;\r\n        }\r\n        else {\r\n            this.isListEmpty = false;\r\n        }\r\n        if (this.items.length > 0) {\r\n            var more = data.objects;\r\n            for (var i = 0; i <= more.length - 1; i++) {\r\n                this.items.push(more[i]);\r\n            }\r\n            this.total_count += more.length;\r\n        }\r\n        else {\r\n            this.items = data.objects;\r\n            this.total_count = data.objects.length;\r\n        }\r\n        this.next = data.meta.next;\r\n        this.offset = data.meta.offset;\r\n        //bind to scroll event to load more data on bottom scroll\r\n        if (this.next !== null) {\r\n            jQuery(window).bind('scroll', this.handleScrollEvent.bind(this));\r\n        }\r\n        else {\r\n            jQuery(window).unbind('scroll');\r\n        }\r\n    };\r\n    ConnectionsContainer.prototype.viewFriendProfile = function (id) {\r\n        for (var i = this.items.length - 1; i >= 0; i--) {\r\n            if (this.items[i].id === id) {\r\n                this.selectedUser = this.items[i];\r\n                this.currentIndex = lodash_1.findIndex(this.items, { id: this.selectedUser.id });\r\n                this.profileViewActive = true;\r\n                if (this.items[i].updated_at === null) {\r\n                    this.items[i].updated_at = 'seen';\r\n                }\r\n                document.body.scrollTop = document.documentElement.scrollTop = 0;\r\n                this.setLocation(this.selectedUser.username);\r\n            }\r\n        }\r\n    };\r\n    ConnectionsContainer.prototype.closeProfile = function (event) {\r\n        this.profileViewActive = false;\r\n        this.selectedUser = null;\r\n        this.setLocation('connections');\r\n    };\r\n    ConnectionsContainer.prototype.previousProfile = function (event) {\r\n        var currentIndex = lodash_1.findIndex(this.items, { id: this.selectedUser.id });\r\n        var newIndex = currentIndex - 1;\r\n        if (newIndex < 0) {\r\n            return;\r\n        }\r\n        if (this.items.length > 0) {\r\n            this.selectedUser = this.items[newIndex];\r\n            this.setLocation(this.selectedUser.username);\r\n        }\r\n        else {\r\n            this.closeProfile(true);\r\n            this.isListEmpty = true;\r\n        }\r\n        this.currentIndex = newIndex;\r\n    };\r\n    ConnectionsContainer.prototype.nextProfile = function (event) {\r\n        var currentIndex = lodash_1.findIndex(this.items, { id: this.selectedUser.id });\r\n        var newIndex = currentIndex + 1;\r\n        if (!this.loading && newIndex > this.items.length - 13 && this.next) {\r\n            this.getList();\r\n        }\r\n        if (newIndex > this.items.length - 1) {\r\n            return;\r\n        }\r\n        if (this.items.length > 0) {\r\n            this.selectedUser = this.items[newIndex];\r\n            this.setLocation(this.selectedUser.username);\r\n        }\r\n        else {\r\n            this.closeProfile(true);\r\n            this.isListEmpty = true;\r\n        }\r\n        this.currentIndex = newIndex;\r\n    };\r\n    ConnectionsContainer.prototype.handleScrollEvent = function (event) {\r\n        var scrollOffset = jQuery(window).scrollTop();\r\n        var threshold = jQuery(document).height() - jQuery(window).height() - 60;\r\n        if (this.next && scrollOffset > threshold) {\r\n            if (!this.loading) {\r\n                this.getList();\r\n            }\r\n        }\r\n    };\r\n    ConnectionsContainer = __decorate([\r\n        core_1.Component({\r\n            selector: 'connections-page',\r\n            template: view,\r\n            directives: [\r\n                filter_component_1.FilterComponent,\r\n                userslist_component_1.UsersListComponent,\r\n                loading_component_1.LoadingComponent,\r\n                profile_friend_component_1.ProfileFriendComponent\r\n            ]\r\n        }), \r\n        __metadata('design:paramtypes', [connections_service_1.ConnectionsService, filter_service_1.FilterService, router_1.Router])\r\n    ], ConnectionsContainer);\r\n    return ConnectionsContainer;\r\n}());\r\nexports.ConnectionsContainer = ConnectionsContainer;\r\n\n\n/*****************\n ** WEBPACK FOOTER\n ** ./~/awesome-typescript-loader/dist.babel!./~/tslint-loader!./src/app/containers/connections/connections.container.ts\n ** module id = 780\n ** module chunks = 4\n **/\n//# sourceURL=webpack:///./src/app/containers/connections/connections.container.ts?./~/awesome-typescript-loader/dist.babel!./~/tslint-loader");

/***/ },

/***/ 1168:
/***/ function(module, exports) {

	eval("module.exports = \"<div class=\\\"layout layout--flush content\\\" [ngClass]=\\\"{'is-hidden': profileViewActive}\\\">\\n  <div class=\\\"layout__item 3/4 extralarge-and-up-4/5\\\">\\n    <h3 *ngIf=\\\"!loading && emptyList\\\">No results...</h3>\\n    <users-list [showButtons]=\\\"0\\\" [users]=\\\"items\\\" (onClicked)=\\\"viewFriendProfile($event)\\\"></users-list>\\n    <loading [status]=\\\"loading\\\"></loading>\\n    <div class=\\\"no-results\\\" *ngIf=\\\"isListEmpty\\\" [ngClass]=\\\"{'is-visible': isListEmpty}\\\">\\n      <h2 class=\\\"no-results__title\\\">Whoops!</h2>\\n      <p class=\\\"no-results__par\\\">No results found.\\n        <br>Please broaden your search criteria</p>\\n      <img src=\\\"/static/assets/images/polar-bear.png\\\" alt=\\\"Polar Bear\\\">\\n    </div>\\n  </div>\\n  <div class=\\\"layout__item 1/4 extralarge-and-up-1/5 filter-place\\\">\\n    <filters [type]=\\\"'connections'\\\"></filters>\\n  </div>\\n</div>\\n<profile-friend [currentIndex]=\\\"currentIndex\\\" [count]=\\\"total_count\\\" (previousEvent)=\\\"previousProfile($event)\\\" (nextEvent)=\\\"nextProfile($event)\\\" *ngIf=\\\"profileViewActive\\\" [user]=\\\"selectedUser\\\" (closeprofileEvent)=\\\"closeProfile($event)\\\">\\n</profile-friend>\\n\"\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/app/containers/connections/connections.html\n ** module id = 1168\n ** module chunks = 4\n **/\n//# sourceURL=webpack:///./src/app/containers/connections/connections.html?");

/***/ }

});