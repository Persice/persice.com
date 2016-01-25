import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {findIndex} from 'lodash';

import {GoalsService} from '../../../app/services/goals.service';

import {LoadingComponent} from '../../../app/components/loading/loading.component';
let view = require('./signup_goals.html');

declare var jQuery: any;
declare var TweenMax: any;
declare var Bloodhound: any;

@Component({
  selector: 'signup-goals',
  template: view,
  directives: [
    LoadingComponent
  ]
})
export class SignupGoalsComponent {

  @Output() counter: EventEmitter<any> = new EventEmitter();

  items: any[] = [];
  loading: boolean = false;
  isListEmpty: boolean = false;
  limit: number = 12;
  query: string = '';
  next: string = '';
  total_count: number = 0;
  offset: number = 0;
  newGoal = '';
  status;
  saveLoading = false;

  constructor(
    private goalsService: GoalsService
    ) {

  }

  ngOnInit() {
    this.initializeTokenInput();
    this.getList();
  }

  ngOnDestroy() {
    jQuery('#goalsInput').typeahead('destroy');
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

    jQuery('#goalsInput').typeahead(
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

    jQuery('#goalsInput').bind('typeahead:select', (ev, suggestion) => {
      if (this.saveLoading) {
        return;
      }
      this.saveLoading = true;
      this.saveGoal(suggestion);
    });

  }

  saveGoal(goal) {

    if (goal.length === 0 || goal.length > 100) {
      this.status = 'failure';
      this.saveLoading = false;
      return;
    }

    this.goalsService.save(goal)
      .subscribe((res) => {
      let newItem = res;
      this.items.push(newItem);
      this.status = 'success';

      this.total_count++;
      this.counter.next({
        type: 'goals',
        count: this.total_count
      });
      if (this.total_count === 0) {
        this.isListEmpty = true;
      }
      else {
        this.isListEmpty = false;
      }
      this.newGoal = '';
      jQuery('#goalsInput').typeahead('val', '');
      this.saveLoading = false;
    }, (err) => {
        let error = JSON.parse(err._body);
        if ('goal' in error) {
          this.status = 'failure';
        }
        this.saveLoading = false;
      }, () => {

      });
  }

  inputChanged(event) {
    //if key is not enter clear notification
    if (event.which !== 13) {
      this.status = null;
    }
    else { //if key is entered
      this.addGoal();
    }

  }

  addGoal() {
    if (this.saveLoading) {
      return;
    }
    this.saveLoading = true;
    this.saveGoal(this.newGoal);
  }

  removeGoal(event) {
    let idx = findIndex(this.items, event);
    if (this.items[idx]) {
      this.goalsService.delete(event.resource_uri)
        .subscribe((res) => {
        this.items.splice(idx, 1);
        this.total_count--;
        this.counter.next({
          type: 'goals',
          count: this.total_count
        });
        if (this.total_count === 0) {
          this.isListEmpty = true;
        }
        else {
          this.isListEmpty = false;
        }
      });
    }

  }


  getList() {
    if (this.next === null) return;
    this.loading = true;
    this.goalsService.get(this.next, 100)
      .subscribe(data => this.assignList(data),
      (err) => {
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
      type: 'goals',
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
      jQuery('#goals').bind('scroll', this.handleScrollEvent.bind(this));
    }
    else {
      jQuery('#goals').unbind('scroll');
    }


  }

  handleScrollEvent(event) {
    let scrollOffset = jQuery('#goals').scrollTop() + jQuery('#goals').innerHeight();
    let threshold = jQuery('#goals')[0].scrollHeight;
    if (this.next && scrollOffset >= threshold) {
      if (!this.loading) {
        this.getList();
      }
    }

  }

}
