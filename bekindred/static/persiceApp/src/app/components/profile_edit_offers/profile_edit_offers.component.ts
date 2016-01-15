import {Component, Input, Output, ChangeDetectionStrategy} from 'angular2/core';
import {OffersService} from '../../services/offers.service';
import {LoadingComponent} from '../loading/loading.component';
import {NotificationComponent} from '../notification/notification.component';

let view = require('./profile_edit_offers.html');

import {findIndex, pluck} from 'lodash';


declare var jQuery: any;
declare var Bloodhound: any;

@Component({
  selector: 'profile-edit-offers',
  template: view,
  directives: [
    LoadingComponent,
    NotificationComponent
  ],
  providers: [
    OffersService
  ]
})
export class ProfileEditOffersComponent {

  timeoutId = null;

  items: any[] = [];
  loading: boolean = false;
  isListEmpty: boolean = false;
  limit: number = 12;
  query: string = '';
  next: string = '';
  total_count: number = 0;
  offset: number = 0;
  newOffer = '';

  notificationMain = {
    body: '',
    title: '',
    active: false,
    type: ''
  };

  constructor(
    private offersService: OffersService
    ) {

  }

  ngOnInit() {
    this.getList();
    this.initializeTokenInput();
  }

  ngOnDestroy() {
    jQuery('#offersInput').typeahead('destroy');
  }

  initializeTokenInput() {
    let keywordsEngine = new Bloodhound({
      remote: {
        url: '/api/v1/subject/?format=json&description__icontains=%QUERY',
        filter: (x: any) => {
          return jQuery.map(x.objects, (item) => {
            return item.description;
          });
        },
        wildcard: '%QUERY'
      },
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });

    keywordsEngine.initialize();


    jQuery('#offersInput').typeahead(
      {
        hint: false,
        highlight: true,
        minLength: 2,
        limit: 20
      },
      {
        source: keywordsEngine
      }
      );

    jQuery('#offersInput').bind('typeahead:select', (ev, suggestion) => {
      console.log('Selection: ' + suggestion);
      this.newOffer = suggestion;
      // this.addOffer(true);
    });


  }

  addOffer(event) {
    this.notificationMain.active = false;
    if (this.newOffer.length === 0) {
      this.notificationMain = {
        type: 'warning',
        title: '',
        active: true,
        body: 'Please enter your offer first.'
      };
      return;
    }

    if (this.newOffer.length > 100) {
      this.notificationMain = {
        type: 'warning',
        title: '',
        active: true,
        body: 'New offer must have less than 100 characters.'
      };
      return;
    }

    this.offersService.save(this.newOffer)
      .subscribe((res) => {
      this.notificationMain.active = false;

      let newItem = res;
      this.items = [...this.items, newItem];
      this.total_count++;
      this.newOffer = '';
      jQuery('#offersInput').typeahead('val', '');
    }, (err) => {
        console.log(err);
        let error = JSON.parse(err._body);
        if ('offer' in error) {

          this.notificationMain = {
            type: 'error',
            title: '',
            active: true,
            body: `${error.offer.error[0]}`
          };

        }
      }, () => {

      });

  }

  removeOffer(event) {
    this.notificationMain.active = false;
    let idx = findIndex(this.items, event);
    if (this.items[idx]) {
      this.offersService.delete(event.resource_uri)
        .subscribe((res) => {
        this.items.splice(idx, 1);
        this.total_count--;
      });
    }

  }


  getList() {
    this.notificationMain.active = false;
    if (this.next === null) return;
    this.loading = true;
    this.offersService.get(this.next, 100)
      .subscribe(data => this.assignList(data),
      (err) => {
        console.log(err);
        this.loading = false;
      },
      () => {

      });
  }


  refreshList() {
    this.notificationMain.active = false;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.items.splice(0, this.items.length);
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
      jQuery('#offers').bind('scroll', this.handleScrollEvent.bind(this));
    }
    else {
      jQuery('#offers').unbind('scroll');
    }


  }

  handleScrollEvent(event) {
    let scrollOffset = jQuery('#offers').scrollTop() + jQuery('#offers').innerHeight();
    let threshold = jQuery('#offers')[0].scrollHeight;
    if (this.next && scrollOffset >= threshold) {
      if (!this.loading) {
        this.getList();
      }
    }

  }

}
