import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {findIndex} from 'lodash';
import {GoalsService} from '../../app/shared/services';
import {SignupStateService} from '../../common/services';

@Component({
  selector: 'prs-mobile-goals',
  template: require('./goals-mobile.html')
})
export class SignupGoalsMobileComponent implements OnInit, OnDestroy {
  goals: Goal[] = [];
  newGoalText: string = '';

  // Fields used for lazy loading.
  loading: boolean = false;
  limit: number = 12;
  query: string = '';
  next: string = '';
  total_count: number = 0;
  offset: number = 0;
  status;
  saveLoading: boolean = false;

  constructor(
    private goalsService: GoalsService,
    private signupStateService: SignupStateService
  ) {
  }

  ngOnInit() {
    this.initializeTokenInput();
    this.getExistingGoals();
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

    var goalInputElement = jQuery('#goalsInput');
    goalInputElement.typeahead(
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

    goalInputElement.bind('typeahead:selected', (ev, suggestion) => {
      this.newGoalText = suggestion;
      this.saveGoal(new Goal(suggestion));
    });
  }

  /**
   * Save given goal on the backend.
   *
   * @param goal A goal to save.
   */
  saveGoal(goal: Goal) {
    if (this.saveLoading === true) {
      return;
    }
    this.saveLoading = true;
    if (goal.subject.length === 0 || goal.subject.length > 100) {
      this.status = 'failure';
      this.saveLoading = false;
      return;
    }

    this.goalsService.save(goal.subject).subscribe((response) => {
      let newItem = response;
      this.goals.push(newItem);
      this.status = 'success';

      this.total_count++;
      this.signupStateService.counterEmitter.emit({
        type: 'goals',
        count: this.total_count
      });
      this.newGoalText = '';
      jQuery('#goalsInput').typeahead('val', '');
      this.saveLoading = false;
    }, (err) => {
      let error = JSON.parse(err._body);
      if ('goal' in error) {
        this.status = 'failure';
      }
      this.saveLoading = false;
    });
  }

  inputChanged(event) {
    //If key is not 'Enter' clear the notification.
    if (event.which !== 13) {
      this.status = null;
    }
    if (event.which === 13) {
      this.saveGoal(new Goal(this.newGoalText));
    }
  }

  removeGoal(event) {
    let idx = findIndex(this.goals, event);
    if (this.goals[idx]) {
      this.goalsService.delete(event.resource_uri)
        .subscribe((res) => {
          this.goals.splice(idx, 1);
          this.total_count--;
          this.signupStateService.counterEmitter.emit({
            type: 'goals',
            count: this.total_count
          });
        });
    }
  }

  addGoal() {
    this.saveGoal(new Goal(this.newGoalText));
  }

  getExistingGoals() {
    if (this.next === null) return;
    this.loading = true;
    this.goalsService.get(this.next, 100)
      .subscribe(data => this.renderGoalsResponse(data),
      () => {
        this.loading = false;
      });
  }

  refreshGoals() {
    // Todo: Rethink usage of document object.
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    this.goals.splice(0, this.goals.length);
    this.next = '';
    this.getExistingGoals();
  }

  /**
   * Parse the response from server and render received goals.
   *
   * @param data Data returned by server.
   */
  renderGoalsResponse(data) {
    this.loading = false;
    this.total_count = data.meta.total_count;

    this.signupStateService.counterEmitter.emit({
      type: 'goals',
      count: this.total_count
    });

    // Todo: This should ideally be moved to Goal::constructor or to a new entity class.
    if (this.goals.length > 0) {
      let more = data.objects;
      for (var i = 0; i <= more.length - 1; i++) {
        this.goals.push(new Goal(more[i]));
      }
    } else {
      this.goals = data.objects;
    }

    this.next = data.meta.next;
    this.offset = data.meta.offset;

    // Bind to scroll event to load more data on bottom scroll.
    if (this.next !== null) {
      jQuery('#goals').bind('scroll', this.handleScrollEvent.bind(this));
    } else {
      jQuery('#goals').unbind('scroll');
    }
  }

  /**
   * Lazy loading on scroll event.
   */
  handleScrollEvent(event) {
    var goals = jQuery('#goals');
    let scrollOffset = goals.scrollTop() + goals.innerHeight();
    let threshold = goals[0].scrollHeight;
    if (this.next && scrollOffset >= threshold) {
      if (!this.loading) {
        this.getExistingGoals();
      }
    }
  }
}

export class Goal {
  subject: string;

  constructor(subject: string) {
    this.subject = subject;
  }
}
