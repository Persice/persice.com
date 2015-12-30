import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {findIndex, pluck} from 'lodash';

import {OffersService} from '../../../app/services/offers.service';
import {NotificationService} from '../../../app/services/notification.service';

import {LoadingComponent} from '../../../app/components/loading/loading.component';
let view = require('./signup_offers.html');


declare var jQuery: any;
declare var Bloodhound: any;

@Component({
  selector: 'signup-offers',
  template: view,
  directives: [
    LoadingComponent
  ]
})
export class SignupOffersComponent {

  @Output() counter: EventEmitter<any> = new EventEmitter();

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

  constructor(
    private offersService: OffersService,
    private notificationService: NotificationService
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

    if (this.newOffer.length === 0) {
      this.notificationService.push({
        type: 'warning',
        title: '',
        body: `Please enter your offer first.`,
        autoclose: 4000
      });
      return;
    }

    if (this.newOffer.length > 100) {
      this.notificationService.push({
        type: 'warning',
        title: '',
        body: `New offer must have less than 100 characters.`,
        autoclose: 4000
      });
      return;
    }

    this.offersService.save(this.newOffer)
      .subscribe((res) => {
        let newItem = res;
        this.items.push(newItem);

        this.notificationService.push({
          type: 'success',
          title: '',
          body: `Offer '${this.newOffer}' has been successfully created.`,
          autoclose: 4000
        });

        this.total_count++;
        this.counter.next({
          type: 'offers',
          count: this.total_count
        });

        this.newOffer = '';
        jQuery('#offersInput').typeahead('val', '');

      }, (err) => {
        console.log(err);
        let error = JSON.parse(err._body);
        if ('offer' in error) {
          this.notificationService.push({
            type: 'error',
            title: '',
            body: `${error.offer.error[0]}`,
            autoclose: 4000
          });
        }
      }, () => {

      });

  }

  removeOffer(event) {
    let idx = findIndex(this.items, event);
    if (this.items[idx]) {
      this.offersService.delete(event.resource_uri)
        .subscribe((res) => {
          this.items.splice(idx, 1);
          this.total_count--;
          this.counter.next({
            type: 'offers',
            count: this.total_count
          });
        });
    }

  }


  getList() {
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
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.items.splice(0, this.items.length);
    this.isListEmpty = false;
    this.next = '';
    this.getList();
  }

  assignList(data) {

    this.loading = false;

    this.total_count = data.meta.total_count;
    this.counter.next({
      type: 'offers',
      count: this.total_count
    });

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
