import {Injectable, provide} from 'angular2/core';
import {Observable, Subject} from 'rxjs';
import {mergeMap} from 'rxjs/operator/mergeMap';

import {ListUtil} from '../core/util';

import {Notification} from '../core/dto';

import {MutualFriendsService} from './mutualfriends.service';
import {PhotosService} from './photos.service';
import {ReligiousViewsService} from './religiousviews.service';
import {PoliticalViewsService} from './politicalviews.service';
import {UserAuthService} from './userauth.service';
import {LikesService} from './likes.service';

@Injectable()
export class UserProfileService {

	loadingNotifier = new Subject();

	user;
	profileId;
	profileType: string = '';
	profileAge = '';
	profileGender = '';
	profileLocation = '';
	profileScore = '';
	profileName = '';
	profileJob = '';
	profileActiveAgo = '2h ago';
	profileDistance = '';
	profileAbout: string = '';
	profileAvatar: string = '';
	profileKeywords: any[] = [];
	profileKeywordsCount: number = 0;
	profileInterests: any[] = [];
	profileGoals: any[] = [];
	profileOffers: any[] = [];
	profileInterestsCount: number = 0;
	profileGoalsCount: number = 0;
	profileOffersCount: number = 0;
	profileLikes: any[] = [];
	profileLikesCount: number = 0;
	profileReligiousViews = [];
	profilePoliticalViews = [];
	profilePhotos: any[] = [];
	profilePhotosCount = 0;
	profileFriends = {
		mutual_bk_friends: [],
		mutual_bk_friends_count: 0,
		mutual_fb_friends: [],
		mutual_fb_friends_count: 0,
		mutual_linkedin_connections: [],
		mutual_linkedin_connections_count: 0,
		mutual_twitter_followers: [],
		mutual_twitter_followers_count: 0,
		mutual_twitter_friends: [],
		mutual_twitter_friends_count: 0
	};
	profileFriendsCount: number = 0;
	profileNetworks = {
		facebook: '',
		twitter: '',
		linkedin: ''
	};

	profileReligiousIndex = [];
	profilePoliticalIndex = [];



	constructor(
		private userService: UserAuthService,
		private mutualfriendsService: MutualFriendsService,
		private photosService: PhotosService,
		private religiousviewsService: ReligiousViewsService,
		private politicalviewsService: PoliticalViewsService,
		private likesService: LikesService
		) {

	}

	public getFriendProfile(id): Observable<any> {
		this._notify({ type: 'start' });
		return this.photosService.get('', 6, id)
			.mergeMap((data: any) => {
				this.assignPhotos(data);
				return this.politicalviewsService.getByUser('', 100, id);
			})
			.mergeMap((data: any) => {
				this.assignPoliticalViews(data);
				return this.religiousviewsService.getByUser('', 100, id);
			})
			.mergeMap((data: any) => {
				this.assignReligiousViews(data);
				return this.mutualfriendsService.get('', 100, id);
			})
			.map((data: any) => {
				this.assignMutualFriends(data);
				let response = {
					religious: this.profileReligiousViews,
					political: this.profilePoliticalViews,
					photos: this.profilePhotos,
					photos_count: this.profilePhotosCount,
					friends: this.profileFriends,
					friends_count: this.profileFriendsCount
				};
				return response;
			})
			.do((res) => {
				this._notify({ type: 'done' });
			},
			err => this._notify({ type: 'error', data: err }),
			() => this._notify({ type: 'complete' })
			);
	}

