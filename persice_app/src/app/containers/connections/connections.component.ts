import {Component} from 'angular2/core';
import {Router} from 'angular2/router';

import {UsersListComponent} from '../../components/userslist/userslist.component';
import {LoadingComponent} from '../../components/loading/loading.component';
import {FilterComponent} from '../../components/filter/filter.component';
import {ProfileFriendComponent} from '../../components/profile/profile_friend.component';

import {ConnectionsService} from '../../services/connections.service';
import {FilterService} from '../../services/filter.service';


import {findIndex, debounce} from 'lodash';

let view = require('./connections.html');

declare var jQuery: any;

@Component({
  selector: 'connections-page',
  template: view,
  directives: [
    FilterComponent,
    UsersListComponent,
    LoadingComponent,
    ProfileFriendComponent
  ]
})
export class ConnectionsComponent {
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
  routerInstance;
  onRefreshList: Function;

  constructor(
    private service: ConnectionsService,
    private filterService: FilterService,
    private _router: Router
    ) {
    this.onRefreshList = debounce(this.refreshList, 300, { 'leading': false, 'trailing': true });
    this.routerInstance = this._router.parent.subscribe(next => {
      this.closeProfile(true);
    });
  }

  setLocation(loc) {
    window.history.pushState('', '', '/' + loc);
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
    this.filterService.addObserver('connections');
    this.filterService.observer('connections')
      .subscribe(
      (data) => this.onRefreshList(),
      (err) => console.log(err)
      );
  }


  ngOnDestroy() {
    this.filterService.observer('connections').unsubscribe();
    this.filterService.removeObserver('connections');
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
    this.serviceInstance = this.service.get(this.next, this.limit, this.filter)
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

  viewFriendProfile(id) {

    for (var i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].id === id) {
        this.selectedUser = this.items[i];
        this.currentIndex = findIndex(this.items, { id: this.selectedUser.id });
        this.profileViewActive = true;
        if (this.items[i].updated_at === null) {
          this.items[i].updated_at = 'seen';
        }
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.setLocation(this.selectedUser.username);
      }
    }
  }

  closeProfile(event) {
    this.profileViewActive = false;
    this.selectedUser = null;
    this.setLocation('connections');
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
      this.setLocation(this.selectedUser.username);
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
