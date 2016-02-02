import {Component} from 'angular2/core';

import {UsersListComponent} from '../userslist/userslist.component';
import {LoadingComponent} from '../loading/loading.component';
import {LoadingCardComponent} from '../loadingcard/loadingcard.component';
import {FilterComponent} from '../filter/filter.component';
import {ProfileCrowdComponent} from '../profile/profile_crowd.component';

import {CrowdService} from '../../services/crowd.service';
import {FriendService} from '../../services/friend.service';
import {FilterService} from '../../services/filter.service';
import {NotificationService} from '../../services/notification.service';

import {remove, findIndex} from 'lodash';

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
    ProfileCrowdComponent,
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
  selectedUser = null;
  currentIndex = 0;
  serviceInstance;

  constructor(
    public service: CrowdService,
    public friendService: FriendService,
    public filterService: FilterService,
    public notificationService: NotificationService
  ) {

  }

  ngOnInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.total_count = 0;
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
    if (this.serviceInstance) {
      this.serviceInstance.unsubscribe();
    }
  }

  getList() {
    if (this.serviceInstance) {
      this.serviceInstance.unsubscribe();
    }

    this.isListEmpty = false;
    if (this.next === null) return;
    this.loading = true;
    if (this.next === '') {
      this.loadingInitial = true;
    }
    this.serviceInstance = this.service.get(this.next, this.limit, this.filter)
      .subscribe(
      data => this.assignList(data),
      (err) => {
        console.log(err);
        this.loading = false;
        this.loadingInitial = false;
      },
      () => {

      });
  }


  refreshList() {
    if (this.serviceInstance) {
      this.serviceInstance.unsubscribe();
    }
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.items = [];
    this.total_count = 0;
    this.currentIndex = 0;
    this.isListEmpty = false;
    this.next = '';
    this.getList();
  }

  assignList(data) {

    this.loading = false;
    this.loadingInitial = false;


    if (data.meta.total_count === 0) {
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
      this.total_count += more.length;
    } else {
      this.items = data.objects;
      this.total_count = data.objects.length;
    }


    this.next = data.meta.next;
    this.offset = data.meta.offset;


    //bind to scroll event to load more data on bottom scroll
    if (this.next !== null) {
      jQuery(window).bind('scroll', this.handleScrollEvent.bind(this));
    } else {
      jQuery(window).unbind('scroll');
    }


  }

  setSelectedUser(id) {

    for (var i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].id === id) {
        this.selectedUser = this.items[i];
        this.currentIndex = findIndex(this.items, { id: this.selectedUser.id });
        this.profileViewActive = true;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }
    }
  }

  passUser(event) {

    let usr;
    for (var i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].id === event.user) {
        usr = this.items[i];
      }
    }

    remove(this.items, (item) => {
      return item.id === event.user;
    });
    this.total_count--;

    if (event.next) {
      this.nextProfile(true);
    }

    this.friendService.saveFriendship(-1, event.user)
      .subscribe(data => {
        if (!event.next) {
          this.profileViewActive = false;
          this.selectedUser = null;
        }
      });

  }

  acceptUser(event) {
    let usr;
    for (var i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].id === event.user) {
        usr = this.items[i];
      }
    }

    remove(this.items, (item) => {
      return item.id === event.user;
    });
    this.total_count--;

    if (event.next) {
      this.nextProfile(true);
    }

    this.friendService.saveFriendship(0, event.user)
      .subscribe(data => {
        if (!event.next) {
          this.profileViewActive = false;
          this.selectedUser = null;
        }
      });

  }


  closeProfile(event) {
    this.profileViewActive = false;
    this.selectedUser = null;
  }


  previousProfile(event) {
    let currentIndex = findIndex(this.items, { id: this.selectedUser.id });
    let newIndex = currentIndex - 1;

    if (newIndex < 0) {
      return;
    }
    if (this.items.length > 0) {
      this.selectedUser = this.items[newIndex];
    }
    else {
      this.closeProfile(true);
      this.isListEmpty = true;
    }
    this.currentIndex = newIndex;
  }

  nextProfile(event) {
    let currentIndex = findIndex(this.items, { id: this.selectedUser.id });
    let newIndex = currentIndex + 1;

    if (!this.loading && newIndex > this.items.length - 13 && this.next) {
      this.getList();
    }

    if (newIndex > this.items.length - 1) {
      return;
    }
    if (this.items.length > 0) {
      this.selectedUser = this.items[newIndex];
    }
    else {
      this.closeProfile(true);
      this.isListEmpty = true;
    }
    this.currentIndex = newIndex;
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
