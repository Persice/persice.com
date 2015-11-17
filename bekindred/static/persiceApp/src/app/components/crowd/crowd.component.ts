/// <reference path="../../../typings/_custom.d.ts" />

import {Component, NgIf, Inject} from 'angular2/angular2';
import {RouteParams, Location} from 'angular2/router';

import {UsersListComponent} from '../userslist/userslist.component';
import {LoadingComponent} from '../loading/loading.component';
import {LoadingCardComponent} from '../loadingcard/loadingcard.component';
import {FilterComponent} from '../filter/filter.component';
import {ProfileComponent} from '../profile/profile.component';
import {NotificationComponent} from '../notification/notification.component';

import {CrowdService} from '../../services/crowd.service';
import {FriendService} from '../../services/friend.service';
import {FilterService} from '../../services/filter.service';

import {remove} from 'lodash';

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
    ProfileComponent,
    NotificationComponent,
    LoadingCardComponent
  ]
})
export class CrowdComponent {
  version: string = 'v2';
  items: Array<any> = [];
  loading: boolean = false;
  loadingInitial: boolean = false;
  isListEmpty: boolean = false;
  limit: number = 12;
  filter: boolean = true;
  next: string = '';
  total_count: number = 0;
  offset: number = 0;
  profileViewActive = false;
  selectedUser;
  notification = {
    body: '',
    title: '',
    active: false,
    type: 'success'
  };

  constructor(
    @Inject(RouteParams) params: RouteParams,
    public service: CrowdService,
    public friendService: FriendService,
    public filterService: FilterService,
    private location: Location
  ) {
    this.version = params.get('version');
    this.location = location;
  }

  onInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.getList();

    //create new observer and subscribe
    this.filterService.addObserver('crowd');
    this.filterService.observer('crowd')
      .subscribe(
      (data) => this.refreshList(),
      (err) => console.log(err),
      () => console.log('event completed')
      );

  }


  onDestroy() {
    this.filterService.observer('crowd').unsubscribe();
    this.filterService.removeObserver('crowd');
  }

  getList() {
    this.closeNotification();
    if (this.next === null) return;
    this.loading = true;
    if (this.next === '') {
      this.loadingInitial = true;
    }
    this.service.get(this.next, this.limit, this.version, this.filter)
      .subscribe(data => this.assignList(data));
  }


  refreshList() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.items = [];
    this.total_count = 0;
    this.isListEmpty = false;
    this.next = '';
    this.getList();
  }

  assignList(data) {

    this.loading = false;
    this.loadingInitial = false;

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
    for (var i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].id === id) {
        this.selectedUser = this.items[i];
        this.closeNotification();
        this.profileViewActive = true;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
    }
  }

  passUser(event) {
    this.profileViewActive = false;
    this.friendService.saveFriendship(-1, this.selectedUser.id)
      .subscribe(data => {
        remove(this.items, (item) => {
          return item.id === this.selectedUser.id;
        });
        this.notification.body = this.selectedUser.first_name + ' has been removed from crowd.';
        this.notification.active = true;
        this.selectedUser = {};
      });

  }

  acceptUser(event) {
    this.profileViewActive = false;
    this.friendService.saveFriendship(0, this.selectedUser.id)
      .subscribe(data => {
        remove(this.items, (item) => {
          return item.id === this.selectedUser.id;
        });
        this.notification.body = 'You sent friendship request to ' + this.selectedUser.first_name + '.';
        this.notification.active = true;
        this.selectedUser = {};
      });

  }

  closeNotification() {
    this.notification.active = false;
  }

  closeProfile(event) {
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
