import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {findIndex} from 'lodash';

import {GoalsService} from '../../app/shared/services';
import {SignupStateService} from '../../common/services';

import {LoadingComponent} from '../../app/shared/components/loading';

@Component({
  selector: 'prs-signup-goals',
  template: require('./signup-goals.html'),
  directives: [
    LoadingComponent
  ]
})
export class SignupGoalsComponent implements OnInit, OnDestroy {
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
    private goalsService: GoalsService,
    private signupStateService: SignupStateService
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
        url: '/api/v1/subject/?format=json&limit=30&description__icontains=%QUERY',
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
        minLength: 2
      },
      {
        source: keywordsEngine,
        limit: 30
      }
      );

    jQuery('#goalsInput').bind('typeahead:selected', (ev, suggestion) => {
      this.newGoal = suggestion;
      this.saveGoal(suggestion);
    });

  }

  saveGoal(goal) {
    if (this.saveLoading === true) {
      return;
    }
    this.saveLoading = true;

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
      this.signupStateService.counterEmitter.emit({
        type: 'goals',
        count: this.total_count
      });
      if (this.total_count === 0) {
        this.isListEmpty = true;
      } else {
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
    if (event.which === 13) {
      this.saveGoal(this.newGoal);
    }

  }

  removeGoal(event) {
    let idx = findIndex(this.items, event);
    if (this.items[idx]) {
      this.goalsService.delete(event.resource_uri)
        .subscribe((res) => {
        this.items.splice(idx, 1);
        this.total_count--;
        this.signupStateService.counterEmitter.emit({
          type: 'goals',
          count: this.total_count
        });
        if (this.total_count === 0) {
          this.isListEmpty = true;
        } else {
          this.isListEmpty = false;
        }
      });
    }

  }

  addGoal() {
    this.saveGoal(this.newGoal);
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

    this.signupStateService.counterEmitter.emit({
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
    } else {
      this.items = data.objects;
    }

    this.next = data.meta.next;
    this.offset = data.meta.offset;


    //bind to scroll event to load more data on bottom scroll
    if (this.next !== null) {
      jQuery('#goals').bind('scroll', this.handleScrollEvent.bind(this));
    } else {
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
