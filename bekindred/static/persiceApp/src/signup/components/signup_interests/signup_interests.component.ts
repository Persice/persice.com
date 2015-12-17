import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {mergeMap} from 'rxjs/operator/mergeMap';

import {findIndex, pluck} from 'lodash';

import {InterestsService} from '../../../app/services/interests.service';
import {KeywordsService} from '../../../app/services/keywords.service';
import {NotificationService} from '../../../app/services/notification.service';

import {LoadingComponent} from '../../../app/components/loading/loading.component';
let view = require('./signup_interests.html');


declare var jQuery: any;
declare var Bloodhound: any;

@Component({
  selector: 'signup-interests',
  template: view,
  directives: [
    LoadingComponent
  ]
})
export class SignupInterestsComponent {

  @Output() counter: EventEmitter<any> = new EventEmitter();

  items: any[] = [];
  loading: boolean = false;
  isListEmpty: boolean = false;
  limit: number = 12;
  query: string = '';
  next: string = '';
  total_count: number = 0;
  offset: number = 0;

  userInterest: any[] = [];
  userInterestCounter: number = 0;

  constructor(
    private interestsService: InterestsService,
    private keywordsService: KeywordsService,
    private notificationService: NotificationService
  ) {

  }

  ngOnInit() {
    this.getList();
    this.initializeTokenInput();
  }

  initializeTokenInput() {
    let keywordsEngine = new Bloodhound({
      remote: {
        url: '/api/v1/interest_subject/?format=json&description__icontains=%QUERY',
        filter: (x: any) => {
          return jQuery.map(x.objects, (item) => {
            return item.description;
          });
        },
        wildcard: '%QUERY'
      },
      datumTokenizer: (d) => {
        return Bloodhound.tokenizers.whitespace(d);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });

    keywordsEngine.initialize();


    jQuery('#interestsInput').typeahead(null, {
      name: 'keywords',
      source: keywordsEngine
    });


  }

  getList() {
    if (this.next === null) return;
    this.loading = true;
    this.interestsService.get('', 2000)
      .mergeMap((data) => {

        this.userInterestCounter = data.meta.total_count;

        this.counter.next({
          type: 'interests',
          count: this.userInterestCounter
        });

        if (this.userInterestCounter > 0) {
          this.userInterest = data.objects;
        }

        return this.keywordsService.get(this.next, 100);
      })
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

    let more = data.objects;

    for (var i = 0; i <= more.length - 1; i++) {
      more[i].active = false;
      more[i].interest_resource = null;

      for (var j = this.userInterest.length - 1; j >= 0; j--) {
        if (more[i].resource_uri === this.userInterest[j].interest) {
          more[i].interest_resource = this.userInterest[j].resource_uri;
          more[i].active = true;
        }
      }

      this.items.push(more[i]);
    }

    this.next = data.meta.next;
    this.offset = data.meta.offset;


    //bind to scroll event to load more data on bottom scroll
    if (this.next !== null) {
      jQuery('#interests').bind('scroll', this.handleScrollEvent.bind(this));
    }
    else {
      jQuery('#interests').unbind('scroll');
    }


  }

  handleScrollEvent(event) {
    let scrollOffset = jQuery('#interests').scrollTop() + jQuery('#interests').innerHeight();
    let threshold = jQuery('#interests')[0].scrollHeight;
    if (this.next && scrollOffset >= threshold) {
      if (!this.loading) {
        this.getList();
      }
    }

  }


  onInterestClick(event) {

    let idx = findIndex(this.items, event);

    if (this.items[idx]) {
      if (this.items[idx].active) {
        //deselect interest
        let url = this.items[idx].interest_resource;

        this.interestsService.delete(url)
          .subscribe((res) => {
            this.items[idx].active = false;
            this.items[idx].interest_resource = null;
            this.userInterestCounter--;
            this.counter.next({
              type: 'interests',
              count: this.userInterestCounter
            });
          });
      }
      else {
        this.items[idx].active = true;

        this.interestsService.save(this.items[idx].description)
          .subscribe((res) => {
            this.items[idx].active = true;
            this.items[idx].interest_resource = res.resource_uri;
            this.userInterestCounter++;
            this.counter.next({
              type: 'interests',
              count: this.userInterestCounter
            });
          });


      }
    }
  }



}