	public getMyProfile(): Observable<any> {
		this._notify({ type: 'start' });
		return this.userService.findOneByUri('me')
			.mergeMap((data: any) => {
				this.assignMyProfile(data);
				return this.photosService.get('', 6, data.id);
			})
			.mergeMap((data: any) => {
				this.assignPhotos(data);
				return this.religiousviewsService.my('', 100);
			})
			.mergeMap((data: any) => {
				this.assignReligiousViews(data);
				return this.religiousviewsService.getIndex('', 100);
			})
			.mergeMap((data: any) => {
				this.assignReligiousIndex(data);
				return this.politicalviewsService.my('', 100);
			})
			.mergeMap((data: any) => {
				this.assignPoliticalViews(data);
				return this.politicalviewsService.getIndex('', 100);
			})
			.mergeMap((data: any) => {
				this.assignPoliticalIndex(data);
				return this.likesService.my('', 200);
			})
			.map((data: any) => {
				this.assignLikes(data);
				let response = {
					user: this.user,
					id: this.profileId,
					name: this.profileName,
					age: this.profileAge,
					gender: this.profileGender,
					distance: this.profileDistance,
					location: this.profileLocation,
					job: this.profileJob,
					avatar: this.profileAvatar,
					about: this.profileAbout,
					score: this.profileScore,
					networks: this.profileNetworks,
					offers: this.profileOffers,
					offers_count: this.profileOffersCount,
					goals: this.profileGoals,
					goals_count: this.profileGoalsCount,
					interests: this.profileInterests,
					interests_count: this.profileInterestsCount,
					religious: this.profileReligiousViews,
					political: this.profilePoliticalViews,
					religious_index: this.profileReligiousIndex,
					political_index: this.profilePoliticalIndex,
					photos: this.profilePhotos,
					photos_count: this.profilePhotosCount,
					likes: this.profileLikes,
					likes_count: this.profileLikesCount,
					friends: this.profileFriends,
					friends_count: this.profileFriendsCount
				};
				return response;
			})
			.do((res) => {
				this._notify({ type: 'done' });
			},
			err => this._notify({ type: 'error', data: err }),
			() => this._notify({ type: 'complete' })
			);
	}


	public getMyProfileUpdates(): Observable<any> {
		this._notify({ type: 'start' });
		return this.userService.findOneByUri('me')
			.mergeMap((data: any) => {
				this.assignMyProfile(data);
				return this.photosService.get('', 6, data.id);
			})
			.mergeMap((data: any) => {
				this.assignPhotos(data);
				return this.religiousviewsService.my('', 100);
			})
			.mergeMap((data: any) => {
				this.assignReligiousViews(data);
				return this.religiousviewsService.getIndex('', 100);
			})
			.mergeMap((data: any) => {
				this.assignReligiousIndex(data);
				return this.politicalviewsService.my('', 100);
			})
			.mergeMap((data: any) => {
				this.assignPoliticalViews(data);
				return this.politicalviewsService.getIndex('', 100);
			})
			.map((data: any) => {
				this.assignPoliticalIndex(data);
				let response = {
					user: this.user,
					id: this.profileId,
					name: this.profileName,
					age: this.profileAge,
					gender: this.profileGender,
					distance: this.profileDistance,
					location: this.profileLocation,
					job: this.profileJob,
					avatar: this.profileAvatar,
					about: this.profileAbout,
					score: this.profileScore,
					networks: this.profileNetworks,
					offers: this.profileOffers,
					offers_count: this.profileOffersCount,
					goals: this.profileGoals,
					goals_count: this.profileGoalsCount,
					interests: this.profileInterests,
					interests_count: this.profileInterestsCount,
					religious: this.profileReligiousViews,
					political: this.profilePoliticalViews,
					religious_index: this.profileReligiousIndex,
					political_index: this.profilePoliticalIndex,
					photos: this.profilePhotos,
					photos_count: this.profilePhotosCount,
				};
				return response;
			})
			.do((res) => {
				this._notify({ type: 'done' });
			},
			err => this._notify({ type: 'error', data: err }),
			() => this._notify({ type: 'complete' })
			);
	}


	private assignMyProfile(data) {
		this.user = data;
		this.profileId = data.id;
		this.profileName = data.first_name;
		this.profileAge = data.age;
		this.profileGender = data.gender === 'm' ? 'Male' : 'Female';
		this.profileDistance = '';

		this.profileLocation = data.lives_in ? data.lives_in : '';

		this.profileJob = data.position && data.position.job !== null && data.position.company !== null ? `${data.position.job} at ${data.position.company}` : '';

		this.profileAvatar = data.image;
		this.profileAbout = data.about_me;
		this.profileScore = '';

		this.profileNetworks.facebook = `https://www.facebook.com/app_scoped_user_id/${data.facebook_id}`;
		this.profileNetworks.linkedin = data.linkedin_provider && data.linkedin_provider !== null ? data.linkedin_provider : '';
		this.profileNetworks.twitter = data.twitter_provider && data.twitter_provider !== null ? `https://twitter.com/${data.twitter_username}` : '';

		this.profileOffers = this.transformData(data.offers, 'subject');
		this.profileInterests = this.transformData(data.interests, 'interest_subject');
		this.profileGoals = this.transformData(data.goals, 'subject');
		this.profileInterestsCount = data.interests.length;
		this.profileOffersCount = data.offers.length;
		this.profileGoalsCount = data.goals.length;
	}


