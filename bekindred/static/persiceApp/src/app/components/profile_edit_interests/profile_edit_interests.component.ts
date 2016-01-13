import {Component, Input, Output, NgZone, ChangeDetectionStrategy} from 'angular2/core';
import {mergeMap} from 'rxjs/operator/mergeMap';

import {findIndex, pluck} from 'lodash';

import {InterestsService} from '../../services/interests.service';
import {KeywordsService} from '../../services/keywords.service';

import {LoadingComponent} from '../loading/loading.component';

declare var jQuery: any;

let view = require('./profile_edit_interests.html');

@Component({
  selector: 'profile-edit-interests',
  template: view,
  directives: [
    LoadingComponent
  ],
  providers: [
    InterestsService,
    KeywordsService
  ]

})
export class ProfileEditInterestsComponent {
  timeoutId = null;

  items: any[] = [];
  loading: boolean = false;
  isListEmpty: boolean = false;
  limit: number = 12;
  query: string = '';
  next: string = '';
  total_count: number = 0;
  offset: number = 0;
  newInterest = '';

  userInterest: any[] = [];
  userInterestCounter: number = 0;

  constructor(
    private interestsService: InterestsService,
    private keywordsService: KeywordsService
    ) {

  }

  ngOnInit() {
    this.getList();
  }

  addInterest(event) {

    if (this.newInterest.length === 0) {
      // this.notificationService.push({
      //   type: 'warning',
      //   title: '',
      //   body: `Please enter your interest first.`,
      //   autoclose: 4000
      // });
      return;
    }

    if (this.newInterest.length > 100) {
      // this.notificationService.push({
      //   type: 'warning',
      //   title: '',
      //   body: `New interest must have less than 100 characters.`,
      //   autoclose: 4000
      // });
      return;
    }

    let idx = findIndex(this.items, 'description', this.newInterest);

    if (this.items[idx]) {
      if (!this.items[idx].active) {
        this.interestsService.save(this.items[idx].description)
          .subscribe((res) => {
          this.items[idx].active = true;
          this.items[idx].interest_resource = res.resource_uri;
          this.userInterestCounter++;
        });
      }
      else {
        // this.notificationService.push({
        //   type: 'warning',
        //   title: '',
        //   body: `Interest '${this.newInterest}' is already selected below.`,
        //   autoclose: 4000
        // });

      }
    }
    else {
      //create new interest
      this.interestsService.save(this.newInterest)
        .subscribe((res) => {
        let newItem = res;
        newItem.active = true;
        newItem.description = res.interest_subject;
        newItem.interest_resource = res.resource_uri;
        this.items.push(newItem);

        // this.notificationService.push({
        //   type: 'success',
        //   title: '',
        //   body: `Interest '${this.newInterest}' has been successfully created.`,
        //   autoclose: 4000
        // });

        this.userInterestCounter++;
        this.newInterest = '';
        this.refreshList();

      });
    }
  }

  onSearchInputChanged() {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.refreshList();
    }, 300);

  }

  getList() {
    if (this.next === null) return;
    this.loading = true;
    this.interestsService.get('', 2000)
      .mergeMap((data) => {

      this.userInterestCounter = data.meta.total_count;

      if (this.userInterestCounter > 0) {
        this.userInterest = data.objects;
      }

      return this.keywordsService.get(this.next, 100, this.newInterest);
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
    this.userInterest = [];
    this.userInterestCounter = 0;
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
        });
      }
      else {
        this.interestsService.save(this.items[idx].description)
          .subscribe((res) => {
          this.items[idx].active = true;
          this.items[idx].interest_resource = res.resource_uri;
          this.userInterestCounter++;
        });


      }
    }
  }


}
