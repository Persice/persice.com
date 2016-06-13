import {Component, Input, ChangeDetectionStrategy} from '@angular/core';

const PAGES_WITH_COUNTER: string[] = ['conversations'];
const PAGES_WITH_NO_TITLE: string[] = ['info privacy policy', 'info terms of service'];
@Component({
  selector: 'prs-page-title',
  template: `
  <h2 class="mob-header__title">
    <span class="mob-header__title-value">{{pageTitle}}</span>
    <span *ngIf="conversationsCounterVisible">({{conversationsCounter}})</span>
  </h2>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageTitleComponent {
  @Input() set title(value: string) {

    this.pageTitle = value.replace(/[-\/]/g, ' '); //replace - and / special chars with space

    // Change title for messages route
    if (this.pageTitle === 'messages') {
      this.pageTitle = 'conversations';
    }

    if (PAGES_WITH_COUNTER.indexOf(this.pageTitle) > -1) {
      this.conversationsCounterVisible = true;
    } else {
      this.conversationsCounterVisible = false;
    }

    if (PAGES_WITH_NO_TITLE.indexOf(this.pageTitle) > -1) {
      this.pageTitle = '';
    }

  }
  @Input() conversationsCounter;

  public pageTitle: string  = '';
  private conversationsCounterVisible: boolean = false;

}