	private assignMutualFriends(data) {
		this.profileFriendsCount = 0;
		this.profileFriends.mutual_bk_friends = [];
		this.profileFriends.mutual_fb_friends = [];
		this.profileFriends.mutual_linkedin_connections = [];
		this.profileFriends.mutual_twitter_friends = [];
		this.profileFriends.mutual_twitter_followers = [];
		if (data.meta.total_count > 0) {
			let items = data.objects[0];
			this.profileFriendsCount += parseInt(items.mutual_bk_friends_count, 10);
			this.profileFriendsCount += parseInt(items.mutual_fb_friends_count, 10);
			this.profileFriendsCount += parseInt(items.mutual_linkedin_connections_count, 10);
			this.profileFriendsCount += parseInt(items.mutual_twitter_followers_count, 10);
			this.profileFriendsCount += parseInt(items.mutual_twitter_friends_count, 10);

			this.profileFriends.mutual_bk_friends = items.mutual_bk_friends;
			this.profileFriends.mutual_fb_friends = items.mutual_fb_friends;
			this.profileFriends.mutual_linkedin_connections = items.mutual_linkedin_connections;
			this.profileFriends.mutual_twitter_friends = items.mutual_twitter_friends;
			this.profileFriends.mutual_twitter_followers = items.mutual_twitter_followers;
		}
	}

	private assignReligiousViews(data) {
		if (data.meta.total_count > 0) {
			let items = data.objects;
			this.profileReligiousViews = items;
		}
	}

	private assignReligiousIndex(data) {
		if (data.meta.total_count > 0) {
			let itemsIndex = data.objects;
			for (var i = 0; i < itemsIndex.length; ++i) {
				itemsIndex[i].selected = false;
				for (var j = 0; j < this.profileReligiousViews.length; ++j) {
					if (itemsIndex[i].resource_uri === this.profileReligiousViews[j].religious_index) {
						itemsIndex[i].selected = true;
						itemsIndex[i].view_uri = this.profileReligiousViews[j].resource_uri;
					}
				}
			}
			this.profileReligiousIndex = itemsIndex;
		}
	}

	private assignPoliticalViews(data) {
		if (data.meta.total_count > 0) {
			let items = data.objects;
			this.profilePoliticalViews = items;
		}
	}

	private assignPoliticalIndex(data) {
		if (data.meta.total_count > 0) {
			let itemsIndex = data.objects;
			for (var i = 0; i < itemsIndex.length; ++i) {
				itemsIndex[i].selected = false;
				for (var j = 0; j < this.profilePoliticalViews.length; ++j) {
					if (itemsIndex[i].resource_uri === this.profilePoliticalViews[j].political_index) {
						itemsIndex[i].selected = true;
						itemsIndex[i].view_uri = this.profilePoliticalViews[j].resource_uri;
					}
				}
			}
			this.profilePoliticalIndex = itemsIndex;
		}
	}

	private assignPhotos(data) {
		this.profilePhotosCount = 0;
		this.profilePhotos = [];
		if (data.meta.total_count > 0) {
			this.profilePhotos = ListUtil.orderBy(data.objects, ['order'], ['asc']);
			this.profilePhotosCount = this.profilePhotos.length;
		}
	}

	private assignLikes(data) {
		if (data.meta.total_count > 0) {
			let items = data.objects;
			this.profileLikes = this.transformLikes(items, 'name');
			this.profileLikesCount = items.length;
		}
	}

	private transformData(arr, prop) {
		let res = [];

		for (let i = 0; i < arr.length; i++) {
			res.push({
				value: arr[i][prop],
				match: 0
			});
		}
		return res;
	}

	private transformLikes(arr, prop) {
		let res = [];

		for (let i = 0; i < arr.length; i++) {
			res.push({
				value: arr[i][prop],
				match: 0,
				image: arr[i].picture
			});
		}
		return res;
	}


	private _notify(data: Notification) {
		this.loadingNotifier.next(data);
	}


}

export var userProfileServiceInjectables: Array<any> = [
	provide(UserProfileService, { useClass: UserProfileService })
];

