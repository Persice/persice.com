import {Component} from 'angular2/core';

import {UsersListComponent} from '../userslist/userslist.component';
import {LoadingComponent} from '../loading/loading.component';
import {LoadingCardComponent} from '../loadingcard/loadingcard.component';
import {FilterComponent} from '../filter/filter.component';
import {ProfileComponent} from '../profile/profile.component';

import {CrowdService} from '../../services/crowd.service';
import {FriendService} from '../../services/friend.service';
import {FilterService} from '../../services/filter.service';
import {NotificationService} from '../../services/notification.service';

import {remove} from 'lodash';

let view = require('./crowd.html');

declare var jQuery: any;

@Component({
  selector: 'crowd',
  template: view,
  providers: [CrowdService],
  directives: [
    FilterComponent,
    UsersListComponent,
    LoadingComponent,
    ProfileComponent,
    LoadingCardComponent
  ]
})
export class CrowdComponent {
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

  constructor(
    public service: CrowdService,
    public friendService: FriendService,
    public filterService: FilterService,
    public notificationService: NotificationService
  ) {

  }

  ngOnInit() {
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


  ngOnDestroy() {
    this.filterService.observer('crowd').unsubscribe();
    this.filterService.removeObserver('crowd');
  }

  getList() {
    if (this.next === null) return;
    this.loading = true;
    if (this.next === '') {
      this.loadingInitial = true;
    }
    this.service.get(this.next, this.limit, this.filter)
      .subscribe(
      data => this.assignList(data),
      (err) => {
        console.log(err);
        this.loading = false;
        this.loadingInitial = false;
        // this.notificationService.push({
        //   type: 'error',
        //   title: 'Error',
        //   body: 'Data could not be loaded.',
        //   autoclose: 4000
        // });
      },
      () => {

      });
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
      for (var i = 0; i <= more.length - 1; i++) {
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

        this.notificationService.push({
          type: 'warning',
          title: '',
          body: `${this.selectedUser.first_name} has been removed from crowd.`,
          autoclose: 4000
        });

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

        this.notificationService.push({
          type: 'success',
          title: 'Success',
          body: `You sent friendship request to ${this.selectedUser.first_name}.`,
          autoclose: 4000
        });

        this.selectedUser = {};
      });

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
