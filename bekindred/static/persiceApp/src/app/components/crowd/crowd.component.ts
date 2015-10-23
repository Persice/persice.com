/// <reference path="../../../typings/_custom.d.ts" />

import {Component, NgIf, Inject} from 'angular2/angular2';
import {Http, Headers, Response, HTTP_BINDINGS} from 'angular2/http';
import {RouteParams} from 'angular2/router';

import {UsersListComponent} from '../userslist/userslist.component';
import {LoadingComponent} from '../loading/loading.component';
import {FilterComponent} from '../filter/filter.component';
import {ProfileComponent} from '../profile/profile.component';

import {CrowdService} from '../../services/crowd.service';
import {MutualFriendsService} from '../../services/mutualfriends.service';

let view = require('./crowd.html');

declare var jQuery: any;

@Component({
  selector: 'crowd',
  template: view,
  providers: [CrowdService],
  directives: [
    NgIf,
    FilterComponent,
    UsersListComponent,
    LoadingComponent,
    ProfileComponent
  ]
})
export class CrowdComponent {
  version: string = 'v2';
  items: Array<any> = [];
  loading: boolean = false;
  isListEmpty: boolean = false;
  limit: number = 12;
  filter: boolean = true;
  next: string = '';
  total_count: number = 0;
  offset: number = 0;
  profileViewActive = false;
  selectedUser;
  mutuals: Array<any> = [];

  constructor(
    @Inject(RouteParams) params: RouteParams,
    public service: CrowdService,
    public mutualfriendsService: MutualFriendsService
  ) {
    this.version = params.get('version');

  }


  onInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.getList();
  }

  getMutualFriends(id) {
    this.mutualfriendsService.get('', 100, 'v1', id)
      .map(res => res.json())
      .subscribe(data => this.assignMutualFriends(data));
  }

  assignMutualFriends(data) {
    console.log(data);
    this.mutuals = data.objects;
  }

  getList() {
    if (this.next === null) return;
    this.loading = true;
    this.service.get(this.next, this.limit, this.version, this.filter)
      .map(res => res.json())
      .subscribe(data => this.assignList(data));
  }


  refreshList(event) {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.items = [];
    this.isListEmpty = false;
    this.next = '';
    this.getList();
  }

  assignList(data) {

    this.loading = false;

    this.total_count = data.meta.total_count;
    if (this.total_count === 0) {
      this.isListEmpty = true;
      return;
    } else {
      this.isListEmpty = false;
    }


    if (this.items.length > 0) {
      let more = data.objects;
      for (var i = more.length - 1; i >= 0; i--) {
        this.items.push(more[i]);
      }

    }
    else {
      this.items = data.objects;
    }

    this.next = data.meta.next;
    this.offset = data.meta.offset;


    //bind to scroll event to load more data on bottom scroll
    if (this.next !== null) {
      jQuery(window).bind('scroll', this.handleScrollEvent.bind(this));
    }
    else {
      jQuery(window).unbind('scroll');
    }


  }

  setSelectedUser(id) {
    console.log('user is selected');
    console.log(id);

    for (var i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].id === id) {
        this.selectedUser = this.items[i];
        this.selectedUser.photos.reverse();
        this.getMutualFriends(this.selectedUser.id);
        this.profileViewActive = true;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
    }
  }

  passUser(event) {
    console.log('User pass');
    this.profileViewActive = false;
  }

  acceptUser(event) {
    console.log('User accept');
    this.profileViewActive = false;
  }


  handleScrollEvent(event) {
    let scrollOffset = jQuery(window).scrollTop();
    let threshold = jQuery(document).height() - jQuery(window).height() - 60;

    if (this.next && scrollOffset > threshold) {
      if (!this.loading) {
        this.getList();
      }
    }

  }

}
