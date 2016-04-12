import {Component, AfterViewInit, OnInit, OnDestroy} from 'angular2/core';
import {Router} from 'angular2/router';

import {UsersListComponent} from '../shared/components/users-list';
import {LoadingComponent} from '../shared/components/loading';
import {FilterComponent} from '../shared/components/filter';
import {ProfileCrowdComponent} from '../profile';

import {CrowdService} from './crowd.service';
import {
  FriendService,
  FilterService,
  NotificationService
} from '../shared/services';

import {remove, findIndex, debounce} from 'lodash';

declare var jQuery: any;

@Component({
  selector: 'prs-crowd',
  template: require('./crowd.html'),
  providers: [CrowdService, FriendService],
  directives: [
    FilterComponent,
    UsersListComponent,
    LoadingComponent,
    ProfileCrowdComponent
  ]
})
export class CrowdComponent implements AfterViewInit, OnDestroy, OnInit {
  items: Array<any> = [];
  loading: boolean = false;
  loadingInitial: boolean = false;
  isListEmpty: boolean = false;
  limit: number = 12;
  next: string = '';
  total_count: number = 0;
  offset: number = 0;
  profileViewActive = false;
  selectedUser = null;
  currentIndex = 0;
  serviceInstance;
  routerInstance;

  onRefreshList: Function;

  constructor(
    private service: CrowdService,
    private friendService: FriendService,
    private filterService: FilterService,
    private notificationService: NotificationService,
    private _router: Router
  ) {
    this.onRefreshList = debounce(this.refreshList, 300, { 'leading': false, 'trailing': true });
    this.routerInstance = this._router.parent.subscribe(next => {
      this.closeProfile(true);
    });

  }

  ngAfterViewInit() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }

  ngOnInit() {
    this.total_count = 0;
    this.getList();

    //create new observer and subscribe
    this.filterService.addObserver('crowd');
    this.filterService.observer('crowd')
      .subscribe(
      (data) => {
        this.onRefreshList();
      },
      (err) => console.log(err)
      );

  }


  ngOnDestroy() {
    this.filterService.observer('crowd').unsubscribe();
    this.filterService.removeObserver('crowd');
    if (this.serviceInstance) {
      this.serviceInstance.unsubscribe();
    }

    this.routerInstance.unsubscribe();
  }

  getList() {
    if (this.loading) {
      return;
    }

    this.isListEmpty = false;
    if (this.next === null) return;
    this.loading = true;
    if (this.next === '') {
      this.loadingInitial = true;
    }
    this.serviceInstance = this.service.get(this.next, this.limit)
      .subscribe(
      data => {
        this.serviceInstance.unsubscribe();
        this.assignList(data);
      },
      (err) => {
        console.log(err);
        this.loading = false;
        this.loadingInitial = false;
        this.serviceInstance.unsubscribe();
      },
      () => {

      });
  }


  refreshList() {
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
        this.setLocation(this.selectedUser.username);
      }
    }
  }

  setLocation(loc) {
    window.history.pushState('', '', '/' + loc);
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
        if (!event.next || this.items.length === 0) {
          this.profileViewActive = false;
          this.selectedUser = null;
        }

      }, (err) => {
        console.log(err);
        if (!event.next || this.items.length === 0) {
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
        if (!event.next || this.items.length === 0) {
          this.profileViewActive = false;
          this.selectedUser = null;
        }

      }, (err) => {
        console.log(err);
        if (!event.next || this.items.length === 0) {
          this.profileViewActive = false;
          this.selectedUser = null;
        }
      });

  }


  closeProfile(event) {
    this.profileViewActive = false;
    this.selectedUser = null;
    this.setLocation('crowd');
  }


  previousProfile(event) {
    let currentIndex = findIndex(this.items, { id: this.selectedUser.id });
    let newIndex = currentIndex - 1;

    if (newIndex < 0) {
      return;
    }
    if (this.items.length > 0) {
      this.selectedUser = this.items[newIndex];
      this.setLocation(this.selectedUser.username);
    } else {
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
      this.setLocation(this.selectedUser.username);
    } else {
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