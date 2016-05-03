import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy
} from '@angular/core';

import {mergeMap} from 'rxjs/operator/mergeMap';
import {findIndex} from 'lodash';


import {LoadingComponent} from '../shared/components/loading';
import {EditFooterComponent} from './edit-footer.component';

import {InterestsService, KeywordsService} from '../shared/services';

declare var jQuery: any;
declare var Bloodhound: any;

@Component({
  selector: 'prs-edit-interests',
  template: require('./edit-interests.html'),
  directives: [
    LoadingComponent,
    EditFooterComponent
  ],
  providers: [
    InterestsService,
    KeywordsService
  ]
})
export class EditInterestsComponent implements OnInit, OnDestroy {

  @Output() close: EventEmitter<any> = new EventEmitter;

  items: any[] = [];
  loading: boolean = false;
  isListEmpty: boolean = false;
  limit: number = 12;
  query: string = '';
  next: string = '';
  total_count: number = 0;
  offset: number = 0;
  newInterest = '';
  status;
  saveLoading = false;
  showWarning = false;

  userInterest: any[] = [];
  userInterestCounter: number = 0;

  constructor(
    private interestsService: InterestsService,
    private keywordsService: KeywordsService
  ) {

  }

  ngOnInit() {
    this.initializeTokenInput();
    this.getList();
  }

  ngOnDestroy() {
    jQuery('#interestsInput').typeahead('destroy');
  }

  initializeTokenInput() {
    let keywordsEngine = new Bloodhound({
      remote: {
        url: '/api/v1/interest_subject/?format=json&limit=30&description__icontains=%QUERY',
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

    jQuery('#interestsInput').typeahead(
      {
        hint: false,
        highlight: true,
        minLength: 2
      },
      {
        source: keywordsEngine,
        limit: 30
      }
    );

    jQuery('#interestsInput').bind('typeahead:selected', (ev, suggestion) => {
      this.newInterest = suggestion;
      this.saveInterest(suggestion);
    });

  }

  addInterest() {
    this.saveInterest(this.newInterest);
  }

  saveInterest(interest) {
    if (this.saveLoading) {
      return;
    }
    this.saveLoading = true;

    if (interest.length === 0 || interest.length > 100) {
      this.status = 'failure';
      this.saveLoading = false;
      return;
    }

    let idx = findIndex(this.items, { 'description': interest });
    if (this.items[idx]) {
      if (!this.items[idx].active) {
        this.interestsService.save(this.items[idx].description)
          .subscribe((res) => {
            this.saveLoading = false;
            this.items[idx].active = true;
            this.items[idx].interest_resource = res.resource_uri;
            this.userInterestCounter++;
            this.status = 'success';
            this.newInterest = '';
            jQuery('#interestsInput').typeahead('val', '');
          },
          (err) => {
            this.status = 'failure';
            this.saveLoading = false;
          },
          () => { });
      } else {
        this.status = 'failure';
        this.saveLoading = false;
      }
    } else {
      //create new interest
      this.interestsService.save(interest)
        .subscribe((res) => {
          this.saveLoading = false;
          let newItem = res;
          newItem.active = true;
          newItem.description = res.interest_subject;
          newItem.interest_resource = res.resource_uri;
          this.items.push(newItem);

          this.status = 'success';

          this.userInterestCounter++;

          this.newInterest = '';
          jQuery('#interestsInput').typeahead('val', '');
          this.refreshList();

        },
        (err) => {
          this.status = 'failure';
          this.saveLoading = false;
        },
        () => { });
    }
  }

  inputChanged(event) {
    //if key is not enter clear notification
    if (event.which !== 13) {
      this.status = null;
    }

    if (event.which === 13) {
      this.saveInterest(this.newInterest);
    }
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
    this.items.splice(0, this.items.length);
    this.isListEmpty = false;
    this.next = '';
    this.saveLoading = false;
    this.userInterest.splice(0, this.userInterest.length);
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
    } else {
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
    this.status = null;

    let idx = findIndex(this.items, event);
    this.saveLoading = true;
    if (this.items[idx]) {
      if (this.items[idx].active) {
        //deselect interest
        let url = this.items[idx].interest_resource;

        this.interestsService.delete(url)
          .subscribe((res) => {
            this.items[idx].active = false;
            this.items[idx].interest_resource = null;
            this.userInterestCounter--;
            this.saveLoading = false;
          }, (err) => {
            this.saveLoading = false;
            this.status = 'failure';
          }, () => { });
      } else {
        //select interest
        this.interestsService.save(this.items[idx].description)
          .subscribe((res) => {
            this.items[idx].active = true;
            this.items[idx].interest_resource = res.resource_uri;
            this.userInterestCounter++;
            this.saveLoading = false;
          }, (err) => {
            this.saveLoading = false;
            this.status = 'failure';
          }, () => { });
      }
    }
  }



}
